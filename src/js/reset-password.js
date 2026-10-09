import { XalConstants } from './core/XalConstants.js';

const form          = document.getElementById(XalConstants.elementIds.password.form);
const passwordInput = document.getElementById(XalConstants.elementIds.password.inputReset);
const confirmInput  = document.getElementById(XalConstants.elementIds.password.inputResetConfirmation);

const ruleElements = {
    length:     document.querySelector(XalConstants.cssQueries.password.ruleLength),
    uppercase:  document.querySelector(XalConstants.cssQueries.password.ruleUppercase),
    number:     document.querySelector(XalConstants.cssQueries.password.ruleNumber),
    special:    document.querySelector(XalConstants.cssQueries.password.ruleSpecial),
};

/**
 * Vérifie la validité des mots de passe saisis.
 */
function updatePasswordValidity() {
    const password  = passwordInput.value;
    const rules     = {
        length:     [...password].length >= 10,
        uppercase:  /\p{Lu}/u.test(password),
        number:     /\p{Nd}/u.test(password),
        special:    /[\p{P}\p{S}]/u.test(password),
    };

    for (const [name, isValid] of Object.entries(rules)) {
        const ruleElement = ruleElements[name];

        ruleElement.classList.toggle(XalConstants.cssClasses.bootstrapTextColor.success, isValid);
        ruleElement.classList.toggle(XalConstants.cssClasses.bootstrapTextColor.bodySecondary, !isValid);
    }

    const passwordIsValid = Object.values(rules).every(Boolean);

    passwordInput.setCustomValidity(
        passwordIsValid ? '' : 'Le mot de passe ne respecte pas toutes les règles.'
    );

    const passwordMatch = password === confirmInput.value;

    // Un champ de confirmation vide reste invalide grâce à l'attribut 'required'
    confirmInput.setCustomValidity(
        confirmInput.value === '' || passwordMatch
            ? ''
            : 'Les deux mots de passe doivent être identiques.'
    );
}

passwordInput.addEventListener('input', updatePasswordValidity);
confirmInput.addEventListener('input', updatePasswordValidity);
form.addEventListener('submit', updatePasswordValidity, true);