import { XalConstants } from './core/XalConstants.js';
import { initBootstrapFormValidation } from './core/XalFormValidation.js';
import { initStaticFormNavigation } from './core/XalFormNavigation.js';
import { initTableSelection } from './core/XalTableSelection.js';

initBootstrapFormValidation();
initStaticFormNavigation();
initTableSelection();

// Activation des popovers, en autorisant les balises 'time'
const popoverAllowList = {
    ...bootstrap.Popover.Default.allowList,
    time: ['datetime']
};

document
    .querySelectorAll(XalConstants.cssQueries.bootstrap.togglePopover)
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