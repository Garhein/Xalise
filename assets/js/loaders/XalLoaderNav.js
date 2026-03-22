/**
 * Gestion de la barre de progression globale.
 *
 * Fournit un retour visuel lors des appels API en affichant
 * une barre de progression indéterminée.
 *
 * Supporte les appels concurrents via un compteur interne :
 * la barre reste visible tant qu'au moins un appel est en cours.
 *
 * Dépendances :
 * - XalConstants.js → XalConstants
 *
 * @namespace XalLoaderNav
 * @author Xavier VILLEMIN
 */
const XalLoaderNav = (() => {
    /**
     * Nombre d'appels API actuellement en cours.
     * La barre est masquée uniquement quand ce compteur atteint 0.
     *
     * @type {number}
     */
    let _pendingCount = 0;

    /**
     * Référence vers l'élément DOM de la barre de progression.
     * Initialisée dans init().
     *
     * @type {HTMLElement|null}
     */
    let _barElt = null;

    /**
     * Met à jour la visibilité de la barre selon le compteur courant.
     *
     * - _pendingCount > 0 : barre visible
     * - _pendingCount = 0 : barre masquée
     */
    const _update = () => {
        if (!_barElt) return;

        const isActive = _pendingCount > 0;

        _barElt.setAttribute(XalConstants.ariaNames.hidden, String(!isActive));
    };

    return {
        /**
         * Signale le début d'un appel API.
         *
         * Incrémente le compteur et affiche la barre si elle était masquée.
         * Peut être appelé plusieurs fois en parallèle.
         */
        start() {
            _pendingCount++;
            _update();
        },

        /**
         * Signale la fin d'un appel API.
         *
         * Décrémente le compteur et masque la barre si plus aucun appel
         * n'est en cours. Ne descend jamais en dessous de 0.
         */
        stop() {
            _pendingCount = Math.max(0, _pendingCount - 1);
            _update();
        },

        /**
         * Réinitialise le compteur et masque immédiatement la barre.
         *
         * Utile en cas d'erreur globale ou de navigation pour garantir
         * un état propre sans attendre la fin de tous les appels.
         */
        reset() {
            _pendingCount = 0;
            _update();
        },

        /**
         * Initialise le composant.
         *
         * Résout la référence DOM et garantit l'état initial masqué.
         */
        init() {
            _barElt = document.getElementById(XalConstants.elementIds.loaderNavbar);
        },
    };
})();