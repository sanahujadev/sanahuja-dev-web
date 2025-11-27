// src/scripts/ContactForm.ts

import intlTelInput from 'intl-tel-input';

export class ContactForm {
    // Elementos Core
    private form: HTMLFormElement;
    private successUrl: string;
    
    // Inputs Principales
    private nameInput: HTMLInputElement | null;
    private emailInput: HTMLInputElement | null;
    private phoneInput: HTMLInputElement | null;
    private messageInput: HTMLTextAreaElement | null;
    private consentCheckbox: HTMLInputElement | null; // Nuevo
    private nicknameInput: HTMLInputElement | null; // Honeypot

    // Elementos de UI de Error (Cacheados para rendimiento)
    private nameErrorMsg: HTMLElement | null;
    private nameErrorIcon: HTMLElement | null;
    private emailErrorMsg: HTMLElement | null;
    private emailErrorIcon: HTMLElement | null;
    private phoneErrorMsg: HTMLElement | null;
    private phoneErrorIcon: HTMLElement | null;
    private messageErrorMsg: HTMLElement | null;
    private messageErrorIcon: HTMLElement | null;
    private consentErrorMsg: HTMLElement | null; // Nuevo
    private consentErrorIcon: HTMLElement | null; // Nuevo
    private formStatus: HTMLElement | null; // Status message container

    // Configuración Turnstile y API
    private turnstileSiteKey: string;
    private turnstileToken: string | null = null;
    private turnstileWidgetId: string | null = null;
    private apiUrl: string;
    private apiKey: string;

    // Librerías y Estado
    private iti: any;
    private firstInvalidInput: HTMLInputElement | HTMLTextAreaElement | null = null;
    private submitBtn: HTMLButtonElement | null;
    private originalBtnContent: string = "";
    private sendingLabel: string = "Sending...";

    constructor(formElement: HTMLFormElement) {
        this.form = formElement;
        this.successUrl = this.form.dataset.successUrl || '/';
        
        // 0. Inicializar Configuración
        this.turnstileSiteKey = this.form.dataset.turnstileSiteKey || "";
        this.apiUrl = this.form.dataset.apiUrl || "";
        this.apiKey = this.form.dataset.apiKey || "";
        this.sendingLabel = this.form.dataset.sendingLabel || "Enviando...";

        // 1. Inicialización de Inputs
        this.nameInput = this.form.querySelector('input[name="name"]');
        this.emailInput = this.form.querySelector('input[name="email"]');
        this.phoneInput = this.form.querySelector('input[name="phone"]');
        this.messageInput = this.form.querySelector('textarea[name="message_basic"]'); // O 'message' según tu HTML
        this.consentCheckbox = this.form.querySelector('input[name="consent"]'); // Nuevo
        this.nicknameInput = this.form.querySelector('input[name="nickname"]'); // Honeypot
        this.submitBtn = this.form.querySelector('button[type="submit"]');

        // 2. Inicialización de UI de Errores
        this.nameErrorMsg = document.getElementById('name-error');
        this.nameErrorIcon = document.getElementById('name-error-icon');
        this.emailErrorMsg = document.getElementById('email-error');
        this.emailErrorIcon = document.getElementById('email-error-icon');
        this.phoneErrorMsg = document.getElementById('phone-error');
        this.phoneErrorIcon = document.getElementById('phone-error-icon');
        this.messageErrorMsg = document.getElementById('message_basic-error');
        this.messageErrorIcon = document.getElementById('message_basic-error-icon');
        this.consentErrorMsg = document.getElementById('consent-error'); // Nuevo
        this.consentErrorIcon = document.getElementById('consent-error-icon'); // Nuevo
        this.formStatus = document.getElementById('form-status'); // Status container

        this.initListeners();
        this.initPhoneInput();
        this.initTurnstile(); // Nuevo
        
        // Marca la inicialización para el test SEO
        this.form.setAttribute('data-form-initialized', 'true');
    }

