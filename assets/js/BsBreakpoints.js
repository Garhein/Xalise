
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
     * Un décalage de -0.02px est appliqué afin d’éviter
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
     * Exemple : bsBreakpointBetween(768, 992) → "(min-width: 768px) and (max-width: 991.98px)"
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
         * La méthode s'appuie sur le media query généré par {@link up}
         * et utilise l'API native `window.matchMedia` pour effectuer l'évaluation.
         *
         * @param {string} key - Clé du breakpoint à tester (ex : 'sm', 'md', 'lg', etc.).
         * @returns {boolean} `true` si la largeur du viewport est ≥ au breakpoint, sinon `false`.
         * @throws {Error} Si la clé du breakpoint n'est pas définie.
         */
        isUp(key) {
            return window.matchMedia(this.up(key)).matches;
        },

        /**
         * Indique si la fenêtre courante correspond à un viewport
         * dont la largeur est inférieure ou égale au breakpoint spécifié.
         *
         * La méthode s'appuie sur le media query généré par {@link down}
         * et utilise l'API native `window.matchMedia` pour effectuer l'évaluation.
         *
         * @param {string} key - Clé du breakpoint à tester (ex : 'sm', 'md', 'lg', etc.).
         * @returns {boolean} `true` si la largeur du viewport est ≤ au breakpoint, sinon `false`.
         * @throws {Error} Si la clé du breakpoint n'est pas définie.
         */
        isDown(key) {
            return window.matchMedia(this.down(key)).matches;
        },

        /**
         * Indique si la fenêtre courante correspond exactement
         * à l’intervalle du breakpoint spécifié.
         *
         * La méthode s'appuie sur le media query généré par {@link only}
         * et utilise l'API native `window.matchMedia` pour effectuer l'évaluation.
         *
         * Le test couvre la plage comprise entre la valeur minimale du breakpoint
         * et la valeur immédiatement inférieure au breakpoint suivant.
         *
         * @param {string} key - Clé du breakpoint à tester (ex : 'sm', 'md', 'lg', etc.).
         * @returns {boolean} `true` si la largeur du viewport se situe strictement dans l’intervalle du breakpoint, sinon `false`.
         * @throws {Error} Si la clé du breakpoint n'est pas définie.
         */
        isOnly(key) {
            return window.matchMedia(this.only(key)).matches;
        },

        /**
         * Retourne la clé du breakpoint actuellement actif
         * en fonction de la largeur courante du viewport.
         *
         * La méthode évalue les breakpoints du plus grand au plus petit
         * et retourne le premier breakpoint dont la media query "up"
         * correspond (`min-width` respectée).
         *
         * Si aucun breakpoint supérieur ne correspond, la méthode
         * retourne par défaut `'xs'`.
         *
         * @returns {string} La clé du breakpoint actif (ex : 'xs', 'sm', 'md', 'lg', 'xl', 'xxl').
         */
        current() {
            const ordered = [...keys].reverse();

            for (const key of ordered) {
                if (window.matchMedia(this.up(key)).matches) {
                    return key;
                }
            }

            return 'xs';
        }
    });
})();