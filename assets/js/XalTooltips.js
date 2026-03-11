/**
 * Namespace du composant des tooltips.
 * Gère l'initialisation des tooltips Bootstrap présents dans le DOM.
 */
const XalTooltips = {
    /**
     * Initialise tous les tooltips présents dans le DOM.
     *
     * @returns {bootstrap.Tooltip[]} Liste des instances de tooltips créées.
     */
    init() {
        const tooltipElements = document.querySelectorAll(XalQueries.tooltip);

        return [...tooltipElements].map((el) => new bootstrap.Tooltip(el));
    }
};