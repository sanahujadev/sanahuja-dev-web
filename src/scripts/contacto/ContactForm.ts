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

    // Librerías y Estado
    private iti: any;
    private firstInvalidInput: HTMLInputElement | HTMLTextAreaElement | null = null;

    constructor(formElement: HTMLFormElement) {
        this.form = formElement;
        this.successUrl = this.form.dataset.successUrl || '/';
        
        // 1. Inicialización de Inputs
        this.nameInput = this.form.querySelector('input[name="name"]');
        this.emailInput = this.form.querySelector('input[name="email"]');
        this.phoneInput = this.form.querySelector('input[name="phone"]');
        this.messageInput = this.form.querySelector('textarea[name="message_basic"]'); // O 'message' según tu HTML
        this.consentCheckbox = this.form.querySelector('input[name="consent"]'); // Nuevo

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

        this.initListeners();
        this.initPhoneInput();
        
        // Marca la inicialización para el test SEO
        this.form.setAttribute('data-form-initialized', 'true');
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

    private async handleSubmit(e: Event) {
        e.preventDefault();

        const isFormValid = await this.validateForm();

        if (!isFormValid) {
            // Asumimos que los datos personales están en el paso 1.
            // En un futuro podríamos detectar en qué paso está this.firstInvalidInput
            this.toggleStep('1', true);
            this.firstInvalidInput?.focus();
            return;
        }

        console.log("Simulando envío de formulario a una API...");

        setTimeout(() => {
            window.location.href = this.successUrl;
        }, 600);
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