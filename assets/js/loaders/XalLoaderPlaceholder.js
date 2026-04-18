/**
 * API de gestion des placeholders de chargement.
 *
 * Affiche des blocs visuels temporaires dans une zone cible pendant
 * le chargement de données asynchrones.
 *
 * Le contenu réel est injecté dynamiquement après chargement.
 *
 * Le composant repose sur un template HTML existant et permet
 * plusieurs instances simultanées sur différentes zones.
 *
 * N’altère pas le contenu existant : le placeholder est simplement
 * inséré en tête de la zone cible.
 *
 * @requires XalConstants
 *
 * @namespace XalLoaderPlaceholder
 */
const XalLoaderPlaceholder = (() => {
    /**
     * Template HTML du placeholder.
     *
     * Résolu lors de l’appel à `init()`.
     *
     * @private
     * 
     * @type {HTMLTemplateElement|null}
     */
    let _templateElement = null;

    /**
     * Résout une cible en élément DOM.
     *
     * Accepte un sélecteur CSS ou un élément HTML directement.
     *
     * @private
     *
     * @param {string|HTMLElement} target Sélecteur CSS ou élément DOM.
     *
     * @returns {HTMLElement|null} Élément résolu ou `null` si introuvable.
     */
    const _resolveTarget = (target) => {
        if (target instanceof HTMLElement) return target;

        if (typeof target === 'string') {
            const el = document.querySelector(target);
            return el instanceof HTMLElement ? el : null;
        }

        return null;
    };

    /**
     * Indique si un placeholder est présent dans un élément cible.
     *
     * @private
     *
     * @param {HTMLElement} el Élément DOM cible.
     *
     * @returns {boolean} `true` si un placeholder est présent, sinon `false`.
     */
    const _isActive = (el) => {
        return el.querySelector(XalConstants.cssQueries.loader.placeholder) !== null;
    };

    /**
     * Clone le template et l’insère en tête de la zone cible.
     *
     * @private
     *
     * @param {HTMLElement} el Élément cible.
     *
     * @returns {void}
     */
    const _cloneAndInsert = (el) => {
        if (!_templateElement) return;

        const fragment = document.importNode(_templateElement.content, true);
        el.prepend(fragment);
    };

    return {
        /**
         * Initialise le composant en résolvant le template HTML.
         *
         * L’idempotence est assurée : les appels multiples n’ont aucun effet
         * après la première initialisation réussie.
         *
         * @public
         *
         * @returns {void}
         *
         * @throws {Error} Si le template est introuvable.
         */
        init() {
            if (_templateElement) return;

            _templateElement = document.getElementById(XalConstants.elementIds.loader.placeholderTemplate);

            if (!_templateElement) {
                throw new Error(`[XalLoaderPlaceholder] Template "${XalConstants.elementIds.loader.placeholderTemplate}" introuvable.`);
            }
        },
        
        /**
         * Affiche un placeholder dans la zone cible.
         *
         * Insère le placeholder en tête de la zone sans supprimer le contenu existant,
         * sauf si l’option `clear` est activée.
         *
         * Aucun effet si :
         * - la cible est introuvable
         * - le composant n’est pas initialisé
         * - un placeholder est déjà présent (idempotence)
         *
         * @public
         *
         * @param {string|HTMLElement} target                 Sélecteur CSS ou élément cible.
         * @param {Object}             [options={}]           Options d’affichage.
         * @param {boolean}            [options.clear=false]  Si `true`, supprime tout le contenu
         *                                                    de la zone avant insertion du placeholder.
         *
         * @returns {void}
         */
        show(target, { clear = false } = {}) {
            if (!_templateElement) {
                console.warn('[XalLoaderPlaceholder] La méthode d\'initialisation doit être appelée avant utilisation.');
                return;
            }

            const el = _resolveTarget(target);
            if (!el) return;

            if (clear) {
                el.replaceChildren();
            }

            if (_isActive(el)) return;

            _cloneAndInsert(el);

            el.classList.add(XalConstants.cssClasses.loaderPlaceholderActive);
        },

        /**
         * Supprime le placeholder de la zone cible.
         *
         * Aucun effet si la cible est introuvable ou si aucun placeholder
         * n’est présent.
         *
         * @public
         *
         * @param {string|HTMLElement} target Sélecteur CSS ou élément cible.
         *
         * @returns {void}
         */
        hide(target) {
            if (!_templateElement) return;

            const el = _resolveTarget(target);

            if (!el) return;

            const placeholder = el.querySelector(XalConstants.cssQueries.loader.placeholder);

            if (!placeholder) return;

            placeholder.remove();
            el.classList.remove(XalConstants.cssClasses.loaderPlaceholderActive);
        },

        /**
         * Indique si un placeholder est actif sur la zone cible.
         *
         * @public
         *
         * @param {string|HTMLElement} target Sélecteur CSS ou élément cible.
         *
         * @returns {boolean} `true` si un placeholder est présent, sinon `false`.
         */
        isActive(target) {
            if (!_templateElement) return false;

            const el = _resolveTarget(target);
            return !!el && _isActive(el);
        },

        /**
         * Réinitialise complètement la zone cible.
         *
         * Supprime tous les placeholders présents (même multiples) et
         * nettoie l’état visuel associé (classe CSS).
         *
         * Contrairement à `hide()`, cette méthode garantit un état propre
         * même en cas d’incohérence du DOM (duplication ou insertion manuelle).
         *
         * Aucun effet si la cible est introuvable.
         *
         * @public
         *
         * @param {string|HTMLElement} target Sélecteur CSS ou élément cible.
         *
         * @returns {void}
         */
        reset(target) {
            const el = _resolveTarget(target);
            if (!el) return;

            el.querySelectorAll(XalConstants.cssQueries.loader.placeholder)
              .forEach(p => p.remove());

            el.classList.remove(XalConstants.cssClasses.loaderPlaceholderActive);
        },
    };
})();