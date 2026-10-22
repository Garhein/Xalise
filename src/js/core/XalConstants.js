/**
 * Constantes DOM partagées par les composants JavaScript de l'application Xalise.
 */
export const XalConstants = Object.freeze({
    /**
     * Noms des attributs ARIA utilisés par les composants.
     */
    ariaNames: Object.freeze({
        hidden:     'aria-hidden',
        label:      'aria-label',
        labelledBy: 'aria-labelledby',
        sort:       'aria-sort',
        valueNow:   'aria-valuenow',
    }),

    /**
     * Nom des attributs de données.
     */
    dataNames: Object.freeze({
        xalise: Object.freeze({
            popoverContent:                 'data-xal-popover-content',
            popoverLabel:                   'data-xal-popover-label',
            popoverValue:                   'data-xal-popover-value',
            popoverValueCssClasses:         'data-xal-popover-value-css-classes',
            recordId:                       'data-xal-record-id',
            refreshUrl:                     'data-xal-refresh-url',
            tableContainerActions :         'data-xal-table-container-actions',
            tableContainerSelectionCount:   'data-xal-table-container-selection-count',
            tablePageSize:                  'data-xal-table-page-size',
            tableSortColumn:                'data-xal-table-sort-column',
            tableSortLabel:                 'data-xal-table-sort-label',
            target:                         'data-xal-target',
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
            needsValidate:      '.needs-validation',
            staticTarget:       'form[data-xal-target]',
            xalClearCriteria:   '[data-xal-form-clear-criteria]',
        }),

        otpDigits: '.xal-otp-form__digit',

        password: Object.freeze({
            ruleLength:     '[data-password-rule="length"]',
            ruleUppercase:  '[data-password-rule="uppercase"]',
            ruleNumber:     '[data-password-rule="number"]',
            ruleSpecial:    '[data-password-rule="special"]',
        }),

        table: Object.freeze({
            selection: Object.freeze({
                selectable:                 '[data-xal-table-selectable]',
                checkAll:                   '[data-xal-table-check-all]',
                checkRow:                   'tbody [data-xal-table-check-row]',
                actionNotDynamicState:      '.xal-table__actions--not-dynamic-state',
            }),

            sort: Object.freeze({
                column: '[data-xal-table-sort-column]',
                icon:   '.xal-table__sort-icon',
            }),
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

        bootstrapIcons: Object.freeze({ 
            arrowUp:                    'bi-arrow-up',
            arrowDown:                  'bi-arrow-down',
            arrowDownUp:                'bi-arrow-down-up',
            arrowRepeat:                'bi-arrow-repeat',
            checkCircleFill:            'bi-check-circle-fill',
            checkLg:                    'bi-check-lg',
            circle:                     'bi-circle',
            exclamationTriangleFill:    'bi-exclamation-triangle-fill',
            infoCircleFill:             'bi-info-circle-fill',
            trash:                      'bi-trash',
            xCircleFill:                'bi-x-circle-fill',
            xLg:                        'bi-x-lg',
        }),

        bootstrapTextBg: Object.freeze({ 
            success: 'text-bg-success',
            danger:  'text-bg-danger',
            warning: 'text-bg-warning',
            info:    'text-bg-info',
            xalise:  'text-bg-xalise',
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

        bootstrapBtn: Object.freeze({
            size: Object.freeze({
                sm: 'btn-sm',
            }),
            
            closeWhite:             'btn-close-white',
            primary:                'btn-primary',
            danger:                 'btn-danger',
            xalise:                 'btn-xalise',
            outlineSecondary:       'btn-outline-secondary',

        }),

        modal: Object.freeze({
            xalHeaderDefault: 'xal-modal__header--default',
        }),

        form: Object.freeze({
            wasValidated:   'was-validated',
            doNotEmpty:     'xal-form-do-not-empty',
        }),
    }),
});
