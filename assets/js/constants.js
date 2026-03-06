
/**
 * Identifiants des éléments du DOM.
 *
 * Centralise les IDs utilisés pour cibler les éléments en JS.
 * Toute modification d'un ID doit être répercutée ici uniquement.
 *
 * @constant
 * @type {Readonly<Record<string, string>>}
 */
const XalSelectors = Object.freeze({
    layout:             'xal-id-application-layout',
    btnToggleSidebar:   'xal-id-btn-toggle-main-sidebar',
});

/**
 * Classes CSS utilisées dynamiquement en JS.
 *
 * Centralise les classes BEM ajoutées ou supprimées via classList.
 * Toute modification d'une classe doit être répercutée ici uniquement.
 *
 * @constant
 * @type {Readonly<Record<string, string>>}
 */
const XalClasses = Object.freeze({
    sidebarCollapsed: 'xal-application-layout--sidebar-collapsed'
});