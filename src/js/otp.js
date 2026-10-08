import { XalConstants } from './core/XalConstants.js';

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Gestion du compte à rebours
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

const OTP_DURATION_SECONDS  = 1 * 60;
const countdown             = document.getElementById(XalConstants.elementIds.otp.countdownTimer);
const resendButton          = document.getElementById(XalConstants.elementIds.otp.resendBtn);

if (countdown && resendButton) {
    let deadline;
    let intervalId;

    /**
     * Mise à jour du compte à rebours et activation du bouton de renvoi du code
     * lorsqu'il atteint 0.
     */
    function updateCountdown() {
        const remaining = Math.max(
            0,
            Math.ceil((deadline - Date.now()) / 1000)
        );

        // Mise à jour de la barre de progression
        const progress    = document.getElementById(XalConstants.elementIds.otp.countdownProgress);
        const progressBar = document.getElementById(XalConstants.elementIds.otp.countdownProgressBar);
        const percentage  = Math.round((remaining / OTP_DURATION_SECONDS) * 100);

        progressBar.style.width = `${percentage}%`;
        progress.setAttribute(XalConstants.ariaNames.valueNow, String(percentage));

        progressBar.classList.remove(
            XalConstants.cssClasses.bootstrapBgColor.success, 
            XalConstants.cssClasses.bootstrapBgColor.warning,
            XalConstants.cssClasses.bootstrapBgColor.danger
        );

        if (remaining <= OTP_DURATION_SECONDS * 0.25) {
            progressBar.classList.add(XalConstants.cssClasses.bootstrapBgColor.danger);
        }
        else if (remaining <= OTP_DURATION_SECONDS * 0.5) {
            progressBar.classList.add(XalConstants.cssClasses.bootstrapBgColor.warning);
        }
        else {
            progressBar.classList.add(XalConstants.cssClasses.bootstrapBgColor.success);
        }

        // Mise à jour du texte
        const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
        const seconds = String(remaining % 60).padStart(2, '0');

        countdown.textContent = `${minutes}:${seconds}`;

        // Activation du bouton de renvoi du code
        if (remaining === 0) {
            clearInterval(intervalId);
            intervalId = undefined;
            resendButton.disabled = false;
        }
    }

    /**
     * Démarre le compte à rebours et désactive le bouton de renvoi du code.
     */
    function startCountdown() {
        clearInterval(intervalId);

        deadline = Date.now() + OTP_DURATION_SECONDS * 1000;
        resendButton.disabled = true;

        updateCountdown();
        intervalId = setInterval(updateCountdown, 1000);
    }

    startCountdown();

    /**
     * Clic sur le bouton de renvoi du code.
     * Dans la maquette, on simule simplement le renvoi réussi.
     */
    resendButton.addEventListener('click', () => {
        startCountdown();
    });
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Passage de champ en champ
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

const otpInputs = Array.from(document.querySelectorAll(XalConstants.cssQueries.otpDigits));

/**
 * Déplace le curseur dans le champ précédent et sélectionne son contenu.
 * @param {number} index
 * @returns {void}
 */
function focusPreviousOtpInput(index) {
    if (index === 0) return;

    const previousInput = otpInputs[index - 1];
    previousInput.focus();
}

/**
 * Déplace le curseur dans le champ suivant et sélectionne son contenu.
 * @param {number} index
 * @returns {void}
 */
function focusNextOtpInput(index) {
    if (index >= otpInputs.length - 1) return;

    const nextInput = otpInputs[index + 1];
    nextInput.focus();
}

otpInputs.forEach((input, index) => {
    input.addEventListener('focus', () => input.select());
    input.addEventListener('click', () => input.select());

    input.addEventListener('input', (event) => {
        // Conserver un seul chiffre
        input.value = input.value.replace(/\D/g, '').slice(0, 1);

        if (input.value) {
            // Passer au champ suivant dès qu'un chiffre est saisi
            if (index < otpInputs.length - 1) {
                focusNextOtpInput(index);
            }
            else if (otpInputs.every((otpInput) => otpInput.value !== '')) {
                // Saisie du dernier chiffre : on retire le focus
                input.blur();
            }
            return;
        }

        // Revenir au champ précédent
        if (['deleteContentBackward', 'deleteContentForward'].includes(event.inputType)) {
            focusPreviousOtpInput(index);
        }
    });

    // Revenir au champ précédent si le champ courant est vide
    input.addEventListener('keydown', (event) => {
        const isDeleteKey = ['Backspace', 'Delete'].includes(event.key);

        if (isDeleteKey && !input.value && index > 0) {
            event.preventDefault();
            focusPreviousOtpInput(index);
        }
    });
});
