import { XalConstants } from './core/XalConstants.js';
import { initBootstrapFormValidation } from './core/XalFormValidation.js';
import { initTableSelection } from './core/XalTableSelection.js';
import { initTableSort } from './core/XalTableSort.js';
import { initFormClearButtons  } from './core/XalForm.js';
import { initTablePagination  } from './core/XalTablePagination.js';

import { XalLoaderNav } from './loaders/XalLoaderNav.js';
import { XalLoaderOverlay } from './loaders/XalLoaderOverlay.js';
import { XalLoaderPlaceholder } from './loaders/XalLoaderPlaceholder.js';

import { XalToast } from './components/XalToast.js';
import { XalDialog } from './components/XalDialog.js';

initBootstrapFormValidation();
initTableSelection();
initTableSort();
initFormClearButtons();
initTablePagination();

XalLoaderOverlay.init();
XalLoaderPlaceholder.init();
XalLoaderNav.init();
XalToast.init();

// Debug des modules Xalise si le paramètre `debug` est présent dans l’URL
if (new URLSearchParams(window.location.search).has('debug')) {
    window.xaliseDebug = Object.freeze({
        XalLoaderNav: XalLoaderNav,
        XalLoaderOverlay: XalLoaderOverlay,
        XalLoaderPlaceholder: XalLoaderPlaceholder,
        XalToast: XalToast,
        XalDialog: XalDialog,
    });
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Gestion des popovers
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

function createSourcePopoverContent(trigger) {
    const content    = document.createElement('span');
    const label      = trigger.dataset.xalPopoverLabel;
    const valueText  = trigger.dataset.xalPopoverValue;
    const cssClasses = trigger.dataset.xalPopoverValueCssClasses;

    content.append(`${label} : `);

    const value = document.createElement('span');
    value.classList.add(cssClasses);
    value.textContent = valueText;

    content.append(value);

    return content;
}

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

        if (trigger.hasAttribute(XalConstants.dataNames.xalise.popoverValue)) {
            options.html = true;
            options.content = () => createSourcePopoverContent(trigger);
        }
        else if (source) {
            options.html = true;
            options.content = () => source.innerHTML;
        }

        bootstrap.Popover.getOrCreateInstance(trigger, options);
    });

document.addEventListener('show.bs.popover', (event) => {
    const openedTrigger = event.target;

    document
        .querySelectorAll(XalConstants.cssQueries.bootstrap.togglePopover)
        .forEach((trigger) => {
            if (trigger === openedTrigger) return;

            bootstrap.Popover.getInstance(trigger)?.hide();
        });
});