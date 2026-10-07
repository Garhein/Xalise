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
        toastTemplateFeedback: 'xal-id-toast-template-feedback',

        loader: Object.freeze({
            navbar:                 'xal-id-loader-nav',
            overlay:                'xal-id-loader-overlay',
            placeholderTemplate:    'xal-id-loader-placeholder-template',
        }),
    }),

    /**
     * Sélecteurs CSS utilisés pour cibler des éléments spécifiques dans le DOM.
     * Ces sélecteurs sont utilisés pour rechercher des éléments enfants dans des composants spécifiques.
     */
    cssQueries: Object.freeze({
        loader: Object.freeze({ 
            overlayMessage: '.xal-loader-overlay__message',
            placeholder:    '.xal-loader-placeholder',
        }),

        toast: Object.freeze({ 
            container:       '.toast-container',
            header:          '.toast-header',
            xalToast:        '.xal-toast',
            xalToastIcon:    '.xal-toast__icon',
            xalToastLabel:   '.xal-toast__label',
            xalToastMessage: '.xal-toast__message',
        }),

        form: Object.freeze({
            needsValidate: '.needs-validation',
            staticTarget:  'form[data-xal-target]',
        }),
    }),

    /**
     * Classes CSS ajoutées ou supprimées dynamiquement via `classList`.
     */
    cssClasses: Object.freeze({
        // Classe appliquée à un placeholder actif dans une zone cible
        loaderPlaceholderActive: 'xal-loader-placeholder--active',

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

        form: Object.freeze({
            wasValidated: 'was-validated',
        }),
    }),
});