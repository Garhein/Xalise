import { XalConstants } from './core/XalConstants.js';

const loginForm = document.getElementById(XalConstants.elementIds.form.login);
if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        // La maquette ne transmet pas le formulaire à un serveur.
        event.preventDefault();

        // Le validateur commun ajoute déjà "was-validated".
        if (!loginForm.checkValidity()) {
            return;
        }

        window.location.assign('./otp.html');
    });
}