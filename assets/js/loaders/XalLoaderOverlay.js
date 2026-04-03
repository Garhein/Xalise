/**
 * API de gestion de l'overlay de chargement.
 *
 * Affiche un voile semi-transparent sur la page afin de bloquer
 * toute interaction utilisateur pendant un traitement.
 *
 * Dépendances :
 * - XalConstants.js → XalConstants
 *
 * @namespace XalLoaderOverlay 
 */
const XalLoaderOverlay = (() => {
    /**
     * Référence vers l'élément DOM de l'overlay.
     * Résolu une seule fois dans init() depuis le HTML statique.
     *
     * @type {HTMLElement|null}
     */
    let _overlayElt = null;

    /**
     * Référence vers l'élément DOM du message.
     * Résolu une seule fois dans init() depuis le HTML statique.
     *
     * @type {HTMLElement|null}
     */
    let _messageElt = null;

    /**
     * Indique si l'overlay est affiché.
     * 
     * @type {boolean} `true` si l'overlay' est affiché, `false` sinon.
     */
    let _isVisible = false;

    /**
     * Met à jour la visibilité de l'overlay.
     *
     * @param {boolean} isActive - `true` si l'overlay doit être affiché, sinon `false`.
     */
    const _update = (isActive) => {
        if (!_overlayElt) {
            console.warn('[XalLoaderOverlay] init() doit être appelé avant utilisation.');
            return;
        }

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
            if (_messageElt) _messageElt.textContent = message;
             
            if (!_isVisible) {
                _isVisible = true;
                _update(true);
            }
        },

        /**
         * Masque l'overlay et restaure les interactions utilisateur.
         */
        hide() {
            _isVisible = false;
            _update(false);
        },

        /**
         * Réinitialise le compteur et masque immédiatement l'overlay.
         *
         * Utile en cas d'erreur globale ou de navigation.
         */
        reset() {
            _isVisible = false;
            _update(false);
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

            _overlayElt = document.getElementById(XalConstants.elementIds.loader.overlay);
            _messageElt = _overlayElt?.querySelector(XalConstants.cssQueries.loader.overlayMessage);

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