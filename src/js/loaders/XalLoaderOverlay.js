import { XalConstants } from '../core/XalConstants.js';

/**
 * Overlay de chargement affiché lors de traitements longs.
 * 
 * L'overlay est contrôlé via un état interne afin d’éviter les mises à jour inutiles.
 *
 * @requires XalConstants
 * @namespace XalLoaderOverlay
 */
export const XalLoaderOverlay = (() => {
    /**
     * Élément DOM de l'overlay, résolu par `init()`.
     *
     * @type {HTMLElement|null}
     */
    let _overlayElement = null;

    /**
     * Élément DOM du message, résolu par `init()`.
     * 
     * @type {HTMLElement|null}
     */
    let _messageElement = null;

    /**
     * Indique si l’overlay est actuellement affiché.
     * 
     * @type {boolean} `true` si l'overlay est affiché, `false` sinon.
     */
    let _isVisible = false;

    /**
     * Vérifie si les éléments DOM requis ont été initialisés avant toute utilisation.
     * 
     * @throws {Error} Si `init()` n’a pas été appelé ou si les éléments DOM sont manquants.
     */
    const _throwIfNotInitialized = () => {
        if (!_overlayElement || !_messageElement) {
            throw new Error('[XalLoaderOverlay] Veuillez exécuter `init()` avant `show()`, `hide()` ou `updateMessage()`.');
        }
    };

    /**
     * Synchronise l’affichage de l’overlay et gère l'attribut ARIA.
     *
     * @param {boolean} isActive `true` pour afficher l'overlay, `false` pour le masquer.
     */
    const _update = (isActive) => {
        _overlayElement.hidden = !isActive;
        _overlayElement.setAttribute(XalConstants.ariaNames.hidden, String(!isActive));
    };

    /**
     * Actualise le message affiché dans l’overlay de chargement.
     * Modifie uniquement le contenu texte sans affecter la visibilité de l’overlay.
     *
     * @param {string} [message=''] Message à afficher dans l’overlay.
     */
    const _setMessage = (message = '') => {
        _messageElement.textContent = message;
    };

    return Object.freeze({
        /**
         * Initialise le module en résolvant les éléments DOM requis.
         * Les appels suivants sont sans effet.
         *
         * @throws {Error} Si l’un des éléments requis est absent du DOM.
         */
        init() {
            if (_overlayElement) return;

            const overlayId         = XalConstants.elementIds.loader.overlay;
            const overlayElt        = document.getElementById(overlayId);

            const messageSelector   = XalConstants.cssQueries.loader.overlayMessage;
            const messageElt        = overlayElt ? overlayElt.querySelector(messageSelector) : null;

            if (!overlayElt) {
                throw new Error(`[XalLoaderOverlay] Élément "${overlayId}" introuvable dans le DOM.`);
            }

            if (!messageElt) {
                throw new Error(`[XalLoaderOverlay] Élément du message "${messageSelector}" introuvable dans l'overlay.`);
            }

            _overlayElement = overlayElt;
            _messageElement = messageElt;

            _isVisible = false;
            _update(false);
        },
        
        /**
         * Affiche l’overlay de chargement avec un message optionnel.
         *
         * @param {string} [message=''] Message à afficher dans l’overlay.
         * @throws {Error} Si l’un des éléments du DOM n'a pas été initialisé.
         */
        show(message = '') {
            _throwIfNotInitialized();
            _setMessage(message);
 
            if (!_isVisible) {
                _isVisible = true;
                _update(true);
            }
        },

        /**
         * Masque l’overlay de chargement s’il est actuellement visible.
         *
         * @throws {Error} Si l’un des éléments du DOM n'a pas été initialisé.
         */
        hide() {
            _throwIfNotInitialized();

            if (_isVisible) {
                _isVisible = false;
                _update(false);
            }
        },

        /**
         * Actualise le message affiché dans l’overlay de chargement.
         * Modifie uniquement le contenu texte sans affecter la visibilité de l’overlay.
         *
         * @param {string} [message=''] Message à afficher dans l’overlay.
         * @throws {Error} Si l’un des éléments du DOM n'a pas été initialisé.
         */
        updateMessage(message = '') {
            _throwIfNotInitialized();
            _setMessage(message);
        },
    });
})();