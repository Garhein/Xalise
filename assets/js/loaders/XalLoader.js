/**
 * Orchestrateur des indicateurs de chargement.
 *
 * Centralise le pilotage des différents loaders de l’application :
 * - barre de navigation (nav)
 * - placeholder
 * - toast de chargement
 * - overlay
 *
 * Permet d’activer ou désactiver plusieurs indicateurs simultanément
 * via une configuration unique, garantissant cohérence et symétrie.
 *
 * @requires XalLoaderNav
 * @requires XalLoaderPlaceholder
 * @requires XalLoaderToast
 * @requires XalLoaderOverlay
 *
 * @namespace XalLoader
 */
const XalLoader = (() => {
    /**
     * @typedef {Object} LoaderConfig                                   Configuration normalisée des loaders.
     * @property {boolean}                          [nav=false]         Active la barre de progression de navigation.
     * @property {boolean|string}                   [overlay=false]     Active l’overlay :
     *                                                                  `true` → overlay sans message
     *                                                                  `string` → overlay avec message
     * @property {string|null}                      [toast=null]        Message du toast de chargement.
     * @property {string|PlaceholderConfig|null}    [placeholder=null]  Configuration du placeholder :
     *                                                                  `string` → sélecteur CSS
     *                                                                  `Object` → configuration avancée
     */

    /**
     * @typedef {Object} PlaceholderConfig                  Configuration du placeholder.
     * @property {string|HTMLElement}   target              Élément cible ou sélecteur CSS.
     * @property {'prepend'|'replace'}  [mode='prepend']    Mode d’insertion :
     *                                                      `prepend` (par défaut) : insère le placeholder en tête de la zone sans supprimer le contenu existant.
     *                                                      `replace` : remplace tout le contenu de la zone par le placeholder.
     */

    /**
     * Normalise la configuration utilisateur.
     *
     * Garantit la présence des propriétés attendues et applique
     * les valeurs par défaut.
     *
     * @private
     *
     * @param {LoaderConfig} [config={}] Configuration brute.
     *
     * @returns {Required<LoaderConfig>} Configuration normalisée.
     */
    const _normalize = (config = {}) => {
        return {
            nav: Boolean(config.nav),
            overlay: config.overlay ?? false,
            toast: config.toast ?? null,
            placeholder: config.placeholder ?? null,
        };
    };

    /**
     * Normalise la configuration du placeholder.
     *
     * @private
     *
     * @param {string|PlaceholderConfig|null} placeholder
     *
     * @returns {PlaceholderConfig|null}
     */
    const _normalizePlaceholder = (placeholder) => {
        if (!placeholder) return null;

        if (typeof placeholder === 'string') {
            return { target: placeholder, mode: XalLoaderPlaceholder.INSERTION_MODES.PREPEND };
        }

        const mode = XalLoaderPlaceholder.VALID_MODES.has(placeholder.mode)
            ? placeholder.mode
            : XalLoaderPlaceholder.INSERTION_MODES.PREPEND;

        return {
            target: placeholder.target,
            mode,
        };
    };

    return {
        /**
         * Active les indicateurs de chargement.
         *
         * Lance chaque loader selon la configuration fournie.
         *
         * @public
         *
         * @param {LoaderConfig} [config={}] Configuration des loaders.
         *
         * @returns {void}
         */
        run(config = {}) {
            const cfg = _normalize(config);

            // Navigation (désactivée si overlay actif)
            if (cfg.nav && !cfg.overlay) {
                XalLoaderNav.start();
            }

            // Placeholder
            const placeholder = _normalizePlaceholder(cfg.placeholder);

            if (placeholder) {
                XalLoaderPlaceholder.show(placeholder.target, {
                    mode: placeholder.mode,
                });
            }

            // Toast
            if (cfg.toast) {
                XalLoaderToast.show(cfg.toast);
            }

            // Overlay
            if (cfg.overlay) {
                XalLoaderOverlay.show(
                    typeof cfg.overlay === 'string' ? cfg.overlay : ''
                );
            }
        },

        /**
         * Désactive les indicateurs de chargement.
         *
         * Chaque loader est arrêté selon la configuration fournie.
         *
         * La configuration doit être identique à celle passée à `run()`
         * pour garantir un comportement cohérent.
         *
         * @public
         *
         * @param {LoaderConfig} [config={}] Configuration des loaders.
         *
         * @returns {void}
         */
        stop(config = {}) {
            const cfg = _normalize(config);

            // Navigation
            if (cfg.nav && !cfg.overlay) {
                XalLoaderNav.stop();
            }

            // Placeholder
            const placeholder = _normalizePlaceholder(cfg.placeholder);

            if (placeholder) {
                XalLoaderPlaceholder.hide(placeholder.target);
            }

            // Toast
            if (cfg.toast) {
                XalLoaderToast.hide();
            }

            // Overlay
            if (cfg.overlay) {
                XalLoaderOverlay.hide();
            }
        },
    };
})();