/**
 * API de gestion de la barre de progression indéterminée.
 *
 * Affiche une barre de progression indéterminée à l'exécution 
 * de traitements.
 *
 * Supporte les appels concurrents via un compteur interne.
 * La barre reste visible tant qu'au moins un appel est en cours.
 * 
 * Le composant repose sur un élément DOM existant (non dynamique).
 *
 * @namespace XalLoaderNav
 */
const XalLoaderNav = (() => {
    /**
     * Nombre de traitements en cours.
     *
     * @type {number}
     * @private
     */
    let _pendingCount = 0;

    /**
     * Élément DOM de la barre de progression.
     *
     * @type {HTMLElement|null}
     * @private
     */
    let _barElement = null;

    /**
     * Indique si au moins un traitement est en cours.
     *
     * @returns {boolean} `true` si la barre de progression est active, `false` sinon.
     * @private
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
        if (!_barElement) {
            console.warn('[XalLoaderNav] la méthode d\'initialisation doit être appelé avant utilisation.');
            return;
        }

        const isActive = _isActive();
        XalUIService.setVisible(_barElement, isActive);
    };

    return {
        /**
         * Initialise le composant en résolvant l'élément DOM.
         */
        init() {
            // Assure l'idempotence : évite une double initialisation
            if (_barElement) return;

            _barElement = XalUIService.getElementById(XalConstants.elementIds.loader.navbar);
        },
        
        /**
         * Signale le début d'un traitement.
         *
         * Incrémente le compteur et affiche la barre si nécessaire.
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
         * Réinitialise le compteur et masque immédiatement la barre de progression.
         */
        reset() {
            _pendingCount = 0;
            _update();
        },
    };
})();