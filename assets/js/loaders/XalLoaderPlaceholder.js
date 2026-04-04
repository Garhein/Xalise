/**
 * API de gestion des zones de contenu temporaire.
 *
 * Affiche des blocs animés dans une zone vide pendant le chargement
 * des données réelles. Le contenu réel est injecté par le JS après
 * réception des données.
 * 
 * Le composant repose sur un template HTML existant (non dynamique).
 *
 * @namespace XalLoaderPlaceholder
 */
const XalLoaderPlaceholder = (() => {
    /**
     * Référence vers le template HTML du placeholder.
     *
     * @type {HTMLTemplateElement|null}
     * @private
     */
    let _templateElement = null;

    /**
     * Résout un sélecteur CSS ou un élément DOM en élément HTML.
     *
     * @param {string|HTMLElement} target - Sélecteur CSS ou élément DOM.
     * @returns {HTMLElement|null} Élément résolu, ou null si introuvable.
     * @private
     */
    const _resolveTarget = (target) => {
        if (target instanceof HTMLElement) return target;
        if (typeof target === 'string')    return document.querySelector(target);
        return null;
    };

    /**
     * Indique si un placeholder est actuellement présent dans un élément.
     *
     * Opère directement sur l'élément DOM résolu pour éviter
     * un second appel à _resolveTarget() dans les méthodes publiques.
     *
     * @param {HTMLElement} el - Élément DOM cible déjà résolu.
     * @returns {boolean} `true` si le placeholder est présent, `false` sinon.
     * @private
     */
    const _isActive = (el) => {
        return !!el.querySelector(XalConstants.cssQueries.loader.placeholder);
    };

    /**
     * Clone le template et l'insère en premier enfant de la zone cible.
     *
     * Chaque appel produit un clone indépendant du template, ce qui permet
     * plusieurs placeholders simultanés sur des zones différentes.
     *
     * @param {HTMLElement} el - Zone cible dans laquelle insérer le placeholder.
     * @private
     */
    const _cloneAndInsert = (el) => {
        const fragment = document.importNode(_templateElement.content, true);
        el.prepend(fragment);
    };

    return {
        /**
         * Initialise le composant en résolvant les éléments DOM.
         */
        init() {
            // Assure l'idempotence : évite une double initialisation
            if (_templateElement) return;

            _templateElement = XalUIService.getElementById(XalConstants.elementIds.loader.placeholderTemplate);
        },
        
        /**
         * Affiche le placeholder dans une zone de contenu.
         *
         * Sans effet si :
         * - la cible est introuvable dans le DOM
         * - init() n'a pas été appelé ou le template est introuvable
         * - un placeholder est déjà actif sur cette zone
         *
         * @param {string|HTMLElement} target - Sélecteur CSS ou élément DOM cible.
         */
        show(target) {
            const el = _resolveTarget(target);

            if (!el || !_templateElement) return;
            if (_isActive(el)) return;

            _cloneAndInsert(el);
        },

        /**
         * Retire le placeholder de la zone cible.
         *
         * @param {string|HTMLElement} target - Sélecteur CSS ou élément DOM cible.
         */
        hide(target) {
            const el = _resolveTarget(target);

            if (!el) return;

            el.querySelector(XalConstants.cssQueries.loader.placeholder)?.remove();
        },

        /**
         * Indique si un placeholder est actuellement actif sur une zone.
         *
         * Retourne `true` dès lors que show() a été appelé sur cette zone
         * et que hide() n'a pas encore été appelé.
         *
         * @param {string|HTMLElement} target - Sélecteur CSS ou élément DOM cible.
         * @returns {boolean} `true` si le placeholder est présent, `false` sinon.
         */
        isActive(target) {
            const el = _resolveTarget(target);
            return el ? _isActive(el) : false;
        },
    };
})();