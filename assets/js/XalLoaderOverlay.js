/**
 * Gestion de l'overlay de chargement.
 *
 * Affiche un voile semi-transparent sur la page afin de bloquer
 * toute interaction utilisateur pendant une opération en cours
 * (action destructive, soumission de formulaire, opération longue).
 *
 * Supporte les appels concurrents via un compteur interne :
 * l'overlay reste visible tant qu'au moins un appel est en cours.
 *
 * Utilisation typique :
 * - Suppression ou archivage d'un enregistrement
 * - Soumission de formulaire
 * - Opération longue nécessitant de bloquer les interactions
 *
 * L'overlay est déclaré en HTML statique dans index.html et
 * résolu une seule fois dans init().
 *
 * HTML requis dans index.html :
 * <div id="xal-id-loader-overlay" class="xal-loader-overlay" aria-hidden="true" hidden>
 *     <div class="xal-loader-overlay__spinner" aria-hidden="true"></div>
 * </div>
 *
 * Dépendances :
 * - XalConstants.js → XalConstants
 *
 * @namespace XalLoaderOverlay
 * @author Xavier VILLEMIN
 */
const XalLoaderOverlay = (() => {
    /**
     * Nombre d'appels ayant demandé l'affichage de l'overlay.
     *
     * L'overlay est masqué uniquement quand ce compteur atteint 0,
     * ce qui permet de gérer correctement les appels concurrents
     * sans masquer l'overlay prématurément.
     *
     * @type {number}
     */
    let _pendingCount = 0;

    /**
     * Référence vers l'élément DOM de l'overlay.
     * Résolu une seule fois dans init() depuis le HTML statique.
     *
     * @type {HTMLElement|null}
     */
    let _overlayElt = null;

    /**
     * Référence vers l'élément DOM du message.
     *
     * @type {HTMLElement|null}
     */
    let _messageElt = null;

    /**
     * Met à jour la visibilité de l'overlay selon le compteur courant.
     *
     * - _pendingCount > 0 : overlay visible, interactions bloquées
     * - _pendingCount = 0 : overlay masqué, interactions restaurées
     */
    const _update = () => {
        if (!_overlayElt) return;

        const isActive = _pendingCount > 0;

        _overlayElt.hidden = !isActive;
        _overlayElt.setAttribute(XalConstants.ariaNames.hidden, String(!isActive));
    };

    return {
        /**
         * Affiche l'overlay et bloque les interactions utilisateur.
         *
         * Incrémente le compteur interne — l'overlay reste visible
         * tant que hide() n'a pas été appelé autant de fois que show().
         * Peut être appelé plusieurs fois en parallèle sans effet de bord.
         *
         * @param {string} [message=''] - Message optionnel affiché sous le spinner.
         */
        show(message = '') {
            _pendingCount++;

            if (_messageElt) {
                _messageElt.textContent = message;
            }

            _update();
        },

        /**
         * Masque l'overlay et restaure les interactions utilisateur.
         *
         * Décrémente le compteur interne et masque l'overlay uniquement
         * si plus aucun appel n'est en cours.
         * Ne descend jamais en dessous de 0.
         */
        hide() {
            _pendingCount = Math.max(0, _pendingCount - 1);
            _update();
        },

        /**
         * Réinitialise le compteur et masque immédiatement l'overlay.
         *
         * Utile en cas d'erreur globale ou de navigation pour garantir
         * un état propre sans attendre la fin de tous les appels en cours.
         */
        reset() {
            _pendingCount = 0;
            _update();
        },

        /**
         * Indique si l'overlay est actuellement visible.
         *
         * @returns {boolean} true si l'overlay est actif, false sinon.
         */
        isActive() {
            return _pendingCount > 0;
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
         * Initialise le composant.
         *
         * Résout les références DOM depuis le HTML statique.
         * Doit être appelé une seule fois depuis xalise.js au DOMContentLoaded,
         * avant tout appel à show() ou hide().
         */
        init() {
            _overlayElt = document.getElementById(XalConstants.elementIds.loaderOverlay);
            _messageElt = _overlayElt?.querySelector(XalConstants.cssQueries.loaderOverlayMessage);
        },
    };
})();