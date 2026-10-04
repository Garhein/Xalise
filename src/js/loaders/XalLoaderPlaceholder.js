import { XalConstants } from '../core/XalConstants.js';

/**
 * Blocs visuels temporaires affichés dans une zone cible pendant le chargement de données asynchrones.
 * Le contenu réel est injecté dynamiquement après chargement.
 *
 * Le composant repose sur un template HTML existant et permet plusieurs instances simultanées sur différentes zones.
 *
 * @requires XalConstants
 * @namespace XalLoaderPlaceholder
 */
export const XalLoaderPlaceholder = (() => {
    /**
     * Élément DOM du template HTML, résolu par `init()`.
     *
     * @type {HTMLTemplateElement|null}
     */
    let _templateElement = null;

    /**
     * Résout une cible en élément DOM, à partir d’un sélecteur CSS ou d’un élément HTML.
     *
     * @param {string|HTMLElement} target Sélecteur CSS ou élément DOM.
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
     * @param {HTMLElement} el Élément DOM cible.
     * @returns {boolean} `true` si un placeholder est présent, sinon `false`.
     */
    const _isInserted = (el) => {
        return el.querySelector(XalConstants.cssQueries.loader.placeholder) !== null;
    };

    /**
     * Modes d’insertion supportés.
     *
     * Définit les stratégies d’injection dans la zone cible :
     * - `PREPEND`  → insère le placeholder au début sans modifier le contenu existant
     * - `REPLACE`  → remplace entièrement le contenu de la zone cible
     * - `APPEND`   → ajoute le placeholder à la fin de la zone cible
     *
     * Utilisé pour valider et normaliser l’option `mode` passée à `show()`.
     *
     * @type {Readonly<{ PREPEND: 'prepend', REPLACE: 'replace', APPEND: 'append' }>}
     */
    const INSERTION_MODES = Object.freeze({
        PREPEND:    'prepend',
        REPLACE:    'replace',
        APPEND:     'append',
    });

    /**
     * Ensemble des modes d’insertion valides.
     *
     * Permet de vérifier rapidement si la valeur fournie pour l’option `mode` est supportée par le module.
     * Construit à partir de `INSERTION_MODES` afin de garantir la cohérence entre la définition des modes et leur validation.
     *
     * @private
     *
     * @type {Readonly<Set<'prepend'|'replace'|'append'>>}
     */
    const VALID_MODES = new Set(Object.values(INSERTION_MODES));

    /**
     * Clone le template et l’insère dans la zone cible.
     *
     * @param {HTMLElement} el Élément cible.
     * @param {string} mode Mode d’insertion.
     */
    const _insertPlaceholder = (el, mode) => {
        const fragment = document.importNode(_templateElement.content, true);

        if (mode === INSERTION_MODES.REPLACE) {
            el.replaceChildren(fragment);
        } else if (mode === INSERTION_MODES.APPEND) {
            el.appendChild(fragment);
        } else {
            el.prepend(fragment);
        }
    };

    /**
     * Vérifie si le template HTML a été initialisé avant toute utilisation.
     * 
     * @throws {Error} Si `init()` n’a pas été appelé ou si le template HTML n'est pas présent dans le DOM.
     */
    const _throwIfNotInitialized = () => {
        if (!_templateElement) {
            throw new Error('[XalLoaderPlaceholder] Veuillez exécuter `init()` avant `show()`.');
        }
    };

    return Object.freeze({
        INSERTION_MODES,

        /**
         * Initialise le module en résolvant le template HTML.
         * Les appels suivants sont sans effet.
         *
         * @throws {Error} Si le template est introuvable dans le DOM.
         */
        init() {
            if (_templateElement) return;

            const templateId    = XalConstants.elementIds.loader.placeholderTemplate;
            const templateElt   = document.getElementById(templateId);

            if (!templateElt) {
                throw new Error(`[XalLoaderPlaceholder] Template "${templateId}" introuvable dans le DOM.`);
            }

            _templateElement = templateElt;
        },
        
        /**
         * Affiche un placeholder dans la zone cible.
         *
         * Aucun effet si :
         * - la cible est introuvable
         * - un placeholder est déjà présent (idempotence), uniquement si le mode est `prepend` ou `append`.
         *
         * @public
         *
         * @param {string|HTMLElement}  target                              Sélecteur CSS ou élément cible.
         * @param {Object}              [options={}]                        Options d’affichage.
         * @param {'prepend'|'replace'|'append'} [options.mode='prepend']   Mode d’insertion du placeholder :
         *                                                                  - `prepend` (par défaut) : insère le placeholder au début sans modifier le contenu existant.
         *                                                                  - `replace` : remplace tout le contenu de la zone par le placeholder.
         *                                                                  - `append` : ajoute le placeholder à la fin de la zone cible.
         */
        show(target, { mode = INSERTION_MODES.PREPEND } = {}) {
            _throwIfNotInitialized();
            
            const el = _resolveTarget(target);
            
            if (!el) {
                console.warn('[XalLoaderPlaceholder] Cible introuvable : ', target);
                return;
            }

            if (typeof mode === 'string') {
                mode = mode.toLowerCase();
            }

            if (!VALID_MODES.has(mode)) {
                console.warn(`[XalLoaderPlaceholder] Mode d\'insertion "${mode}" non valide, fallback sur "prepend".`);
                mode = INSERTION_MODES.PREPEND;
            }

            if (mode !== INSERTION_MODES.REPLACE && _isInserted(el)) return;

            _insertPlaceholder(el, mode);

            el.classList.add(XalConstants.cssClasses.loaderPlaceholderActive);
        },

        /**
         * Supprime tous les placeholders présents dans la cible (même multiples) et
         * nettoie l’état visuel associé (classe CSS).
         *
         * Aucun effet si la cible est introuvable ou si aucun placeholder n’est présent.
         * @param {string|HTMLElement} target Sélecteur CSS ou élément cible.
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
    });
})();