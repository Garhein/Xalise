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
            navbar:     'xal-id-loader-nav',
            // Overlay de chargement global
            overlay:    'xal-id-loader-overlay',
        }),
    }),

    /**
     * Sélecteurs CSS utilisés pour cibler des éléments spécifiques dans le DOM.
     * Ces sélecteurs sont utilisés pour rechercher des éléments enfants dans des composants spécifiques.
     */
    cssQueries: Object.freeze({
        loader: Object.freeze({ 
            // Conteneur du message dans l’overlay de chargement
            overlayMessage: '.xal-loader-overlay__message',
        }),
    }),
});