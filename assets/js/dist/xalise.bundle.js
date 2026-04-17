/**
 * Constantes globales de l'application Xalise.
 *
 * Centralise l'ensemble des valeurs utilisées dynamiquement par le JS :
 * - attributs ARIA
 * - attributs (data-xal-* et autres)
 * - valeurs d'attributs
 * - identifiants DOM 
 * - classes CSS 
 * - sélecteurs CSS
 *
 * Toute modification d'une valeur doit être répercutée ici uniquement.
 *
 * @constant
 * @type {Readonly<Record<string, any>>}
 */
const XalConstants = Object.freeze({
    /**
     * Noms des attributs ARIA.
     * 
     * @public
     *
     * @constant
     * @type {Readonly<Record<string, string>>}
     */
    ariaNames: Object.freeze({
        expanded: 'aria-expanded',
        hidden:   'aria-hidden',
    }),

    /**
     * Noms des attributs.
     * 
     * @public
     *
     * @constant
     * @type {Readonly<Record<string, string>>}
     */
    attributeNames: Object.freeze({
        xalise: Object.freeze({ 
            action: 'data-xal-action',
            target: 'data-xal-target',
        }),

        tooltip: 'data-tooltip',
        hidden:  'hidden',
    }),

    /**
     * Valeurs attendues des attributs.
     * 
     * @public
     *
     * @constant
     * @type {Readonly<Record<string, string>>}
     */
    attributeValues: Object.freeze({
        sidebar: Object.freeze({ 
            toggleSubmenu: 'toggle-submenu',
        }),
    }),

    /**
     * Identifiants des éléments uniques du DOM.
     * 
     * Utilisés avec getElementById.
     * 
     * @public
     *
     * @constant
     * @type {Readonly<Record<string, string>>}
     */
    elementIds: Object.freeze({
        layout:                     'xal-id-application-layout',
        sidebar:                    'xal-id-sidebar',
        btnToggleSidebar:           'xal-id-btn-toggle-sidebar',
        notificationCenter:         'xal-id-notification-center',
        notificationToastUndo:      'xal-id-notification-toast-undo',
        toastTemplateFeedback:      'xal-id-toast-template-feedback',

        loader: Object.freeze({ 
            navbar:                 'xal-id-loader-nav',
            toast:                  'xal-id-loader-toast',
            placeholderTemplate:    'xal-id-loader-placeholder-template',
            overlay:                'xal-id-loader-overlay',
        }),

        dialog: Object.freeze({ 
            template:       'xal-id-dialog-template',
            buttonTemplate: 'xal-id-dialog-button-template',
            iconTemplate:   'xal-id-dialog-icon-template',
        }),
    }),

    /**
     * Classes CSS ajoutées ou supprimées dynamiquement via `classList`.
     * 
     * @public
     *
     * @constant
     * @type {Readonly<Record<string, string>>}
     */
    cssClasses: Object.freeze({
        sidebarCollapsed:           'xal-application-layout--sidebar-collapsed',
        loaderPlaceholderActive:    'xal-loader-placeholder--active',

        bootstrapIcons: Object.freeze({ 
            checkCircleFill:          'bi-check-circle-fill',
            xCircleFill:              'bi-x-circle-fill',
            exclamationTriangleFill:  'bi-exclamation-triangle-fill',
            infoCircleFill:           'bi-info-circle-fill',
        }),

        bootstrapTextBg: Object.freeze({ 
            success: 'text-bg-success',
            danger:  'text-bg-danger',
            warning: 'text-bg-warning',
            info:    'text-bg-info',
        }),

        bootstrapBtn: Object.freeze({ 
            primary:    'btn-primary',
            secondary:  'btn-secondary',
        }),
    }),

    /**
     * Sélecteurs CSS utilisés dans `querySelector` et `querySelectorAll`.
     * 
     * @public
     *
     * @constant
     * @type {Readonly<Record<string, string>>}
     */
    cssQueries: Object.freeze({
        tooltip:     '[data-bs-toggle="tooltip"]',
        
        toast: Object.freeze({ 
            container:       '.toast-container',
            header:          '.toast-header',
            xalToast:        '.xal-toast',
            xalToastIcon:    '.xal-toast__icon',
            xalToastLabel:   '.xal-toast__label',
            xalToastMessage: '.xal-toast__message',
        }),

        loader: Object.freeze({ 
            toast:          '.xal-loader-toast',
            toastMessage:   '.xal-loader-toast__message',
            placeholder:    '.xal-loader-placeholder',
            overlayMessage: '.xal-loader-overlay__message',
        }),

        dialog: Object.freeze({ 
            dialog:      '.modal-dialog',
            container:   '.xal-dialog',
            title:       '.xal-dialog__title',
            body:        '.xal-dialog__body',
            footer:      '.xal-dialog__footer',
            button:      '.xal-dialog__button',
            icon:        '.xal-dialog__icon',
            closeButton: '.xal-dialog__close-button',            
        }),
        
        sidebar: Object.freeze({ 
            submenuToggleBtn: '[data-xal-action="toggle-submenu"]',
            submenu:          '.xal-sidebar__submenu',
            activeNavLink:    '.nav-link.active',
        }),
    }),
});
/**
 * Breakpoints officiels de Bootstrap 5 (en pixels).
 * https://getbootstrap.com/docs/5.3/layout/breakpoints/
 *
 * @constant
 * @type {Readonly<Record<string, number>>}
 */
const BS_SIZES = Object.freeze({
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400
});

/**
 * Objet passé au callback lors de l'appel synchrone initial de onChange().
 *
 * Distinct d'un vrai `MediaQueryListEvent` : la propriété `type: 'init'`
 * permet au consommateur de distinguer cet appel initial d'un vrai changement.
 *
 * @typedef {{ matches: boolean, media: string, type: 'init' }} MediaQueryState
 */

/**
 * API de manipulation des breakpoints Bootstrap.
 *
 * Permet de générer dynamiquement des media queries :
 * - only(size)
 * - up(size)
 * - down(size)
 * - between(min, max)
 *
 * Exemple : window.matchMedia(BsBreakpoints.up('lg'))
 */
const BsBreakpoints = (() => {

    const sizes = BS_SIZES;
    const keys  = Object.keys(sizes);

    /**
     * Registre des listeners actifs, organisé en deux niveaux :
     * - premier niveau  : la media query (string)
     * - deuxième niveau : le callback fourni par le consommateur → le handler DOM interne
     *
     * Permet à removeEventListener() de cibler la référence exacte
     * d'un handler enregistré lors d'un appel précédent à onChange().
     *
     * @type {Map<string, Map<Function, Function>>}
     */
    const _listenerRegistry = new Map();

    /**
     * Retourne le MediaQueryList correspondant à la query fournie.
     *
     * Centralise l'accès à window.matchMedia et lève une erreur explicite
     * dans les environnements sans DOM (Node.js, SSR, tests unitaires…).
     *
     * @param {string} query - Media query CSS à évaluer.
     * @returns {MediaQueryList}
     * @throws {Error} Si window.matchMedia n'est pas disponible.
     */
    const _matchMedia = (query) => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            throw new Error(
                'window.matchMedia is not available in this environment. ' +
                'BsBreakpoints requires a browser context.'
            );
        }

        return window.matchMedia(query);
    };

    /**
     * Vérifie si le breakpoint indiqué en paramètre est défini dans BS_SIZES.
     *
     * @param {string} key - Clé du breakpoint à vérifier (ex : 'sm', 'md', 'lg', etc.).
     * @throws {Error} Si la clé n'est pas définie dans BS_SIZES.
     */
    const assertKey = (key) => {
        if (!Object.hasOwn(sizes, key)) {
            throw new Error(`Breakpoint "${key}" is not defined.`);
        }
    };

    /**
     * Retourne la clé du breakpoint suivant dans l'ordre Bootstrap.
     *
     * Retourne null si la clé fournie est le dernier breakpoint (xxl),
     * car il n'existe pas de breakpoint supérieur.
     *
     * @param {string} key - Clé du breakpoint courant.
     * @returns {string|null} La clé du breakpoint suivant, ou null si inexistant.
     */
    const nextKey = (key) => {
        const index = keys.indexOf(key);

        return index >= 0 && index < keys.length - 1
            ? keys[index + 1]
            : null;
    };

    /**
     * Génère un media query de type "max-width".
     *
     * Un décalage de -0.02px est appliqué afin d'éviter tout chevauchement
     * avec le media query min-width du breakpoint suivant, conformément
     * à la spécification Bootstrap.
     *
     * Exemple : max(768) → "(max-width: 767.98px)"
     *
     * @param {number} value - Largeur maximale en pixels.
     * @returns {string} Media query CSS prêt à être utilisé.
     */
    const max = (value) => `(max-width: ${value - 0.02}px)`;

    /**
     * Génère un media query de type "min-width".
     *
     * Exemple : min(768) → "(min-width: 768px)"
     *
     * @param {number} value - Largeur minimale en pixels.
     * @returns {string} Media query CSS prêt à être utilisé.
     */
    const min = (value) => `(min-width: ${value}px)`;

    /**
     * Génère un media query couvrant un intervalle entre deux largeurs.
     *
     * Combine un min-width inclusif et un max-width exclusif (avec correction de -0.02px).
     *
     * Exemple : between(768, 992) → "(min-width: 768px) and (max-width: 991.98px)"
     *
     * @param {number} minValue - Largeur minimale en pixels (inclusive).
     * @param {number} maxValue - Largeur maximale en pixels (exclusive).
     * @returns {string} Media query CSS combiné prêt à être utilisé.
     */
    const between = (minValue, maxValue) => `${min(minValue)} and ${max(maxValue)}`;

    return Object.freeze({
        /**
         * Retourne un media query qui correspond à tous les viewports.
         *
         * Utile pour appliquer un comportement sans condition de breakpoint,
         * tout en restant cohérent avec l'API BsBreakpoints.
         *
         * @returns {string} La valeur CSS 'all'.
         */
        always() {
            return 'all';
        },

        /**
         * Génère un media query ciblant exclusivement l'intervalle du breakpoint spécifié.
         *
         * Cas particuliers :
         * - 'xxl' : aucun breakpoint supérieur n'existe, only('xxl') est équivalent à up('xxl').
         * - 'xs'  : aucun breakpoint inférieur n'existe, seule la borne supérieure est appliquée.
         *
         * Exemple : only('md') → "(min-width: 768px) and (max-width: 991.98px)"
         * Exemple : only('xxl') → "(min-width: 1400px)"
         * Exemple : only('xs') → "(max-width: 575.98px)"
         *
         * @param {string} key - Clé du breakpoint à cibler (ex : 'sm', 'md', 'lg', etc.).
         * @returns {string} Media query CSS prêt à être utilisé.
         * @throws {Error} Si la clé du breakpoint n'est pas définie.
         */
        only(key) {
            assertKey(key);

            const next = nextKey(key);

            if (!next) {
                // xxl : aucun breakpoint supérieur — only() est équivalent à up()
                return min(sizes[key]);
            }

            if (key === 'xs') {
                // xs : aucun breakpoint inférieur — seule la borne supérieure s'applique
                return max(sizes[next]);
            }

            return between(sizes[key], sizes[next]);
        },

        /**
         * Génère un media query ciblant le breakpoint spécifié et au-dessus.
         *
         * Exemple : up('md') → "(min-width: 768px)"
         *
         * @param {string} key - Clé du breakpoint à cibler (ex : 'sm', 'md', 'lg', etc.).
         * @returns {string} Media query CSS prêt à être utilisé.
         * @throws {Error} Si la clé du breakpoint n'est pas définie.
         */
        up(key) {
            assertKey(key);
            return min(sizes[key]);
        },

        /**
         * Génère un media query ciblant le breakpoint spécifié et en dessous.
         *
         * Cas particulier : down('xxl') retourne 'all' car il n'existe pas
         * de breakpoint supérieur — tous les viewports sont donc couverts.
         *
         * Exemple : down('md') → "(max-width: 991.98px)"
         * Exemple : down('xxl') → "all"
         *
         * @param {string} key - Clé du breakpoint à cibler (ex : 'sm', 'md', 'lg', etc.).
         * @returns {string} Media query CSS prêt à être utilisé.
         * @throws {Error} Si la clé du breakpoint n'est pas définie.
         */
        down(key) {
            assertKey(key);

            const next = nextKey(key);

            if (!next) {
                return 'all';
            }

            return max(sizes[next]);
        },

        /**
         * Génère un media query ciblant un intervalle entre deux breakpoints.
         *
         * Le breakpoint minimum est inclusif, le breakpoint maximum est exclusif —
         * between('sm', 'lg') couvre de sm jusqu'à juste avant lg.
         *
         * Cas particulier : si les deux breakpoints sont voisins, between() est
         * équivalent à only() sur le breakpoint minimum.
         *
         * Exemple : between('sm', 'lg') → "(min-width: 576px) and (max-width: 991.98px)"
         * Exemple : between('sm', 'md') → "(max-width: 767.98px)" (équivalent à only('sm'))
         *
         * @param {string} minKey - Clé du breakpoint minimum inclusif.
         * @param {string} maxKey - Clé du breakpoint maximum exclusif.
         * @returns {string} Media query CSS prêt à être utilisé.
         * @throws {Error} Si une clé n'est pas définie dans BS_SIZES.
         * @throws {Error} Si minKey est supérieur ou égal à maxKey.
         */
        between(minKey, maxKey) {
            assertKey(minKey);
            assertKey(maxKey);

            const minIndex = keys.indexOf(minKey);
            const maxIndex = keys.indexOf(maxKey);

            if (minIndex >= maxIndex) {
                throw new Error(`"${minKey}" must be smaller than "${maxKey}".`);
            }

            // Breakpoints voisins : between() est équivalent à only() sur le minimum
            if (maxIndex === minIndex + 1) {
                return this.only(minKey);
            }

            return between(
                sizes[minKey],
                sizes[maxKey]
            );
        },

        /**
         * Indique si la largeur courante du viewport est égale ou supérieure au breakpoint spécifié.
         *
         * @param {string} key - Clé du breakpoint à tester (ex : 'sm', 'md', 'lg', etc.).
         * @returns {boolean} true si la largeur du viewport est ≥ au breakpoint, sinon false.
         * @throws {Error} Si la clé du breakpoint n'est pas définie.
         * @throws {Error} Si window.matchMedia n'est pas disponible.
         */
        isUp(key) {
            return _matchMedia(this.up(key)).matches;
        },

        /**
         * Indique si la largeur courante du viewport est inférieure au breakpoint spécifié.
         *
         * @param {string} key - Clé du breakpoint à tester (ex : 'sm', 'md', 'lg', etc.).
         * @returns {boolean} true si la largeur du viewport est < au breakpoint, sinon false.
         * @throws {Error} Si la clé du breakpoint n'est pas définie.
         * @throws {Error} Si window.matchMedia n'est pas disponible.
         */
        isDown(key) {
            return _matchMedia(this.down(key)).matches;
        },

        /**
         * Indique si la largeur courante du viewport se situe exactement dans l'intervalle du breakpoint spécifié.
         *
         * @param {string} key - Clé du breakpoint à tester (ex : 'sm', 'md', 'lg', etc.).
         * @returns {boolean} true si le viewport se situe dans l'intervalle du breakpoint, sinon false.
         * @throws {Error} Si la clé du breakpoint n'est pas définie.
         * @throws {Error} Si window.matchMedia n'est pas disponible.
         */
        isOnly(key) {
            return _matchMedia(this.only(key)).matches;
        },

        /**
         * Retourne la clé du breakpoint actuellement actif
         * en fonction de la largeur courante du viewport.
         *
         * Évalue les breakpoints du plus grand au plus petit et retourne
         * le premier dont la condition min-width est satisfaite.
         * Retourne 'xs' par défaut si aucun breakpoint supérieur ne correspond.
         *
         * Exemple : viewport de 900px → 'md'
         *
         * @returns {string} La clé du breakpoint actif (ex : 'xs', 'sm', 'md', 'lg', 'xl', 'xxl').
         * @throws {Error} Si window.matchMedia n'est pas disponible.
         */
        current() {
            const ordered = [...keys].reverse();

            for (const key of ordered) {
                if (_matchMedia(this.up(key)).matches) {
                    return key;
                }
            }

            return 'xs';
        },

        /**
         * Observe les changements d'un media query et notifie le callback.
         *
         * - Déduplique les listeners via {@link _listenerRegistry} : si onChange()
         *   est appelé deux fois avec le même couple (query, callback), le listener
         *   précédent est supprimé avant d'en créer un nouveau.
         * - Fournit l'état courant dès l'inscription via un appel synchrone initial.
         * - Retourne une fonction de désinscription qui nettoie le listener et le registre.
         *
         * L'appel initial reçoit un objet {@link MediaQueryState} et non un vrai
         * MediaQueryListEvent. La propriété `type: 'init'` permet au consommateur
         * de distinguer cet appel initial d'un vrai changement si nécessaire.
         *
         * @example
         * const unsubscribe = BsBreakpoints.onChange(
         *     BsBreakpoints.up('lg'),
         *     (e) => {
         *         if (e.matches) {
         *             console.log('≥ lg');
         *         } else {
         *             console.log('< lg');
         *         }
         *     }
         * );
         *
         * // Plus tard :
         * unsubscribe();
         *
         * @param {string} query - Media query complet à observer.
         * @param {(event: MediaQueryListEvent | MediaQueryState) => void} callback - Fonction appelée lors d'un changement ou à l'inscription.
         * @returns {() => void} Fonction de désinscription.
         * @throws {TypeError} Si callback n'est pas une fonction.
         * @throws {Error} Si window.matchMedia n'est pas disponible.
         */
        onChange(query, callback) {
            if (typeof callback !== 'function') {
                throw new TypeError('callback must be a function.');
            }

            const mql = _matchMedia(query);

            // Récupère ou crée la Map de callbacks pour cette query
            if (!_listenerRegistry.has(query)) {
                _listenerRegistry.set(query, new Map());
            }

            const callbackMap = _listenerRegistry.get(query);

            // Supprime le handler précédent s'il existe (même query + même callback)
            if (callbackMap.has(callback)) {
                mql.removeEventListener('change', callbackMap.get(callback));
            }

            // Crée et enregistre le nouveau handler
            const handler = (event) => callback(event);
            callbackMap.set(callback, handler);
            mql.addEventListener('change', handler);

            // Appel synchrone initial : expose l'état courant au consommateur
            // dès l'inscription, sans attendre un vrai changement de viewport.
            callback({
                matches: mql.matches,
                media:   mql.media,
                type:    'init'
            });

            // Retourne une fonction de désinscription propre
            return () => {
                mql.removeEventListener('change', handler);
                callbackMap.delete(callback);

                // Nettoyage : supprime l'entrée query si plus aucun callback
                if (callbackMap.size === 0) {
                    _listenerRegistry.delete(query);
                }
            };
        },

        /**
         * Affiche le breakpoint courant dans la console.
         *
         * Utile en développement pour surveiller les transitions de breakpoints
         * sans inspecter manuellement les media queries.
         *
         * Utilise onChange() sur la media query "all" pour être notifié
         * à chaque changement, et current() pour résoudre le nom du breakpoint actif.
         *
         * @param {Object}  [options={}]
         * @param {boolean} [options.onResize=false] - Si true, notifie à chaque changement
         *                                             de viewport. Si false, affiche une seule fois.
         * @returns {() => void} Fonction de désinscription pour arrêter les notifications.
         */
        notifyBreakpoint({ onResize = false } = {}) {
            const log = () => {
                console.info('[BsBreakpoints] Breakpoint courant :', this.current());
            };

            if (!onResize) {
                log();
                return () => {};
            }

            // onChange appelle déjà le callback immédiatement — pas besoin de log() séparé
            const unsubscribers = keys.map(key =>
                this.onChange(this.up(key), () => log())
            );

            return () => unsubscribers.forEach(unsub => unsub());
        },
    });
})();
/**
 * Utilitaires communs pour les composants UI.
 *
 * Fournit des helpers pour :
 * - la résolution d'éléments DOM obligatoires
 * - la manipulation standardisée de la visibilité
 *
 * Centralise la gestion des erreurs afin d'assurer un comportement
 * homogène entre les composants.
 *
 * @namespace XalUIService
 */
