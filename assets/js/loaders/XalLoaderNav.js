/**
 * API de gestion de la barre de progression globale.
 *
 * Permet d'afficher une barre de progression indéterminée à 
 * l'exécution de traitements.
 *
 * Supporte les appels concurrents via un compteur interne :
 * la barre reste visible tant qu'au moins un appel est en cours.
 *
 * Dépendances :
 * - XalConstants.js → XalConstants
 *
 * @namespace XalLoaderNav
 */
const XalLoaderNav = (() => {
    /**
     * Nombre de traitements en cours.
     * 
     * La barre est masquée uniquement quand ce compteur atteint 0.
     *
     * @type {number}
     * @private
     */
    let _pendingCount = 0;

    /**
     * Référence vers l'élément DOM de la barre de progression.
     * 
     * Initialisée dans init().
     *
     * @type {HTMLElement|null}
     * @private
     */
    let _barElt = null;

    /**
     * Indique si au moins un traitement est en cours.
     *
     * @returns {boolean} `true` si la barre de progression est active,
     * `false` sinon.
     */
    const _isActive = () => {
        return _pendingCount > 0;
    };

    /**
     * Met à jour la visibilité de la barre en fonction du nombre
     * de traitements en cours.
     *
     * @private
     */
    const _update = () => {
        if (!_barElt) {
            console.warn('[XalLoaderNav] init() doit être appelé avant utilisation.');
            return;
        }

        const isActive = _isActive();

        _barElt.hidden = !isActive;
        _barElt.setAttribute(XalConstants.ariaNames.hidden, !isActive);
    };

    return {
        /**
         * Signale le début d'un traitement.
         *
         * Incrémente le compteur et affiche la barre si nécessaire.
         * Supporte les appels concurrents.
         */
        start() {
            const wasActive = _isActive();
            _pendingCount++;
            if (!wasActive) _update();
        },

        /**
         * Signale la fin d'un traitement.
         *
         * Décrémente le compteur (sans passer sous 0) et masque la barre
         * si aucun traitement n'est en cours.
         */
        stop() {
            _pendingCount = Math.max(0, _pendingCount - 1);
            _update();
        },

        /**
         * Réinitialise le compteur et masque immédiatement la barre.
         *
         * Utile en cas d'erreur globale ou de navigation.
         */
        reset() {
            _pendingCount = 0;
            _update();
        },

        /**
         * Initialise le composant en résolvant l'élément DOM.
         *
         * Doit être appelé avant toute utilisation.
         */
        init() {
            // Assure l'idempotence : évite une double initialisation
            if (_barElt) return;

            _barElt = document.getElementById(XalConstants.elementIds.loaderNavbar);
        
            if (!_barElt) {
                console.warn('[XalLoaderNav] Élément introuvable dans le DOM.');
                return;
            }
        },
    };
})();