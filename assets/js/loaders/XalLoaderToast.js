/**
 * API de gestion du toast de chargement.
 *
 * Affiche un toast Bootstrap non dismissible avec un spinner
 * pendant une opération longue.
 *
 * Le toast repose sur un élément DOM existant (non dynamique).
 *
 * @namespace XalLoaderToast
 */
const XalLoaderToast = (() => {
    /**
     * Message affiché par défaut.
     *
     * @type {string}
     */
    const DEFAULT_MESSAGE = 'Chargement en cours…';

    /**
     * Élément DOM du toast.
     *
     * @type {HTMLElement|null}
     * @private
     */
    let _toastElement = null;

    /**
     * Élément DOM du message.
     *
     * @type {HTMLElement|null}
     * @private
     */
    let _messageElement = null;

    /**
     * Instance Bootstrap associée.
     *
     * @type {bootstrap.Toast|null}
     * @private
     */
    let _toastInstance = null;

    return {
        /**
         * Initialise le composant en résolvant les éléments DOM.
         */
        init() {
            // Assure l'idempotence : évite une double initialisation
            if (_toastElement) return;

            _toastElement   = XalUIService.getElementById(XalConstants.elementIds.loader.toast);
            _messageElement = XalUIService.getRequiredElement(_toastElement, XalConstants.cssQueries.loader.toastMessage);

            _toastInstance = bootstrap.Toast.getOrCreateInstance(_toastElement, {
                autohide: false,
            });
        },

        /**
         * Affiche le toast de chargement.
         *
         * Met à jour le message puis affiche le toast.
         *
         * @param {string} [message] Message à afficher.
         */
        show(message = DEFAULT_MESSAGE) {
            if (!_toastInstance) {
                console.warn('[XalLoaderToast] la méthode d\'initialisation doit être appelé avant utilisation.');
                return;
            }

            if (this.isVisible()) return;

            _messageElement.textContent = message ?? DEFAULT_MESSAGE;
            _toastInstance.show();
        },

        /**
         * Masque le toast.
         */
        hide() {
            if (!_toastInstance) return;

            _toastInstance.hide();
        },

        /**
         * Met à jour le message affiché.
         *
         * @param {string} message Nouveau message.
         */
        setMessage(message) {
            if (!_messageElement) return;

            _messageElement.textContent = message ?? '';
        },

        /**
         * Indique si le toast est actuellement visible.
         *
         * @returns {boolean} `true` si visible, `false` sinon.
         */
        isVisible() {
            return _toastElement?.classList.contains('show') ?? false;
        },
    };
})();