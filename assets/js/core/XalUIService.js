/**
 * Utilitaires communs pour les composants UI.
 *
 * Fournit des helpers pour :
 * - la résolution d'éléments DOM obligatoires
 * - la manipulation standardisée de la visibilité
 *
 * Centralise la gestion des erreurs afin d'assurer un comportement
 * homogène entre les composants.
 *
 * @namespace XalUIService
 */
const XalUIService = {
    /**
     * Résout un élément DOM par son identifiant.
     *
     * @param {string} id Identifiant de l'élément.
     * @returns {HTMLElement} Élément DOM correspondant.
     *
     * @throws {Error} Si aucun élément ne correspond à l'identifiant.
     */
    getElementById(id) {
        const element = document.getElementById(id);

        if (!element) {
            throw new Error(`[XalUIService] Élément introuvable : ${id}`);
        }

        return element;
    },

    /**
     * Résout un élément enfant à partir d'un sélecteur CSS.
     *
     * @param {HTMLElement} parent Élément parent de recherche.
     * @param {string} selector Sélecteur CSS de l'élément cible.
     * @returns {HTMLElement} Élément DOM correspondant.
     *
     * @throws {Error} Si aucun élément ne correspond au sélecteur.
     */
    getRequiredElement(parent, selector) {
        const element = parent.querySelector(selector);

        if (!element) {
            throw new Error(`[XalUIService] Élément introuvable : ${selector}`);
        }

        return element;
    },

    /**
     * Met à jour la visibilité d'un élément.
     *
     * Synchronise les attributs `hidden` et `aria-hidden`
     * afin de garantir :
     * - un affichage correct
     * - une accessibilité conforme
     *
     * @param {HTMLElement} element Élément cible.
     * @param {boolean} isVisible Indique si l'élément doit être visible.
     */
    setVisible(element, isVisible) {
        element.hidden = !isVisible;
        element.setAttribute(XalConstants.ariaNames.hidden, !isVisible);
    },
};