// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Barre latérale
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

/**
 * Bascule l'état réduit/étendu de la barre latérale en ajoutant ou supprimant
 * le modificateur BEM correspondant sur l'élément racine du layout.
 *
 * @throws {Error} Si l'élément layout est introuvable dans le DOM.
 */
const toggleXalSidebar = () => {
    const layout = document.getElementById(XalSelectors.layout);

    if (!layout) {
        throw new Error(`Element #${XalSelectors.layout} not found.`);
    }

    layout.classList.toggle(XalClasses.sidebarCollapsed);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Tooltips
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

/**
 * Initialise tous les tooltips présents dans le DOM.
 *
 * @returns {bootstrap.Tooltip[]} Liste des instances de tooltips créées.
 */
const initTooltips = () => {
    const tooltipElements = document.querySelectorAll(XalQueries.tooltip);

    return [...tooltipElements].map((el) => new bootstrap.Tooltip(el));
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Initialisation de la page
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

document.addEventListener('DOMContentLoaded', () => {
    initTooltips();

    const btnToggleSidebar = document.getElementById(XalSelectors.btnToggleSidebar);
    if (btnToggleSidebar) {
        btnToggleSidebar.addEventListener('click', toggleXalSidebar);
    }
});