const XalUIService = {
    /**
     * Résout un élément DOM par son identifiant.
     *
     * @param {string} id Identifiant de l'élément.
     * @returns {HTMLElement} Élément DOM correspondant.
     *
     * @throws {Error} Si aucun élément ne correspond à l'identifiant.
     */
    getElementById(id) {
        const element = document.getElementById(id);

        if (!element) {
            throw new Error(`[XalUIService] Élément introuvable : ${id}`);
        }

        return element;
    },

    /**
     * Résout un élément enfant à partir d'un sélecteur CSS.
     *
     * @param {HTMLElement} parent Élément parent de recherche.
     * @param {string} selector Sélecteur CSS de l'élément cible.
     * @returns {HTMLElement} Élément DOM correspondant.
     *
     * @throws {Error} Si aucun élément ne correspond au sélecteur.
     */
    getRequiredElement(parent, selector) {
        const element = parent.querySelector(selector);

        if (!element) {
            throw new Error(`[XalUIService] Élément introuvable : ${selector}`);
        }

        return element;
    },

    /**
     * Met à jour la visibilité d'un élément.
     *
     * Synchronise les attributs `hidden` et `aria-hidden`
     * afin de garantir :
     * - un affichage correct
     * - une accessibilité conforme
     *
     * @param {HTMLElement} element Élément cible.
     * @param {boolean} isVisible Indique si l'élément doit être visible.
     */
    setVisible(element, isVisible) {
        element.hidden = !isVisible;
        element.setAttribute(XalConstants.ariaNames.hidden, !isVisible);
    },
};
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
/**
 * API de gestion du toast de chargement.
 *
 * Affiche un toast Bootstrap non dismissible avec un spinner
 * pendant une opération longue.
 *
 * Le toast repose sur un élément DOM existant (non dynamique).
 *
 * @namespace XalLoaderToast
 */
const XalLoaderToast = (() => {
    /**
     * Message affiché par défaut.
     *
     * @type {string}
     */
    const DEFAULT_MESSAGE = 'Chargement en cours…';

    /**
     * Élément DOM du toast.
     *
     * @type {HTMLElement|null}
     * @private
     */
    let _toastElement = null;

    /**
     * Élément DOM du message.
     *
     * @type {HTMLElement|null}
     * @private
     */
    let _messageElement = null;

    /**
     * Instance Bootstrap associée.
     *
     * @type {bootstrap.Toast|null}
     * @private
     */
    let _toastInstance = null;

    return {
        /**
         * Initialise le composant en résolvant les éléments DOM.
         */
        init() {
            // Assure l'idempotence : évite une double initialisation
            if (_toastElement) return;

            _toastElement   = XalUIService.getElementById(XalConstants.elementIds.loader.toast);
            _messageElement = XalUIService.getRequiredElement(_toastElement, XalConstants.cssQueries.loader.toastMessage);

            _toastInstance = bootstrap.Toast.getOrCreateInstance(_toastElement, {
                autohide: false,
            });
        },

        /**
         * Affiche le toast de chargement.
         *
         * Met à jour le message puis affiche le toast.
         *
         * @param {string} [message] Message à afficher.
         */
        show(message = DEFAULT_MESSAGE) {
            if (!_toastInstance) {
                console.warn('[XalLoaderToast] la méthode d\'initialisation doit être appelé avant utilisation.');
                return;
            }

            if (this.isVisible()) return;

            _messageElement.textContent = message ?? DEFAULT_MESSAGE;
            _toastInstance.show();
        },

        /**
         * Masque le toast.
         */
        hide() {
            if (!_toastInstance) return;

            _toastInstance.hide();
        },

        /**
         * Met à jour le message affiché.
         *
         * @param {string} message Nouveau message.
         */
        setMessage(message) {
            if (!_messageElement) return;

            _messageElement.textContent = message ?? '';
        },

        /**
         * Indique si le toast est actuellement visible.
         *
         * @returns {boolean} `true` si visible, `false` sinon.
         */
        isVisible() {
            return _toastElement?.classList.contains('show') ?? false;
        },
    };
})();
/**
 * API de gestion de l'overlay de chargement.
 *
 * Affiche un voile semi-transparent sur la page afin de bloquer
 * toute interaction utilisateur pendant un traitement.
 * 
 * L'overlay repose sur un élément DOM existant (non dynamique).
 *
 * @namespace XalLoaderOverlay 
 */
const XalLoaderOverlay = (() => {
    /**
     * Élément DOM de l'overlay.
     *
     * @type {HTMLElement|null}
     * @private
     */
    let _overlayElement = null;

    /**
     * Élément DOM du message.
     *
     * @type {HTMLElement|null}
     * @private
     */
    let _messageElement = null;

    /**
     * Indique si l'overlay est affiché.
     * 
     * @type {boolean} `true` si l'overlay' est affiché, `false` sinon.
     * @private
     */
    let _isVisible = false;

    /**
     * Met à jour la visibilité de l'overlay.
     *
     * @param {boolean} isActive - `true` si l'overlay doit être affiché, sinon `false`.
     * @private
     */
    const _update = (isActive) => {
        if (!_overlayElement) {
            console.warn('[XalLoaderOverlay] la méthode d\'initialisation doit être appelé avant utilisation.');
            return;
        }

        XalUIService.setVisible(_overlayElement, isActive);
    };

    return {
        /**
         * Initialise le composant en résolvant les éléments DOM.
         */
        init() {
            // Assure l'idempotence : évite une double initialisation
            if (_overlayElement) return;

            _overlayElement = XalUIService.getElementById(XalConstants.elementIds.loader.overlay);
            _messageElement = XalUIService.getRequiredElement(_overlayElement, XalConstants.cssQueries.loader.overlayMessage);
        },
        
        /**
         * Affiche l'overlay de chargement.
         * 
         * Met à jour le message puis affiche l'overlay.
         * 
         * @param {string} [message=''] - Message optionnel affiché sous le spinner.
         */
        show(message = '') {
            if (!_messageElement) {
                console.warn('[XalLoaderOverlay] la méthode d\'initialisation doit être appelé avant utilisation.');
                return;
            }

            if (_messageElement) _messageElement.textContent = message ?? '';
             
            if (!_isVisible) {
                _isVisible = true;
                _update(true);
            }
        },

        /**
         * Masque l'overlay de chargement.
         */
        hide() {
            if (!_overlayElement) return;
            
            _isVisible = false;
            _update(false);
        },

        /**
         * Masque immédiatement l'overlay de chargement.
         *
         */
        reset() {
            _isVisible = false;
            _update(false);
        },

        /**
         * Met à jour le message affiché.
         *
         * @param {string} message - Nouveau message.
         */
        setMessage(message) {
            if (!_messageElement || !_overlayElement) return;

            _messageElement.textContent = message ?? '';
        },
    };
})();
/**
 * API de gestion des toasts de notification.
 * 
 * Affiche des toasts Bootstrap signalant le résultat d'une action
 * utilisateur : succès, erreur, avertissement, information ou personnalisé.
 * 
 * Le composant repose sur un élément DOM existant (non dynamique) servant de template,
 * résolu via la méthode `init()` et cloné à chaque affichage de toast.
 * 
 * Chaque toast est automatiquement masqué après un délai configurable (5s par défaut) 
 * et nettoie le DOM à la fin de l'animation de masquage.
 * 
 * @requires XalConstants
 * 
 * @namespace XalToast
 */
