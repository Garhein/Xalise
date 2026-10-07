import { XalLoaderNav } from './loaders/XalLoaderNav.js';
import { XalLoaderOverlay } from './loaders/XalLoaderOverlay.js';
import { XalLoaderPlaceholder } from './loaders/XalLoaderPlaceholder.js';
import { XalToast } from './components/XalToast.js';

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
    });
}