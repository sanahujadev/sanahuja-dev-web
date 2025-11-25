// src/scripts/ContactForm.ts

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

    constructor(formElement: HTMLFormElement) {
        this.form = formElement;
        this.successUrl = this.form.dataset.successUrl || '/';

        this.initListeners();
        // Marca la inicialización para el test SEO
        this.form.setAttribute('data-form-initialized', 'true');
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

    // Maneja la validación y el envío
    private validateForm(requiredFields: string[]): boolean {
        // (Tu implementación anterior de validación)
        // ... (Código que limpia errores y busca campos vacíos)
        let isValid = true;
        this.firstInvalidInput = null;

        requiredFields.forEach(fieldName => {
            const input = this.form.querySelector(`[name="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement | null;
            
            if (input && input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                input.setAttribute('data-invalid', 'true');
                // Lógica de mostrar error, etc.
                const errorMsg = document.getElementById(`${fieldName}-error`);
                if (errorMsg) errorMsg.classList.remove('hidden');

                if (!this.firstInvalidInput) this.firstInvalidInput = input;
            }
        });

        return isValid;
    }

    private handleSubmit(e: Event) {
        e.preventDefault();

        // **CRÍTICO:** Aquí defines los campos requeridos para el envío básico
        const requiredFields = ['name', 'email', 'message_basic'];

        if (!this.validateForm(requiredFields)) {
            // Si falla la validación básica, abre el primer step y enfoca el error
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