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
            navbar:                 'xal-id-loader-nav',
            // Overlay de chargement global
            overlay:                'xal-id-loader-overlay',
            // Template HTML du placeholder de chargement
            placeholderTemplate:    'xal-id-loader-placeholder-template',
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
            // Placeholder de chargement inséré dans une zone cible
            placeholder:    '.xal-loader-placeholder',
        }),
    }),

    /**
     * Classes CSS ajoutées ou supprimées dynamiquement via `classList`.
     */
    cssClasses: Object.freeze({
        // Classe appliquée à un placeholder actif dans une zone cible
        loaderPlaceholderActive: 'xal-loader-placeholder--active',
    }),
});