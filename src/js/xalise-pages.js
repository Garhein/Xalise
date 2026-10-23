import { initBootstrapFormValidation } from './core/XalFormValidation.js';
import { initFormClearButtons } from './core/XalForm.js';
import { XalToast } from './components/XalToast.js';
import { XalLoaderNav } from './loaders/XalLoaderNav.js';
import { XalLoaderOverlay } from './loaders/XalLoaderOverlay.js';
import { XalLoaderPlaceholder } from './loaders/XalLoaderPlaceholder.js';

/**
 * Initialise les éléments partagés par les pages de l'application.
 **/
function initAppShell() {
    initBootstrapFormValidation();
    initFormClearButtons();

    XalLoaderOverlay.init();
    XalLoaderPlaceholder.init();
    XalLoaderNav.init();
    XalToast.init();

    exposeDebugModules();
}

/**
 * Expose les composants communs dans la console en mode debug.
 **/
function exposeDebugModules() {
    if (!new URLSearchParams(window.location.search).has('debug')) return;

    window.xaliseDebug = Object.freeze({
        XalLoaderNav,
        XalLoaderOverlay,
        XalLoaderPlaceholder,
        XalToast,
    });
}

initAppShell();
