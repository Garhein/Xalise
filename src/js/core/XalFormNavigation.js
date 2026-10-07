import { XalConstants } from './XalConstants.js';

/**
 * Intercepte les formulaires qui déclarent une cible de navigation.
 *
 * Les données du formulaire ne sont pas envoyées : après validation,
 * seule la page indiquée dans data-xal-target est chargée.
 *
 * @param {ParentNode} [root=document] Racine DOM dans laquelle rechercher les formulaires.
 * @returns {void}
 */
export function initStaticFormNavigation(root = document) {
    const forms = root.querySelectorAll(XalConstants.cssQueries.form.staticTarget);

    forms.forEach((form) => {
        form.addEventListener('submit', (event) => {
            // Empêche l'envoi natif, qui ferait un GET ou un POST.
            event.preventDefault();

            // Le validateur commun ajoute déjà "was-validated".
            if (!form.checkValidity()) {
                return;
            }

            // Récupération de la cible
            const target = form.dataset.xalTarget?.trim();

            if (!target) {
                console.error('[XalFormNavigation] Attribut "data-xal-target" vide.');
                return;
            }

            window.location.assign(target);
        });
    });
}