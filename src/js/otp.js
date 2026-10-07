import { XalConstants } from './core/XalConstants.js';

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