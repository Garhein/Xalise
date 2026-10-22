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
    const label      = trigger.getAttribute(XalConstants.dataNames.xalise.popoverLabel);
    const valueText  = trigger.getAttribute(XalConstants.dataNames.xalise.popoverValue);
    const cssClasses = trigger.getAttribute(XalConstants.dataNames.xalise.popoverValueCssClasses);

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
        const selector  = trigger.getAttribute(XalConstants.dataNames.xalise.popoverContent);
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

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Tri des colonnes
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

/**
 * Écoute les événements de tri émis par les tables et prépare l'URL de la requête.
 * 
 * La table émettrice est récupérée depuis `event.target`. Ses paramètres de tri sont
 * ajoutés à l'URL définie dans son attribut `data-xal-refresh-url`.
 * 
 * @param {CustomEvent} event Événement émis par une table.
 */
document.addEventListener('xal-table:sort', (event) => {
    const table = event.target;
    const url   = table.getAttribute(XalConstants.dataNames.xalise.refreshUrl);

    if (!url) return;

    const { key, direction } = event.detail;
    const urlSearch = new URL(url, window.location.origin);

    urlSearch.searchParams.set('sort', key);
    urlSearch.searchParams.set('direction', direction);

    // TODO: appeler le serveur et remplacer les lignes du tableau avec sa réponse (penser à mettre async (event))
    /*
    const response = await fetch(urlSearch);
    if (!response.ok) {
        console.error('Impossible de trier les demandes d\'intégration.');
        return;
    }

    const rowsHtml = await response.text();
    table.querySelector('tbody').innerHTML = rowsHtml;
    */

    console.log(urlSearch);
});

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Taille de la pagination
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

/**
 * Écoute les changements de taille de page émis par les tables et prépare l'URL de la requête.
 * 
 * La table émettrice est récupérée depuis `event.target`. La nouvelle taille de page et le
 * numéro de page sont ajoutés à l'URL définie dans son attribut `data-xal-refresh-url`.
 * 
 * @param {CustomEvent} event Événement de changement de taille émis par une table.
 * 
 */
document.addEventListener('xal-table:page-size-change', (event) => {
    const table = event.target;
    const url   = table.getAttribute(XalConstants.dataNames.xalise.refreshUrl);

    if (!url) return;

    const { pageSize, page } = event.detail;
    const urlSearch = new URL(url, window.location.origin);

    urlSearch.searchParams.set('pageSize', pageSize);
    urlSearch.searchParams.set('page', page);

    // TODO: appeler le serveur pour mettre à jour les lignes du tableau et la pagination (penser à mettre async (event))

    console.log(urlSearch);
});