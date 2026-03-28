/**
 * API de gestion de l'overlay de chargement.
 *
 * Affiche un voile semi-transparent sur la page afin de bloquer
 * toute interaction utilisateur pendant un traitement.
 *
 * Supporte les appels concurrents via un compteur interne :
 * l'overlay reste visible tant qu'au moins un appel est en cours.
 *
 * Dépendances :
 * - XalConstants.js → XalConstants
 *
 * @namespace XalLoaderOverlay 
 */
const XalLoaderOverlay = (() => {
    /**
     * Nombre de traitements en cours.
     *
     * L'overlay est masqué uniquement quand ce compteur atteint 0.
     *
     * @type {number}
     * @private
     */
    let _pendingCount = 0;

    /**
     * Référence vers l'élément DOM de l'overlay.
     * 
     * Initialisée dans init().
     *
     * @type {HTMLElement|null}
     * @private
     */
    let _overlayElt = null;

    /**
     * Référence vers l'élément DOM du message.
     * 
     * Initialisée dans init().
     *
     * @type {HTMLElement|null}
     * @private
     */
    let _messageElt = null;

    /**
     * Indique si au moins un traitement est en cours.
     *
     * @returns {boolean} `true` si l'overlay' est active, `false` sinon.
     */
    const _isActive = () => {
        return _pendingCount > 0;
    };

    /**
     * Met à jour la visibilité de l'overlay en fonction du nombre
     * de traitements en cours
     *
     * @private
     */
    const _update = () => {
        if (!_overlayElt) {
            console.warn('[XalLoaderOverlay] init() doit être appelé avant utilisation.');
            return;
        }

        const isActive = _isActive();

        _overlayElt.hidden = !isActive;
        _overlayElt.setAttribute(XalConstants.ariaNames.hidden, String(!isActive));
    };

    return {
        /**
         * Affiche l'overlay et bloque les interactions utilisateur.
         *
         * Incrémente le compteur interne et affiche l'overlay si nécessaire.
         * Supporte les appels concurrents.
         *
         * @param {string} [message=''] - Message optionnel affiché sous le spinner.
         */
        show(message = '') {
            const wasActive = _isActive();
            _pendingCount++;

            if (!wasActive) {
                if (_messageElt) {
                    _messageElt.textContent = message;
                }

                _update();
            }
        },

        /**
         * Masque l'overlay et restaure les interactions utilisateur.
         *
         * Décrémente le compteur (sans passer sous 0) et masque l'overlay
         * si aucun traitement n'est en cours.
         */
        hide() {
            _pendingCount = Math.max(0, _pendingCount - 1);
            _update();
        },

        /**
         * Réinitialise le compteur et masque immédiatement l'overlay.
         *
         * Utile en cas d'erreur globale ou de navigation.
         */
        reset() {
            _pendingCount = 0;
            _update();
        },

        /**
         * Met à jour le message affiché sans masquer ni réafficher l'overlay.
         *
         * Sans effet si l'overlay n'est pas affiché.
         *
         * @param {string} message - Nouveau message à afficher.
         */
        updateMessage(message) {
            if (!_messageElt || !_overlayElt) return;

            _messageElt.textContent = message;
        },

        /**
         * Initialise le composant en résolvant les éléments DOM/.
         *
         * Doit être appelé avant toute utilisation.
         */
        init() {
            // Assure l'idempotence : évite une double initialisation
            if (_overlayElt) return;

            _overlayElt = document.getElementById(XalConstants.elementIds.loaderOverlay);
            _messageElt = _overlayElt?.querySelector(XalConstants.cssQueries.loaderOverlayMessage);

            if (!_overlayElt) {
                console.warn('[XalLoaderOverlay] Élément (overlay) introuvable dans le DOM.');
                return;
            }

            if (!_messageElt) {
                console.warn('[XalLoaderOverlay] Élément (message) introuvable dans le DOM.');
                return;
            }
        },
    };
})();