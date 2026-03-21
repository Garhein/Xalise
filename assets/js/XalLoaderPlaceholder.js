/**
 * Gestion des zones de contenu temporaire pendant le chargement.
 *
 * Clone un template HTML défini dans index.html et l'insère dans
 * la zone cible afin de donner à l'utilisateur une représentation
 * visuelle de la structure attendue avant l'arrivée des données réelles.
 *
 * La zone cible doit être vide au chargement — le contenu réel
 * est injecté par le JS après réception des données.
 *
 * Template HTML requis dans index.html :
 * <template id="xal-id-placeholder-template">
 *     <div class="xal-loader-placeholder" aria-hidden="true">
 *         ...blocs animés...
 *     </div>
 * </template>
 *
 * Utilisation typique :
 * - Chargement initial d'un tableau de données
 * - Premier affichage d'une liste
 *
 * Dépendances :
 * - XalConstants.js → XalConstants
 *
 * @namespace XalLoaderPlaceholder
 * @author Xavier VILLEMIN
 */
const XalLoaderPlaceholder = (() => {
    /**
     * Référence vers le template HTML du placeholder.
     *
     * Résolu une seule fois dans init() depuis le HTML statique.
     * Chaque appel à show() produit un clone indépendant de ce template,
     * ce qui permet d'afficher plusieurs placeholders simultanément.
     *
     * @type {HTMLTemplateElement|null}
     */
    let _templateElt = null;

    /**
     * Résout un sélecteur CSS ou un élément DOM.
     *
     * @param {string|HTMLElement} target - Sélecteur CSS ou élément DOM.
     * @returns {HTMLElement|null} Élément résolu, ou null si introuvable.
     */
    const _resolveTarget = (target) => {
        if (target instanceof HTMLElement) return target;
        if (typeof target === 'string')    return document.querySelector(target);
        return null;
    };

    /**
     * Clone le template et l'insère en premier enfant de la zone cible.
     *
     * Utilise document.importNode() pour obtenir une copie indépendante
     * du contenu du template, prête à être insérée dans le DOM actif.
     *
     * @param {HTMLElement} el - Zone cible dans laquelle insérer le placeholder.
     * @returns {HTMLElement|null} L'élément placeholder inséré, ou null si introuvable après insertion.
     */
    const _insertPlaceholder = (el) => {
        const clone = document.importNode(_templateElt.content, true);
        el.prepend(clone);
        return el.querySelector(XalConstants.cssQueries.loaderPlaceholder);
    };

    return {
        /**
         * Affiche le placeholder dans une zone de contenu.
         *
         * Clone le template et l'insère en tête de la zone cible.
         * Sans effet si le placeholder est déjà actif sur cette zone,
         * si le template n'a pas été résolu, ou si la cible est introuvable.
         *
         * @param {string|HTMLElement} target - Sélecteur CSS ou élément DOM cible.
         */
        show(target) {
            const el = _resolveTarget(target);

            if (!el || !_templateElt) return;
            if (this.isActive(target)) return;

            _insertPlaceholder(el);
        },

        /**
         * Masque et retire le placeholder de la zone cible.
         *
         * Supprime le clone inséré par show().
         * Sans effet si aucun placeholder n'est actif sur cette zone.
         *
         * @param {string|HTMLElement} target - Sélecteur CSS ou élément DOM cible.
         */
        hide(target) {
            const el = _resolveTarget(target);

            if (!el) return;

            el.querySelector(XalConstants.cssQueries.placeholderLoader)?.remove();
        },

        /**
         * Indique si un placeholder est actuellement actif sur une zone.
         *
         * @param {string|HTMLElement} target - Sélecteur CSS ou élément DOM cible.
         * @returns {boolean} true si le placeholder est présent, false sinon.
         */
        isActive(target) {
            const el = _resolveTarget(target);
            return !!el?.querySelector(XalConstants.cssQueries.placeholderLoader);
        },

        /**
         * Initialise le composant.
         *
         * Résout la référence au template HTML depuis le DOM statique.
         * Doit être appelé une seule fois depuis xalise.js au DOMContentLoaded,
         * avant tout appel à show().
         */
        init() {
            _templateElt = document.getElementById(XalConstants.elementIds.placeholderLoaderTemplate);
        },
    };
})();