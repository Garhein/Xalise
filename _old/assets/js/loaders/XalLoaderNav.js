/**
 * API de gestion de la barre de progression globale.
 *
 * Affiche une barre de progression indéterminée lors de l’exécution
 * de traitements asynchrones.
 *
 * Supporte les appels concurrents via un compteur interne :
 * la barre reste visible tant qu’au moins un traitement est actif.
 *
 * @requires XalConstants
 *
 * @namespace XalLoaderNav
 */
const XalLoaderNav = (() => {
    /**
     * Nombre de traitements asynchrones en cours.
     *
     * Détermine la visibilité de la barre de progression.
     *
     * @private
     * 
     * @type {number}
     */
    let _pendingCount = 0;

    /**
     * Élément DOM de la barre de progression.
     *
     * Résolu lors de l’appel à `init()`.
     *
     * @private
     * 
     * @type {HTMLElement|null}
     */
    let _barElement = null;

    /**
     * Indique si au moins un traitement est en cours.
     * 
     * Basé sur le compteur interne `_pendingCount`.
     * 
     * @private
     *
     * @returns {boolean} `true` si au moins un traitement est actif, `false` sinon.
     */
    const _isActive = () => {
        return _pendingCount > 0;
    };

    /**
     * Met à jour la visibilité de la barre de progression.
     *
     * Affiche ou masque la barre de progression en fonction de l’état courant
     * (déterminé par `_isActive()`), et synchronise les attributs
     * d’accessibilité associés.
     * 
     * Synchronise également l’attribut ARIA `aria-hidden`.
     *
     * Aucun effet si l’élément DOM n’est pas initialisé.
     *
     * @private
     *
     * @returns {void}
     */
    const _update = () => {
        if (!_barElement) {
            console.warn('[XalLoaderNav] La méthode d\'initialisation doit être appelée avant utilisation.');
            return;
        }

        const isActive = _isActive();

        _barElement.hidden = !isActive;
        _barElement.setAttribute(XalConstants.ariaNames.hidden, String(!isActive));
    };

    return {
        /**
         * Initialise le composant en résolvant l’élément DOM cible.
         *
         * L’idempotence est assurée : les appels multiples n’ont aucun effet
         * après la première initialisation réussie.
         * 
         * @public
         * 
         * @throws {Error} Si l’élément DOM requis est introuvable.
         * 
         * @returns {void}
         */
        init() {
            if (_barElement) return;

            _barElement = document.getElementById(XalConstants.elementIds.loader.navbar);

            if (!_barElement) {
                throw new Error(`[XalLoaderNav] Élément "${XalConstants.elementIds.loader.navbar}" non trouvé dans le DOM.`);
            }
        },
        
        /**
         * Signale le début d’un traitement.
         *
         * Incrémente le compteur interne des opérations en cours.
         * La mise à jour de la barre de progression est déclenchée 
         * uniquement lors du passage de l’état inactif à actif afin
         * d’éviter des mises à jour inutiles.
         *
         * Peut être appelé plusieurs fois en parallèle.
         *
         * @public
         *
         * @returns {void}
         */
        start() {
            const wasActive = _isActive();

            _pendingCount++;

            if (!wasActive) _update();
        },

        /**
         * Signale la fin d’un traitement.
         *
         * Décrémente le compteur interne sans jamais descendre en dessous de 0,
         * puis met à jour l’état de la barre de progression.
         * 
         * La mise à jour de la barre de progression est déclenchée 
         * uniquement lors du passage de l’état actif à inactif afin
         * d’éviter des mises à jour inutiles.
         *
         * Émet un avertissement si appelé sans `start()` correspondant.
         *
         * @public
         *
         * @returns {void}
         */
        stop() {
            if (_pendingCount === 0) {
                console.warn('[XalLoaderNav] stop() appelé sans start() correspondant.');
            }

            const wasActive = _isActive();

            _pendingCount = Math.max(0, _pendingCount - 1);

            if (wasActive) _update();
        },

        /**
         * Réinitialise l’état du loader.
         *
         * Remet le compteur interne à 0 et force la mise à jour
         * de la barre de progression, garantissant son masquage immédiat.
         *
         * Utile en cas d’erreur globale, d’annulation ou de navigation
         * pour rétablir un état cohérent sans attendre la fin des traitements.
         *
         * @public
         *
         * @returns {void}
         */
        reset() {
            _pendingCount = 0;
            _update();
        },
    };
})();