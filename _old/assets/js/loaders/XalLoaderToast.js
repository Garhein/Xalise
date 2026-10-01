/**
 * API de gestion du toast de chargement.
 *
 * Affiche un toast Bootstrap non dismissible contenant un indicateur visuel
 * (spinner) pendant l’exécution d’opérations asynchrones.
 *
 * Le composant repose sur un élément DOM existant (non généré dynamiquement)
 * et gère automatiquement la concurrence via un compteur interne.
 *
 * Le toast est affiché tant qu’au moins une opération est en cours,
 * puis masqué lorsqu'elles sont toutes terminées.
 *
 * @requires XalConstants
 *
 * @namespace XalLoaderToast
 */
const XalLoaderToast = (() => {
    /**
     * Message affiché par défaut dans le toast.
     *
     * Utilisé lorsque aucun message n’est fourni lors de l’appel à `show()`
     * ou `setMessage()`.
     *
     * @private
     *
     * @type {string}
     */
    const DEFAULT_MESSAGE = 'Chargement en cours…';

    /**
     * Élément DOM racine du toast.
     *
     * Résolu lors de l’appel à `init()`.
     *
     * @private
     *
     * @type {HTMLElement|null}
     */
    let _toastElement = null;

    /**
     * Élément DOM contenant le message du toast.
     *
     * Résolu à partir de `_toastElement` lors de l'appel à `init()`.
     *
     * @private
     *
     * @type {HTMLElement|null}
     */
    let _messageElement = null;

    /**
     * Instance Bootstrap associée au toast.
     *
     * Permet de contrôler l’affichage et le masquage via l’API Bootstrap.
     *
     * @private
     *
     * @type {bootstrap.Toast|null}
     */
    let _toastInstance = null;

    /**
     * Nombre d’opérations en cours.
     *
     * Chaque appel à `show()` incrémente ce compteur,
     * tandis que chaque appel à `hide()` le décrémente.
     *
     * Le toast reste visible tant que ce compteur est supérieur à 0.
     *
     * @private
     *
     * @type {number}
     */
    let _pendingCount = 0;

    /**
     * Indique si le toast est actuellement visible.
     *
     * Permet de découpler l’état logique du DOM
     * et d’éviter les dépendances aux classes CSS Bootstrap.
     *
     * @private
     *
     * @type {boolean}
     */
    let _isVisible = false;

    return {
        /**
         * Initialise le composant en résolvant les éléments DOM requis.
         *
         * L’idempotence est assurée : les appels multiples n’ont aucun effet
         * après la première initialisation réussie.
         *
         * @public
         *
         * @throws {Error} Si l’élément du toast ou son message est introuvable dans le DOM.
         *
         * @returns {void}
         */
        init() {
            if (_toastElement) return;

            _toastElement = document.getElementById(XalConstants.elementIds.loader.toast);

            if (!_toastElement) {
                throw new Error(`[XalLoaderToast] Élément "${XalConstants.elementIds.loader.toast}" non trouvé dans le DOM.`);
            }

            _messageElement = _toastElement.querySelector(XalConstants.cssQueries.loader.toastMessage);

            if (!_messageElement) {
                throw new Error('[XalLoaderToast] Élément du message introuvable dans le toast.');
            }

            _toastInstance = bootstrap.Toast.getOrCreateInstance(_toastElement, {
                autohide: false,
            });
        },

        /**
         * Affiche le toast de chargement.
         *
         * Incrémente le compteur interne des opérations en cours.
         * Le toast est affiché uniquement lors du passage de l’état
         * inactif à actif.
         *
         * Si un message est fourni, il remplace le message actuellement affiché.
         *
         * Aucun effet si le composant n’est pas initialisé.
         *
         * @public
         *
         * @param {string} [message=DEFAULT_MESSAGE] Message à afficher dans le toast.
         *
         * @returns {void}
         */
        show(message = DEFAULT_MESSAGE) {
            if (!_toastInstance) {
                console.warn('[XalLoaderToast] La méthode d\'initialisation doit être appelée avant utilisation.');
                return;
            }

            _pendingCount++;
            _messageElement.textContent = message ?? DEFAULT_MESSAGE;

            if (!_isVisible) {
                _toastInstance.show();
                _isVisible = true;
            }
        },

        /**
         * Masque le toast de chargement.
         *
         * Décrémente le compteur interne des opérations en cours.
         * Le toast est masqué uniquement lorsque toutes les opérations
         * sont terminées (compteur à 0).
         *
         * Aucun effet si le composant n’est pas initialisé.
         *
         * @public
         *
         * @returns {void}
         */
        hide() {
            if (!_toastInstance) return;

            _pendingCount = Math.max(0, _pendingCount - 1);

            if (_pendingCount === 0 && _isVisible) {
                _toastInstance.hide();
                _isVisible = false;
            }
        },

        /**
         * Réinitialise complètement l’état du toast de chargement.
         *
         * Remet le compteur interne à 0 et force le masquage du toast,
         * indépendamment de son état courant.
         *
         * Utile en cas d’erreur globale, d’annulation ou de navigation
         * pour garantir un état cohérent.
         *
         * @public
         *
         * @returns {void}
         */
        reset() {
            _pendingCount = 0;

            if (_toastInstance && _isVisible) {
                _toastInstance.hide();
            }

            _isVisible = false;
        },

        /**
         * Met à jour le message affiché dans le toast.
         *
         * N’affecte pas la visibilité du toast.
         *
         * Aucun effet si le composant n’est pas initialisé.
         *
         * @public
         *
         * @param {string} [message=DEFAULT_MESSAGE] Nouveau message à afficher.
         *
         * @returns {void}
         */
        setMessage(message) {
            if (!_messageElement) return;

            _messageElement.textContent = message ?? DEFAULT_MESSAGE;
        },

        /**
         * Indique si le toast de chargement est actuellement visible.
         *
         * Repose sur l’état interne plutôt que sur le DOM pour garantir
         * une information fiable indépendamment des animations Bootstrap.
         *
         * @public
         *
         * @returns {boolean} `true` si le toast est visible, sinon `false`.
         */
        isVisible() {
            return _isVisible;
        },
    };
})();