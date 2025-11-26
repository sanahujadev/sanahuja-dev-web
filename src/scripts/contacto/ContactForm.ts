// src/scripts/ContactForm.ts

import intlTelInput from 'intl-tel-input';

// Usaremos un tipo genérico para las opciones del formulario
interface FormField {
    // Definiciones simplificadas para el script
    name: string;
    required?: boolean;
}

export class ContactForm {
    private form: HTMLFormElement;
    private successUrl: string;
    private firstInvalidInput: HTMLInputElement | HTMLTextAreaElement | null = null;
    private phoneInput: HTMLInputElement | null = null;
    private iti: any;

    constructor(formElement: HTMLFormElement) {
        this.form = formElement;
        this.successUrl = this.form.dataset.successUrl || '/';
        this.phoneInput = this.form.querySelector('input[name="phone"]');

        this.initListeners();
        this.initPhoneInput();
        // Marca la inicialización para el test SEO
        this.form.setAttribute('data-form-initialized', 'true');
    }

    private initPhoneInput() {
        if (!this.phoneInput) return;

        try {
            // Inicialización directa con el módulo importado
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
    }

    private toggleStep(stepId: string, forceOpen: boolean = false) {
        // (Lógica de toggleStep: añadir/quitar clase 'hidden', rotar íconos, aria-expanded)
        // ... (Tu implementación anterior de toggleStep, con `this.form.querySelector`)
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

    // Maneja el clic en el botón de pasar al siguiente step
    private handleNextStep(e: Event) {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        const targetStep = target.dataset.targetStep;
        if (targetStep) {
            this.toggleStep(targetStep, true);
            // Scroll al nuevo paso abierto
            const targetContainer = document.getElementById(`step-${targetStep}-container`);
            targetContainer?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Helper: Validación de formato de email
    private validateEmailFormat(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Helper: Validación de formato de teléfono (Async)
    private async validatePhoneFormat(): Promise<boolean> {
        // Si no hay instancia de la librería, asumimos válido para no bloquear
        if (!this.iti) return true; 
        
        let isPhoneValid = false;
        try {
            // Esperamos a que el script de utilidades esté listo
            if (this.iti.utilsReady) {
                await this.iti.utilsReady;
            }
            
            const val = this.phoneInput?.value.trim() || "";
            // Es válido si está vacío o si la librería dice que es un número válido
            isPhoneValid = val === "" || this.iti.isValidNumber();
        } catch (err) {
            console.error("Error validando teléfono:", err);
            isPhoneValid = true; 
        }
        return isPhoneValid;
    }

    // Maneja la validación y el envío
    private async validateForm(requiredFields: string[]): Promise<boolean> {
        let isValid = true;
        this.firstInvalidInput = null;

        // Usamos for...of para poder usar await dentro del loop secuencialmente
        for (const fieldName of requiredFields) {
            const input = this.form.querySelector(`[name="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement | null;

            if (input) {
                // Reset individual error state
                input.removeAttribute('aria-invalid');
                const errorMsg = document.getElementById(`${fieldName}-error`);
                const errorIcon = document.getElementById(`${fieldName}-error-icon`);

                if (errorMsg) errorMsg.classList.add('hidden');
                if (errorIcon) errorIcon.classList.add('hidden');

                let fieldIsValid = true;
                const value = input.value.trim();

                // 1. Validación Genérica: Requerido
                if (input.hasAttribute('required') && !value) {
                    fieldIsValid = false;
                } 
                // 2. Validaciones Específicas (solo si hay valor)
                else if (value) {
                    switch (fieldName) {
                        case 'email':
                            fieldIsValid = this.validateEmailFormat(value);
                            break;
                        case 'phone':
                            fieldIsValid = await this.validatePhoneFormat();
                            break;
                        case 'name':
                            fieldIsValid = value.length >= 2; // Mínimo 2 caracteres
                            break;
                        case 'message_basic':
                        case 'message':
                            fieldIsValid = value.length >= 10; // Mínimo 10 caracteres
                            break;
                    }
                }

                if (!fieldIsValid) {
                    isValid = false;
                    input.setAttribute('aria-invalid', 'true');

                    // Mostrar error e icono
                    if (errorMsg) errorMsg.classList.remove('hidden');
                    if (errorIcon) errorIcon.classList.remove('hidden');

                    if (!this.firstInvalidInput) this.firstInvalidInput = input;
                }
            }
        }

        return isValid;
    }

    private async handleSubmit(e: Event) {
        e.preventDefault();

        // **CRÍTICO:** Campos a validar.
        // Nota: 'phone' se valida si está presente en esta lista. 
        // Si es opcional en HTML pero quieres validar formato si escriben algo, inclúyelo aquí.
        const fieldsToValidate = ['name', 'email', 'message_basic', 'phone'];

        const isFormValid = await this.validateForm(fieldsToValidate);

        if (!isFormValid) {
            // Si falla la validación, abre el paso 1 (donde suelen estar los datos de contacto)
            // o detecta en qué paso está el error (mejora futura)
            this.toggleStep('1', true);
            if (this.firstInvalidInput) {
                this.firstInvalidInput.focus();
            }
            return;
        }

        // Simulación de envío a la API (Próxima tarea para All Might Coder)
        console.log("Simulando envío de formulario a una API...");

        // Timeout simula el tiempo de respuesta del servidor (0.6s)
        setTimeout(() => {
            // **Paso clave de la Conversión:** Redirección a la página de éxito
            window.location.href = this.successUrl;
        }, 600);
    }

    // Y otros métodos privados (handleAccordionClick, etc.)
    private handleAccordionClick(e: Event) {
        const target = e.currentTarget as HTMLElement;
        console.log(target.dataset, "debug");

        const step = target.dataset.step;
        if (step) this.toggleStep(step);
    }
}