const XalToast = (() => {
    /**
     * @typedef {Object} ToastOptions           Options de configuration d'un toast.
     * @property {string}   title               Titre du toast.
     * @property {string}   message             Contenu HTML ou texte brut à afficher.
     * @property {string}   icon                Classes CSS de l'icône Bootstrap à afficher (ex : 'bi-check-circle-fill').
     * @property {string}   color               Classe CSS de couleur à appliquer sur le toast (ex : 'text-bg-success').
     * @property {boolean}  [allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
     */

    /**
     * Délai par défaut en ms avant masquage automatique du toast.
     * 
     * @private
     *
     * @type {number}
     */
    const DEFAULT_DELAY_MS = 5000;

    /**
     * Énumération des différentes variantes supportées par l'API.
     *
     * @private
     *
     * @constant
     * @type {Readonly<Record<string, string>>}
     */
    const ToastVariant = Object.freeze({
        success:    'success',
        error:      'error',
        warning:    'warning',
        info:       'info',
    });

    /**
     * Configuration des différentes variantes des toasts.
     *
     * Le message et l'autorisation du HTML sont remplis dynamiquement
     * dans `_getOptions()` sans muter l'objet source.
     * 
     * @private
     *
     * @constant
     * @type {Readonly<Record<keyof typeof ToastVariant, ToastOptions>>}
     */
    const ToastVariantConfig = Object.freeze({
        success: Object.freeze({
            title:      'Succès',
            icon:       XalConstants.cssClasses.bootstrapIcons.checkCircleFill,
            color:      XalConstants.cssClasses.bootstrapTextBg.success,
        }),
        error: Object.freeze({
            title:      'Erreur',
            icon:       XalConstants.cssClasses.bootstrapIcons.xCircleFill,
            color:      XalConstants.cssClasses.bootstrapTextBg.danger,
        }),
        warning: Object.freeze({
            title:      'Avertissement',
            icon:       XalConstants.cssClasses.bootstrapIcons.exclamationTriangleFill,
            color:      XalConstants.cssClasses.bootstrapTextBg.warning,
        }),
        info: Object.freeze({
            title:      'Information',
            icon:       XalConstants.cssClasses.bootstrapIcons.infoCircleFill,
            color:      XalConstants.cssClasses.bootstrapTextBg.info,
        }),
    });

    /**
     * Référence vers le template HTML des toasts.
     *
     * @private
     * 
     * @type {HTMLTemplateElement|null}
     */
    let _templateElement = null;

    /**
     * Récupère les options du toast à afficher en fonction de la variante souhaitée.
     * 
     * La configuration de la variante est fusionnée avec le message fourni pour construire l'objet d'options complet.
     * Si la variante souhaitée n'existe pas, un avertissement est loggé et la variante "info" est utilisée par défaut.
     * 
     * @private
     *  
     * @param {keyof typeof ToastVariant} variant           Variante du toast.
     * @param {string}                    message           Message à afficher dans le toast.
     * @param {boolean}                   [allowHtml=false] Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
     * 
     * @returns {ToastOptions} Objet d'options complet.
     */
    const _getOptions = (variant, message, allowHtml = false) => {
        if (!ToastVariantConfig[variant]) {
            console.warn(`[XalToast] Variante "${variant}" inconnue, fallback sur la variante "info".`);
        }

        const base = ToastVariantConfig[variant] ?? ToastVariantConfig[ToastVariant.info];
        return Object.freeze({ ...base, message, allowHtml });
    };

    /**
     * Crée, insère et affiche un toast Bootstrap à partir du template HTML.
     * 
     * Séquence d'exécution :
     * 1. Clonage du template et gestion du titre, de l'icône, du message et des classes CSS complémentaires
     * 2. Insertion dans le conteneur des toasts
     * 3. Création de l'instance Bootstrap Toast et affichage
     * 4. Nettoyage du DOM après masquage via hidden.bs.toast
     * 
     * Sans effet si le template n'a pas été résolu dans `init()`.
     * 
     * @private
     * 
     * @param {ToastOptions}    options Configuration du toast.
     * @param {number}          [delay] Délai en ms avant masquage automatique.
     * 
     * @returns {void}
     */
    const _show = (options, delay = DEFAULT_DELAY_MS) => {
        if (!_templateElement) {
            console.warn('[XalToast] La méthode d\'initialisation doit être appelée avant utilisation.');
            return;
        }

        // Clone indépendant du template permettant d'afficher plusieurs toasts simultanément
        const fragment = document.importNode(_templateElement.content, true);
        const toastElt = fragment.querySelector(XalConstants.cssQueries.toast.xalToast);

        if (!toastElt) {
            console.warn('[XalToast] Template invalide : élément toast introuvable.');
            return;
        }

        const header = toastElt.querySelector(XalConstants.cssQueries.toast.header);
        const icon   = toastElt.querySelector(XalConstants.cssQueries.toast.xalToastIcon);
        const label  = toastElt.querySelector(XalConstants.cssQueries.toast.xalToastLabel);

        // Classe supplémentaire sur le toast
        if (options.color) toastElt.classList.add(options.color);

        // Gestion du titre et de l'icône bootstrap
        const displayTitle = Boolean(options.title);
        const displayIcon  = Boolean(options.icon);

        header.toggleAttribute(XalConstants.attributeNames.hidden, !displayTitle);
        icon.toggleAttribute(XalConstants.attributeNames.hidden, !displayIcon);

        if (displayTitle) {
            label.textContent = options.title;
        }

        if (displayIcon) {
            options.icon.split(' ').forEach(cls => icon.classList.add(cls));
        }

        // Injection du message dans le corps du toast
        if (options.allowHtml) {
            toastElt.querySelector(XalConstants.cssQueries.toast.xalToastMessage).innerHTML = options.message;    
        }
        else {
            toastElt.querySelector(XalConstants.cssQueries.toast.xalToastMessage).textContent = options.message;    
        }

        // Insertion dans le conteneur des toasts ou dans body en dernier recours
        const container = document.querySelector(XalConstants.cssQueries.toast.container);
        const parent    = container ?? document.body;
        parent.appendChild(toastElt);

        // Création de l'instance Bootstrap avec masquage automatique
        const toastInstance = new bootstrap.Toast(toastElt, { autohide: true, delay });

        // Nettoyage du DOM après la fin de l'animation de masquage
        // { once: true } garantit que le listener se supprime automatiquement
        toastElt.addEventListener('hidden.bs.toast', () => {
            toastInstance.dispose();
            toastElt.remove();
        }, { once: true });

        toastInstance.show();
    };

    return {
        /**
         * Initialise le composant en résolvant le template HTML.
         * 
         * L'idempotence est assurée : si le template a déjà été résolu, la méthode ne fait rien.
         * 
         * @public
         * 
         * @throws {Error} Si le template du toast n'est pas trouvé dans le DOM.
         * 
         * @returns {void}
         */
        init() {
            if (_templateElement) return;

            _templateElement = document.getElementById(XalConstants.elementIds.toastTemplateFeedback);

            if (!_templateElement) {
                throw new Error(`[XalToast] Template "${XalConstants.elementIds.toastTemplateFeedback}" non trouvé dans le DOM.`);
            }
        },
        
        /**
         * Affiche un toast de succès.
         * 
         * @public
         *
         * @param {string}  message                     Message à afficher.
         * @param {object}  [options]                   Options d'affichage du toast.
         * @param {boolean} [options.allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
         * @param {number}  [options.delay]             Délai en ms avant masquage automatique.
         * 
         * @returns {void}
         */
        success(message, { allowHtml = false, delay = DEFAULT_DELAY_MS } = {}) {
            _show(_getOptions(ToastVariant.success, message, allowHtml), delay);
        },

        /**
         * Affiche un toast d'erreur.
         * 
         * @public
         *
         * @param {string}  message                     Message à afficher.
         * @param {object}  [options]                   Options d'affichage du toast.
         * @param {boolean} [options.allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
         * @param {number}  [options.delay]             Délai en ms avant masquage automatique.
         * 
         * @returns {void}
         */
        error(message, { allowHtml = false, delay = DEFAULT_DELAY_MS } = {}) {
            _show(_getOptions(ToastVariant.error, message, allowHtml), delay);
        },

        /**
         * Affiche un toast d'avertissement.
         * 
         * @public
         *
         * @param {string}  message                     Message à afficher.
         * @param {object}  [options]                   Options d'affichage du toast.
         * @param {boolean} [options.allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
         * @param {number}  [options.delay]             Délai en ms avant masquage automatique.
         * 
         * @returns {void}
         */
        warning(message, { allowHtml = false, delay = DEFAULT_DELAY_MS } = {}) {
            _show(_getOptions(ToastVariant.warning, message, allowHtml), delay);
        },

        /**
         * Affiche un toast d'information.
         * 
         * @public
         *
         * @param {string}  message                     Message à afficher.
         * @param {object}  [options]                   Options d'affichage du toast.
         * @param {boolean} [options.allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
         * @param {number}  [options.delay]             Délai en ms avant masquage automatique.
         * 
         * @returns {void}
         */
        info(message, { allowHtml = false, delay = DEFAULT_DELAY_MS } = {}) {
            _show(_getOptions(ToastVariant.info, message, allowHtml), delay);
        },

        /**
         * Affiche un toast de notification personnalisé.
         *
         * Permet d'afficher un toast en dehors des variantes prédéfinies,
         * en fournissant directement un objet options.
         * 
         * @public
         *
         * @param {ToastOptions} options    Configuration du toast.
         * @param {number}       [delay]    Délai en ms avant masquage automatique.
         * 
         * @returns {void}
         */
        custom(options, delay = DEFAULT_DELAY_MS) {
            _show(options, delay);
        },
    };
})();
/**
 * Couche de gestion des requêtes HTTP.
 * 
 * Surcouche de `fetch()` fournissant :
 * - gestion des indicateurs de chargement (navbar, placeholder, toast, overlay)
 * - gestion centralisée des erreurs réseau et HTTP
 * - callbacks personnalisables
 * 
 * Gestion des erreurs :
 * - Erreur réseau (fetch rejeté)    → toast d'erreur générique
 * - Erreur HTTP (statut 4xx, 5xx)   → toast d'erreur avec le statut HTTP
 * - Comportement personnalisable    → paramètre `onError` par appel
 * 
 * @requires XalLoaderNav
 * @requires XalLoaderPlaceholder
 * @requires XalLoaderToast
 * @requires XalLoaderOverlay
 * @requires XalToast
 * 
 * @namespace XalHttp
 */
