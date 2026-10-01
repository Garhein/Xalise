/**
 * Gestion de la barre latérale (sidebar) de l'application.
 * 
 * @namespace XalSidebar
 * @author  Xavier VILLEMIN
 */
const XalSidebar = {
    /**
     * Synchronise l'attribut aria-expanded d'un bouton déclencheur
     * avec l'état d'affichage de son sous-menu.
     *
     * @param {HTMLElement} menu - Le bouton à mettre à jour.
     * @param {boolean} state - true = sous-menu ouvert, false = sous-menu fermé.
     */
    updateAriaExpanded(menu, state) {
        menu.setAttribute(XalConstants.ariaNames.expanded, state.toString());
    },

    /**
     * Ferme un sous-menu et synchronise l'état aria-expanded de son bouton déclencheur.
     *
     * Le bouton déclencheur est retrouvé dynamiquement via l'attribut
     * data-xal-target pointant vers l'ID du sous-menu.
     *
     * @param {HTMLElement} submenu - Le sous-menu à fermer.
     */
    closeSubmenu(submenu) {
        submenu.hidden = true;

        const button = document.querySelector(
            `${XalConstants.cssQueries.sidebar.submenuToggleBtn}[${XalConstants.attributeNames.xalTarget}="#${submenu.id}"]`
        );

        if (button) {
            this.updateAriaExpanded(button, false);
        }
    },

    /**
     * Ferme tous les sous-menus ouverts de la sidebar.
     */
    closeAllSubmenus() {
        document.querySelectorAll(XalConstants.cssQueries.sidebar.submenu)
                .forEach((submenu) => {
                    if (!submenu.hidden) {
                        this.closeSubmenu(submenu);
                    }
                });
    },

    /**
     * Ouvre un sous-menu et synchronise l'état aria-expanded de son bouton déclencheur.
     *
     * @param {HTMLElement} submenu - Le sous-menu à ouvrir.
     * @param {HTMLElement} button  - Le bouton déclencheur associé.
     */
    openSubmenu(submenu, button) {
        submenu.hidden = false;
        this.updateAriaExpanded(button, true);
    },

    /**
     * Indique si la sidebar est actuellement affichée en mode réduit.
     *
     * @returns {boolean} true = mode réduit, false = mode étendu.
     */
    isCollapsed() {
        const layout = document.getElementById(XalConstants.elementIds.layout);

        return layout
            ? layout.classList.contains(XalConstants.cssClasses.sidebarCollapsed)
            : false;
    },

    /**
     * Gère l'ouverture et la fermeture d'un sous-menu au clic sur son bouton déclencheur.
     *
     * Règles appliquées :
     * - Si le sous-menu ciblé est déjà ouvert, il est fermé.
     * - Un seul sous-menu peut être ouvert à la fois.
     * - Mode étendu : le sous-menu contenant un lien actif reste ouvert
     *   lors de l'ouverture d'un autre sous-menu.
     * - Mode réduit : tous les sous-menus sont fermés sans exception
     *   avant l'ouverture du sous-menu ciblé.
     *
     * @param {HTMLElement} button - Le bouton déclencheur cliqué.
     */
    handleSubmenuToggle(button) {
        const targetSelector = button.getAttribute(XalConstants.attributeNames.xalTarget);
        const submenu        = document.querySelector(targetSelector);

        if (!submenu) return;

        const isOpen = !submenu.hidden;

        if (isOpen) {
            this.closeSubmenu(submenu);
            return;
        }

        // Ferme les sous-menus ouverts selon le mode courant
        document.querySelectorAll(XalConstants.cssQueries.sidebar.submenu).forEach((el) => {
            if (el === submenu) return;

            // Mode étendu : préserve le sous-menu contenant un lien actif
            if (!this.isCollapsed() && el.querySelector(XalConstants.cssQueries.sidebar.activeNavLink)) return;

            this.closeSubmenu(el);
        });

        this.openSubmenu(submenu, button);
    },

    /**
     * Initialise la gestion des sous-menus de la sidebar.
     *
     * Utilise la délégation d'événements sur le conteneur sidebar
     * pour éviter d'attacher un listener sur chaque bouton déclencheur.
     */
    initSubmenus() {
        const sidebar = document.getElementById(XalConstants.elementIds.sidebar);

        if (!sidebar) return;

        sidebar.addEventListener('click', (e) => {
            const button = e.target.closest(XalConstants.cssQueries.sidebar.submenuToggleBtn);

            if (!button) return;

            this.handleSubmenuToggle(button);
        });
    },

    /**
     * Bascule l'état réduit/étendu de la sidebar.
     *
     * Effets de bord :
     * - Ajoute ou supprime la classe CSS collapsed sur le layout
     * - Ferme tous les sous-menus ouverts lors du passage en mode réduit
     * - Persiste l'état dans localStorage
     *
     * @throws {Error} Si l'élément layout est introuvable dans le DOM.
     */
    toggle() {
        const layout = document.getElementById(XalConstants.elementIds.layout);

        if (!layout) {
            throw new Error(`Element #${XalConstants.elementIds.layout} not found.`);
        }

        const isCollapsed = layout.classList.toggle(XalConstants.cssClasses.sidebarCollapsed);

        // Ferme tous les sous-menus quand on passe en mode réduit
        if (isCollapsed) {
            this.closeAllSubmenus();
        }

        localStorage.setItem(XalConstants.elementIds.layout, isCollapsed);
    },

    /**
     * Initialise le composant sidebar.
     *
     * - Restaure l'état collapsed depuis localStorage
     * - Attache le listener du bouton toggle
     * - Initialise la gestion des sous-menus
     * - Initialise le comportement responsive
     */
    init() {
        // Restaure l'état collapsed depuis localStorage
        const wasCollapsed = localStorage.getItem(XalConstants.elementIds.layout) === 'true';

        if (wasCollapsed) {
            document.getElementById(XalConstants.elementIds.layout)
                    ?.classList.add(XalConstants.cssClasses.sidebarCollapsed);
        }

        const btnToggleSidebar = document.getElementById(XalConstants.elementIds.btnToggleSidebar);

        if (btnToggleSidebar) {
            btnToggleSidebar.addEventListener('click', () => this.toggle());
        }

        this.initSubmenus();
        this.initResponsive();
    },

    /**
     * Initialise le comportement responsive de la sidebar.
     *
     * Observe le breakpoint md via BsBreakpoints et ajuste automatiquement
     * l'état de la sidebar en fonction de la largeur du viewport :
     * - En dessous de md : réduit la sidebar et ferme tous les sous-menus.
     * - Au-dessus de md  : restaure l'état persisté dans localStorage.
     *
     * Note : les changements d'état déclenchés par le responsive ne sont pas
     * persistés dans localStorage afin de ne pas écraser la préférence
     * manuelle de l'utilisateur.
     */
    initResponsive() {
        // En dessous de md : retire le mode réduit pour l'offcanvas
        BsBreakpoints.onChange(BsBreakpoints.down('md'), (e) => {
            const layout  = document.getElementById(XalConstants.elementIds.layout);
            const sidebar = document.getElementById(XalConstants.elementIds.sidebar);

            if (!layout) return;

            if (e.matches) {
                // Mobile : retire le mode réduit, l'offcanvas prend le relais
                layout.classList.remove(XalConstants.cssClasses.sidebarCollapsed);
                this.closeAllSubmenus();
            } else {
                // Fermeture propre de l'offcanvas avant le passage en mode desktop
                // Évite que le backdrop reste affiché après le redimensionnement.
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(sidebar);

                if (offcanvasInstance) {
                    offcanvasInstance.hide();
                }

                // Desktop : restaure l'état persisté
                const wasCollapsed = localStorage.getItem(XalConstants.elementIds.layout) === 'true';

                layout.classList.toggle(
                    XalConstants.cssClasses.sidebarCollapsed,
                    wasCollapsed
                );
            }
        });

        // À partir de md et jusqu'à lg : réduit automatiquement la sidebar
        BsBreakpoints.onChange(BsBreakpoints.only('md'), (e) => {
            const layout = document.getElementById(XalConstants.elementIds.layout);

            if (!layout) return;

            if (e.matches) {
                // Breakpoint md : réduit automatiquement
                layout.classList.add(XalConstants.cssClasses.sidebarCollapsed);
                this.closeAllSubmenus();
            }
        });
    },
};