    private async initTurnstile() {
        if (!this.turnstileSiteKey) {
            console.error("Turnstile site key no encontrada.");
            return;
        }

        const widgetContainer = document.getElementById('turnstile-widget');
        if (!widgetContainer) return;

        // Polling para esperar a que window.turnstile esté disponible
        let attempts = 0;
        const maxAttempts = 50; // 5 segundos aprox
        
        while (!(window as any).turnstile && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (!(window as any).turnstile) {
            console.error("Error: Turnstile no cargó a tiempo.");
            return;
        }

        try {
            this.turnstileWidgetId = (window as any).turnstile.render('#turnstile-widget', {
                sitekey: this.turnstileSiteKey,
                callback: (token: string) => {
                    this.turnstileToken = token;
                    // Opcional: Limpiar error visual si existiera
                },
                'expired-callback': () => {
                    console.warn("Turnstile token expired.");
                    this.turnstileToken = null;
                },
                'error-callback': () => {
                    console.error("Turnstile encountered an error.");
                    this.turnstileToken = null;
                },
            });
        } catch (e) {
            console.error("Failed to render Turnstile widget:", e);
        }
    }

    private initPhoneInput() {
        if (!this.phoneInput) return;

        try {
            this.iti = intlTelInput(this.phoneInput, {
                initialCountry: "es",
                nationalMode: false,
                validationNumberTypes: null,
                // @ts-ignore
                loadUtils: () => import("intl-tel-input/utils"),
            });
        } catch (error) {
            console.error("Error inicializando intl-tel-input:", error);
        }
    }

    private initListeners() {
        // 1. Acordeones y Botones "Next Step"
        this.form.querySelectorAll('.accordion-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => this.handleAccordionClick(e));
        });

        this.form.querySelectorAll('.next-step-trigger').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNextStep(e));
        });

        // 2. Submit Handler
        this.form.addEventListener("submit", (e) => this.handleSubmit(e));

        // 3. Validación Individual (onBlur & onInput)
        this.setupFieldValidation(this.nameInput, 'name');
        this.setupFieldValidation(this.emailInput, 'email');
        this.setupFieldValidation(this.phoneInput, 'phone');
        this.setupFieldValidation(this.messageInput, 'message');
        this.setupFieldValidation(this.consentCheckbox, 'consent'); // Nuevo
    }

    // Configura los listeners de validación para un campo específico
    private setupFieldValidation(input: HTMLInputElement | HTMLTextAreaElement | null, fieldType: 'name' | 'email' | 'phone' | 'message' | 'consent') {
        if (!input) return;

        const isCheckbox = input.type === 'checkbox';

        // onBlur/onChange para checkboxes: Validar cuando el usuario deja el campo o cambia su valor
        if (isCheckbox) {
            input.addEventListener('change', () => this.validateField(input, fieldType));
            // No necesitamos un onInput para checkboxes para limpiar errores, ya que 'change' lo maneja y el 'input' no es relevante
        } else {
            input.addEventListener('blur', () => this.validateField(input, fieldType));
            // onInput: Limpiar errores mientras el usuario corrige
            input.addEventListener('input', () => {
                input.removeAttribute('aria-invalid');
                this.toggleErrorUI(fieldType, false);
            });
        }
    }

    // Muestra u oculta la UI de error para un tipo de campo
    private toggleErrorUI(fieldType: 'name' | 'email' | 'phone' | 'message' | 'consent', show: boolean) {
        let msgEl, iconEl;

        switch (fieldType) {
            case 'name': msgEl = this.nameErrorMsg; iconEl = this.nameErrorIcon; break;
            case 'email': msgEl = this.emailErrorMsg; iconEl = this.emailErrorIcon; break;
            case 'phone': msgEl = this.phoneErrorMsg; iconEl = this.phoneErrorIcon; break;
            case 'message': msgEl = this.messageErrorMsg; iconEl = this.messageErrorIcon; break;
            case 'consent': msgEl = this.consentErrorMsg; iconEl = this.consentErrorIcon; break; // Nuevo
        }

        if (show) {
            msgEl?.classList.remove('hidden');
            iconEl?.classList.remove('hidden');
        } else {
            msgEl?.classList.add('hidden');
            iconEl?.classList.add('hidden');
        }
    }

    // Lógica Central de Validación por Campo
    private async validateField(input: HTMLInputElement | HTMLTextAreaElement, fieldType: 'name' | 'email' | 'phone' | 'message' | 'consent'): Promise<boolean> {
        let isValid = true;
        const isCheckbox = input.type === 'checkbox';
        const value = isCheckbox ? (input as HTMLInputElement).checked.toString() : input.value.trim(); // Usamos 'true'/'false' para checkboxes

        // 1. Validación Genérica: Requerido
        if (input.hasAttribute('required')) {
            if (isCheckbox && !(input as HTMLInputElement).checked) {
                isValid = false;
            } else if (!isCheckbox && !value) {
                isValid = false;
            }
        }
        // 2. Validaciones Específicas (solo si hay valor o está marcado para checkboxes)
        // Para checkboxes, entramos aquí si es requerido y está marcado, o si no es requerido pero está marcado.
        else if (value || isCheckbox) { 
            switch (fieldType) {
                case 'email':
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    break;
                case 'phone':
                    isValid = await this.validatePhoneFormat();
                    break;
                case 'name':
                    isValid = value.length >= 2;
                    break;
                case 'message':
                    isValid = value.length >= 10;
                    break;
                case 'consent':
                    // Si es checkbox, la validación principal es si está 'checked' (manejado por 'required' arriba)
                    // No hay una validación de formato compleja para un checkbox más allá de su estado 'checked'.
                    isValid = (input as HTMLInputElement).checked; 
                    break;
            }
        }

        if (!isValid) {
            input.setAttribute('aria-invalid', 'true');
            this.toggleErrorUI(fieldType, true);
        } else {
            // ÉXITO: Limpiar estado de error explícitamente
            input.removeAttribute('aria-invalid');
            this.toggleErrorUI(fieldType, false);
        }

        return isValid;
    }

    private async validatePhoneFormat(): Promise<boolean> {
        if (!this.iti) return true;
        
        try {
            if (this.iti.utilsReady) await this.iti.utilsReady;
            const val = this.phoneInput?.value.trim() || "";
            return val === "" || this.iti.isValidNumber();
        } catch (err) {
            console.error("Error validando teléfono:", err);
            return true; // Fallback seguro
        }
    }

    private async validateForm(): Promise<boolean> {
        let isFormValid = true;
        this.firstInvalidInput = null;

        // Validamos secuencialmente (o en paralelo si quisiéramos)
        // Usamos las referencias directas
        if (this.nameInput) {
            if (!(await this.validateField(this.nameInput, 'name'))) this.markInvalid(this.nameInput, ref => isFormValid = false);
        }
        if (this.emailInput) {
            if (!(await this.validateField(this.emailInput, 'email'))) this.markInvalid(this.emailInput, ref => isFormValid = false);
        }
        if (this.phoneInput) {
            if (!(await this.validateField(this.phoneInput, 'phone'))) this.markInvalid(this.phoneInput, ref => isFormValid = false);
        }
        if (this.messageInput) {
            if (!(await this.validateField(this.messageInput, 'message'))) this.markInvalid(this.messageInput, ref => isFormValid = false);
        }
        if (this.consentCheckbox) { // Nuevo
            if (!(await this.validateField(this.consentCheckbox, 'consent'))) this.markInvalid(this.consentCheckbox, ref => isFormValid = false);
        }

        return isFormValid;
    }
    
    // Helper para gestionar el foco del primer error
    private markInvalid(input: HTMLInputElement | HTMLTextAreaElement, callback: (v: boolean) => void) {
        callback(false);
        if (!this.firstInvalidInput) this.firstInvalidInput = input;
    }

    private setLoading(isLoading: boolean) {
        if (!this.submitBtn) return;

        if (isLoading) {
            this.originalBtnContent = this.submitBtn.innerHTML;
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
            this.submitBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ${this.sendingLabel}
            `;
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            this.submitBtn.innerHTML = this.originalBtnContent;
        }
    }

    private async handleSubmit(e: Event) {
        e.preventDefault();

        // 1. Honeypot Check (Seguridad Anti-Spam)
        // Si el campo oculto tiene valor, es un bot. Simulamos éxito y salimos.
        if (this.nicknameInput && this.nicknameInput.value) {
            setTimeout(() => { 
                const url = new URL(this.successUrl, window.location.origin);
                url.searchParams.set('LEAD_ID', '482');
                window.location.href = url.toString();
            }, 600);
            return;
        }

        const isFormValid = await this.validateForm();

        if (!isFormValid) {
            this.toggleStep('1', true);
            this.firstInvalidInput?.focus();
            return;
        }

        // Validar Turnstile
        if (!this.turnstileToken) {
            this.showStatus("Por favor, completa la verificación de seguridad.", 'error');
            return;
        }

        // 2. Construcción del Payload
        const formData = new FormData(this.form);
        const payload = {
            fromName: this.nameInput?.value.trim(),
            fromEmail: this.emailInput?.value.trim(),
            numeroDeTelefono: this.phoneInput?.value.trim(),
            body: this.messageInput?.value.trim(),
            conversion :{
                project_type: this.getLabelForField('project_type'),
                tech_status: this.getLabelForField('tech_status'),
                goal: formData.get('goal'),
                timeline: this.getLabelForField('timeline'),
                budget_range: this.getLabelForField('budget_range'),
            },
            nickname: formData.get('nickname'),
            cfTurnstileResponse: this.turnstileToken,
            consent: this.consentCheckbox?.checked || false,
        };

        try {
            this.setLoading(true);
            // Limpiar estado previo
            if (this.formStatus) this.formStatus.classList.add('hidden');

            const response = await fetch(`${this.apiUrl}/forms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json().catch(() => ({}));
                const url = new URL(this.successUrl, window.location.origin);
                if (data.messageId) {
                    url.searchParams.set('LEAD_ID', data.messageId);
                }
                window.location.href = url.toString();
            } else {
                this.setLoading(false);
                const errorData = await response.json().catch(() => ({}));
                console.error("Error en respuesta API:", errorData);
                this.showStatus("Hubo un problema al enviar tu solicitud. Por favor, inténtalo de nuevo.", 'error');
            }
        } catch (error) {
            this.setLoading(false);
            console.error("Error de red o sistema:", error);
            this.showStatus("Error de conexión. Por favor, verifica tu internet e inténtalo de nuevo.", 'error');
        }
    }

    private showStatus(message: string, type: 'success' | 'error') {
        if (!this.formStatus) return;

        this.formStatus.textContent = message;
        this.formStatus.classList.remove('hidden', 'bg-green-500/10', 'text-green-400', 'border-green-500/20', 'bg-red-500/10', 'text-red-400', 'border-red-500/20', 'border');

        if (type === 'success') {
            this.formStatus.classList.add('bg-green-500/10', 'text-green-400', 'border-green-500/20', 'border');
        } else {
            this.formStatus.classList.add('bg-red-500/10', 'text-red-400', 'border-red-500/20', 'border');
        }

        this.formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Helper para obtener el texto visible (label) en lugar del value interno
    private getLabelForField(fieldName: string): string {
        const element = this.form.querySelector(`[name="${fieldName}"]`);
        if (!element) return "";

        // Caso SELECT
        if (element.tagName === 'SELECT') {
            const select = element as HTMLSelectElement;
            if (select.selectedIndex < 0) return "";
            if (!select.value) return "";
            return select.options[select.selectedIndex].text.trim();
        }
        
        // Caso RADIO Group
        if (element.getAttribute('type') === 'radio') {
            const checked = this.form.querySelector(`input[name="${fieldName}"]:checked`) as HTMLInputElement;
            if (!checked) return "";
            
            const labelParent = checked.closest('label');
            if (labelParent) {
               // Buscamos el span que contiene el texto (estructura Astro actual)
               const span = labelParent.querySelector('span');
               if (span) return span.textContent?.trim() || "";
               return labelParent.textContent?.trim() || "";
            }
            return checked.value;
        }
        
        // Default (Input text, etc)
        return (element as HTMLInputElement).value;
    }

    // --- Métodos de UI (Acordeón) ---
    private toggleStep(stepId: string, forceOpen: boolean = false) {
        const content = this.form.querySelector(`#step-${stepId}-content`);
        const button = this.form.querySelector(`button[data-step="${stepId}"]`);
        const icon = button?.querySelector('.icon-container');

        if (!content || !button) return;

        const isClosed = content.classList.contains('hidden');

        if (forceOpen || isClosed) {
            content.classList.remove('hidden');
            button.setAttribute('aria-expanded', 'true');
            icon?.classList.add('rotate-180');
        } else if (!forceOpen) {
            content.classList.add('hidden');
            button.setAttribute('aria-expanded', 'false');
            icon?.classList.remove('rotate-180');
        }
    }

    private handleAccordionClick(e: Event) {
        const target = e.currentTarget as HTMLElement;
        const step = target.dataset.step;
        if (step) this.toggleStep(step);
    }

    private handleNextStep(e: Event) {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        const targetStep = target.dataset.targetStep;
        if (targetStep) {
            this.toggleStep(targetStep, true);
            const targetContainer = document.getElementById(`step-${targetStep}-container`);
            targetContainer?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}