import { initBootstrapFormValidation } from './core/XalFormValidation.js';
import { initStaticFormNavigation } from './core/XalFormNavigation.js';

initBootstrapFormValidation();
initStaticFormNavigation();

// Activation des popovers, en autorisant les balises 'time'
const popoverAllowList = {
    ...bootstrap.Popover.Default.allowList,
    time: ['datetime']
};

document
    .querySelectorAll('[data-bs-toggle="popover"]')
    .forEach((trigger) => {
        const selector  = trigger.dataset.xalPopoverContent;
        const source    = selector ? document.querySelector(selector) : null;

        const options = {
            container: 'body',
            allowList: popoverAllowList
        };

        if (source) {
            options.html = true;
            options.content = () => source.innerHTML;
        }

        bootstrap.Popover.getOrCreateInstance(trigger, options);
    });