const XalHttp = (() => {
    /**
     * Message d'erreur affiché par défaut en cas d'erreur réseau.
     * 
     * @private
     *
     * @type {string}
     */
    const DEFAULT_NETWORK_ERROR_MESSAGE = 'Une erreur réseau est survenue. Veuillez réessayer.';

    /**
     * Messages d'erreur par défaut associés aux statuts HTTP.
     * 
     * @private
     * 
     * @type {Readonly<Record<number, string>>}
     */
    const DEFAULT_ERROR_MESSAGES = Object.freeze({
        400: 'Requête invalide.',
        401: 'Accès non autorisé à la ressource demandée.',
        403: 'Accès refusé à la ressource demandée.',
        404: 'Ressource non trouvée.',
        405: 'Méthode HTTP non autorisée pour accéder à la ressource.',
        408: 'Délai d\'envoi de la requête trop long.',
        409: 'Conflit avec l\'état actuel de la ressource.',
        410: 'Ressource supprimée définitivement.',
        422: 'Données invalides.',
        429: 'Limite de requête atteinte ou dépassée.',
        500: 'Une erreur serveur est survenue.',
        501: 'Fonctionnalité non supportée par le serveur.',
        502: 'Réponse invalide d\'un serveur en amont.',
        503: 'Serveur temporairement indisponible.',
        504: 'Délai dépassé en attendant un serveur en amont.',
    });

    /**
     * Active ou désactive les indicateurs visuels de chargement.
     * 
     * La barre de progression située sous la barre de navigation est désactivée si
     * l'overlay est actif car le spinner de l'overlay suffit comme retour visuel.
     * 
     * @private
     * 
     * @param {Object}          indicators              Indicateurs visuels à activer ou désactiver.
     * @param {string}          indicators.placeholder  Sélecteur CSS de la zone du placeholder.
     * @param {string}          indicators.toast        Message du toast.
     * @param {boolean|string}  indicators.overlay      Si `true`, affiche l'overlay sans message.
     *                                                  Si `string`, affiche l'overlay avec ce message.
     * @param {boolean}         show                    `true` pour afficher les indicateurs, `false` pour masquer les indicateurs.
     */
    const _toggleLoadingIndicators = ({ placeholder, toast, overlay }, show) => {
        if (!overlay) {
            show ? XalLoaderNav.start() : XalLoaderNav.stop();
        }

        if (placeholder) {
            show
                ? XalLoaderPlaceholder.show(placeholder)
                : XalLoaderPlaceholder.hide(placeholder);
        }

        if (toast) {
            show
                ? XalLoaderToast.show(toast)
                : XalLoaderToast.hide(toast);
        }

        if (overlay) {
            show
                ? XalLoaderOverlay.show(typeof overlay === 'string' ? overlay : '')
                : XalLoaderOverlay.hide();
        }
    };

    /**
     * Extrait un message d'erreur à partir d'une réponse HTTP.
     * 
     * Tente d'interpréter le corps de la réponse selon son type :
     * - JSON   → retourne la propriété `message` si présente, sinon la réponse sérialisée.
     * - Autre  → retourne le contenu texte brut.
     * 
     * La méthode consomme le body de la réponse.
     * Il est recommandé de lui fournir une copie de la réponse (`response.clone()`) si
     * celle-ci doit être réutilisée ailleurs (ex: pour un autre traitement ou un callback onSuccess).
     * 
     * @private
     * 
     * @param {Response} response Réponse HTTP à analyser.
     * 
     * @returns {Promise<string>} Message d'erreur extrait ou message générique en cas d'échec.
     */
    const _extractErrorMessage = async (response) => {
        try {
            const contentType = response.headers.get('content-type');

            if (contentType?.includes('application/json')) {
                const data = await response.json();
                return data.message ?? data.error ?? JSON.stringify(data);
            }

            return await response.text();
        } catch {
            return '[XalHttp] Une erreur est survenue à l\'extraction du message d\'erreur.';
        }
    };

    /**
     * Parse le corps d'une réponse HTTP en fonction de son type de contenu.
     * - JSON   → retourne un objet JavaScript
     * - Autre  → retourne une chaîne de caractères
     * 
     * La méthode consomme le body de la réponse.
     * Il est recommandé de lui fournir une copie de la réponse (`response.clone()`) si
     * celle-ci doit être réutilisée ailleurs (ex: pour un autre traitement ou un callback onSuccess).
     * 
     * @private
     * 
     * @param {Response} response Réponse HTTP à parser.
     * 
     * @returns {Promise<any>} Données parsées (objet ou texte).
     */
    const _parseResponse = async (response) => {
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('json')) {
            try {
                return await response.json();
            } catch {
                return null;
            }
        }

        return await response.text();
    };

    /**
     * Gère une erreur réseau ou HTTP.
     * 
     * Ordre de priorité pour la résolution du message d'erreur :
     * 1. Callback `onError` fourni par l'appelant
     * 2. Message personnalisé spécifique par statut HTTP fourni par l'appelant
     * 3. Message extrait de la réponse HTTP (si disponible)
     * 4. Message par défaut défini dans DEFAULT_ERROR_MESSAGES
     * 5. Message générique de fallback
     * 
     * @private
     * 
     * @param {Error|Response}          error           Erreur survenue.
     *                                                  Instance de `Response` (erreur HTTP) ou une `Error` (erreur réseau).
     * @param {Function|null}           onError         Callback d'erreur personnalisé fourni par l'appelant.
     * @param {Record<number, string>}  errorMessages   Messages d'erreur personnalisés par statut HTTP fournis par l'appelant.
     * 
     * @returns {Promise<void>} Promesse résolue une fois l'erreur traitée et le message affiché.
     */
    const _handleError = async (error, onError, errorMessages) => {
        if (onError) {
            await onError(error);
            return;
        }

        if (error instanceof Response) {
            // Utilisation de `error.clone()` pour éviter de consommer le corps de la réponse,
            // permettant à d'autres traitements d'y accéder si nécessaire.
            const extractedMessage = await _extractErrorMessage(error.clone());

            const safeExtracted =
                    extractedMessage?.startsWith('<')
                        ? null
                        : extractedMessage;

            const message =
                errorMessages[error.status]
                ?? DEFAULT_ERROR_MESSAGES[error.status]
                ?? safeExtracted
                ?? `Erreur ${error.status} : ${error.statusText || 'Une erreur est survenue.'}`;

            error.status === 409
                ? XalToast.warning(message)
                : XalToast.error(message);

        } else {
            XalToast.error(DEFAULT_NETWORK_ERROR_MESSAGE);
        }
    };

    return {
        /**
         * Exécute une requête HTTP.
         * 
         * Gère les indicateurs de chargement et les erreurs selon la configuration fournie.
         * Les indicateurs sont systématiquement masqués dans le bloc finally() pour garantir leur nettoyage même en cas d'erreur.
         * 
         * @public
         * 
         * @param {string}                  url                         URL de la ressource demandée.
         * @param {Object}                  [fetchOptions={}]           Options de la requête HTTP.
         * @param {Object}                  [indicators={}]             Indicateurs visuels et callbacks.
         * @param {string}                  [indicators.placeholder]    Sélecteur CSS de la zone du placeholder.
         * @param {string}                  [indicators.toast]          Message du toast.
         * @param {boolean|string}          [indicators.overlay]        Si `true`, affiche l'overlay sans message.
         *                                                              Si `string`, affiche l'overlay avec ce message.
         * @param {Function|null}           [indicators.onSuccess]      Callback appelé après une requête HTTP réussie.
         *                                                              Reçoit la `Response` en paramètre.
         * @param {Function|null}           [indicators.onError]        Callback appelé en cas d'erreur réseau ou HTTP.
         *                                                              Reçoit la `Response` (erreur HTTP) ou une `Error` (erreur réseau) en paramètre.
         *                                                              Si absent, la résolution suit l'ordre de priorité défini.
         * @param {Record<number, string>}  [indicators.errorMessages]  Messages d'erreur personnalisés par statut HTTP.
         *                                                              Prennent le pas sur DEFAULT_ERROR_MESSAGES pour les statuts concernés.
         * 
         * @returns {Promise<Response>}                                 Promesse résolue avec la `Response` ou rejetée en cas d'erreur réseau.
         */
        fetch(url, fetchOptions = {}, { placeholder, toast, overlay = false, onError = null, onSuccess = null, errorMessages = {} } = {}) {
            const indicators = { placeholder, toast, overlay };

            _toggleLoadingIndicators(indicators, true);

            return fetch(url, fetchOptions)
                .then(async response => {
                    const parsedData = await _parseResponse(response.clone());

                    // Les erreurs HTTP ne rejettent pas la promesse nativement.
                    // On doit vérifier response.ok et rejeter manuellement.
                    if (!response.ok) {
                        await _handleError(response, onError, errorMessages);
                        return Promise.reject(response);
                    }

                    if (typeof onSuccess === 'function') {
                        // Reçoit la `Response` et les données parsées (si disponibles)
                        onSuccess(response, parsedData);
                    }

                    return response;
                })
                .catch(async error => {
                    // Évite de traiter deux fois les erreurs HTTP déjà gérées dans .then()
                    if (!(error instanceof Response)) {
                        await _handleError(error, onError, errorMessages);
                    }

                    return Promise.reject(error);
                })
                .finally(() => {
                    _toggleLoadingIndicators(indicators, false);
                });
        },

        /**
         * Simule une requête HTTP.
         * 
         * Déclenche les mêmes indicateurs visuels et la même gestion d'erreurs que `fetch()`,
         * mais retourne une réponse fictive après le délai spécifié.
         * 
         * @public
         * 
         * @param {*}                       [data=null]                 Données fictives à retourner.
         * @param {Object}                  [options={}]                Options de la simulation.
         * @param {number}                  [options.delay=5000]        Délai en ms avant la résolution.
         * @param {boolean}                 [options.fail=false]        Si `true`, simule une erreur réseau.
         * @param {Object}                  [indicators={}]             Indicateurs visuels et callbacks.
         * @param {string}                  [indicators.placeholder]    Sélecteur CSS de la zone du placeholder.
         * @param {string}                  [indicators.toast]          Message du toast.
         * @param {boolean|string}          [indicators.overlay]        Si `true`, affiche l'overlay sans message.
         *                                                              Si `string`, affiche l'overlay avec ce message.
         * @param {Function|null}           [indicators.onSuccess]      Callback appelé après une requête HTTP réussie.
         *                                                              Reçoit les données directement.
         * @param {Function|null}           [indicators.onError]        Callback appelé en cas d'erreur réseau ou HTTP.
         *                                                              Reçoit la `Response` (erreur HTTP) ou une `Error` (erreur réseau) en paramètre.
         *                                                              Si absent, la résolution suit l'ordre de priorité défini.
         * @param {Record<number, string>}  [indicators.errorMessages]  Messages d'erreur personnalisés par statut HTTP.
         *                                                              Prennent le pas sur DEFAULT_ERROR_MESSAGES pour les statuts concernés.
         * 
         * @returns {Promise<*>}                                        Promesse résolue avec les données ou rejetée si fail = `true`.
         */
        mock(data = null, { delay = 5000, fail = false } = {}, { placeholder, toast, overlay = false, onError = null, onSuccess = null, errorMessages = {} } = {}) {
            const indicators = { placeholder, toast, overlay };

            _toggleLoadingIndicators(indicators, true);

            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    _toggleLoadingIndicators(indicators, false);

                    if (fail) {
                        const error = new Error('[XalHttp.mock] Erreur simulée.');
                        await _handleError(error, onError, errorMessages);
                        reject(error);
                    } else {
                        if (typeof onSuccess === 'function') {
                            onSuccess(data, data);
                        }

                        resolve(data);
                    }
                }, delay);
            });
        },
    };
})();
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
/**
 * Gestion de la barre latérale (sidebar) de l'application.
 * 
 * @namespace XalSidebar
 * @author  Xavier VILLEMIN
 */
