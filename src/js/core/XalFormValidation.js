import { XalConstants } from './XalConstants.js';

/**
 * Initialise les styles de validation Bootstrap sur les formulaires descendants
 * correspondant au sélecteur `needs-validation`.
 * 
 * À la soumission, les contraintes HTML natives du formulaire sont vérifiées. Si le
 * formulaire est invalide, sa soumission est bloquée. Dans tous les cas, la classe `was-validated'
 * esdt ajoutée pour afficher les retours Bootstrap.
 * 
 * @param {ParentNode} [root=document] Racine DOM dans laquelle rechercher les formulaires.
 * @returns {void}
 */
export function initBootstrapFormValidation(root = document) {
    const forms = root.querySelectorAll(XalConstants.cssQueries.form.needsValidate);

    forms.forEach((form) => {
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add(XalConstants.cssClasses.form.wasValidated);
        });
    });
}