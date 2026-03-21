/**
 * Constantes globales de l'application Xalise.
 *
 * Centralise l'ensemble des valeurs utilisées dynamiquement par le JS :
 * - attributs ARIA
 * - attributs data-xal-*
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
     * Noms des attributs ARIA manipulés par le JS.
     *
     * @type {Readonly<Record<string, string>>}
     */
    ariaNames: Object.freeze({
        expanded: 'aria-expanded',
    }),

    /**
     * Noms des attributs utilisés comme hooks JS dans le DOM.
     *
     * @type {Readonly<Record<string, string>>}
     */
    attributeNames: Object.freeze({
        xalAction: 'data-xal-action',
        xalTarget: 'data-xal-target',
        tooltip:   'data-tooltip',
    }),

    /**
     * Valeurs attendues des attributs utilisés comme hooks JS dans le DOM.
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
        layout:                 'xal-id-application-layout',
        sidebar:                'xal-id-sidebar',
        btnToggleSidebar:       'xal-id-btn-toggle-sidebar',
        notificationCenter:     'xal-id-notification-center',
        notificationToastUndo:  'xal-id-notification-toast-undo',
    }),

    /**
     * Classes CSS ajoutées ou supprimées dynamiquement via classList.
     *
     * @type {Readonly<Record<string, string>>}
     */
    cssClasses: Object.freeze({
        sidebarCollapsed: 'xal-application-layout--sidebar-collapsed',
    }),

    /**
     * Sélecteurs CSS utilisés dans querySelector et querySelectorAll.
     *
     * Note : les sélecteurs dérivés d'autres constantes sont écrits en dur
     * car les propriétés d'un objet littéral ne peuvent pas se référencer
     * entre elles lors de la définition.
     *
     * @type {Readonly<Record<string, string>>}
     */
    cssQueries: Object.freeze({
        tooltip:                        `[data-bs-toggle="tooltip"]`,

        // Sidebar
        sidebarSubmenuToggleBtn:        `[data-xal-action="toggle-submenu"]`,
        sidebarSubmenu:                 `.xal-sidebar__submenu`,
        sidebarActiveNavLink:           `.nav-link.active`,
    }),
});