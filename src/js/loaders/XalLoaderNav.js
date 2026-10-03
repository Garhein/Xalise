import { XalConstants } from '../core/XalConstants.js';

/**
 * Barre de progression indéterminée de la barre de navigation.
 *
 * Chaque traitement doit appeler `start()` puis `stop()` dans un bloc `finally`.
 * Le compteur interne permet de gérer plusieurs traitements simultanés : la barre reste visible jusqu’à leur achèvement.
 *
 * @requires XalConstants
 * @namespace XalLoaderNav
 */
export const XalLoaderNav = (() => {
    /** 
     * Nombre de traitements en cours.
     * 
     * @type {number}
     */
    let _pendingCount = 0;

    /**
     * Élément DOM de la barre, résolu par `init()`.
     * 
     * @type {HTMLElement|null}
     */
    let _barElement = null;

    /**
     * Indique si au moins un traitement est en cours.
     * 
     * @returns {boolean} `true` si au moins un traitement est en cours, `false` sinon.
     */
    const _isActive = () => _pendingCount > 0;

    /**
     * Vérifie si l’élément DOM a été résolu avant toute utilisation.
     *
     * @throws {Error} Si `init()` n’a pas été appelé ou si l’élément DOM est manquant.
     */
    const _throwIfNotInitialized = () => {
        if (!_barElement) {
            throw new Error('[XalLoaderNav] Veuillez exécuter `init()` avant `start()`, `stop()` ou toute mise à jour.');
        }
    };

    /**
     * Synchronise l’affichage de la barre et gère l'attribut ARIA.
     * 
     * @throws {Error} Si l’élément DOM n’a pas été initialisé.
     */
    const _update = () => {
        _throwIfNotInitialized();

        const isActive = _isActive();

        _barElement.hidden = !isActive;
        _barElement.setAttribute(XalConstants.ariaNames.hidden, String(!isActive));
    };

    return Object.freeze({
        /**
         * Initialise le module en résolvant l’élément DOM de la barre.
         * Les appels suivants sont sans effet.
         *
         * @throws {Error} Si l’élément requis est absent du DOM.
         */
        init() {
            if (_barElement) return;

            const elementId = XalConstants.elementIds.loader.navbar;
            const element   = document.getElementById(elementId);

            if (!element) {
                throw new Error(`[XalLoaderNav] Élément "${elementId}" introuvable dans le DOM.`);
            }

            _barElement = element;
        },

        /**
         * Signale le début d’un traitement et affiche la barre si nécessaire.
         * 
         * @throws {Error} Si l’élément DOM n’a pas été initialisé.
         */
        start() {
            _throwIfNotInitialized();

            const wasActive = _isActive();
            _pendingCount++;

            if (!wasActive) _update();
        },

        /**
         * Signale la fin d’un traitement.
         * Un appel sans `start()` correspondant est ignoré et signalé.
         * 
         * @throws {Error} Si l’élément DOM n’a pas été initialisé.
         */
        stop() {
            _throwIfNotInitialized();

            if (_pendingCount === 0) {
                console.warn('[XalLoaderNav] `stop()` appelé sans `start()` correspondant.');
                return;
            }

            _pendingCount--;

            if (!_isActive()) _update();
        },
    });
})();
