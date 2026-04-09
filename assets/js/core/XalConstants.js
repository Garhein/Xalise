/**
 * Constantes globales de l'application Xalise.
 *
 * Centralise l'ensemble des valeurs utilisées dynamiquement par le JS :
 * - attributs ARIA
 * - attributs (data-xal-* et autres)
 * - valeurs d'actions
 * - sélecteurs CSS
 * - identifiants DOM
 * - classes CSS
 *
 * Toute modification d'une valeur doit être répercutée ici uniquement.
 *
 * @constant
 * @type {Readonly<Object>}
 */
const XalConstants = Object.freeze({

    /**
     * Noms des attributs ARIA.
     *
     * @type {Readonly<Record<string, string>>}
     */
    ariaNames: Object.freeze({
        expanded: 'aria-expanded',
        hidden:   'aria-hidden',
    }),

    /**
     * Noms des attributs.
     *
     * @type {Readonly<Record<string, string>>}
     */
    attributeNames: Object.freeze({
        xalise: Object.freeze({ 
            action: 'data-xal-action',
            target: 'data-xal-target',
        }),

        tooltip: 'data-tooltip',
        hidden:  'hidden',
    }),

    /**
     * Valeurs attendues des attributs.
     *
     * @type {Readonly<Record<string, string>>}
     */
    attributeValues: Object.freeze({
        sidebarToggleSubmenu: 'toggle-submenu',
    }),

    /**
     * Identifiants des éléments uniques du DOM.
     * Utilisés avec getElementById.
     *
     * @type {Readonly<Record<string, string>>}
     */
    elementIds: Object.freeze({
        layout:                     'xal-id-application-layout',
        sidebar:                    'xal-id-sidebar',
        btnToggleSidebar:           'xal-id-btn-toggle-sidebar',
        notificationCenter:         'xal-id-notification-center',
        notificationToastUndo:      'xal-id-notification-toast-undo',
        toastTemplateFeedback:      'xal-id-toast-template-feedback',

        loader: Object.freeze({ 
            navbar:                 'xal-id-loader-nav',
            toast:                  'xal-id-loader-toast',
            placeholderTemplate:    'xal-id-loader-placeholder-template',
            overlay:                'xal-id-loader-overlay',
        }),

        dialog: Object.freeze({ 
            template:       'xal-id-dialog-template',
            buttonTemplate: 'xal-id-dialog-button-template',
            iconTemplate:   'xal-id-dialog-icon-template',
        }),
    }),

    /**
     * Classes CSS ajoutées ou supprimées dynamiquement via classList.
     *
     * @type {Readonly<Record<string, string>>}
     */
    cssClasses: Object.freeze({
        sidebarCollapsed:           'xal-application-layout--sidebar-collapsed',
        loaderPlacerholderActive:   'xal-loader-placeholder--active',

        bootstrapIcon: Object.freeze({ 
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

        bootstrapBtn: Object.freeze({ 
            primary:    'btn-primary',
            secondary:  'btn-secondary',
        }),
    }),

    /**
     * Sélecteurs CSS utilisés dans querySelector et querySelectorAll.
     *
     * @type {Readonly<Record<string, string>>}
     */
    cssQueries: Object.freeze({
        tooltip:     '[data-bs-toggle="tooltip"]',
        modalDialog: '.modal-dialog',
        
        toast: Object.freeze({ 
            container:       '.toast-container',
            header:          '.toast-header',
            xalToast:        '.xal-toast',
            xalToastIcon:    '.xal-toast__icon',
            xalToastLabel:   '.xal-toast__label',
            xalToastMessage: '.xal-toast__message',
        }),

        loader: Object.freeze({ 
            toast:          '.xal-loader-toast',
            toastMessage:   '.xal-loader-toast__message',
            placeholder:    '.xal-loader-placeholder',
            overlayMessage: '.xal-loader-overlay__message',
        }),

        dialog: Object.freeze({ 
            container:   '.xal-dialog',
            title:       '.xal-dialog__title',
            body:        '.xal-dialog__body',
            footer:      '.xal-dialog__footer',
            button:      '.xal-dialog__button',
            icon:        '.xal-dialog__icon',
            closeButton: '.xal-dialog__close-button',            
        }),
        
        sidebar: Object.freeze({ 
            submenuToggleBtn: '[data-xal-action="toggle-submenu"]',
            submenu:          '.xal-sidebar__submenu',
            activeNavLink:    '.nav-link.active',
        }),
    }),
});