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
     * Modes d’insertion supportés pour le placeholder.
     *
     * Définit les stratégies d’injection du placeholder dans la zone cible :
     * - `PREPREND` → insère le placeholder en tête sans modifier le contenu existant
     * - `REPLACE`  → remplace entièrement le contenu de la zone cible
     *
     * Utilisé pour valider et normaliser l’option `mode` passée à `show()`.
     *
     * @private
     *
     * @type {Readonly<{ PREPEND: 'prepend', REPLACE: 'replace' }>}
     */
    const INSERTION_MODES = Object.freeze({
        PREPEND:    'prepend',
        REPLACE:    'replace',
    });

    /**
     * Ensemble des modes d’insertion valides.
     *
     * Permet de vérifier rapidement si la valeur fournie pour l’option `mode`
     * est supportée par le composant, avec une complexité constante (`O(1)`).
     *
     * Construit à partir de `INSERTION_MODES` afin de garantir la cohérence
     * entre la définition des modes et leur validation.
     *
     * @private
     *
     * @type {Readonly<Set<'prepend'|'replace'>>}
     */
    const VALID_MODES = new Set(Object.values(INSERTION_MODES));

    /**
     * Clone le template et l’insère en tête de la zone cible.
     *
     * @private
     *
     * @param {HTMLElement} el Élément cible.
     *
     * @returns {void}
     */
    const _insertPlaceholder = (el, mode) => {
        const fragment = document.importNode(_templateElement.content, true);

        if (mode === INSERTION_MODES.REPLACE) {
            el.replaceChildren(fragment);
        } else {
            el.prepend(fragment);
        }
    };

    return {
        INSERTION_MODES,
        VALID_MODES,

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
         * Aucun effet si :
         * - la cible est introuvable
         * - le composant n’est pas initialisé
         * - un placeholder est déjà présent (idempotence)
         *
         * @public
         *
         * @param {string|HTMLElement}  target                    Sélecteur CSS ou élément cible.
         * @param {Object}              [options={}]              Options d’affichage.
         * @param {'prepend'|'replace'} [options.mode='prepend']  Mode d’insertion du placeholder :
         *                                                        - `prepend` (par défaut) : insère le placeholder en tête de la zone sans supprimer le contenu existant.
         *                                                        - `replace` : remplace tout le contenu de la zone par le placeholder.
         *
         * @returns {void}
         */
        show(target, { mode = INSERTION_MODES.PREPEND } = {}) {
            if (!_templateElement) {
                console.warn('[XalLoaderPlaceholder] La méthode d\'initialisation doit être appelée avant utilisation.');
                return;
            }

            const el = _resolveTarget(target);
            
            if (!el) {
                console.warn('[XalLoaderPlaceholder] Cible introuvable : ', target);
                return;
            }

            if (!VALID_MODES.has(mode)) {
                console.warn(`[XalLoaderPlaceholder] Mode d\'insertion "${mode}" non valide, fallback sur "prepend".`);
                mode = INSERTION_MODES.PREPEND;
            }

            // Idempotence uniquement en prepend
            if (mode === INSERTION_MODES.PREPEND && _isActive(el)) return;

            _insertPlaceholder(el, mode);

            el.classList.add(XalConstants.cssClasses.loaderPlaceholderActive);
        },

        /**
         * Supprime le placeholder de la zone cible.
         * 
         * Supprime tous les placeholders présents (même multiples) et
         * nettoie l’état visuel associé (classe CSS).
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
            const el = _resolveTarget(target);

            if (!el) {
                console.warn('[XalLoaderPlaceholder] Cible introuvable : ', target);
                return;
            }

            el.querySelectorAll(XalConstants.cssQueries.loader.placeholder)
              .forEach(p => p.remove());

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
            const el = _resolveTarget(target);
            return !!el && _isActive(el);
        },

        /**
         * Réinitialise complètement la zone cible.
         *
         * @public
         *
         * @param {string|HTMLElement} target Sélecteur CSS ou élément cible.
         *
         * @returns {void}
         */
        reset(target) {
            this.hide(target);
        },
    };
})();