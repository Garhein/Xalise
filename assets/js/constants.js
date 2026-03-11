
/**
 * Noms des attributs ARIA manipulés par le JS.
 * Toute modification doit être répercutée ici uniquement.
 */
const XalAriaNames = Object.freeze({
    expanded: 'aria-expanded'
});

/**
 * Noms des attributs data-xal-* manipulés par le JS, notamment comme hooks JS.
 * Toute modification doit être répercutée ici uniquement.
 *
 * @constant
 * @type {Readonly<Record<string, string>>}
 */
const XalAttributes = Object.freeze({
    action:         'data-xal-action',
    target:         'data-xal-target',
});

/**
 * Valeurs attendues de l'attribut data-xal-action.
 * Toute modification doit être répercutée ici uniquement.
 *
 * @constant
 * @type {Readonly<Record<string, string>>}
 */
const XalActionsValues = Object.freeze({
    sidebarToggleSubmenu: 'toggle-submenu',
});

/**
 * Sélecteurs CSS utilisés pour les initialisations et requêtes DOM.
 * Toute modification doit être répercutée ici uniquement.
 *
 * @constant
 * @type {Readonly<Record<string, string>>}
 */
const XalQueries = Object.freeze({
    tooltip:                    `[data-bs-toggle="tooltip"]`,
    sidebarSubmenuToggleBtn:    `[${XalAttributes.action}="${XalActionsValues.sidebarToggleSubmenu}"]`,
    sidebarSubmenu:             `.xal-sidebar__submenu`,
    sidebarActiveNavLink:       `.nav-link.active`,
});

/**
 * Identifiants des éléments du DOM.
 * Toute modification doit être répercutée ici uniquement.
 *
 * @constant
 * @type {Readonly<Record<string, string>>}
 */
const XalSelectors = Object.freeze({
    layout:             'xal-id-application-layout',
    sidebar:            'xal-id-sidebar',
    btnToggleSidebar:   'xal-id-btn-toggle-sidebar',
});

/**
 * Classes CSS utilisées dynamiquement en JS.
 * Toute modification doit être répercutée ici uniquement.
 *
 * @constant
 * @type {Readonly<Record<string, string>>}
 */
const XalClasses = Object.freeze({
    sidebarCollapsed: 'xal-application-layout--sidebar-collapsed'
});