import { XalConstants } from './XalConstants.js';

/**
 * Vide les champs modifiables d'un formulaire de recherche.
 * - décoche les cases à cocher et les boutons radio
 * - vide les champs texte et les zones de texte
 * - réinitialise les listes déroulantes de sélection
 * 
 * Les boutons, éléments désactivés ou en lecture seule et les éléments portant la
 * classe `xal-form-do-not-empty` sont ignorés.
 * 
 * Le message de validation personnalisé est effacé après le nettoyage de chaque champ traité
 * et les événements `input` et `change` sont déclenchés.
 * 
 * @param   {HTMLFormElement} form  Formulaire dont les champs doivent être vidés.
 * @returns {void}
 * @throws  {TypeError}             Si `form` n'est pas un élément `<form>`.
 */
export function clearFormFields(form) {
    if (!(form instanceof HTMLFormElement)) {
        throw new TypeError('Un élément <form> est requis.');
    }

    for (const field of form.elements) {
        if (field.disabled || field.readOnly || field.classList.contains(XalConstants.cssClasses.form.doNotEmpty)) {
            continue;
        }

        if (field instanceof HTMLInputElement) {
            switch (field.type) {
                case 'checkbox':
                case 'radio':
                    field.checked = false;
                    break;

                case 'button':
                case 'submit':
                case 'reset':
                case 'image':
                    continue;

                case 'file':
                    field.value = '';
                    break;

                // Ces types ont toujours une valeur valide
                case 'color':
                case 'range': 
                    field.value = field.defaultValue;
                    break;
                
                default: 
                    field.value = '';
            }
        }
        else if (field instanceof HTMLTextAreaElement) {
            field.value = '';
        }
        else if (field instanceof HTMLSelectElement) {
            if (field.multiple) {
                for (const option of field.options) {
                    option.selected = false;
                }
            }
            else {
                const emptyOptionIndex = [...field.options].findIndex(
                    (option) => option.value === '' && !option.disabled
                );
                
                field.selectedIndex = emptyOptionIndex;
            }
        }
        else {
            continue;
        }

        field.setCustomValidity('');
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

/**
 * Initialise les boutons qui vident les critères des formulaires de recherche.
 * 
 * Recherche dans `root` les éléments portant l'attribut `data-xal-form-clear-criteria`, puis
 * leur associe un écouteur de clic. Au clic, le formulaire associé au bouton est transmis
 * à `clearFormFields`.
 * 
 * @param   {ParentNode} [root=document] Racine DOM dans laquelle rechercher les boutons.
 * @returns {void}
 */
export function initFormClearButtons(root = document) {
    root
        .querySelectorAll(XalConstants.cssQueries.form.formClearCriteria)
        .forEach((button) => {
            button.addEventListener('click', () => {
                if (button.form) {
                    clearFormFields(button.form);
                }
            });
        });
}