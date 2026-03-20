/**
 * Gestion des tooltips Bootstrap dans l'application.
 * 
 * @namespace XalTooltips
 * @author  Xavier VILLEMIN
 */
const XalTooltips = {
    /**
     * Initialise tous les tooltips présents dans le DOM.
     *
     * @returns {bootstrap.Tooltip[]} Liste des instances de tooltips créées.
     */
    init() {
        const tooltipElements = document.querySelectorAll(XalConstants.cssQueries.tooltip);

        return [...tooltipElements].map((el) => new bootstrap.Tooltip(el));
    },
};