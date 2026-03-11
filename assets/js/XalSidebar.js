
/**
 * Namespace du composant de la barre latérale (sidebar) de l'application.
 *
 * Ce composant gère l'affichage et le comportement de la barre latérale, notamment :
 * - La gestion des sous-menus
 * - La persistance de l'état (ouvert/fermé) de la sidebar
 */
const XalSidebar = {
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
    // Sous-menus
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

    /**
     * Mise à jour de l'attribut aria-expanded d'un menu.
     *
     * @param {HTMLElement} menu - Le menu sur lequel appliquer la mise à jour.
     * @param {boolean} state - true = ouvert, false = fermé.
     */
    updateAriaExpanded(menu, state) {
        menu.setAttribute(XalAriaNames.expanded, state.toString());
    },

    /**
     * Ferme un sous-menu et met à jour son parent.
     *
     * Le bouton est retrouvé via l'attribut data-xal-target pointant
     * vers l'ID du sous-menu.
     *
     * @param {HTMLElement} submenu - Le sous-menu à fermer.
     */
    closeSubmenu(submenu) {
        submenu.hidden = true;

        const button = document.querySelector(
            `${XalQueries.sidebarSubmenuToggleBtn}[${XalAttributes.target}="#${submenu.id}"]`
        );

        if (button) {
            this.updateAriaExpanded(button, false);
        }
    },

    /**
     * Ferme tous les sous-menus ouverts.
     */
    closeAllSubmenus() {
        document.querySelectorAll(XalQueries.sidebarSubmenu)
                .forEach((submenu) => {
                    if (!submenu.hidden) {
                        this.closeSubmenu(submenu);
                    }
                });
    },

    /**
     * Ouvre un sous-menu et met à jour son bouton déclencheur.
     *
     * @param {HTMLElement} submenu - L'élément sous-menu à ouvrir.
     * @param {HTMLElement} button  - Le bouton déclencheur associé.
     */
    openSubmenu(submenu, button) {
        submenu.hidden = false;
        this.updateAriaExpanded(button, true);
    },

    /**
     * Indique si la sidebar est actuellement en mode réduit.
     *
     * @returns {boolean}
     */
    isCollapsed() {
        const layout = document.getElementById(XalSelectors.layout);

        return layout
            ? layout.classList.contains(XalClasses.sidebarCollapsed)
            : false;
    },

    /**
     * Gère le clic sur un bouton de sous-menu.
     *
     * Règles :
     * - Un seul sous-menu ouvert à la fois
     * - Mode étendu : le sous-menu contenant un lien .active reste ouvert
     *   lors de l'ouverture d'un autre sous-menu
     * - Mode réduit : tous les sous-menus sont fermés sans exception
     *   avant d'ouvrir le sous-menu ciblé
     *
     * @param {HTMLElement} button - Le bouton déclencheur cliqué.
     */
    handleSubmenuToggle(button) {
        const targetSelector = button.getAttribute(XalAttributes.target);
        const submenu        = document.querySelector(targetSelector);

        if (!submenu) return;

        const isOpen = !submenu.hidden;

        if (isOpen) {
            this.closeSubmenu(submenu);
            return;
        }

        // Ferme les sous-menus ouverts selon le mode courant
        document.querySelectorAll(XalQueries.sidebarSubmenu).forEach((el) => {
            if (el === submenu) return;

            // Mode étendu : préserve le sous-menu contenant un lien actif
            if (!this.isCollapsed() && el.querySelector(XalQueries.sidebarActiveNavLink)) return;

            this.closeSubmenu(el);
        });

        this.openSubmenu(submenu, button);
    },

    /**
     * Initialise la gestion des sous-menus.
     *
     * Utilise la délégation d'événements sur le conteneur sidebar
     * pour éviter N listeners individuels sur chaque bouton.
     */
    initSubmenus() {
        const sidebar = document.getElementById(XalSelectors.sidebar);

        if (!sidebar) return;

        sidebar.addEventListener('click', (e) => {
            const button = e.target.closest(XalQueries.sidebarSubmenuToggleBtn);

            if (!button) return;

            this.handleSubmenuToggle(button);
        });
    },

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
    // Toggle collapsed
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

    /**
     * Bascule l'état réduit/étendu de la barre latérale.
     *
     * Ferme tous les sous-menus ouverts lors du passage en mode réduit,
     * et persiste l'état dans localStorage.
     *
     * @throws {Error} Si l'élément layout est introuvable dans le DOM.
     */
    toggle() {
        const layout = document.getElementById(XalSelectors.layout);

        if (!layout) {
            throw new Error(`Element #${XalSelectors.layout} not found.`);
        }

        const isCollapsed = layout.classList.toggle(XalClasses.sidebarCollapsed);

        // Ferme tous les sous-menus quand on passe en mode réduit
        if (isCollapsed) {
            this.closeAllSubmenus();
        }

        localStorage.setItem(XalSelectors.layout, isCollapsed);
    },

    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
    // Initialisation
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

    /**
     * Initialise le composant.
     *
     * - Restaure l'état collapsed depuis localStorage
     * - Attache le listener du bouton toggle
     * - Initialise les sous-menus
     */
    init() {
        // Restaure l'état collapsed depuis localStorage
        const wasCollapsed = localStorage.getItem(XalSelectors.layout) === 'true';

        if (wasCollapsed) {
            document.getElementById(XalSelectors.layout)
                    ?.classList.add(XalClasses.sidebarCollapsed);
        }

        const btnToggleSidebar = document.getElementById(XalSelectors.btnToggleSidebar);

        if (btnToggleSidebar) {
            btnToggleSidebar.addEventListener('click', () => this.toggle());
        }

        this.initSubmenus();
    }
};