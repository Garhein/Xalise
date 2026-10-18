/**
 * Constantes DOM partagées par les composants JavaScript de l'application Xalise.
 */
export const XalConstants = Object.freeze({
    /**
     * Noms des attributs ARIA utilisés par les composants.
     */
    ariaNames: Object.freeze({
        hidden:     'aria-hidden',
        valueNow:   'aria-valuenow',
        labelledBy: 'aria-labelledby',
        label:      'aria-label',
    }),

    /**
     * Nom des attributs de données.
     */
    dataNames: Object.freeze({
        xalise: Object.freeze({
            popoverValue: 'data-xal-popover-value',
        }),
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

        otp: Object.freeze({
            countdownTimer:         'xal-id-otp-countdown-timer',
            countdownProgress:      'xal-id-otp-countdown-progress',
            countdownProgressBar:   'xal-id-otp-countdown-progress-bar',
            resendBtn:              'xal-id-otp-resend',
        }),

        password: Object.freeze({
            form:                       'xal-id-reset-password-form',
            inputReset:                 'xal-id-reset-password',
            inputResetConfirmation:     'xal-id-reset-password-confirm',
            rulesStatus:                'xal-id-password-rules-status',
        }),

        modal: Object.freeze({
            xalTitle: 'xal-id-modal-title',
        }),
    }),

    /**
     * Sélecteurs CSS utilisés pour cibler des éléments spécifiques dans le DOM.
     * Ces sélecteurs sont utilisés pour rechercher des éléments enfants dans des composants spécifiques.
     */
    cssQueries: Object.freeze({
        bootstrap: Object.freeze({
            togglePopover: '[data-bs-toggle="popover"]',
        }),

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

        otpDigits: '.xal-otp-form__digit',

        password: Object.freeze({
            ruleLength:     '[data-password-rule="length"]',
            ruleUppercase:  '[data-password-rule="uppercase"]',
            ruleNumber:     '[data-password-rule="number"]',
            ruleSpecial:    '[data-password-rule="special"]',
        }),

        tableSelection: Object.freeze({
            selectable: '[data-xal-table-selectable]',
            selectAll:  '[data-xal-table-select-all]',
            selectRow:  'tbody [data-xal-table-select-row]',
        }),

        modal: Object.freeze({
            bootstrapClass:    '.modal-dialog',
            xalHeader:         '.xal-modal__header',
            xalTitle:          '.xal-modal__title',
            xalBody:           '.xal-modal__body',
            xalFooter:         '.xal-modal__footer',
            xalCloseButton:    '.xal-modal__close-button',
        }),
    }),

    /**
     * Classes CSS ajoutées ou supprimées dynamiquement via `classList`.
     */
    cssClasses: Object.freeze({
        // Classe appliquée à un placeholder actif dans une zone cible
        loaderPlaceholderActive: 'xal-loader-placeholder--active',

        displayNone: 'd-none',
        btnCloseWhite: 'btn-close-white',

        bootstrapIcons: Object.freeze({ 
            checkCircleFill:          'bi-check-circle-fill',
            xCircleFill:              'bi-x-circle-fill',
            exclamationTriangleFill:  'bi-exclamation-triangle-fill',
            infoCircleFill:           'bi-info-circle-fill',
            circle:                   'bi-circle',
        }),

        bootstrapTextBg: Object.freeze({ 
            success: 'text-bg-success',
            danger:  'text-bg-danger',
            warning: 'text-bg-warning',
            info:    'text-bg-info',
        }),

        bootstrapBgColor: Object.freeze({
            success:    'bg-success',
            danger:     'bg-danger',
            warning:    'bg-warning',
            info:       'bg-info',
        }),

        bootstrapTextColor: Object.freeze({
            success:        'text-success',
            danger:         'text-danger',
            warning:        'text-warning',
            info:           'text-info',
            bodySecondary:  'text-body-secondary',
        }),

        bootstrapFont: Object.freeze({
            monospace: 'font-monospace',
        }),

        bootstrapModal: Object.freeze({
            size: Object.freeze({
                sm:         'modal-sm',
                lg:         'modal-lg',
                xl:         'modal-xl',
                fullScreen: 'modal-fullscreen',
            }),
        }),

        modal: Object.freeze({
            xalHeaderDefault: 'xal-modal__header--default',
        }),

        form: Object.freeze({
            wasValidated: 'was-validated',
        }),
    }),
});
