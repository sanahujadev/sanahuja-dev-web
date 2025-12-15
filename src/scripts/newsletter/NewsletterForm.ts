// src/scripts/newsletter/NewsletterForm.ts

export class NewsletterForm {
    private form: HTMLFormElement;
    private emailInput: HTMLInputElement | null;
    private consentCheckbox: HTMLInputElement | null;
    private nicknameInput: HTMLInputElement | null;
    private submitBtn: HTMLButtonElement | null;
    private successMsg: HTMLElement | null;
    private serverErrorMsg: HTMLElement | null;

    // Error UI elements
    private emailErrorMsg: HTMLElement | null;
    private emailErrorIcon: HTMLElement | null;
    private consentErrorMsg: HTMLElement | null;
    private consentErrorIcon: HTMLElement | null;
    
    // API & Turnstile
    private apiUrl: string;
    private apiKey: string;
    private turnstileSiteKey: string;
    private turnstileToken: string | null = null;

    private originalBtnContent: string = "";

    constructor(formElement: HTMLFormElement) {
        this.form = formElement;
        
        this.emailInput = this.form.querySelector('input[name="email"]');
        this.consentCheckbox = this.form.querySelector('input[name="consent"]');
        this.nicknameInput = this.form.querySelector('input[name="nickname"]');
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.successMsg = this.form.parentElement?.querySelector('[data-testid="success-message"]') as HTMLElement;
        this.serverErrorMsg = this.form.querySelector('#server-error');

        // Error UI elements initialization
        this.emailErrorMsg = this.form.querySelector('#email-error');
        this.emailErrorIcon = this.form.querySelector('#email-error-icon');
        this.consentErrorMsg = this.form.querySelector('#consent-error');
        this.consentErrorIcon = this.form.querySelector('#consent-error-icon');

        this.apiUrl = this.form.dataset.apiUrl || "";
        this.apiKey = this.form.dataset.apiKey || "";
        this.turnstileSiteKey = this.form.dataset.turnstileSiteKey || "";

        this.initListeners();
        this.initTurnstile();
        
        // Mark as initialized for tests
        this.form.setAttribute('data-form-initialized', 'true');
    }

    private initListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        this.emailInput?.addEventListener('blur', () => this.validateEmail());
        this.emailInput?.addEventListener('input', () => {
             this.emailInput?.removeAttribute('aria-invalid');
             this.toggleErrorUI('email', false);
             this.hideServerError();
        });

        this.consentCheckbox?.addEventListener('change', () => {
            this.validateConsent();
            this.hideServerError();
        });
    }

    private toggleErrorUI(fieldType: 'email' | 'consent', show: boolean) {
        let msgEl: HTMLElement | null = null;
        let iconEl: HTMLElement | null = null;

        switch (fieldType) {
            case 'email':
                msgEl = this.emailErrorMsg;
                iconEl = this.emailErrorIcon;
                break;
            case 'consent':
                msgEl = this.consentErrorMsg;
                iconEl = this.consentErrorIcon;
                break;
        }

        if (show) {
            msgEl?.classList.remove('hidden');
            iconEl?.classList.remove('hidden');
        } else {
            msgEl?.classList.add('hidden');
            iconEl?.classList.add('hidden');
        }
    }

    private validateEmail(): boolean {
        if (!this.emailInput) return false;
        const value = this.emailInput.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        
        if (!isValid) {
            this.emailInput.setAttribute('aria-invalid', 'true');
            this.toggleErrorUI('email', true);
        } else {
            this.emailInput.removeAttribute('aria-invalid');
            this.toggleErrorUI('email', false);
        }
        return isValid;
    }

    private validateConsent(): boolean {
        if (!this.consentCheckbox) return false;
        const isValid = this.consentCheckbox.checked;

        if (!isValid) {
            this.consentCheckbox.setAttribute('aria-invalid', 'true');
            this.toggleErrorUI('consent', true);
        } else {
            this.consentCheckbox.removeAttribute('aria-invalid');
            this.toggleErrorUI('consent', false);
        }
        return isValid;
    }

    private async initTurnstile() {
        if (!this.turnstileSiteKey) return;
        
        // Wait for Turnstile API
        let attempts = 0;
        while (!(window as any).turnstile && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if ((window as any).turnstile) {
            try {
                (window as any).turnstile.render('#turnstile-widget', {
                    sitekey: this.turnstileSiteKey,
                    callback: (token: string) => {
                        this.turnstileToken = token;
                    }
                });
            } catch (e) {
                console.error("Turnstile render error", e);
            }
        }
    }

    private setLoading(loading: boolean) {
        if (!this.submitBtn) return;
        if (loading) {
            this.originalBtnContent = this.submitBtn.innerHTML;
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = "Enviando...";
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = this.originalBtnContent;
        }
    }

    private hideServerError() {
        if (this.serverErrorMsg) {
            this.serverErrorMsg.classList.add('hidden');
        }
    }

    private showServerError() {
        if (this.serverErrorMsg) {
            this.serverErrorMsg.classList.remove('hidden');
        }
    }

    private async handleSubmit(e: Event) {
        e.preventDefault();
        this.hideServerError();

        // Honeypot check
        if (this.nicknameInput && this.nicknameInput.value) {
            // Fake success
            this.showSuccess();
            return;
        }

        const isEmailValid = this.validateEmail();
        const isConsentValid = this.validateConsent();

        if (!isEmailValid || !isConsentValid) return;

        // Turnstile check
        if (!this.turnstileToken && this.turnstileSiteKey) {
             console.error("Missing Turnstile token");
        }

        this.setLoading(true);

        const payload = {
            email: this.emailInput?.value.trim(),
            consent: true,
            nickname: "",
            cfTurnstileResponse: this.turnstileToken || "mock-token-fallback"
        };

        try {
            const response = await fetch(`${this.apiUrl}/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                this.showSuccess();
            } else {
                console.error("Subscription failed");
                this.showServerError();
            }
        } catch (error) {
            console.error("Network error", error);
            this.showServerError();
        } finally {
            this.setLoading(false);
        }
    }

    private showSuccess() {
        this.form.classList.add('hidden');
        if (this.successMsg) {
            this.successMsg.classList.remove('hidden');
        }
    }
}
