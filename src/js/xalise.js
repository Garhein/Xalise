import { initBootstrapFormValidation } from './core/XalFormValidation.js';
import { initStaticFormNavigation } from './core/XalFormNavigation.js';

initBootstrapFormValidation();
initStaticFormNavigation();

// Activation des popovers
document
    .querySelectorAll('[data-bs-toggle="popover"]')
    .forEach((popoverTriggerEl) => {
        bootstrap.Popover.getOrCreateInstance(popoverTriggerEl);
    });