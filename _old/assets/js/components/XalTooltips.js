/**
 * Gestion des tooltips Bootstrap avec support des breakpoints.
 *
 * Permet de contrôler finement l'affichage des tooltips en fonction
 * de la largeur du viewport, via l'attribut data-tooltip sur chaque élément.
 *
 * Exemple HTML :
 * <button data-bs-toggle="tooltip" data-tooltip="md-up" title="MD et plus">
 *
 * Règles supportées (valeur de data-tooltip) :
 * - "always"   → toujours affiché (défaut si attribut absent ou invalide)
 * - "xs-only"  → uniquement en xs
 * - "md-up"    → à partir de md
 * - "lg-down"  → jusqu'à lg
 * - etc. pour toutes les combinaisons {xs|sm|md|lg|xl|xxl}-{up|down|only}
 * Note : "xxl-only" n'est pas supporté car xxl est un breakpoint terminal.
 *
 * Dépendances (chargées avant ce fichier dans le HTML) :
 * - BsBreakpoints.js → BsBreakpoints
 * - XalConstants.js  → XalConstants
 *
 * @namespace XalTooltips
 * @author Xavier VILLEMIN
 */
const XalTooltips = (() => {
    /**
     * Valeur de règle signifiant que le tooltip est toujours actif,
     * indépendamment du breakpoint courant.
     *
     * Utilisée comme valeur par défaut quand data-tooltip est absent ou invalide.
     *
     * @type {string}
     */
    const RULE_ALWAYS = 'always';

    /**
     * Liste exhaustive des clés de breakpoints acceptées par l'API.
     *
     * Chaque clé correspond à une combinaison {taille}-{direction} convertie
     * en camelCase (ex : "md-up" → "mdUp"), plus la valeur spéciale "always".
     *
     * Utilisée pour valider la configuration passée à init().
     *
     * @type {ReadonlyArray<string>}
     */
    const BREAKPOINT_KEYS = Object.freeze([
        RULE_ALWAYS,
        'xsOnly',
        'smOnly',
        'mdOnly',
        'lgOnly',
        'xlOnly',
        'smUp',
        'mdUp',
        'lgUp',
        'xlUp',
        'xxlUp',
        'xsDown',
        'smDown',
        'mdDown',
        'lgDown',
        'xlDown',
    ]);

    /**
     * Dictionnaire des media queries indexées par nom de breakpoint camelCase.
     * Construit à partir de BsBreakpoints lors de l'initialisation.
     *
     * @type {Readonly<Record<string, string>>|null}
     */
    let _breakpointDefinitions = null;

    /**
     * Registre interne associant chaque élément DOM à son état de tooltip.
     *
     * Structure de chaque entrée :
     * - tooltipInstance    {bootstrap.Tooltip|null}  — instance Bootstrap active ou null
     * - mediaQueryList     {MediaQueryList}          — media query observée
     * - mediaChangeHandler {Function}                — handler attaché au changement de media query
     * - bootstrapOptions   {Object}                  — options passées à bootstrap.Tooltip
     * - ruleUsed           {string}                  — règle de breakpoint résolue
     *
     * @type {Map<HTMLElement, Object>}
     */
    let _registry = new Map();

    /**
     * Référence vers le MutationObserver surveillant les ajouts dynamiques dans le DOM.
     * Initialisé dans init(), nettoyé dans destroy().
     *
     * @type {MutationObserver|null}
     */
    let _domObserver = null;

    /**
     * Active les logs de debug dans la console lorsque true.
     *
     * @type {boolean}
     */
    let _debug = false;

    /**
     * Vérifie la validité du dictionnaire de breakpoints fourni à init().
     *
     * Contrôles effectués :
     * - l'argument doit être un objet non null
     * - toutes les clés de BREAKPOINT_KEYS doivent être présentes
     * - chaque valeur doit être une chaîne non vide (media query CSS)
     *
     * @param {Object} definitions - Dictionnaire à valider.
     * @throws {Error} Si une clé est manquante ou si une valeur est invalide.
     */
    const _validateBreakpointDefinitions = (definitions) => {
        if (!definitions || typeof definitions !== 'object') {
            throw new Error('[XalTooltips] breakpointDefinitions doit être un objet.');
        }

        // Détection des clés manquantes
        const missingKeys = BREAKPOINT_KEYS.filter(key => !(key in definitions));

        if (missingKeys.length > 0) {
            throw new Error(
                `[XalTooltips] Breakpoints manquants : ${missingKeys.join(', ')}.`
            );
        }

        // Vérification de la cohérence des media queries
        Object.entries(definitions).forEach(([key, value]) => {
            if (typeof value !== 'string' || !value.trim()) {
                throw new Error(`[XalTooltips] Media query invalide pour "${key}".`);
            }
        });
    };

    /**
     * Normalise une règle de tooltip.
     *
     * - Supprime les espaces en début et fin
     * - Convertit en minuscules
     * - Retourne RULE_ALWAYS si la règle est absente, vide ou non-string
     *
     * @param {string} rule - Règle brute issue de data-tooltip.
     * @returns {string} Règle normalisée.
     */
    const _normalizeRule = (rule) => {
        return typeof rule === 'string' && rule.trim()
            ? rule.trim().toLowerCase()
            : RULE_ALWAYS;
    };

    /**
     * Convertit une règle textuelle (ex : "md-up") en clé de breakpoint
     * interne en camelCase (ex : "mdUp").
     *
     * La valeur spéciale "always" est retournée telle quelle.
     * "xxl-only" n'est pas supporté car xxl est un breakpoint terminal
     * (il n'a pas de borne supérieure).
     *
     * @param {string} rule - Règle normalisée.
     * @returns {string|null} Clé camelCase valide, ou null si la règle est invalide.
     */
    const _ruleToKey = (rule) => {
        if (rule === RULE_ALWAYS) {
            return RULE_ALWAYS;
        }

        const match = rule.match(/^(xs|sm|md|lg|xl|xxl)-(up|down|only)$/);

        if (!match) {
            return null;
        }

        const [, size, mode] = match;

        // Exemple : "md" + "up" → "mdUp"
        return `${size}${mode[0].toUpperCase()}${mode.slice(1)}`;
    };

    /**
     * Résout la media query CSS correspondant à une règle de tooltip.
     *
     * Si la règle est invalide ou inconnue, retourne la media query "always"
     * (correspondant à 'all') pour garantir un comportement par défaut sûr.
     *
     * @param {string} rule - Règle brute (non normalisée).
     * @returns {string} Media query CSS prête à être passée à window.matchMedia().
     */
    const _resolveMediaQuery = (rule) => {
        const key = _ruleToKey(_normalizeRule(rule));

        if (!key || !(key in _breakpointDefinitions)) {
            return _breakpointDefinitions[RULE_ALWAYS];
        }

        return _breakpointDefinitions[key];
    };

    /**
     * Détermine si un élément est effectivement visible à l'écran.
     *
     * Retourne toujours true — la media query seule suffit comme condition
     * d'activation. Une vérification de visibilité bloquerait les tooltips
     * sur les éléments masqués au chargement (offcanvas fermé, onglet inactif).
     *
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    const _isVisible = (element) => {
        return true;
    };

    /**
     * Crée et enregistre le contexte matchMedia pour un élément tooltip.
     *
     * Centralise :
     * - la résolution de la media query à partir de la règle
     * - la création du MediaQueryList
     * - l'enregistrement du listener de changement
     *
     * @param {HTMLElement} element  - Élément tooltip concerné.
     * @param {string}      ruleUsed - Règle de breakpoint à appliquer.
     * @returns {{ mediaQueryList: MediaQueryList, mediaChangeHandler: Function }}
     */
    const _createMediaQueryContext = (element, ruleUsed) => {
        const mediaQuery     = _resolveMediaQuery(ruleUsed);
        const mediaQueryList = window.matchMedia(mediaQuery);

        // Handler appelé à chaque changement de media query
        const handler = () => _updateTooltipState(element);

        mediaQueryList.addEventListener('change', handler);

        return {
            mediaQueryList,
            mediaChangeHandler: handler,
        };
    };

    /**
     * Met à jour l'état actif/inactif d'un tooltip en fonction
     * de la media query courante et de la visibilité de l'élément.
     *
     * - Si l'élément a été retiré du DOM : nettoyage immédiat via disableTooltip()
     * - Si la media query correspond et l'élément est visible : création de l'instance Bootstrap
     * - Si la media query ne correspond plus : destruction de l'instance Bootstrap
     *
     * @param {HTMLElement} element - Élément dont l'état doit être mis à jour.
     */
    const _updateTooltipState = (element) => {
        const data = _registry.get(element);

        if (!data) return;

        // Si l'élément a été retiré du DOM, on nettoie immédiatement
        if (!document.body.contains(element)) {
            api.disableTooltip(element);
            return;
        }

        const shouldBeActive = data.mediaQueryList.matches && _isVisible(element);

        // Activation : la media query correspond et aucune instance n'est active
        if (shouldBeActive && !data.tooltipInstance) {
            data.tooltipInstance = new bootstrap.Tooltip(
                element,
                data.bootstrapOptions || {}
            );

            if (_debug) {
                console.info('[XalTooltips] Tooltip activé :', element, '— règle :', data.ruleUsed);
            }
        }

        // Désactivation : la media query ne correspond plus
        if (!shouldBeActive && data.tooltipInstance) {
            data.tooltipInstance.dispose();
            data.tooltipInstance = null;

            if (_debug) {
                console.info('[XalTooltips] Tooltip désactivé :', element, '— règle :', data.ruleUsed);
            }
        }
    };

    /**
     * Observe les mutations du DOM afin d'activer automatiquement
     * les tooltips ajoutés dynamiquement après le chargement initial.
     *
     * Surveille les nœuds ajoutés à document.body et à ses descendants.
     * Les nœuds non-éléments (texte, commentaires) sont ignorés.
     */
    const _observeDomMutations = () => {
        _domObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    // On ignore les nœuds non-éléments (texte, commentaires, etc.)
                    if (!(node instanceof HTMLElement)) continue;

                    // Tooltip direct sur le nœud ajouté
                    if (node.matches(XalConstants.cssQueries.tooltip)) {
                        api.enableTooltip(node);
                    }

                    // Tooltips descendants du nœud ajouté
                    node.querySelectorAll(XalConstants.cssQueries.tooltip).forEach(el => {
                        api.enableTooltip(el);
                    });
                }
            }
        });

        _domObserver.observe(document.body, {
            childList: true,
            subtree:   true,
        });
    };

    /**
     * Construit le dictionnaire de breakpoints à partir de BsBreakpoints.
     *
     * Mappe chaque clé attendue par BREAKPOINT_KEYS vers la media query
     * correspondante générée par BsBreakpoints.
     *
     * @returns {Readonly<Record<string, string>>} Dictionnaire figé de breakpoints.
     */
    const _buildBreakpointDefinitions = () => Object.freeze({
        [RULE_ALWAYS]: BsBreakpoints.always(),
        xsOnly:        BsBreakpoints.only('xs'),
        smOnly:        BsBreakpoints.only('sm'),
        mdOnly:        BsBreakpoints.only('md'),
        lgOnly:        BsBreakpoints.only('lg'),
        xlOnly:        BsBreakpoints.only('xl'),
        smUp:          BsBreakpoints.up('sm'),
        mdUp:          BsBreakpoints.up('md'),
        lgUp:          BsBreakpoints.up('lg'),
        xlUp:          BsBreakpoints.up('xl'),
        xxlUp:         BsBreakpoints.up('xxl'),
        xsDown:        BsBreakpoints.down('xs'),
        smDown:        BsBreakpoints.down('sm'),
        mdDown:        BsBreakpoints.down('md'),
        lgDown:        BsBreakpoints.down('lg'),
        xlDown:        BsBreakpoints.down('xl'),
    });

    const api = {

        /**
         * Active la gestion d'un tooltip sur un élément donné.
         *
         * La règle de breakpoint est lue depuis l'attribut data-tooltip de l'élément.
         * Si l'attribut est absent ou invalide, le tooltip est toujours affiché (RULE_ALWAYS).
         *
         * Une configuration précédente sur le même élément est automatiquement
         * nettoyée avant l'enregistrement de la nouvelle.
         *
         * @param {HTMLElement} element               - Élément cible du tooltip.
         * @param {string|null} [ruleOverride=null]   - Règle optionnelle prenant le pas sur data-tooltip.
         * @param {Object}      [bootstrapOptions={}] - Options passées directement à bootstrap.Tooltip.
         */
        enableTooltip(element, ruleOverride = null, bootstrapOptions = {}) {
            if (!element || !(element instanceof HTMLElement)) {
                if (_debug) {
                    console.warn('[XalTooltips] Élément invalide pour enableTooltip.', element);
                }
                return;
            }

            // Nettoyage de toute configuration précédente sur cet élément
            this.disableTooltip(element);

            const ruleUsed = ruleOverride
                ?? element.getAttribute(XalConstants.attributeNames.tooltip)
                ?? RULE_ALWAYS;

            const { mediaQueryList, mediaChangeHandler } =
                _createMediaQueryContext(element, ruleUsed);

            // Enregistrement de l'état interne
            _registry.set(element, {
                tooltipInstance:  null,
                mediaQueryList,
                mediaChangeHandler,
                bootstrapOptions,
                ruleUsed,
            });

            // Évaluation initiale de l'état du tooltip
            _updateTooltipState(element);
        },

        /**
         * Désactive complètement un tooltip et libère toutes les ressources associées.
         *
         * - Supprime le listener de media query
         * - Détruit l'instance Bootstrap si active
         * - Retire l'élément du registre interne
         *
         * @param {HTMLElement} element - Élément dont le tooltip doit être désactivé.
         */
        disableTooltip(element) {
            const data = _registry.get(element);

            if (!data) return;

            data.mediaQueryList.removeEventListener('change', data.mediaChangeHandler);

            if (data.tooltipInstance) {
                data.tooltipInstance.dispose();
            }

            _registry.delete(element);
        },

        /**
         * Initialise tous les tooltips présents dans le DOM au moment de l'appel.
         *
         * Parcourt tous les éléments correspondant au sélecteur tooltip
         * et appelle enableTooltip() sur chacun d'eux.
         *
         * Utile lors du chargement initial de la page, avant que
         * le MutationObserver ne prenne le relais pour les ajouts dynamiques.
         */
        initTooltips() {
            document.querySelectorAll(XalConstants.cssQueries.tooltip).forEach(el => {
                this.enableTooltip(el);
            });
        },

        /**
         * Détruit l'ensemble du composant et libère toutes les ressources.
         *
         * - Désactive et supprime tous les tooltips enregistrés
         * - Nettoie les listeners de media queries associés
         * - Stoppe l'observation du DOM
         *
         * Après appel, init() devra être rappelé pour réactiver le composant.
         */
        destroy() {
            for (const element of _registry.keys()) {
                this.disableTooltip(element);
            }

            _domObserver?.disconnect();
            _domObserver = null;
        },

        /**
         * Initialise le composant XalTooltips.
         *
         * Point d'entrée unique appelé depuis xalise.js au DOMContentLoaded.
         *
         * Séquence d'initialisation :
         * 1. Construit le dictionnaire de breakpoints depuis BsBreakpoints
         * 2. Valide la configuration obtenue
         * 3. Active le mode debug si demandé
         * 4. Démarre l'observation des mutations DOM
         * 5. Initialise les tooltips déjà présents dans le DOM
         *
         * @param {Object}  [options={}]
         * @param {boolean} [options.debug=false] - Active les logs de debug dans la console.
         * @throws {Error} Si BsBreakpoints ne fournit pas toutes les clés attendues.
         */
        init({ debug = false } = {}) {
            _debug = debug;

            _breakpointDefinitions = _buildBreakpointDefinitions();
            _validateBreakpointDefinitions(_breakpointDefinitions);

            _observeDomMutations();
            this.initTooltips();
        },

        /**
         * Active ou désactive le mode debug à la volée.
         *
         * Permet de modifier le niveau de verbosité sans réinitialiser
         * le composant. Utile pour investiguer un comportement en production
         * ou depuis la console du navigateur.
         *
         * @param {boolean} value - true pour activer, false pour désactiver.
         */
        setDebug(value) {
            _debug = Boolean(value);
        },
    };

    return api;
})();