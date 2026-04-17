/**
 * API de gestion de l’overlay de chargement global.
 *
 * Affiche un écran bloquant avec un message lors de traitements longs.
 *
 * L’overlay est contrôlé via un état interne (`_isVisible`) afin
 * d’éviter les mises à jour inutiles et garantir un comportement idempotent.
 *
 * @requires XalConstants
 *
 * @namespace XalLoaderOverlay
 */
const XalLoaderOverlay = (() => {
    /**
     * Élément DOM de l'overlay.
     * 
     * Résolu lors de l’appel à `init()`.
     * 
     * @private
     *
     * @type {HTMLElement|null}
     */
    let _overlayElement = null;

    /**
     * Élément DOM du message.
     * 
     * Résolu lors de l’appel à `init()`.
     *
     * @private
     * 
     * @type {HTMLElement|null}
     */
    let _messageElement = null;

    /**
     * Indique si l’overlay est actuellement affiché.
     * 
     * @private
     * 
     * @type {boolean} `true` si l'overlay' est affiché, `false` sinon.
     */
    let _isVisible = false;

    /**
     * Met à jour la visibilité de l’overlay.
     *
     * Synchronise l’affichage DOM ainsi que l’attribut ARIA `aria-hidden`.
     * 
     * @private
     *
     * @param {boolean} isActive `true` pour afficher l'overlay, `false` pour le masquer.
     * 
     * @returns {void}
     */
    const _update = (isActive) => {
        if (!_overlayElement) return;
        
        _overlayElement.hidden = !isActive;
        _overlayElement.setAttribute(XalConstants.ariaNames.hidden, String(!isActive));
    };

    return {
        /**
         * Initialise le composant en résolvant les éléments DOM requis.
         *
         * L’idempotence est assurée : les appels multiples n’ont aucun effet
         * après la première initialisation réussie.
         * 
         * @public
         * 
         * @throws {Error} Si l’élément overlay ou le conteneur du message est introuvable.
         * 
         * @returns {void}
         */
        init() {
            if (_overlayElement) return;

            _overlayElement = document.getElementById(XalConstants.elementIds.loader.overlay);

            if (!_overlayElement) {
                throw new Error(`[XalLoaderOverlay] Élément "${XalConstants.elementIds.loader.overlay}" non trouvé dans le DOM.`);
            }

            _messageElement = _overlayElement.querySelector(XalConstants.cssQueries.loader.overlayMessage);

            if (!_messageElement) {
                throw new Error('[XalLoaderOverlay] Élément du message introuvable dans l\'overlay.');
            }
        },
        
        /**
         * Affiche l’overlay de chargement avec un message optionnel.
         *
         * Met à jour le message affiché puis active l’overlay si celui-ci
         * n’est pas déjà visible. Les appels répétés mettent uniquement à jour
         * le message sans réinitialiser l’état.
         *
         * Aucun effet si l’élément DOM requis n’est pas initialisé.
         *
         * @public
         *
         * @param {string} [message=''] Message à afficher dans l’overlay.
         *
         * @returns {void}
         */
        show(message = '') {
            if (!_messageElement) {
                console.warn('[XalLoaderOverlay] La méthode d\'initialisation doit être appelée avant utilisation.');
                return;
            }

            _messageElement.textContent = message;
             
            // Ne réaffiche pas l’overlay si déjà visible (idempotence)
            if (!_isVisible) {
                _isVisible = true;
                _update(true);
            }
        },

        /**
         * Masque l’overlay de chargement s’il est actuellement visible.
         *
         * Met à jour l’état interne et déclenche la synchronisation visuelle.
         * Aucun effet si l’overlay n’est pas initialisé ou déjà masqué.
         *
         * @public
         *
         * @returns {void}
         */
        hide() {
            // Évite une mise à jour inutile si déjà masqué
            if (!_overlayElement || !_isVisible) return;
            
            _isVisible = false;
            _update(false);
        },

        /**
         * Réinitialise l’état de l’overlay de chargement.
         *
         * Force le masquage de l’overlay et réinitialise son état interne,
         * indépendamment de sa visibilité actuelle.
         *
         * Utile en cas d’erreur globale, d’annulation ou de navigation
         * pour garantir un état cohérent.
         *
         * @public
         *
         * @returns {void}
         */
        reset() {
            _isVisible = false;
            _update(false);
        },

        /**
         * Met à jour le message affiché dans l’overlay de chargement.
         *
         * Modifie uniquement le contenu texte sans affecter la visibilité
         * de l’overlay.
         *
         * Aucun effet si les éléments DOM requis ne sont pas initialisés.
         *
         * @public
         *
         * @param {string} [message=''] Message à afficher dans l’overlay.
         *
         * @returns {void}
         */
        setMessage(message = '') {
            if (!_messageElement || !_overlayElement) return;

            _messageElement.textContent = message;
        },
    };
})();