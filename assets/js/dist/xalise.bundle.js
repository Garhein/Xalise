/**
 * Constantes globales de l'application Xalise.
 *
 * Centralise l'ensemble des valeurs utilisées dynamiquement par le JS :
 * - attributs ARIA
 * - attributs data-xal-*
 * - valeurs d'actions
 * - sélecteurs CSS
 * - identifiants DOM
 * - classes CSS
 *
 * Toute modification d'une valeur doit être répercutée ici uniquement.
 *
 * @constant
 * @type {Readonly<Object>}
 */
const XalConstants = Object.freeze({

    /**
     * Noms des attributs ARIA manipulés par le JS.
     *
     * @type {Readonly<Record<string, string>>}
     */
    ariaNames: Object.freeze({
        expanded:   'aria-expanded',
        hidden:     'aria-hidden',
    }),

    /**
     * Noms des attributs.
     *
     * @type {Readonly<Record<string, string>>}
     */
    attributeNames: Object.freeze({
        xalAction:  'data-xal-action',
        xalTarget:  'data-xal-target',
        tooltip:    'data-tooltip',
    }),

    /**
     * Valeurs attendues des attributs.
     *
     * @type {Readonly<Record<string, string>>}
     */
    attributeValues: Object.freeze({
        sidebarToggleSubmenu: 'toggle-submenu',
    }),

    /**
     * Identifiants des éléments uniques du DOM.
     * Utilisés avec getElementById.
     *
     * @type {Readonly<Record<string, string>>}
     */
    elementIds: Object.freeze({
        layout:                     'xal-id-application-layout',
        sidebar:                    'xal-id-sidebar',
        btnToggleSidebar:           'xal-id-btn-toggle-sidebar',
        notificationCenter:         'xal-id-notification-center',
        notificationToastUndo:      'xal-id-notification-toast-undo',
        loaderNavbar:               'xal-id-loader-nav',
        loaderToast:                'xal-id-loader-toast',
        loaderPlaceholderTemplate:  'xal-id-loader-placeholder-template',
        loaderOverlay:              'xal-id-loader-overlay',
        toastTemplateSuccess:       'xal-id-toast-template-success',
        toastTemplateError:         'xal-id-toast-template-error',
        toastTemplateWarning:       'xal-id-toast-template-warning',
        toastTemplateInfo:          'xal-id-toast-template-info',
    }),

    /**
     * Classes CSS ajoutées ou supprimées dynamiquement via classList.
     *
     * @type {Readonly<Record<string, string>>}
     */
    cssClasses: Object.freeze({
        sidebarCollapsed:           'xal-application-layout--sidebar-collapsed',
        loaderPlacerholderActive:   'xal-loader-placeholder--active'
    }),

    /**
     * Sélecteurs CSS utilisés dans querySelector et querySelectorAll.
     *
     * Note : les sélecteurs dérivés d'autres constantes sont écrits en dur
     * car les propriétés d'un objet littéral ne peuvent pas se référencer
     * entre elles lors de la définition.
     *
     * @type {Readonly<Record<string, string>>}
     */
    cssQueries: Object.freeze({
        tooltip:                        `[data-bs-toggle="tooltip"]`,
        toastContainer:                 `.toast-container`,
        loaderToastMessage:             `.xal-loader-toast__message`,
        loaderPlaceholder:              `.xal-loader-placeholder`,
        loaderOverlayMessage:           `.xal-loader-overlay__message`,
        toast:                          `.xal-toast`,
        toastMessage:                   `.xal-toast__message`,

        // Sidebar
        sidebarSubmenuToggleBtn:        `[data-xal-action="toggle-submenu"]`,
        sidebarSubmenu:                 `.xal-sidebar__submenu`,
        sidebarActiveNavLink:           `.nav-link.active`,
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
 * Gestion de la barre de progression globale.
 *
 * Fournit un retour visuel lors des appels API en affichant
 * une barre de progression indéterminée.
 *
 * Supporte les appels concurrents via un compteur interne :
 * la barre reste visible tant qu'au moins un appel est en cours.
 *
 * Dépendances :
 * - XalConstants.js → XalConstants
 *
 * @namespace XalLoaderNav
 * @author Xavier VILLEMIN
 */
const XalLoaderNav = (() => {
    /**
     * Nombre d'appels API actuellement en cours.
     * La barre est masquée uniquement quand ce compteur atteint 0.
     *
     * @type {number}
     */
    let _pendingCount = 0;

    /**
     * Référence vers l'élément DOM de la barre de progression.
     * Initialisée dans init().
     *
     * @type {HTMLElement|null}
     */
    let _barElt = null;

    /**
     * Met à jour la visibilité de la barre selon le compteur courant.
     *
     * - _pendingCount > 0 : barre visible
     * - _pendingCount = 0 : barre masquée
     */
    const _update = () => {
        if (!_barElt) return;

        const isActive = _pendingCount > 0;

        _barElt.setAttribute(XalConstants.ariaNames.hidden, String(!isActive));
    };

    return {
        /**
         * Signale le début d'un appel API.
         *
         * Incrémente le compteur et affiche la barre si elle était masquée.
         * Peut être appelé plusieurs fois en parallèle.
         */
        start() {
            _pendingCount++;
            _update();
        },

        /**
         * Signale la fin d'un appel API.
         *
         * Décrémente le compteur et masque la barre si plus aucun appel
         * n'est en cours. Ne descend jamais en dessous de 0.
         */
        stop() {
            _pendingCount = Math.max(0, _pendingCount - 1);
            _update();
        },

        /**
         * Réinitialise le compteur et masque immédiatement la barre.
         *
         * Utile en cas d'erreur globale ou de navigation pour garantir
         * un état propre sans attendre la fin de tous les appels.
         */
        reset() {
            _pendingCount = 0;
            _update();
        },

        /**
         * Initialise le composant.
         *
         * Résout la référence DOM et garantit l'état initial masqué.
         */
        init() {
            _barElt = document.getElementById(XalConstants.elementIds.loaderNavbar);
        },
    };
})();
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

            el.querySelector(XalConstants.cssQueries.loaderPlaceholder)?.remove();
        },

        /**
         * Indique si un placeholder est actuellement actif sur une zone.
         *
         * @param {string|HTMLElement} target - Sélecteur CSS ou élément DOM cible.
         * @returns {boolean} true si le placeholder est présent, false sinon.
         */
        isActive(target) {
            const el = _resolveTarget(target);
            return !!el?.querySelector(XalConstants.cssQueries.loaderPlaceholder);
        },

        /**
         * Initialise le composant.
         *
         * Résout la référence au template HTML depuis le DOM statique.
         * Doit être appelé une seule fois depuis xalise.js au DOMContentLoaded,
         * avant tout appel à show().
         */
        init() {
            _templateElt = document.getElementById(XalConstants.elementIds.loaderPlaceholderTemplate);
        },
    };
})();
/**
 * Gestion du toast de chargement pour les opérations longues.
 *
 * Affiche un toast Bootstrap non dismissible en bas à droite
 * avec un spinner et un message, pendant une opération longue
 * (export, génération de rapport, traitement batch, etc.).
 * 
 * Le toast reste affiché jusqu'à l'appel explicite de hide() et
 * affiche un spinner de chargement, et non une action à effectuer
 *
 * Le toast est créé dynamiquement dans le DOM lors du premier
 * appel à show() et réutilisé pour les appels suivants.
 *
 * Dépendances :
 * - XalConstants.js → XalConstants
 *
 * @namespace XalLoaderToast
 * @author Xavier VILLEMIN
 */