const XalSidebar = {
    /**
     * Synchronise l'attribut aria-expanded d'un bouton déclencheur
     * avec l'état d'affichage de son sous-menu.
     *
     * @param {HTMLElement} menu - Le bouton à mettre à jour.
     * @param {boolean} state - true = sous-menu ouvert, false = sous-menu fermé.
     */
    updateAriaExpanded(menu, state) {
        menu.setAttribute(XalConstants.ariaNames.expanded, state.toString());
    },

    /**
     * Ferme un sous-menu et synchronise l'état aria-expanded de son bouton déclencheur.
     *
     * Le bouton déclencheur est retrouvé dynamiquement via l'attribut
     * data-xal-target pointant vers l'ID du sous-menu.
     *
     * @param {HTMLElement} submenu - Le sous-menu à fermer.
     */
    closeSubmenu(submenu) {
        submenu.hidden = true;

        const button = document.querySelector(
            `${XalConstants.cssQueries.sidebar.submenuToggleBtn}[${XalConstants.attributeNames.xalTarget}="#${submenu.id}"]`
        );

        if (button) {
            this.updateAriaExpanded(button, false);
        }
    },

    /**
     * Ferme tous les sous-menus ouverts de la sidebar.
     */
    closeAllSubmenus() {
        document.querySelectorAll(XalConstants.cssQueries.sidebar.submenu)
                .forEach((submenu) => {
                    if (!submenu.hidden) {
                        this.closeSubmenu(submenu);
                    }
                });
    },

    /**
     * Ouvre un sous-menu et synchronise l'état aria-expanded de son bouton déclencheur.
     *
     * @param {HTMLElement} submenu - Le sous-menu à ouvrir.
     * @param {HTMLElement} button  - Le bouton déclencheur associé.
     */
    openSubmenu(submenu, button) {
        submenu.hidden = false;
        this.updateAriaExpanded(button, true);
    },

    /**
     * Indique si la sidebar est actuellement affichée en mode réduit.
     *
     * @returns {boolean} true = mode réduit, false = mode étendu.
     */
    isCollapsed() {
        const layout = document.getElementById(XalConstants.elementIds.layout);

        return layout
            ? layout.classList.contains(XalConstants.cssClasses.sidebarCollapsed)
            : false;
    },

    /**
     * Gère l'ouverture et la fermeture d'un sous-menu au clic sur son bouton déclencheur.
     *
     * Règles appliquées :
     * - Si le sous-menu ciblé est déjà ouvert, il est fermé.
     * - Un seul sous-menu peut être ouvert à la fois.
     * - Mode étendu : le sous-menu contenant un lien actif reste ouvert
     *   lors de l'ouverture d'un autre sous-menu.
     * - Mode réduit : tous les sous-menus sont fermés sans exception
     *   avant l'ouverture du sous-menu ciblé.
     *
     * @param {HTMLElement} button - Le bouton déclencheur cliqué.
     */
    handleSubmenuToggle(button) {
        const targetSelector = button.getAttribute(XalConstants.attributeNames.xalTarget);
        const submenu        = document.querySelector(targetSelector);

        if (!submenu) return;

        const isOpen = !submenu.hidden;

        if (isOpen) {
            this.closeSubmenu(submenu);
            return;
        }

        // Ferme les sous-menus ouverts selon le mode courant
        document.querySelectorAll(XalConstants.cssQueries.sidebar.submenu).forEach((el) => {
            if (el === submenu) return;

            // Mode étendu : préserve le sous-menu contenant un lien actif
            if (!this.isCollapsed() && el.querySelector(XalConstants.cssQueries.sidebar.activeNavLink)) return;

            this.closeSubmenu(el);
        });

        this.openSubmenu(submenu, button);
    },

    /**
     * Initialise la gestion des sous-menus de la sidebar.
     *
     * Utilise la délégation d'événements sur le conteneur sidebar
     * pour éviter d'attacher un listener sur chaque bouton déclencheur.
     */
    initSubmenus() {
        const sidebar = document.getElementById(XalConstants.elementIds.sidebar);

        if (!sidebar) return;

        sidebar.addEventListener('click', (e) => {
            const button = e.target.closest(XalConstants.cssQueries.sidebar.submenuToggleBtn);

            if (!button) return;

            this.handleSubmenuToggle(button);
        });
    },

    /**
     * Bascule l'état réduit/étendu de la sidebar.
     *
     * Effets de bord :
     * - Ajoute ou supprime la classe CSS collapsed sur le layout
     * - Ferme tous les sous-menus ouverts lors du passage en mode réduit
     * - Persiste l'état dans localStorage
     *
     * @throws {Error} Si l'élément layout est introuvable dans le DOM.
     */
    toggle() {
        const layout = document.getElementById(XalConstants.elementIds.layout);

        if (!layout) {
            throw new Error(`Element #${XalConstants.elementIds.layout} not found.`);
        }

        const isCollapsed = layout.classList.toggle(XalConstants.cssClasses.sidebarCollapsed);

        // Ferme tous les sous-menus quand on passe en mode réduit
        if (isCollapsed) {
            this.closeAllSubmenus();
        }

        localStorage.setItem(XalConstants.elementIds.layout, isCollapsed);
    },

    /**
     * Initialise le composant sidebar.
     *
     * - Restaure l'état collapsed depuis localStorage
     * - Attache le listener du bouton toggle
     * - Initialise la gestion des sous-menus
     * - Initialise le comportement responsive
     */
    init() {
        // Restaure l'état collapsed depuis localStorage
        const wasCollapsed = localStorage.getItem(XalConstants.elementIds.layout) === 'true';

        if (wasCollapsed) {
            document.getElementById(XalConstants.elementIds.layout)
                    ?.classList.add(XalConstants.cssClasses.sidebarCollapsed);
        }

        const btnToggleSidebar = document.getElementById(XalConstants.elementIds.btnToggleSidebar);

        if (btnToggleSidebar) {
            btnToggleSidebar.addEventListener('click', () => this.toggle());
        }

        this.initSubmenus();
        this.initResponsive();
    },

    /**
     * Initialise le comportement responsive de la sidebar.
     *
     * Observe le breakpoint md via BsBreakpoints et ajuste automatiquement
     * l'état de la sidebar en fonction de la largeur du viewport :
     * - En dessous de md : réduit la sidebar et ferme tous les sous-menus.
     * - Au-dessus de md  : restaure l'état persisté dans localStorage.
     *
     * Note : les changements d'état déclenchés par le responsive ne sont pas
     * persistés dans localStorage afin de ne pas écraser la préférence
     * manuelle de l'utilisateur.
     */
    initResponsive() {
        // En dessous de md : retire le mode réduit pour l'offcanvas
        BsBreakpoints.onChange(BsBreakpoints.down('md'), (e) => {
            const layout  = document.getElementById(XalConstants.elementIds.layout);
            const sidebar = document.getElementById(XalConstants.elementIds.sidebar);

            if (!layout) return;

            if (e.matches) {
                // Mobile : retire le mode réduit, l'offcanvas prend le relais
                layout.classList.remove(XalConstants.cssClasses.sidebarCollapsed);
                this.closeAllSubmenus();
            } else {
                // Fermeture propre de l'offcanvas avant le passage en mode desktop
                // Évite que le backdrop reste affiché après le redimensionnement.
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(sidebar);

                if (offcanvasInstance) {
                    offcanvasInstance.hide();
                }

                // Desktop : restaure l'état persisté
                const wasCollapsed = localStorage.getItem(XalConstants.elementIds.layout) === 'true';

                layout.classList.toggle(
                    XalConstants.cssClasses.sidebarCollapsed,
                    wasCollapsed
                );
            }
        });

        // À partir de md et jusqu'à lg : réduit automatiquement la sidebar
        BsBreakpoints.onChange(BsBreakpoints.only('md'), (e) => {
            const layout = document.getElementById(XalConstants.elementIds.layout);

            if (!layout) return;

            if (e.matches) {
                // Breakpoint md : réduit automatiquement
                layout.classList.add(XalConstants.cssClasses.sidebarCollapsed);
                this.closeAllSubmenus();
            }
        });
    },
};
/**
 * Gestion du centre de notifications de l'application.
 *
 * Fonctionnalités implémentées :
 * - gestion de l'état des notifications
 * - actions unitaires et de masse
 *
 * @namespace XalNotifications
 * @author Xavier VILLEMIN
 */
