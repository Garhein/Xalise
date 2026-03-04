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
     * Structure Map<query, Map<callback, handler>> permettant de stocker les handlers enregistrés
     * lors d'un appel précédent à onChange(), afin de garantir que removeEventListener() puisse 
     * supprimer le bon listener.
     * 
     * @type {Map<string, Map<Function, Function>>}
     */
    const _listenerRegistry = new Map();

    /**
     * Retourne le MediaQueryList correspondant à la query fournie.
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
     * Vérifie si le breakpoint indiqué en paramètre existe.
     * @param {string} key
     */
    const assertKey = (key) => {
        if (!sizes.hasOwnProperty(key)) {
            throw new Error(`Breakpoint "${key}" is not defined.`);
        }
    };

    /**
     * Retourne la clé suivante dans l'ordre Bootstrap.
     * @param {string} key
     * @returns {string|null}
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
     * Un décalage de -0.02px est appliqué afin d'éviter
     * tout chevauchement avec le media query min-width suivant.
     *
     * Exemple : max(992) → "(max-width: 991.98px)"
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
     * Génère un media query comprise entre deux largeurs.
     *
     * Combine automatiquement :
     * - min-width inclusif
     * - max-width exclusif (avec correction de -0.02px)
     *
     * Exemple : between(768, 992) → "(min-width: 768px) and (max-width: 991.98px)"
     *
     * @param {number} minValue - Largeur minimale en pixels.
     * @param {number} maxValue - Largeur maximale en pixels.
     * @returns {string} Media query CSS combiné.
     */
    const between = (minValue, maxValue) => `${min(minValue)} and ${max(maxValue)}`;

    return Object.freeze({
        always() {
            return 'all';
        },

        /**
         * Cible un breakpoint précis.
         * Exemple : only('md')
         */
        only(key) {
            assertKey(key);

            const next = nextKey(key);

            if (!next) {
                // xxlOnly est équivalent à xxlUp
                return min(sizes[key]);
            }

            if (key === 'xs') {
                return max(sizes[next]);
            }

            return between(sizes[key], sizes[next]);
        },

        /**
         * Cible un breakpoint et au-dessus.
         * Exemple : up('lg')
         */
        up(key) {
            assertKey(key);
            return min(sizes[key]);
        },

        /**
         * Cible un breakpoint et en dessous.
         * Exemple : down('md')
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
         * Cible deux breakpoints inclus/exclus.
         * Exemple : between('sm', 'lg')
         */
        between(minKey, maxKey) {
            assertKey(minKey);
            assertKey(maxKey);

            const minIndex = keys.indexOf(minKey);
            const maxIndex = keys.indexOf(maxKey);

            if (minIndex >= maxIndex) {
                throw new Error(`"${minKey}" must be smaller than "${maxKey}".`);
            }

            // Intervalle voisin équivalent à only()
            if (maxIndex === minIndex + 1) {
                return this.only(minKey);
            }

            return between(
                sizes[minKey],
                sizes[maxKey]
            );
        },

        /**
         * Indique si la fenêtre courante correspond à un viewport
         * dont la largeur est égale ou supérieure au breakpoint spécifié.
         *
         * @param {string} key - Clé du breakpoint à tester (ex : 'sm', 'md', 'lg', etc.).
         * @returns {boolean} `true` si la largeur du viewport est ≥ au breakpoint, sinon `false`.
         * @throws {Error} Si la clé du breakpoint n'est pas définie.
         * @throws {Error} Si window.matchMedia n'est pas disponible.
         */
        isUp(key) {
            return _matchMedia(this.up(key)).matches;
        },

        /**
         * Indique si la fenêtre courante correspond à un viewport
         * dont la largeur est inférieure ou égale au breakpoint spécifié.
         *
         * @param {string} key - Clé du breakpoint à tester (ex : 'sm', 'md', 'lg', etc.).
         * @returns {boolean} `true` si la largeur du viewport est ≤ au breakpoint, sinon `false`.
         * @throws {Error} Si la clé du breakpoint n'est pas définie.
         * @throws {Error} Si window.matchMedia n'est pas disponible.
         */
        isDown(key) {
            return _matchMedia(this.down(key)).matches;
        },

        /**
         * Indique si la fenêtre courante correspond exactement
         * à l'intervalle du breakpoint spécifié.
         *
         * @param {string} key - Clé du breakpoint à tester (ex : 'sm', 'md', 'lg', etc.).
         * @returns {boolean} `true` si le viewport se situe dans l'intervalle du breakpoint, sinon `false`.
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
         * - Déduplique les listeners via un registre interne (Map à deux niveaux)
         * - Fournit l'état actuel lors de l'inscription (appel synchrone initial)
         * - Retourne une fonction de désinscription propre
         *
         * L'appel initial reçoit un objet de type {@link MediaQueryState} et non
         * un vrai MediaQueryListEvent. La propriété `type: 'init'` permet au
         * consommateur de distinguer cet appel initial d'un vrai changement.
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
         * @typedef {{ matches: boolean, media: string, type: 'init' }} MediaQueryState
         *
         * @param {string} query - Media query complet à observer.
         * @param {(event: MediaQueryListEvent | MediaQueryState) => void} callback - Fonction appelée lors d'un changement ou à l'inscription.
         * @returns {Function} Fonction de désinscription.
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