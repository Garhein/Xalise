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
// Initialisation de la page
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

document.addEventListener('DOMContentLoaded', () => {
    const btnToggleSidebar = document.getElementById(XalSelectors.btnToggleSidebar);

    if (btnToggleSidebar) {
        btnToggleSidebar.addEventListener('click', toggleXalSidebar);
    }
});