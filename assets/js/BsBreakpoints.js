
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
 * Génère un media query de type "max-width".
 *
 * Un décalage de -0.02px est appliqué afin d’éviter
 * tout chevauchement avec le media query min-width suivant.
 *
 * Exemple : bsBreakpointMax(992) → "(max-width: 991.98px)"
 *
 * @param {number} value - Largeur maximale en pixels.
 * @returns {string} Media query CSS prêt à être utilisé.
 */
const bsBreakpointMax = (value) => `(max-width: ${value - 0.02}px)`;

/**
 * Génère un media query de type "min-width".
 *
 * Exemple : bsBreakpointMin(768) → "(min-width: 768px)"
 *
 * @param {number} value - Largeur minimale en pixels.
 * @returns {string} Media query CSS prêt à être utilisé.
 */
const bsBreakpointMin = (value) => `(min-width: ${value}px)`;

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
const bsBreakpointBetween = (minValue, maxValue) => `${bsBreakpointMin(minValue)} and ${bsBreakpointMax(maxValue)}`;

/**
 * Ensemble normalisé de media queries basés sur les breakpoints Bootstrap 5.
 *
 * Cet objet fournit des alias prêts à l'emploi pour :
 * - cibler uniquement un breakpoint précis (ex: mdOnly)
 * - cibler un breakpoint et au-dessus (ex: lgUp)
 * - cibler un breakpoint et en dessous (ex: smDown)
 *
 * Toutes les valeurs sont des chaînes compatibles avec :
 * - window.matchMedia()
 * - CSS @media
 *
 * Exemple : window.matchMedia(BsBreakpoints.mdUp)
 *
 * L'objet est figé afin d'empêcher toute modification
 * accidentelle des définitions de breakpoints.
 *
 * @constant
 * @type {Readonly<Record<string, string>>}
 */
const BsBreakpoints = Object.freeze({
    // Toujours vrai
    always: 'all',

    // =-=-=-
    // Breakpoints "only" ciblant uniquement un intervalle
    // =-=-=-

    xsOnly: bsBreakpointMax(BS_SIZES.sm),
    smOnly: bsBreakpointBetween(BS_SIZES.sm, BS_SIZES.md),
    mdOnly: bsBreakpointBetween(BS_SIZES.md, BS_SIZES.lg),
    lgOnly: bsBreakpointBetween(BS_SIZES.lg, BS_SIZES.xl),
    xlOnly: bsBreakpointBetween(BS_SIZES.xl, BS_SIZES.xxl),
    
    // =-=-=-
    // Breakpoints "and up"
    // =-=-=-

    smUp: bsBreakpointMin(BS_SIZES.sm),
    mdUp: bsBreakpointMin(BS_SIZES.md),
    lgUp: bsBreakpointMin(BS_SIZES.lg),
    xlUp: bsBreakpointMin(BS_SIZES.xl),
    xxlUp: bsBreakpointMin(BS_SIZES.xxl),

    // =-=-=-
    // Breakpoints "and down"
    // =-=-=-

    xsDown: bsBreakpointMax(BS_SIZES.sm),
    smDown: bsBreakpointMax(BS_SIZES.md),
    mdDown: bsBreakpointMax(BS_SIZES.lg),
    lgDown: bsBreakpointMax(BS_SIZES.xl),
    xlDown: bsBreakpointMax(BS_SIZES.xxl)
});