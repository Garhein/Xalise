import { XalLoaderNav } from './loaders/XalLoaderNav.js';
XalLoaderNav.init();

// Debug des modules Xalise si le paramètre `debug` est présent dans l’URL
if (new URLSearchParams(window.location.search).has('debug')) {
    window.xaliseDebug = Object.freeze({
        XalLoaderNav: XalLoaderNav,
    });
}