const XalNotifications = (() => {

    /**
     * Durée (en ms) pendant laquelle l'utilisateur peut annuler une suppression unitaire
     * avant que celle-ci soit définitivement appliquée.
     *
     * @type {number}
     */
    const UNDO_DELETE_DELAY_MS = 5000;

    /**
     * Délai simulé (en ms) pour reproduire le temps de réponse d'une API backend
     * chargée de persister les changements d'état (lue, non lue, supprimée).
     *
     * @type {number}
     */
    const MOCK_API_DELAY_MS = 5000;

    /**
     * Centralisation des sélecteurs CSS et classes d'état utilisés
     * par le gestionnaire de notifications.
     *
     * Règles :
     * - aucune chaîne CSS ne doit être utilisée en dehors de cet objet
     * - toute modification de structure DOM ou de nom de classe doit être répercutée ici
     *
     * L'objet est figé pour garantir l'immuabilité des références
     * et éviter toute modification accidentelle à l'exécution.
     */
    const css = Object.freeze({

        /**
         * Sélecteurs CSS ciblant des éléments du DOM.
         *
         * Ces sélecteurs décrivent la structure de l'interface et sont utilisés pour :
         * - la sélection d'éléments statiques
         * - la délégation d'événements
         * - la synchronisation de l'UI
         */
        selectors: Object.freeze({
            // Conteneurs principaux
            notificationsList:      '.xal-notification-center__list',
            emptyItem:              '.xal-notification-center__list-empty',
            notificationItem:       '.xal-notification',
            offcanvas:              '#xal-id-notification-center',

            // Indicateurs de notifications non lues
            badgeCounters:          '.xal-notification-indicator__badge',
            badgeCountersWrapper:   '.xal-notification-indicator',
            badgeCounterDot:        '.xal-notification-indicator__dot',

            // Toast d'annulation de suppression unitaire
            toastUndo:              '#xal-id-notification-toast-undo',
            toastUndoBtn:           '.xal-notification-toast__action',
            toastProgress:          '.xal-notification-toast__progress',

            // Actions unitaires
            singleActions: Object.freeze({
                read:   '.xal-notification__action--mark-read',
                unread: '.xal-notification__action--mark-unread',
                delete: '.xal-notification__action--delete',
            }),

            // Actions de masse
            bulkActions: Object.freeze({
                read:   '.xal-notification-center__bulk-action--read',
                unread: '.xal-notification-center__bulk-action--unread',
                delete: '.xal-notification-center__bulk-action--delete',
            }),

            // Confirmation de suppression de masse
            bulkDeleteConfirm: Object.freeze({
                wrapper: '.xal-notification-center__bulk-confirm',
                count:   '.xal-notification-center__bulk-confirm-counter',
                confirm: '.xal-notification-center__bulk-confirm-delete',
                cancel:  '.xal-notification-center__bulk-confirm-cancel',
            }),
        }),

        /**
         * Classes CSS représentant des états visuels et fonctionnels.
         *
         * Ces classes :
         * - traduisent l'état métier dans l'UI
         * - pilotent l'activation / désactivation des interactions
         * - ne doivent jamais être utilisées comme sélecteurs DOM
         */
        classes: Object.freeze({
            // États de lecture
            read:       'xal-notification--read',
            unread:     'xal-notification--unread',

            // États d'interaction
            busy:       'xal-notification--busy',
            disabled:   'xal-notification-center__bulk-action--disabled',
        }),
    });

    /**
     * Enumération des types d'actions applicables sur une notification.
     *
     * Cette structure centralise les actions possibles afin de :
     * - éviter l'utilisation de chaînes magiques dispersées dans le code
     * - améliorer la lisibilité et la maintenabilité
     * - faciliter l'évolution future (ajout de nouvelles actions)
     *
     * Les clés représentent l'intention métier, tandis que les valeurs
     * correspondent aux identifiants utilisés dans le DOM ou la logique.
     */
    const NotificationActionType = Object.freeze({
        /** Marquer une notification comme lue */
        MARK_AS_READ:   'read',

        /** Marquer une notification comme non lue */
        MARK_AS_UNREAD: 'unread',

        /** Supprimer une notification (action destructive) */
        DELETE:         'delete',
    });

    /**
     * Enumération des phases applicables à une suppression unitaire de notification.
     *
     * Cette structure centralise les phases possibles afin de :
     * - éviter l'utilisation de chaînes magiques dispersées dans le code
     * - améliorer la lisibilité et la maintenabilité
     * - faciliter l'évolution future (ajout de nouvelles phases)
     *
     * Les clés représentent l'intention métier, tandis que les valeurs
     * correspondent aux identifiants utilisés dans le DOM ou la logique.
     */
    const SingleDeletePhase = Object.freeze({
        /** Phase d'annulation : la suppression peut encore être annulée par l'utilisateur */
        UNDO: 'undo',

        /**
         * Phase d'appel API : la suppression est engagée et ne peut plus être annulée.
         * Cette valeur est assignée dans startNotificationDeletionCommit() pour marquer
         * le point de non-retour — elle n'est pas testée directement mais son absence
         * de correspondance dans cancelNotificationDeletion() bloque implicitement l'annulation.
         */
        API: 'api',
    });

    /**
     * Type de l'action de masse actuellement en cours.
     * null = aucune action.
     *
     * @type {'read' | 'unread' | 'delete' | null}
     */
    let _bulkActionType = null;

    /**
     * Verrou applicatif indiquant qu'une action de suppression (unitaire ou de masse) est en cours.
     * Utilisé pour empêcher le déclenchement simultané de plusieurs suppressions concurrentes.
     *
     * @type {boolean}
     */
    let _isDeleteActionLocked = false;

    /**
     * Phase de la suppression unitaire actuellement en cours.
     * null = aucune phase.
     *
     * @type {'undo' | 'api' | null}
     */
    let _singleDeletePhase = null;

    /**
     * Références vers les éléments DOM manipulés par le gestionnaire.
     *
     * Ces éléments :
     * - sont résolus une seule fois à l'initialisation dans init()
     * - servent de points d'entrée pour les mises à jour de l'UI
     * - peuvent être absents selon l'état de l'interface
     *
     * Toute logique dépendante de ces éléments doit vérifier leur existence.
     *
     * @type {HTMLElement|null}
     */
    let notificationsListElt     = null;
    let emptyStateElt            = null;
    let unreadCounterDotElt      = null;
    let bulkDeleteConfirmWrapper = null;
    let toastDeleteElt           = null;
    let toastDeleteProgressElt   = null;

    /**
     * Notification en attente de suppression (undo possible).
     *
     * @type {HTMLElement|null}
     */
    let pendingSingleDeleteItem = null;

    /**
     * Timer associé au délai d'annulation d'une suppression unitaire.
     * Déclenche startNotificationDeletionCommit() à l'expiration du délai.
     *
     * @type {number|null}
     */
    let pendingDeleteTimer = null;

    /**
     * Timer simulant l'appel à l'API de persistance de la suppression unitaire.
     * Déclenche finalizeNotificationDeletion() à l'expiration du délai.
     *
     * @type {number|null}
     */
    let pendingDeleteApiTimer = null;

    /**
     * Timer utilisé pour différer l'exécution d'une suppression de masse.
     * Déclenche la suppression définitive des éléments du DOM à son expiration.
     *
     * @type {number|null}
     */
    let bulkDeleteTimer = null;

    /**
     * Instance Bootstrap Toast utilisée pour permettre l'annulation d'une suppression unitaire.
     * La référence est créée lors de l'affichage du toast et détruite après masquage.
     *
     * @type {import('bootstrap').Toast|null}
     */
    let undoDeleteToast = null;

    /**
     * Abstration nommée qui exécute une fonction après le délai de simulation d'appel API (MOCK_API_DELAY_MS).
     *
     * @param {() => void} fn - Fonction à exécuter après le délai.
     * @returns {number} Identifiant du timer retourné par setTimeout.
     */
    const _delayApi = (fn) => setTimeout(fn, MOCK_API_DELAY_MS);

    /**
     * Abstration nommée qui exécute une fonction après le délai d'annulation (UNDO_DELETE_DELAY_MS).
     *
     * @param {() => void} fn - Fonction à exécuter après le délai.
     * @returns {number} Identifiant du timer retourné par setTimeout.
     */
    const _delayUndo = (fn) => setTimeout(fn, UNDO_DELETE_DELAY_MS);

    /**
     * Réinitialise toutes les références et états transitoires
     * liés au cycle de suppression unitaire.
     *
     * Appelée à l'issue d'une suppression (finalisation ou annulation)
     * pour garantir un état propre avant la prochaine interaction.
     */
    const _resetSingleDeleteState = () => {
        pendingSingleDeleteItem = null;
        pendingDeleteApiTimer   = null;
        undoDeleteToast         = null;
        _singleDeletePhase      = null;
    };

    return {

        //#region Méthodes utilitaires et gestion des états

        /**
         * Indique si une action de suppression (unitaire ou de masse) est en cours.
         *
         * Utilisé comme précondition pour bloquer toute nouvelle action destructive
         * tant que la précédente n'est pas terminée ou annulée.
         *
         * @returns {boolean} true si le verrou de suppression est actif, false sinon.
         */
        isDeleteActionLocked() {
            return _isDeleteActionLocked;
        },

        /**
         * Active le verrou de suppression.
         *
         * Empêche le déclenchement de toute nouvelle action destructive
         * (unitaire ou de masse) tant que ce verrou est actif.
         *
         * Effets de bord :
         * - met à jour la disponibilité des actions de masse
         */
        lockDeleteAction() {
            _isDeleteActionLocked = true;
            this.updateBulkActionsAvailability();
        },

        /**
         * Désactive le verrou de suppression.
         *
         * Libère le verrou posé par lockDeleteAction() et restaure
         * la disponibilité des actions de masse selon les règles métier.
         *
         * Effets de bord :
         * - met à jour la disponibilité des actions de masse
         */
        unlockDeleteAction() {
            _isDeleteActionLocked = false;
            this.updateBulkActionsAvailability();
        },

        /**
         * Indique si une notification est occupée (état "busy").
         *
         * Une notification est considérée comme "busy" lorsqu'elle :
         * - est en cours d'une action (lecture, suppression, etc.)
         * - ne doit plus accepter d'interactions utilisateur
         *
         * @param {HTMLElement} item - Élément notification à tester.
         * @returns {boolean} true si la notification est occupée, false sinon.
         */
        isItemBusy(item) {
            return item?.classList.contains(css.classes.busy);
        },

        /**
         * Applique ou retire l'état "busy" sur une notification.
         *
         * L'état "busy" indique que la notification est temporairement
         * indisponible pour toute interaction utilisateur (action en cours,
         * transition, simulation d'appel API).
         *
         * La classe CSS correspondante permet de :
         * - désactiver visuellement les actions
         * - afficher un feedback visuel (spinner, animation, etc.)
         *
         * @param {HTMLElement} item - Notification concernée.
         * @param {boolean} [value=true] - true pour appliquer l'état "busy", false pour le retirer.
         */
        setItemBusy(item, value = true) {
            item?.classList.toggle(css.classes.busy, value);
        },

        /**
         * Indique si une action de masse est actuellement en cours.
         *
         * Cet état permet de :
         * - bloquer les actions de masse concurrentes
         * - désactiver les contrôles UI associés
         * - refléter visuellement un état global "occupé" sur la liste
         *
         * @returns {boolean} true si une action de masse est en cours, false sinon.
         */
        isBulkActionInProgress() {
            return _bulkActionType !== null;
        },

        /**
         * Applique ou retire l'état visuel "action de masse en cours" sur la liste.
         *
         * Cet état agit comme un verrou visuel et fonctionnel global appliqué
         * à la liste de notifications pendant l'exécution d'une action de masse
         * (lecture, marquage, suppression).
         *
         * @param {boolean} [value=true] - true pour activer l'état, false pour le désactiver.
         */
        setBulkActionVisualState(value = true) {
            notificationsListElt?.classList.toggle(css.classes.busy, value);
        },

        /**
         * Verrouille les actions de masse pour un type donné.
         *
         * Si une action de masse est déjà en cours, le verrouillage est refusé
         * et la méthode retourne false sans modifier l'état.
         *
         * Effets de bord :
         * - applique l'état visuel "busy" sur la liste
         * - met à jour la disponibilité des actions de masse
         *
         * @param {'read' | 'unread' | 'delete'} type - Type de l'action de masse à verrouiller.
         * @returns {boolean} true si le verrouillage a été appliqué, false si une action de masse est déjà en cours.
         */
        lockBulkAction(type) {
            if (this.isBulkActionInProgress()) return false;

            _bulkActionType = type;
            this.setBulkActionVisualState(true);
            this.updateBulkActionsAvailability();

            return true;
        },

        /**
         * Déverrouille toute action de masse en cours.
         *
         * Remet _bulkActionType à null et restaure l'état visuel
         * et la disponibilité des actions de masse.
         *
         * Effets de bord :
         * - retire l'état visuel "busy" de la liste
         * - met à jour la disponibilité des actions de masse
         */
        unlockBulkAction() {
            _bulkActionType = null;
            this.setBulkActionVisualState(false);
            this.updateBulkActionsAvailability();
        },

        //#endregion

        //#region Getters

        /**
         * Retourne la liste actuelle des notifications dans le DOM.
         *
         * Calculée dynamiquement à chaque appel — le DOM est la source de vérité visuelle.
         * Aucune donnée n'est mise en cache : toute modification
         * (ajout, mise à jour, suppression) est immédiatement reflétée.
         *
         * @returns {HTMLElement[]} Tableau des éléments notification.
         */
        items() {
            return Array.from(document.querySelectorAll(css.selectors.notificationItem));
        },

        /**
         * Retourne la liste des notifications actuellement marquées comme non lues.
         *
         * Filtre dynamiquement items() pour ne conserver que les éléments
         * possédant la classe CSS unread.
         *
         * Le DOM reste la source de vérité visuelle : aucun état interne
         * n'est mis en cache, et toute modification est immédiatement reflétée.
         *
         * @returns {HTMLElement[]} Tableau des notifications non lues.
         */
        unreadItems() {
            return this.items().filter(i => i.classList.contains(css.classes.unread));
        },

        /**
         * Retourne la liste des notifications actuellement marquées comme lues.
         *
         * Filtre dynamiquement items() pour ne conserver que les éléments
         * possédant la classe CSS read.
         *
         * Le DOM reste la source de vérité visuelle : aucun état interne
         * n'est mis en cache, et toute modification est immédiatement reflétée.
         *
         * @returns {HTMLElement[]} Tableau des notifications lues.
         */
        readItems() {
            return this.items().filter(i => i.classList.contains(css.classes.read));
        },

        //#endregion

        //#region Actions unitaires

        /**
         * Marque une notification comme lue.
         *
         * Déclenche une action unitaire simulant :
         * - un verrouillage temporaire de la notification
         * - un appel API asynchrone via _delayApi()
         * - une mise à jour de l'état visuel à l'issue du traitement
         *
         * L'action est ignorée si :
         * - la notification est inexistante
         * - une action est déjà en cours sur cet élément (busy)
         * - la notification est déjà marquée comme lue
         *
         * @param {HTMLElement} item - Élément notification à marquer comme lue.
         */
        markNotificationAsRead(item) {
            if (!item || this.isItemBusy(item) || !item.classList.contains(css.classes.unread)) return;

            this.setItemBusy(item);

            _delayApi(() => {
                item.classList.replace(css.classes.unread, css.classes.read);
                this.setItemBusy(item, false);
                this.updateGlobalUIIndicators();
            });
        },

        /**
         * Marque une notification comme non lue.
         *
         * Déclenche une action unitaire simulant :
         * - un verrouillage temporaire de la notification
         * - un appel API asynchrone via _delayApi()
         * - une mise à jour de l'état visuel à l'issue du traitement
         *
         * L'action est ignorée si :
         * - la notification est inexistante
         * - une action est déjà en cours sur cet élément (busy)
         * - la notification est déjà marquée comme non lue
         *
         * @param {HTMLElement} item - Élément notification à marquer comme non lue.
         */
        markNotificationAsUnread(item) {
            if (!item || this.isItemBusy(item) || !item.classList.contains(css.classes.read)) return;

            this.setItemBusy(item);

            _delayApi(() => {
                item.classList.replace(css.classes.read, css.classes.unread);
                this.setItemBusy(item, false);
                this.updateGlobalUIIndicators();
            });
        },

        /**
         * Programme la suppression d'une notification avec possibilité d'annulation.
         *
         * Vérifie les préconditions avant d'initier le cycle de suppression :
         * - l'élément doit exister et ne pas être occupé
         * - aucun verrou de suppression ne doit être actif
         *
         * Si les préconditions sont satisfaites :
         * - active le verrou global des actions de suppression
         * - délègue à startUndoableNotificationDeletion() pour démarrer le cycle
         *
         * La suppression effective n'est pas immédiate :
         * elle sera exécutée automatiquement à l'issue du délai UNDO_DELETE_DELAY_MS
         * si aucune annulation n'est demandée par l'utilisateur.
         *
         * @param {HTMLElement} item - Notification à supprimer.
         */
        scheduleNotificationDeletion(item) {
            if (!item || this.isItemBusy(item) || this.isDeleteActionLocked()) return;

            this.lockDeleteAction();
            this.startUndoableNotificationDeletion(item);
        },

        /**
         * Démarre la phase de suppression unitaire avec possibilité d'annulation (phase UNDO).
         *
         * Cette méthode :
         * - verrouille visuellement la notification concernée
         * - enregistre l'élément comme suppression en attente
         * - configure et affiche le toast d'annulation avec barre de progression
         * - déclenche un compte à rebours via _delayUndo() avant suppression définitive
         *
         * À l'issue du délai, et en l'absence d'annulation explicite,
         * la phase API est automatiquement déclenchée via startNotificationDeletionCommit().
         *
         * @param {HTMLElement} item - Notification concernée par la suppression.
         */
        startUndoableNotificationDeletion(item) {
            this.setItemBusy(item);
            pendingSingleDeleteItem = item;
            _singleDeletePhase      = SingleDeletePhase.UNDO;

            toastDeleteProgressElt?.style.setProperty('--toast-duration', `${UNDO_DELETE_DELAY_MS}ms`);

            undoDeleteToast = new bootstrap.Toast(toastDeleteElt, {
                delay:    UNDO_DELETE_DELAY_MS,
                autohide: true,
            });

            undoDeleteToast.show();

            pendingDeleteTimer = _delayUndo(() => {
                this.startNotificationDeletionCommit(item);
            });
        },

        /**
         * Démarre la phase d'engagement définitif de la suppression (phase API).
         *
         * Appelée automatiquement après l'expiration du délai d'annulation.
         * À partir de ce point, la suppression ne peut plus être annulée.
         *
         * Simule un appel API de persistance via _delayApi(),
         * à l'issue duquel finalizeNotificationDeletion() est appelée
         * pour retirer définitivement l'élément du DOM.
         *
         * @param {HTMLElement} item - Notification concernée par la suppression.
         */
        startNotificationDeletionCommit(item) {
            pendingDeleteTimer = null;
            _singleDeletePhase = SingleDeletePhase.API;

            pendingDeleteApiTimer = _delayApi(() => {
                this.finalizeNotificationDeletion(item);
            });
        },

        /**
         * Finalise la suppression définitive d'une notification.
         *
         * Représente l'ultime étape du cycle de suppression unitaire.
         * À ce stade, la suppression est irréversible du point de vue de l'UI.
         *
         * Effets de bord :
         * - retire l'élément du DOM s'il est encore connecté
         * - annule le timer API résiduel
         * - réinitialise toutes les références et états transitoires via _resetSingleDeleteState()
         * - libère le verrou global des actions destructives
         * - synchronise les indicateurs globaux de l'interface
         *
         * @param {HTMLElement} item - Notification à supprimer définitivement.
         */
        finalizeNotificationDeletion(item) {
            if (item?.isConnected) item.remove();

            clearTimeout(pendingDeleteApiTimer);
            _resetSingleDeleteState();

            this.unlockDeleteAction();
            this.updateGlobalUIIndicators();
        },

        /**
         * Annule la suppression unitaire en attente d'une notification.
         *
         * Déclenchée lorsque l'utilisateur clique sur le bouton d'annulation
         * dans le toast d'undo. N'est effective que si la suppression est
         * encore dans la phase UNDO — toute tentative hors de cette phase est ignorée.
         *
         * Effets de bord :
         * - annule le timer d'undo (pendingDeleteTimer)
         * - réactive visuellement la notification (retire l'état busy)
         * - réinitialise les références de suppression en attente via _resetSingleDeleteState()
         * - libère le verrou global des actions destructives
         * - masque le toast d'annulation
         *
         * Aucune suppression n'est effectuée :
         * la notification reste inchangée dans le DOM.
         */
        cancelNotificationDeletion() {
            if (!pendingSingleDeleteItem) return;
            if (_singleDeletePhase !== SingleDeletePhase.UNDO) return;

            clearTimeout(pendingDeleteTimer);
            pendingDeleteTimer = null;

            this.setItemBusy(pendingSingleDeleteItem, false);

            const toast = undoDeleteToast;
            _resetSingleDeleteState();

            this.unlockDeleteAction();
            toast?.hide();
        },

        //#endregion

        //#region Actions de masse

        /**
         * Marque toutes les notifications non lues comme lues.
         *
         * Déclenche une action de masse simulant :
         * - un verrouillage global de la liste (lockBulkAction)
         * - un appel API asynchrone via _delayApi()
         * - une mise à jour atomique de l'état visuel des notifications concernées
         *
         * L'action est ignorée si :
         * - une suppression est en cours (verrou actif)
         * - aucune notification non lue n'est présente
         *
         * Pendant le traitement :
         * - toutes les notifications ciblées sont marquées comme busy
         * - les actions de masse sont temporairement désactivées
         *
         * À l'issue du traitement :
         * - les notifications sont marquées comme lues
         * - l'état global de l'interface est synchronisé
         */
        markAllUnreadNotificationsAsRead() {
            if (this.isDeleteActionLocked() || !this.lockBulkAction(NotificationActionType.MARK_AS_READ)) return;

            const unreadNotifications = this.unreadItems();

            if (!unreadNotifications.length) {
                this.unlockBulkAction();
                return;
            }

            unreadNotifications.forEach(n => this.setItemBusy(n));

            _delayApi(() => {
                unreadNotifications.forEach(n => {
                    n.classList.replace(css.classes.unread, css.classes.read);
                    this.setItemBusy(n, false);
                });

                this.unlockBulkAction();
                this.updateGlobalUIIndicators();
            });
        },

        /**
         * Marque toutes les notifications lues comme non lues.
         *
         * Déclenche une action de masse simulant :
         * - un verrouillage global de la liste (lockBulkAction)
         * - un appel API asynchrone via _delayApi()
         * - une mise à jour atomique de l'état visuel des notifications concernées
         *
         * L'action est ignorée si :
         * - une suppression est en cours (verrou actif)
         * - aucune notification lue n'est présente
         *
         * Pendant le traitement :
         * - toutes les notifications ciblées sont marquées comme busy
         * - les actions de masse sont temporairement désactivées
         *
         * À l'issue du traitement :
         * - les notifications sont marquées comme non lues
         * - l'état global de l'interface est synchronisé
         */
        markAllReadNotificationsAsUnread() {
            if (this.isDeleteActionLocked() || !this.lockBulkAction(NotificationActionType.MARK_AS_UNREAD)) return;

            const readNotifications = this.readItems();

            if (!readNotifications.length) {
                this.unlockBulkAction();
                return;
            }

            readNotifications.forEach(n => this.setItemBusy(n));

            _delayApi(() => {
                readNotifications.forEach(n => {
                    n.classList.replace(css.classes.read, css.classes.unread);
                    this.setItemBusy(n, false);
                });

                this.unlockBulkAction();
                this.updateGlobalUIIndicators();
            });
        },

        /**
         * Affiche la confirmation de suppression de masse.
         *
         * Méthode strictement visuelle — aucune suppression n'est déclenchée
         * et aucun état métier n'est modifié.
         *
         * Elle :
         * - vérifie qu'aucune action destructive n'est déjà en cours
         * - met à jour le compteur affichant le nombre de notifications concernées
         * - rend visible le bloc de confirmation
         *
         * La suppression effective ne pourra être exécutée
         * qu'après validation explicite de l'utilisateur via confirmAndExecuteBulkDeletion().
         */
        showBulkDeleteConfirmation() {
            if (this.isDeleteActionLocked() || !bulkDeleteConfirmWrapper) return;

            bulkDeleteConfirmWrapper
                .querySelector(css.selectors.bulkDeleteConfirm.count)
                .textContent = this.items().length;

            bulkDeleteConfirmWrapper.hidden = false;
        },

        /**
         * Confirme et exécute la suppression de masse des notifications.
         *
         * Représente le point de non-retour du processus de suppression de masse,
         * après validation explicite de l'utilisateur.
         * Aucune annulation n'est possible après l'appel de cette méthode.
         *
         * Déroulé :
         * - vérifie qu'aucune autre action destructive n'est en cours
         * - verrouille toutes les actions (unitaires et de masse)
         * - masque le bloc de confirmation
         * - place chaque notification en état busy
         * - simule un appel API via _delayApi()
         * - supprime définitivement toutes les notifications du DOM
         * - libère les verrous et synchronise l'interface
         */
        confirmAndExecuteBulkDeletion() {
            if (this.isDeleteActionLocked() || !this.lockBulkAction(NotificationActionType.DELETE)) return;

            const items = this.items();

            if (!items.length) {
                this.unlockBulkAction();
                return;
            }

            this.lockDeleteAction();
            this.hideBulkDeleteConfirmation();

            items.forEach(item => this.setItemBusy(item));

            bulkDeleteTimer = _delayApi(() => {
                items.forEach(item => { if (item?.isConnected) item.remove(); });

                bulkDeleteTimer = null;

                this.unlockDeleteAction();
                this.unlockBulkAction();
                this.updateGlobalUIIndicators();
            });
        },

        //#endregion

        //#region Gestion de l'UI

        /**
         * Masque la confirmation contextuelle de suppression de masse.
         *
         * Méthode strictement visuelle :
         * - aucune suppression n'est déclenchée
         * - aucun état métier ou logique n'est modifié
         *
         * Appelée dans les cas suivants :
         * - annulation explicite par l'utilisateur (bouton Annuler)
         * - fermeture du offcanvas
         * - après confirmation et exécution d'une suppression de masse
         */
        hideBulkDeleteConfirmation() {
            if (bulkDeleteConfirmWrapper) bulkDeleteConfirmWrapper.hidden = true;
        },

        /**
         * Met à jour la disponibilité des actions de masse selon les règles métier.
         *
         * Méthode strictement visuelle — ne modifie que les classes CSS des contrôles
         * et ne déclenche aucune action métier.
         *
         * Parcours unique via tableau de règles, supprimant le double
         * parcours (désactivation globale puis règles spécifiques) de l'implémentation précédente.
         *
         * Capture unique des listes DOM en début de méthode pour éviter
         * les appels DOM redondants au sein d'une même opération de mise à jour.
         *
         * Règles appliquées :
         * - toutes les actions sont désactivées si une suppression ou une action de masse est en cours
         * - "tout marquer comme lu"  : actif uniquement s'il existe des notifications non lues
         * - "tout marquer comme non lu" : actif uniquement s'il existe des notifications lues
         * - "tout supprimer" : actif uniquement s'il existe des notifications
         */
        updateBulkActionsAvailability() {
            const disabled    = this.isDeleteActionLocked() || this.isBulkActionInProgress();
            const allItems    = disabled ? [] : this.items();
            const unreadCount = disabled ? 0  : this.unreadItems().length;
            const readCount   = disabled ? 0  : this.readItems().length;

            const rules = [
                { selector: css.selectors.bulkActions.read,   isDisabled: disabled || unreadCount === 0 },
                { selector: css.selectors.bulkActions.unread, isDisabled: disabled || readCount === 0 },
                { selector: css.selectors.bulkActions.delete, isDisabled: disabled || allItems.length === 0 },
            ];

            rules.forEach(({ selector, isDisabled }) => {
                document.querySelector(selector)?.classList.toggle(css.classes.disabled, isDisabled);
            });
        },

        /**
         * Synchronise l'ensemble des indicateurs globaux de l'interface avec l'état courant du DOM.
         *
         * Le DOM est considéré comme la source de vérité visuelle.
         * Méthode strictement visuelle — ne modifie aucun état métier
         * et ne déclenche aucune action utilisateur.
         *
         * Capture unique de items() et unreadItems() en début de méthode
         * pour éviter les appels DOM redondants au sein d'une même synchronisation.
         *
         * Met à jour :
         * - les compteurs numériques de notifications non lues et leur visibilité
         * - l'indicateur visuel global (dot)
         * - l'état "aucune notification" (liste vide)
         * - la disponibilité des actions de masse
         *
         * Doit être appelée après toute modification du contenu ou de l'état des notifications.
         */
        updateGlobalUIIndicators() {
            const allItems    = this.items();
            const unreadCount = this.unreadItems().length;

            // Mise à jour des compteurs numériques et de leur visibilité
            document.querySelectorAll(css.selectors.badgeCounters).forEach(badge => {
                badge.textContent = unreadCount;
                badge.closest(css.selectors.badgeCountersWrapper).hidden = unreadCount === 0;
            });

            // Indicateur visuel global (dot)
            unreadCounterDotElt?.toggleAttribute('hidden', unreadCount === 0);

            // État "aucune notification"
            emptyStateElt?.toggleAttribute('hidden', allItems.length > 0);

            // Mise à jour des règles de disponibilité des actions de masse
            this.updateBulkActionsAvailability();
        },

        //#endregion

        //#region Gestion des événements

        /**
         * Construit la table de dispatch des actions utilisateur.
         *
         * Retourne une structure déclarative associant des sélecteurs CSS
         * à des handlers d'action. Centralise le routage de toutes les interactions :
         * - actions unitaires sur une notification
         * - actions de masse sur la liste
         * - confirmations contextuelles
         * - annulation d'une suppression (undo)
         *
         * Aucun listener n'est attaché ici — cette méthode décrit uniquement
         * les correspondances entre l'UI et les intentions métier.
         * La résolution effective est effectuée par handleClickAction().
         *
         * Type de retour précisé en {Array<[string, () => void]>}
         * au lieu du générique {Array<[string, Function]>}.
         *
         * @param {HTMLElement} notificationItem - Notification de référence pour les actions unitaires.
         * @returns {Array<[string, () => void]>} Liste de paires [sélecteur CSS, handler].
         */
        createActionDispatchMap(notificationItem) {
            return [
                // Actions unitaires
                [css.selectors.singleActions.read,   () => this.markNotificationAsRead(notificationItem)],
                [css.selectors.singleActions.unread, () => this.markNotificationAsUnread(notificationItem)],
                [css.selectors.singleActions.delete, () => this.scheduleNotificationDeletion(notificationItem)],

                // Actions de masse
                [css.selectors.bulkActions.read,   () => this.markAllUnreadNotificationsAsRead()],
                [css.selectors.bulkActions.unread, () => this.markAllReadNotificationsAsUnread()],
                [css.selectors.bulkActions.delete, () => this.showBulkDeleteConfirmation()],

                // Confirmation contextuelle de suppression de masse
                [css.selectors.bulkDeleteConfirm.confirm, () => this.confirmAndExecuteBulkDeletion()],
                [css.selectors.bulkDeleteConfirm.cancel,  () => this.hideBulkDeleteConfirmation()],

                // Annulation de la suppression unitaire (toast undo)
                [css.selectors.toastUndoBtn, () => this.cancelNotificationDeletion()],
            ];
        },

        /**
         * Résout et exécute l'action associée à un clic sur l'interface des notifications.
         *
         * Parcourt la table de dispatch retournée par createActionDispatchMap() et exécute
         * le premier handler dont le sélecteur correspond à la cible du clic (ou l'un de ses parents).
         *
         * Une seule action est exécutée par clic : la résolution s'arrête
         * dès la première correspondance trouvée.
         *
         * @param {MouseEvent} event - Événement de clic capturé.
         * @param {HTMLElement} notificationItem - Notification de référence pour les actions unitaires.
         */
        handleClickAction(event, notificationItem) {
            for (const [cssSelector, actionHandler] of this.createActionDispatchMap(notificationItem)) {
                // Vérifie si la cible du clic (ou un de ses parents) correspond au sélecteur de l'action
                if (event.target.closest(cssSelector)) {
                    actionHandler();

                    // Stoppe la résolution après la première action trouvée
                    return;
                }
            }
        },

        /**
         * Initialise les gestionnaires d'événements du centre de notifications.
         *
         * Met en place une délégation d'événements globale sur document,
         * ce qui permet à un seul listener de gérer toutes les interactions
         * (actions unitaires, de masse, confirmations, annulations).
         *
         * Attache également un listener sur l'offcanvas pour nettoyer les états
         * transitoires à sa fermeture (timers actifs, confirmations visibles).
         *
         * Cette méthode doit être appelée une seule fois lors de l'initialisation.
         */
        initEventHandlers() {
            // Délégation globale des clics
            document.addEventListener('click', event => {
                // Notification éventuellement concernée par l'action
                const notificationItem = event.target.closest(css.selectors.notificationItem);

                // Blocage des interactions unitaires si la notification est occupée.
                // Les actions globales (masse, confirmation, undo) restent autorisées
                // lorsque notificationItem est null.
                if (notificationItem && this.isItemBusy(notificationItem)) return;

                this.handleClickAction(event, notificationItem);
            });

            // Nettoyage des états transitoires à la fermeture du offcanvas :
            // - annulation des timers actifs
            // - réinitialisation des confirmations contextuelles
            document.querySelector(css.selectors.offcanvas)
                ?.addEventListener('hidden.bs.offcanvas', () => {
                    this.cancelAllDeleteActions();
                });
        },

        /**
         * Annule les actions de suppression non confirmées lors de la fermeture du offcanvas.
         *
         * Règles appliquées :
         * - annule uniquement les états transitoires (phase UNDO)
         * - ne rollback jamais une suppression déjà confirmée (phase API ou bulk confirmé)
         * - nettoie les timers non engagés
         * - masque les confirmations visibles non validées
         * - restaure un état UI cohérent
         *
         * Effets de bord :
         * - retire l'état busy de la notification en attente (si phase UNDO)
         * - masque le toast d'annulation (si phase UNDO)
         * - libère le verrou de suppression (si phase UNDO)
         * - masque la confirmation de suppression de masse (si non confirmée)
         * - synchronise les indicateurs globaux de l'interface
         */
        cancelAllDeleteActions() {
            // Annulation d'une suppression unitaire uniquement si elle est encore dans la phase d'undo
            if (_singleDeletePhase === SingleDeletePhase.UNDO) {
                clearTimeout(pendingDeleteTimer);
                pendingDeleteTimer = null;

                this.setItemBusy(pendingSingleDeleteItem, false);

                const toast = undoDeleteToast;
                _resetSingleDeleteState();

                toast?.hide();
                this.unlockDeleteAction();
            }

            // Masquage d'une confirmation de suppression de masse si affichée mais non confirmée.
            // Si une suppression de masse est confirmée, on ne touche PAS au bulkDeleteTimer :
            // l'opération doit aller à son terme.
            if (!this.isDeleteActionLocked() && bulkDeleteConfirmWrapper) {
                this.hideBulkDeleteConfirmation();
            }

            // Nettoyage visuel global
            this.updateGlobalUIIndicators();
        },

        //#endregion

        //#region Initialisation

        /**
         * Initialise le composant centre de notifications.
         *
         * Point d'entrée unique appelé depuis xalise.js au DOMContentLoaded.
         *
         * Séquence d'initialisation :
         * 1. Résout et stocke les références DOM utilisées par le gestionnaire
         * 2. Attache le listener hidden.bs.toast pour réinitialiser la barre de progression
         * 3. Initialise la délégation d'événements via initEventHandlers()
         * 4. Synchronise l'état initial de l'interface via updateGlobalUIIndicators()
         */
        init() {
            // Résolution des références DOM
            notificationsListElt     = document.querySelector(css.selectors.notificationsList);
            emptyStateElt            = document.querySelector(css.selectors.emptyItem);
            unreadCounterDotElt      = document.querySelector(css.selectors.badgeCounterDot);
            bulkDeleteConfirmWrapper = document.querySelector(css.selectors.bulkDeleteConfirm.wrapper);
            toastDeleteElt           = document.querySelector(css.selectors.toastUndo);
            toastDeleteProgressElt   = document.querySelector(css.selectors.toastProgress);

            // Réinitialise la durée d'animation de la barre de progression
            // lorsque le toast est entièrement masqué (événement Bootstrap hidden.bs.toast),
            // afin d'éviter toute persistance d'état visuel lors d'un affichage ultérieur.
            toastDeleteElt?.addEventListener('hidden.bs.toast', () => {
                toastDeleteProgressElt?.style.removeProperty('--toast-duration');
            });

            this.initEventHandlers();
            this.updateGlobalUIIndicators();
        },

        //#endregion
    };
})();
/**
 * API de gestion d'une modale basée sur Bootstrap Modal, avec configuration
 * dynamique du contenu et des boutons.
 * 
 * Une seule instance de modale est présente dans le DOM à tout moment.
 * Elle est réinitialisée à chaque appel à `show()`, garantissant un état propre 
 * et évitant les fuites mémoire liées à des instances Bootstrap obsolètes.
 * 
 * @requires XalConstants
 * 
 * @namespace XalDialog
 */
