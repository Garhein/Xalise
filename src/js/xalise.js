import { initBootstrapFormValidation } from './core/XalFormValidation.js';
import { initStaticFormNavigation } from './core/XalFormNavigation.js';

initBootstrapFormValidation();
initStaticFormNavigation();

// Activation des popovers
document
    .querySelectorAll('[data-bs-toggle="popover"]')
    .forEach((trigger) => {
        const selector  = trigger.dataset.xalPopoverContent;
        const source    = selector ? document.querySelector(selector) : null;

        const options = {
            container: 'body'
        };

        if (source) {
            options.html = true;
            options.content = () => source.innerHTML;
        }

        bootstrap.Popover.getOrCreateInstance(trigger, options);
    });