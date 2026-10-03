import { XalLoaderNav } from './loaders/XalLoaderNav.js';
import { XalLoaderOverlay } from './loaders/XalLoaderOverlay.js';

XalLoaderNav.init();
XalLoaderOverlay.init();

// Debug des modules Xalise si le paramètre `debug` est présent dans l’URL
if (new URLSearchParams(window.location.search).has('debug')) {
    window.xaliseDebug = Object.freeze({
        XalLoaderNav: XalLoaderNav,
        XalLoaderOverlay: XalLoaderOverlay,
    });
}