const XalDialog = (() => {
    /**
     * @typedef {Object} ButtonOptions      Options de configuration d'un bouton de la modale.
     * @property {string}   label           Libellé du bouton.
     * @property {string[]} [cssClasses=[]] Classes CSS Bootstrap à appliquer.
     *                                      Permet de combiner plusieurs classes (ex : ['btn-small', 'btn-primary']).
     * @property {string}   [icon]          Classe Bootstrap Icons à appliquer sur l'icône (ex : 'bi-trash').
     *                                      L'icône est positionnée avant le libellé.
     * @property {Function} [onClick]       Callback exécuté au clic.
     */

    /**
     * @typedef {Object} DialogOptions                      Options de configuration de la modale.
     * @property {string}           title                   Titre affiché dans l'en-tête.
     * @property {string}           message                 Contenu affiché dans le corps.
     * @property {string[]}         [modalClasses=[]]       Classes CSS à appliquer à la modale.
     * @property {ButtonOptions[]}  [buttons=[]]            Liste des boutons à afficher
     * @property {boolean}          [dismissible=true]      Si `true`, la modale peut être fermée via la touche d'échappement ou le clic extérieur.
     * @property {boolean}          [showCloseButton=true]  Si `true`, le bouton de fermeture présent dans l'en-tête est affiché.
     * @property {boolean}          [allowHtml=false]       Si `true`, le contenu du message est interprété comme du HTML.
     *                                                      Sinon, il est injecté en tant que texte pour éviter les risques de XSS.
     */
    
    /**
     * Référence vers le template HTML de la modale.
     *
     * @private
     * 
     * @type {HTMLTemplateElement|null}
     */
    let _modalTemplate = null;

    /**
     * Référence vers le template HTML d'un bouton.
     *
     * @private
     * 
     * @type {HTMLTemplateElement|null}
     */
    let _buttonTemplate = null;

    /**
     * Référence vers le template HTML de l'icône affichée dans les boutons.
     *
     * @private
     * 
     * @type {HTMLTemplateElement|null}
     */
    let _iconTemplate = null;

    /**
     * Élément DOM de la modale actuellement insérée dans le DOM.
     * Null si aucune modale n'est affichée.
     *
     * @private
     * 
     * @type {HTMLElement|null}
     */
    let _modalElement = null;

    /**
     * Instance Bootstrap Modal active.
     * Null si aucune modale n'est affichée.
     *
     * @private
     * 
     * @type {bootstrap.Modal|null}
     */
    let _modalInstance = null;

    /**
     * Nettoie la modale après sa fermeture.
     *
     * Libère les ressources associées à l'instance Bootstrap et
     * supprime l'élément du DOM, puis réinitialise les références internes.
     *
     * Cette méthode garantit l'absence de fuite mémoire et un état propre
     * avant une prochaine ouverture de la modale.
     * 
     * @private
     * 
     * @returns {void}
     */
    const _cleanup = () => {
        _modalInstance?.dispose();
        _modalElement?.remove();
        _modalInstance = null;
        _modalElement  = null;
    };

    /**
     * Crée un bouton de modale à partir du template et l'insère dans le conteneur.
     *
     * Gère :
     * - l'application des classes CSS
     * - l'ajout d'une icône optionnelle (via template)
     * - l'injection sécurisée du libellé (prévention XSS)
     * - l'exécution du callback associé
     * - la fermeture automatique de la modale après clic
     *
     * @private
     *
     * @param {HTMLElement}  container      Conteneur DOM recevant le bouton (footer de la modale).
     * @param {ButtonOptions}   buttonOptions   Configuration du bouton
     *
     * @returns {void}
     */
    const _createButton = (container, buttonOptions) => {
        if (!_buttonTemplate) {
            console.warn('[XalDialog] Template de bouton non trouvé.');
            return;
        }

        const clone     = document.importNode(_buttonTemplate.content, true);
        const buttonElt = clone.querySelector(XalConstants.cssQueries.dialog.button);

        if (!buttonElt) return;

        // Application des classes CSS Bootstrap
        if (buttonOptions.cssClasses && buttonOptions.cssClasses.length > 0) {
            buttonElt.classList.add(...buttonOptions.cssClasses);
        }
        else {
            buttonElt.classList.add(XalConstants.cssClasses.bootstrapBtn.secondary);
        }

        // Icône positionnée avant le libellé.
        if (buttonOptions.icon && _iconTemplate) {
            const iconClone = document.importNode(_iconTemplate.content, true);
            const iconElt   = iconClone.querySelector(XalConstants.cssQueries.dialog.icon);

            if (iconElt) {
                iconElt.classList.add(buttonOptions.icon);
                buttonElt.appendChild(iconClone);
            }
        }

        // Injection du libellé dans un noeud texte pour éviter tout XSS
        buttonElt.appendChild(document.createTextNode(buttonOptions.label));

        // La modale est toujours fermée après exécution du callback
        buttonElt.addEventListener('click', async () => {
            try {
                if (typeof buttonOptions.onClick === 'function') {
                    await buttonOptions.onClick();
                }
            } finally {
                api.hide();
            }
        });

        container.appendChild(clone);
    };

    const api = {
        /**
         * Initialise le composant en résolvant les templates HTML.
         * 
         * L'idempotence est assurée : si le template de la modale a déjà été résolu, la méthode ne fait rien.
         * 
         * @public
         * 
         * @throws {Error} Si le template de la modale, du bouton ou de l'icône n'est pas trouvé dans le DOM.
         * 
         * @returns {void}
         */
        init() {
            if (_modalTemplate) return;

            _modalTemplate = document.getElementById(XalConstants.elementIds.dialog.template);

            if (!_modalTemplate) {
                throw new Error(`[XalDialog] Template "${XalConstants.elementIds.dialog.template}" non trouvé dans le DOM.`);
            }

            _buttonTemplate = document.getElementById(XalConstants.elementIds.dialog.buttonTemplate);

            if (!_buttonTemplate) {
                throw new Error(`[XalDialog] Template "${XalConstants.elementIds.dialog.buttonTemplate}" non trouvé dans le DOM.`);
            }

            _iconTemplate = document.getElementById(XalConstants.elementIds.dialog.iconTemplate);

            if (!_iconTemplate) {
                throw new Error(`[XalDialog] Template "${XalConstants.elementIds.dialog.iconTemplate}" non trouvé dans le DOM.`);
            }
        },

        /**
         * Affiche la modale avec la configuration fournie.
         *
         * Gère :
         * - le clonage et l’initialisation du template
         * - l’injection du titre et du contenu (HTML ou texte sécurisé)
         * - l’ajout de classes CSS personnalisées
         * - la génération dynamique des boutons
         * - la configuration du comportement (dismissible, bouton de fermeture)
         * - l’instanciation et l’affichage de la modale Bootstrap
         * - le focus automatique sur le premier bouton
         * - le nettoyage automatique après fermeture
         *
         * Nettoie systématiquement toute modale existante avant affichage.
         *
         * @public
         *
         * @param {DialogOptions} config    Configuration de la modale.
         *
         * @returns {void}
         */
        show(config = {}) {
            if (!_modalTemplate) {
                console.warn('[XalDialog] La méthode d\'initialisation doit être appelée avant utilisation.');
                return;
            }

            const {
                title,
                message,
                modalClasses    = [],
                buttons         = [],
                dismissible     = true,
                showCloseButton = true,
                allowHtml       = false,
            } = config;

            // Nettoyage de toute modale précédente
            this.hide();

            // Clonage du template
            const clone   = document.importNode(_modalTemplate.content, true);
            _modalElement = clone.querySelector(XalConstants.cssQueries.dialog.container);

            if (!_modalElement) {
                console.warn('[XalDialog] Template invalide : élément modale introuvable.');
                return;
            }

            // Affichage conditionnel du bouton de fermeture dans l'en-tête
            if (!showCloseButton) {
                const closeBtn = _modalElement.querySelector(XalConstants.cssQueries.dialog.closeButton);
                
                if (closeBtn) { 
                    closeBtn.toggleAttribute(XalConstants.attributeNames.hidden, true);
                }
            }

            // Ajout des classes sur la modale
            if (modalClasses.length > 0) {
                const modalDialog = _modalElement.querySelector(XalConstants.cssQueries.dialog.dialog);

                if (modalDialog) {
                    modalDialog.classList.add(...modalClasses);
                }
            }

            // Injection du titre et du contenu
            const titleElt = _modalElement.querySelector(XalConstants.cssQueries.dialog.title);
            const bodyElt  = _modalElement.querySelector(XalConstants.cssQueries.dialog.body);

            if (titleElt) titleElt.textContent = title;

            if (bodyElt) {
                if (allowHtml) {
                    bodyElt.innerHTML = message;
                } else {
                    bodyElt.textContent = message;
                }
            }

            // Génération des boutons dans le pied de la modale
            const footerElt = _modalElement.querySelector(XalConstants.cssQueries.dialog.footer);

            if (footerElt) {
                if (!buttons.length) {
                    _createButton(footerElt, {
                        label: 'Fermer',
                        icon: XalConstants.cssClasses.bootstrapIcons.xCircleFill,
                        cssClasses: [XalConstants.cssClasses.bootstrapBtn.secondary],
                    });
                }
                else {
                    buttons.forEach(btnConfig => _createButton(footerElt, btnConfig));
                }
            }

            // Insertion dans le DOM
            document.body.appendChild(_modalElement);

            // Création de l'instance Bootstrap Modal
            _modalInstance = new bootstrap.Modal(_modalElement, {
                backdrop: dismissible ? true : 'static',
                keyboard: dismissible,
            });

            // Nettoyage automatique après fermeture de l'animation Bootstrap
            _modalElement.addEventListener('hidden.bs.modal', () => {
                _cleanup();
            }, { once: true });

            // Focus sur le premier bouton après affichage de la modale
            _modalElement.addEventListener('shown.bs.modal', () => {
                const btn = _modalElement.querySelector('button');
                btn?.focus();
            });

            _modalInstance.show();
        },

        /**
         * Ferme la modale si elle est actuellement affichée.
         *
         * Déclenche la fermeture via l'API Bootstrap, ce qui entraîne
         * l'événement `hidden.bs.modal` et le nettoyage associé.
         *
         * Aucun effet si aucune instance de modale n'est active.
         *
         * @public
         *
         * @returns {void}
         */
        hide() {
            if (!_modalInstance) return;

            _modalInstance.hide();
        },

        /**
         * Indique si la modale est actuellement visible.
         *
         * Utilise l'API Bootstrap pour récupérer l'instance associée à l'élément
         * et vérifie son état interne (`_isShown`).
         *
         * Plus fiable qu’un test sur la classe CSS `show`, car reflète l’état réel
         * du composant Bootstrap (y compris pendant les transitions).
         *
         * Retourne `false` si aucune instance n'est initialisée.
         *
         * @public
         *
         * @returns {boolean} `true` si la modale est affichée, `false` sinon.
         */
        isVisible() {
            if (!_modalElement) return false;

            const instance = bootstrap.Modal.getInstance(_modalElement);

            return instance?._isShown ?? false;
        },
    };

    return api;
})();

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Initialisation
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

document.addEventListener('DOMContentLoaded', () => {
    XalLoaderNav.init();
    XalLoaderPlaceholder.init();
    XalLoaderToast.init();
    XalLoaderOverlay.init();
    XalTooltips.init();
    XalSidebar.init();
    XalNotifications.init();
    XalDialog.init();
    XalToast.init();
});