const XalLoaderToast = (() => {
    /**
     * Message affiché par défaut si aucun message n'est fourni à show().
     *
     * @type {string}
     */
    const DEFAULT_MESSAGE = 'Chargement en cours…';

    /**
     * Instance Bootstrap Toast active.
     * Créée lors du premier appel à show() et détruite dans hide().
     *
     * @type {bootstrap.Toast|null}
     */
    let _toastInstance = null;

    /**
     * Élément DOM du toast.
     * Créé une seule fois et réutilisé.
     *
     * @type {HTMLElement|null}
     */
    let _toastElt = null;

    /**
     * Élément DOM du message à l'intérieur du toast.
     *
     * @type {HTMLElement|null}
     */
    let _messageElt = null;

    return {
        /**
         * Affiche le toast de chargement avec le message fourni.
         *
         * Crée l'élément DOM si c'est le premier appel.
         * Met à jour le message si le toast est déjà visible.
         *
         * @param {string} [message] - Message à afficher. Utilise DEFAULT_MESSAGE si absent.
         */
        show(message = DEFAULT_MESSAGE) {
            if (!_toastElt) {
                _createToastElement();
            }

            // Mise à jour du message
            if (_messageElt) {
                _messageElt.textContent = message;
            }

            // Création ou réutilisation de l'instance Bootstrap Toast
            if (!_toastInstance) {
                _toastInstance = new bootstrap.Toast(_toastElt, {
                    autohide: false,
                });
            }

            _toastInstance.show();
        },

        /**
         * Masque le toast de chargement et libère l'instance Bootstrap
         * après la fin de l'animation de disparition.
         *
         * dispose() est appelé via l'événement hidden.bs.toast pour éviter
         * une erreur "this._element is null" causée par l'appel synchrone
         * de dispose() avant la fin de l'animation Bootstrap.
         *
         * Sans effet si le toast n'est pas affiché.
         */
        hide() {
            if (!_toastInstance) return;

            // Nettoyage différé après la fin de l'animation
            _toastElt.addEventListener('hidden.bs.toast', () => {
                _toastInstance?.dispose();
                _toastInstance = null;
            }, { once: true });

            _toastInstance.hide();
        },

        /**
         * Indique si le toast de chargement est actuellement affiché.
         *
         * @returns {boolean} true si le toast est visible, false sinon.
         */
        isVisible() {
            return _toastInstance !== null;
        },

        /**
         * Met à jour le message affiché sans masquer ni réafficher le toast.
         *
         * Sans effet si le toast n'est pas affiché.
         *
         * @param {string} message - Nouveau message à afficher.
         */
        updateMessage(message) {
            if (!_messageElt || !_toastInstance) return;

            _messageElt.textContent = message;
        },

        /**
         * Initialise le composant toast de chargement.
         *
         * Résout les références DOM depuis le HTML statique.
         * Doit être appelé une seule fois depuis xalise.js au DOMContentLoaded,
         * avant tout appel à show() ou hide().
         */
        init() {
            _toastElt   = document.getElementById(XalConstants.elementIds.loaderToast);
            _messageElt = _toastElt?.querySelector(XalConstants.cssQueries.loaderToastMessage);
        },
    };
})();
/**
 * Gestion de l'overlay de chargement.
 *
 * Affiche un voile semi-transparent sur la page afin de bloquer
 * toute interaction utilisateur pendant une opération en cours
 * (action destructive, soumission de formulaire, opération longue).
 *
 * Supporte les appels concurrents via un compteur interne :
 * l'overlay reste visible tant qu'au moins un appel est en cours.
 *
 * Utilisation typique :
 * - Suppression ou archivage d'un enregistrement
 * - Soumission de formulaire
 * - Opération longue nécessitant de bloquer les interactions
 *
 * L'overlay est déclaré en HTML statique dans index.html et
 * résolu une seule fois dans init().
 *
 * HTML requis dans index.html :
 * <div id="xal-id-loader-overlay" class="xal-loader-overlay" aria-hidden="true" hidden>
 *     <div class="xal-loader-overlay__spinner" aria-hidden="true"></div>
 * </div>
 *
 * Dépendances :
 * - XalConstants.js → XalConstants
 *
 * @namespace XalLoaderOverlay
 * @author Xavier VILLEMIN
 */
