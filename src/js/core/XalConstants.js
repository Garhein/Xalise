/**
 * Constantes DOM partagées par les composants JavaScript de l'application Xalise.
 */
export const XalConstants = Object.freeze({
    /**
     * Noms des attributs ARIA utilisés par les composants.
     */
    ariaNames: Object.freeze({
        hidden: 'aria-hidden',
    }),

    /**
     * Identifiants des éléments uniques du DOM.
     */
    elementIds: Object.freeze({
        loader: Object.freeze({ 
            // Barre de progression placée dans la barre de navigation
            navbar: 'xal-id-loader-nav',
        }),
    }),
});