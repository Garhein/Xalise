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
        }
    });
})();