import { initBootstrapFormValidation } from '../core/XalFormValidation.js';
import { initStaticFormNavigation } from '../core/XalFormNavigation.js';

/**
 * Initialise les comportements communs aux pages d'authentification.
 *
 * @param {ParentNode} [root=document] Racine DOM contenant les formulaires d'authentification.
 */
export function initAuthPage(root = document) {
    initBootstrapFormValidation(root);
    initStaticFormNavigation(root);
}
