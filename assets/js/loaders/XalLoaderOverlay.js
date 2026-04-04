/**
 * API de gestion de l'overlay de chargement.
 *
 * Affiche un voile semi-transparent sur la page afin de bloquer
 * toute interaction utilisateur pendant un traitement.
 * 
 * L'overlay repose sur un élément DOM existant (non dynamique).
 *
 * @namespace XalLoaderOverlay 
 */
const XalLoaderOverlay = (() => {
    /**
     * Élément DOM de l'overlay.
     *
     * @type {HTMLElement|null}
     * @private
     */
    let _overlayElement = null;

    /**
     * Élément DOM du message.
     *
     * @type {HTMLElement|null}
     * @private
     */
    let _messageElement = null;

    /**
     * Indique si l'overlay est affiché.
     * 
     * @type {boolean} `true` si l'overlay' est affiché, `false` sinon.
     * @private
     */
    let _isVisible = false;

    /**
     * Met à jour la visibilité de l'overlay.
     *
     * @param {boolean} isActive - `true` si l'overlay doit être affiché, sinon `false`.
     * @private
     */
    const _update = (isActive) => {
        if (!_overlayElement) {
            console.warn('[XalLoaderOverlay] la méthode d\'initialisation doit être appelé avant utilisation.');
            return;
        }

        XalUIService.setVisible(_overlayElement, isActive);
    };

    return {
        /**
         * Initialise le composant en résolvant les éléments DOM.
         */
        init() {
            // Assure l'idempotence : évite une double initialisation
            if (_overlayElement) return;

            _overlayElement = XalUIService.getElementById(XalConstants.elementIds.loader.overlay);
            _messageElement = XalUIService.getRequiredElement(_overlayElement, XalConstants.cssQueries.loader.overlayMessage);
        },
        
        /**
         * Affiche l'overlay de chargement.
         * 
         * Met à jour le message puis affiche l'overlay.
         * 
         * @param {string} [message=''] - Message optionnel affiché sous le spinner.
         */
        show(message = '') {
            if (!_messageElement) {
                console.warn('[XalLoaderOverlay] la méthode d\'initialisation doit être appelé avant utilisation.');
                return;
            }

            if (_messageElement) _messageElement.textContent = message ?? '';
             
            if (!_isVisible) {
                _isVisible = true;
                _update(true);
            }
        },

        /**
         * Masque l'overlay de chargement.
         */
        hide() {
            if (!_overlayElement) return;
            
            _isVisible = false;
            _update(false);
        },

        /**
         * Masque immédiatement l'overlay de chargement.
         *
         */
        reset() {
            _isVisible = false;
            _update(false);
        },

        /**
         * Met à jour le message affiché.
         *
         * @param {string} message - Nouveau message.
         */
        setMessage(message) {
            if (!_messageElement || !_overlayElement) return;

            _messageElement.textContent = message ?? '';
        },
    };
})();