const XalLoaderOverlay = (() => {
    /**
     * Nombre d'appels ayant demandé l'affichage de l'overlay.
     *
     * L'overlay est masqué uniquement quand ce compteur atteint 0,
     * ce qui permet de gérer correctement les appels concurrents
     * sans masquer l'overlay prématurément.
     *
     * @type {number}
     */
    let _pendingCount = 0;

    /**
     * Référence vers l'élément DOM de l'overlay.
     * Résolu une seule fois dans init() depuis le HTML statique.
     *
     * @type {HTMLElement|null}
     */
    let _overlayElt = null;

    /**
     * Référence vers l'élément DOM du message.
     *
     * @type {HTMLElement|null}
     */
    let _messageElt = null;

    /**
     * Met à jour la visibilité de l'overlay selon le compteur courant.
     *
     * - _pendingCount > 0 : overlay visible, interactions bloquées
     * - _pendingCount = 0 : overlay masqué, interactions restaurées
     */
    const _update = () => {
        if (!_overlayElt) return;

        const isActive = _pendingCount > 0;

        _overlayElt.hidden = !isActive;
        _overlayElt.setAttribute(XalConstants.ariaNames.hidden, String(!isActive));
    };

    return {
        /**
         * Affiche l'overlay et bloque les interactions utilisateur.
         *
         * Incrémente le compteur interne — l'overlay reste visible
         * tant que hide() n'a pas été appelé autant de fois que show().
         * Peut être appelé plusieurs fois en parallèle sans effet de bord.
         *
         * @param {string} [message=''] - Message optionnel affiché sous le spinner.
         */
        show(message = '') {
            _pendingCount++;

            if (_messageElt) {
                _messageElt.textContent = message;
            }

            _update();
        },

        /**
         * Masque l'overlay et restaure les interactions utilisateur.
         *
         * Décrémente le compteur interne et masque l'overlay uniquement
         * si plus aucun appel n'est en cours.
         * Ne descend jamais en dessous de 0.
         */
        hide() {
            _pendingCount = Math.max(0, _pendingCount - 1);
            _update();
        },

        /**
         * Réinitialise le compteur et masque immédiatement l'overlay.
         *
         * Utile en cas d'erreur globale ou de navigation pour garantir
         * un état propre sans attendre la fin de tous les appels en cours.
         */
        reset() {
            _pendingCount = 0;
            _update();
        },

        /**
         * Indique si l'overlay est actuellement visible.
         *
         * @returns {boolean} true si l'overlay est actif, false sinon.
         */
        isActive() {
            return _pendingCount > 0;
        },

        /**
         * Met à jour le message affiché sans masquer ni réafficher l'overlay.
         *
         * Sans effet si l'overlay n'est pas affiché.
         *
         * @param {string} message - Nouveau message à afficher.
         */
        updateMessage(message) {
            if (!_messageElt || !_overlayElt) return;

            _messageElt.textContent = message;
        },

        /**
         * Initialise le composant.
         *
         * Résout les références DOM depuis le HTML statique.
         * Doit être appelé une seule fois depuis xalise.js au DOMContentLoaded,
         * avant tout appel à show() ou hide().
         */
        init() {
            _overlayElt = document.getElementById(XalConstants.elementIds.loaderOverlay);
            _messageElt = _overlayElt?.querySelector(XalConstants.cssQueries.loaderOverlayMessage);
        },
    };
})();
/**
 * Gestion des toasts de feedback de l'application.
 *
 * Affiche des toasts Bootstrap contextuels pour informer l'utilisateur
 * du résultat d'une opération : succès, erreur, avertissement ou information.
 *
 * Distinct de XalLoaderToast qui est réservé aux indicateurs de chargement :
 * - XalLoaderToast → opération en cours (spinner, non dismissible)
 * - XalToast       → résultat d'une opération (icône, auto-masqué)
 *
 * Les toasts sont créés dynamiquement et insérés dans le conteneur
 * Bootstrap `.toast-container` existant dans index.html.
 * Ils se masquent automatiquement après le délai configuré
 * et sont retirés du DOM après masquage.
 *
 * Dépendances :
 * - XalConstants.js → XalConstants
 *
 * @namespace XalToast
 * @author Xavier VILLEMIN
 */
