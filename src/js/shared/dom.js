/**
 * Recherche un élément parent et lit l'attribut qui identifie son contexte.
 *
 * @param {Element} element         Élément à partir duquel remonter dans le DOM.
 * @param {string}  selector        Sélecteur de l'élément parent à trouver.
 * @param {string}  attributeName   Nom de l'attribut contenant la valeur de contexte.
 * @returns {{element: Element, value: string}|null} Contexte trouvé ou `null` si incomplet.
 */
export function getClosestAttributeContext(element, selector, attributeName) {
    const contextElement = element.closest(selector);
    const value          = contextElement?.getAttribute(attributeName);

    if (!contextElement || !value) {
        console.error(`Contexte introuvable pour le sélecteur "${selector}" et l'attribut "${attributeName}".`);
        return null;
    }

    return { element: contextElement, value };
}

/**
 * Récupère un template HTML par son identifiant.
 *
 * @param {string}      id              Identifiant du template.
 * @param {ParentNode}  [root=document] Racine DOM dans laquelle rechercher.
 * @returns {HTMLTemplateElement|null}  Template trouvé ou `null` s'il est absent ou invalide.
 */
export function getTemplateById(id, root = document) {
    const template = typeof root.getElementById === 'function'
        ? root.getElementById(id)
        : root.querySelector(`#${CSS.escape(id)}`);

    if (!(template instanceof HTMLTemplateElement)) {
        console.error(`Template HTML introuvable ou invalide : "${id}".`);
        return null;
    }

    return template;
}