const XalToast = (() => {
    /**
     * Délai par défaut en ms avant masquage automatique du toast.
     *
     * @type {number}
     */
    const DEFAULT_DELAY_MS = 5000;

    /**
     * Référence vers les templates HTML des variantes de toast.
     * Clé : ID du template, Valeur : HTMLTemplateElement.
     *
     * @type {Map<string, HTMLTemplateElement>}
     */
    let _templates = new Map();

    /**
     * Table de correspondance entre les noms de variantes de toast
     * et les identifiants DOM de leurs templates HTML respectifs.
     *
     * Centralise la résolution interne des variantes sans dupliquer
     * les identifiants définis dans XalConstants.elementIds.
     *
     * Utilisée dans init() pour résoudre les références aux templates,
     * et dans _show() pour sélectionner le template à cloner.
     *
     * @type {Readonly<Record<string, string>>}
     */
    const VARIANT_TEMPLATE_IDS = Object.freeze({
        success: XalConstants.elementIds.toastTemplateSuccess,
        error:   XalConstants.elementIds.toastTemplateError,
        warning: XalConstants.elementIds.toastTemplateWarning,
        info:    XalConstants.elementIds.toastTemplateInfo,
    });

    /**
     * Crée, insère et affiche un toast Bootstrap depuis son template HTML.
     *
     * Séquence d'exécution :
     * 1. Résolution du template correspondant à la variante
     * 2. Clonage du template et injection du message
     * 3. Insertion dans le conteneur de toasts
     * 4. Création de l'instance Bootstrap Toast et affichage
     * 5. Nettoyage du DOM après masquage via hidden.bs.toast
     *
     * Si la variante est inconnue, la variante "info" est utilisée par défaut.
     * Sans effet si le template de la variante n'a pas été résolu dans init().
     *
     * @param {string} message          - Message à afficher dans le corps du toast.
     * @param {string} variant          - Variante du toast ('success', 'error', 'warning', 'info').
     * @param {number} [delay]          - Délai en ms avant masquage automatique.
     */
    const _show = (message, variant, delay = DEFAULT_DELAY_MS) => {
        const templateId  = VARIANT_TEMPLATE_IDS[variant] ?? VARIANT_TEMPLATE_IDS.info;
        const templateElt = _templates.get(templateId);

        if (!templateElt) return;

        // Clone indépendant du template — permet plusieurs toasts simultanés
        const clone    = document.importNode(templateElt.content, true);
        const toastElt = clone.querySelector(XalConstants.cssQueries.toast);

        // Injection du message dans le corps du toast
        toastElt.querySelector(XalConstants.cssQueries.toastMessage).textContent = message;

        // Insertion dans le conteneur de toasts, ou dans body en dernier recours
        const container = document.querySelector(XalConstants.cssQueries.toastContainer);
        (container ?? document.body).appendChild(toastElt);

        // Création de l'instance Bootstrap avec masquage automatique
        const toastInstance = new bootstrap.Toast(toastElt, { autohide: true, delay });

        // Nettoyage du DOM après la fin de l'animation de masquage —
        // { once: true } garantit que le listener se supprime automatiquement.
        toastElt.addEventListener('hidden.bs.toast', () => {
            toastInstance.dispose();
            toastElt.remove();
        }, { once: true });

        toastInstance.show();
    };

    return {
        /**
         * Affiche un toast de succès.
         *
         * @param {string} message      - Message à afficher.
         * @param {number} [delay]      - Délai en ms avant masquage automatique.
         */
        success(message, delay = DEFAULT_DELAY_MS) {
            _show(message, 'success', delay);
        },

        /**
         * Affiche un toast d'erreur.
         *
         * Utilise aria-live="assertive" pour une annonce immédiate
         * aux technologies d'assistance.
         *
         * @param {string} message      - Message à afficher.
         * @param {number} [delay]      - Délai en ms avant masquage automatique.
         */
        error(message, delay = DEFAULT_DELAY_MS) {
            _show(message, 'error', delay);
        },

        /**
         * Affiche un toast d'avertissement.
         *
         * @param {string} message      - Message à afficher.
         * @param {number} [delay]      - Délai en ms avant masquage automatique.
         */
        warning(message, delay = DEFAULT_DELAY_MS) {
            _show(message, 'warning', delay);
        },

        /**
         * Affiche un toast d'information.
         *
         * @param {string} message      - Message à afficher.
         * @param {number} [delay]      - Délai en ms avant masquage automatique.
         */
        info(message, delay = DEFAULT_DELAY_MS) {
            _show(message, 'info', delay);
        },

        /**
         * Initialise le composant.
         *
         * Résout les références vers les templates HTML de chaque variante.
         * Doit être appelé une seule fois depuis xalise.js au DOMContentLoaded,
         * avant tout appel à success(), error(), warning() ou info().
         */
        init() {
            Object.values(VARIANT_TEMPLATE_IDS).forEach(id => {
                const templateElt = document.getElementById(id);
                if (templateElt) _templates.set(id, templateElt);
            });
        },
    };
})();
/**
 * Couche HTTP de l'application Xalise.
 *
 * Surcouche de la méthode fetch() native pour les appels Ajax,
 * avec gestion automatique des indicateurs visuels de chargement 
 * (barre navbar, placeholder, toast, overlay) et la gestion
 * des erreurs HTTP.
 *
 * Gestion des erreurs :
 * - Erreur réseau (fetch rejeté)    → toast d'erreur générique
 * - Erreur HTTP (statut 4xx, 5xx)   → toast d'erreur avec le statut HTTP
 * - Comportement personnalisable    → paramètre onError par appel
 *
 * Dépendances :
 * - XalLoaderNav.js         → XalLoaderNav
 * - XalLoaderPlaceholder.js → XalLoaderPlaceholder
 * - XalLoaderToast.js       → XalLoaderToast
 * - XalLoaderOverlay.js     → XalLoaderOverlay
 * - XalToast.js             → XalToast
 *
 * @namespace XalHttp
 * @author Xavier VILLEMIN
 */
const XalHttp = {
    /**
     * Message d'erreur affiché par défaut lors d'une erreur réseau.
     *
     * @type {string}
     */
    DEFAULT_NETWORK_ERROR_MESSAGE: 'Une erreur réseau est survenue. Veuillez réessayer.',

    /**
     * Messages d'erreur par défaut associés aux statuts HTTP courants.
     * Utilisés par _handleError() quand aucun errorMessages n'est fourni
     * et qu'aucun callback onError n'est défini.
     *
     * @type {Readonly<Record<number, string>>}
     */
    DEFAULT_ERROR_MESSAGES: Object.freeze({
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
    }),

    /**
     * Active ou désactive les indicateurs visuels de chargement.
     *
     * @param {Object}          indicators              - Indicateurs visuels.
     * @param {string}          indicators.placeholder
     * @param {string}          indicators.toast
     * @param {boolean|string}  indicators.overlay
     * @param {boolean}         show                    - true pour afficher, false pour masquer.
     */
    _toggleIndicators({ placeholder, toast, overlay }, show) {
        const action = show ? 'show' : 'hide';

        if (!overlay) show ? XalLoaderNav.start() : XalLoaderNav.stop();

        if (placeholder) XalLoaderPlaceholder[action](placeholder);
        if (toast)       XalLoaderToast[action](toast);
        if (overlay)     show
            ? XalLoaderOverlay.show(typeof overlay === 'string' ? overlay : '')
            : XalLoaderOverlay.hide();
    },

    /**
     * Gère une erreur survenue lors d'un appel HTTP.
     *
     * Ordre de priorité pour la résolution du message d'erreur :
     * 1. Callback onError fourni par l'appelant    → délégation complète
     * 2. errorMessages fourni par l'appelant       → message spécifique par statut
     * 3. DEFAULT_ERROR_MESSAGES                    → message par défaut par statut
     * 4. Message générique                         → fallback si aucun message n'est défini
     *
     * @param {Error|Response}              error           - Erreur survenue.
     * @param {Function|null}               onError         - Callback d'erreur personnalisé.
     * @param {Record<number, string>}      [errorMessages] - Messages personnalisés par statut HTTP.
     */
    _handleError(error, onError, errorMessages = {}) {
        if (typeof onError === 'function') {
            onError(error);
            return;
        }

        if (error instanceof Response) {
            const message =
                errorMessages[error.status]
                ?? this.DEFAULT_ERROR_MESSAGES[error.status]
                ?? `Erreur ${error.status} : ${error.statusText || 'Une erreur est survenue.'}`;

            // Avertissement pour les conflits (409), erreur pour les autres cas
            error.status === 409
                ? XalToast.warning(message)
                : XalToast.error(message);
        } else {
            XalToast.error(this.DEFAULT_NETWORK_ERROR_MESSAGE);
        }
    },

    /**
     * Enveloppe un appel fetch avec les indicateurs visuels appropriés
     * et la gestion des erreurs HTTP.
     *
     * La barre navbar est désactivée si l'overlay est actif —
     * le spinner de l'overlay suffit comme retour visuel.
     *
     * Les réponses HTTP avec un statut 4xx ou 5xx sont considérées
     * comme des erreurs et déclenchent la résolution du message d'erreur
     * selon l'ordre de priorité suivant :
     * 1. Callback onError fourni → délégation complète
     * 2. errorMessages fourni → message spécifique par statut HTTP
     * 3. DEFAULT_ERROR_MESSAGES → message par défaut par statut HTTP
     * 4. Message générique → fallback si aucun message n'est défini
     *
     * Les indicateurs sont systématiquement masqués dans le bloc finally()
     * afin de garantir leur nettoyage même en cas d'erreur réseau.
     *
     * @param {string}                  url                          - URL de la ressource.
     * @param {Object}                  [fetchOptions={}]            - Options passées à fetch().
     * @param {Object}                  [indicators={}]              - Indicateurs visuels et callbacks.
     * @param {string}                  [indicators.placeholder]     - Sélecteur CSS de la zone placeholder.
     * @param {string}                  [indicators.toast]           - Message du toast de chargement.
     * @param {boolean|string}          [indicators.overlay]         - Si true, affiche l'overlay sans message.
     *                                                                 Si string, affiche l'overlay avec ce message.
     * @param {Function|null}           [indicators.onSuccess]       - Callback appelé après une réponse HTTP réussie.
     *                                                                 Reçoit la Response en paramètre.
     * @param {Function|null}           [indicators.onError]         - Callback appelé en cas d'erreur réseau ou HTTP.
     *                                                                 Reçoit la Response (erreur HTTP) ou une Error (erreur réseau) en paramètre.
     *                                                                 Si absent, la résolution suit l'ordre de priorité défini.
     * @param {Record<number, string>}  [indicators.errorMessages]   - Messages d'erreur personnalisés par statut HTTP.
     *                                                                 Prennent le pas sur DEFAULT_ERROR_MESSAGES
     *                                                                 pour les statuts concernés.
     * @returns {Promise<Response>}
     */
    fetch(url, fetchOptions = {}, { placeholder, toast, overlay = false, onError = null, onSuccess = null, errorMessages = {} } = {}) {
        const indicators = { placeholder, toast, overlay };

        this._toggleIndicators(indicators, true);

        return fetch(url, fetchOptions)
            .then(response => {
                // Les erreurs HTTP ne rejettent pas la promesse nativement —
                // on doit vérifier response.ok et rejeter manuellement.
                if (!response.ok) {
                    this._handleError(response, onError, errorMessages);
                    return Promise.reject(response);
                }

                if (typeof onSuccess === 'function') {
                    onSuccess(response);
                }

                return response;
            })
            .catch(error => {
                // Évite de traiter deux fois les erreurs HTTP déjà gérées dans .then()
                if (!(error instanceof Response)) {
                    this._handleError(error, onError, errorMessages);
                }

                return Promise.reject(error);
            })
            .finally(() => {
                this._toggleIndicators(indicators, false);
            });
    },

    /**
     * Simule un appel HTTP avec un délai configurable.
     *
     * Déclenche les mêmes indicateurs visuels et la même gestion d'erreurs
     * que fetch(), mais retourne une réponse fictive après le délai spécifié.
     *
     * Utile pour le développement front-end sans backend disponible,
     * ou pour tester les états de chargement et les scénarios d'erreur.
     *
     * @param {*}                       [data=null]                 - Données fictives à retourner.
     * @param {Object}                  [options={}]
     * @param {number}                  [options.delay=5000]        - Délai en ms avant la résolution.
     * @param {boolean}                 [options.fail=false]        - Si true, simule une erreur réseau.
     * @param {Object}                  [indicators={}]             - Mêmes indicateurs que fetch().
     * @param {string}                  [indicators.placeholder]    - Sélecteur CSS de la zone placeholder.
     * @param {string}                  [indicators.toast]          - Message du toast de chargement.
     * @param {boolean|string}          [indicators.overlay]        - Si true, affiche l'overlay sans message.
     *                                                                Si string, affiche l'overlay avec ce message.
     * @param {Function|null}           [indicators.onError]        - Callback appelé en cas d'erreur réseau ou HTTP.
     *                                                                Reçoit la Response (erreur HTTP) ou une Error (erreur réseau) en paramètre.
     *                                                                Si absent, la résolution suit l'ordre de priorité défini.
     * @param {Function|null}           [indicators.onSuccess]      - Callback appelé après une réponse HTTP réussie.
     *                                                                Reçoit les données directement.
     * @param {Record<number, string>}  [indicators.errorMessages]  - Messages d'erreur personnalisés par statut HTTP.
     *                                                                Prennent le pas sur DEFAULT_ERROR_MESSAGES
     *                                                                pour les statuts concernés.
     * @returns {Promise<*>} Promesse résolue avec les données ou rejetée si fail=true.
     */
    mock(data = null, { delay = 5000, fail = false } = {}, { placeholder, toast, overlay = false, onError = null, onSuccess = null, errorMessages = {} } = {}) {
        const indicators = { placeholder, toast, overlay };

        this._toggleIndicators(indicators, true);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this._toggleIndicators(indicators, false);

                if (fail) {
                    const error = new Error('[XalHttp.mock] Erreur simulée.');
                    this._handleError(error, onError, errorMessages);
                    reject(error);
                } else {
                    if (typeof onSuccess === 'function') {
                        onSuccess(data);
                    }

                    resolve(data);
                }
            }, delay);
        });
    },
};
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
            `${XalConstants.cssQueries.sidebarSubmenuToggleBtn}[${XalConstants.attributeNames.xalTarget}="#${submenu.id}"]`
        );

        if (button) {
            this.updateAriaExpanded(button, false);
        }
    },

    /**
     * Ferme tous les sous-menus ouverts de la sidebar.
     */
    closeAllSubmenus() {
        document.querySelectorAll(XalConstants.cssQueries.sidebarSubmenu)
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
        document.querySelectorAll(XalConstants.cssQueries.sidebarSubmenu).forEach((el) => {
            if (el === submenu) return;

            // Mode étendu : préserve le sous-menu contenant un lien actif
            if (!this.isCollapsed() && el.querySelector(XalConstants.cssQueries.sidebarActiveNavLink)) return;

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
            const button = e.target.closest(XalConstants.cssQueries.sidebarSubmenuToggleBtn);

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
    XalToast.init();
});