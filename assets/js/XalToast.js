/**
 * Gestion des toasts de feedback de l'application.
 *
 * Affiche des toasts Bootstrap contextuels pour informer l'utilisateur
 * du résultat d'une opération : succès, erreur, avertissement ou information.
 *
 * Distinct de XalLoaderToast qui est réservé aux indicateurs de chargement :
 * - XalLoaderToast → opération en cours (spinner, non dismissible)
 * - XalToast       → résultat d'une opération (icône, auto-masqué)
 *
 * Les toasts sont créés dynamiquement et insérés dans le conteneur
 * Bootstrap `.toast-container` existant dans index.html.
 * Ils se masquent automatiquement après le délai configuré
 * et sont retirés du DOM après masquage.
 *
 * Dépendances :
 * - XalConstants.js → XalConstants
 *
 * @namespace XalToast
 * @author Xavier VILLEMIN
 */
const XalToast = (() => {
    /**
     * Délai par défaut en ms avant masquage automatique du toast.
     *
     * @type {number}
     */
    const DEFAULT_DELAY_MS = 5000;

    /**
     * Configuration des variantes de toast.
     *
     * Chaque variante définit :
     * - cssClass  : classe CSS Bootstrap appliquée sur le toast
     * - icon      : icône Bootstrap Icons affichée dans l'en-tête
     * - label     : libellé de l'en-tête du toast
     *
     * @type {Readonly<Record<string, {cssClass: string, icon: string, label: string}>>}
     */
    const VARIANTS = Object.freeze({
        success: Object.freeze({
            cssClass: 'text-bg-success',
            icon:     'bi-check-circle-fill',
            label:    'Succès',
        }),
        error: Object.freeze({
            cssClass: 'text-bg-danger',
            icon:     'bi-x-circle-fill',
            label:    'Erreur',
        }),
        warning: Object.freeze({
            cssClass: 'text-bg-warning',
            icon:     'bi-exclamation-triangle-fill',
            label:    'Avertissement',
        }),
        info: Object.freeze({
            cssClass: 'text-bg-info',
            icon:     'bi-info-circle-fill',
            label:    'Information',
        }),
    });

    /**
     * Crée, insère et affiche un toast Bootstrap dans le conteneur de toasts.
     *
     * Le toast est retiré du DOM automatiquement après masquage
     * via l'événement hidden.bs.toast.
     *
     * @param {string} message          - Message à afficher dans le corps du toast.
     * @param {string} variant          - Variante du toast ('success', 'error', 'warning', 'info').
     * @param {number} [delay]          - Délai en ms avant masquage automatique.
     */
    const _show = (message, variant, delay = DEFAULT_DELAY_MS) => {
        const config = VARIANTS[variant] ?? VARIANTS.info;

        // Création de l'élément toast
        const toastElt       = document.createElement('div');
        toastElt.className   = `toast xal-toast ${config.cssClass}`;
        toastElt.setAttribute('role', 'alert');
        toastElt.setAttribute('aria-live', variant === 'error' ? 'assertive' : 'polite');
        toastElt.setAttribute('aria-atomic', 'true');

        toastElt.innerHTML = `
            <div class="toast-header">
                <i class="bi ${config.icon} me-2" aria-hidden="true"></i>
                <strong class="me-auto">${config.label}</strong>
                <button type="button"
                        class="btn-close"
                        data-bs-dismiss="toast"
                        aria-label="Fermer">
                </button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        // Insertion dans le conteneur de toasts existant
        const container = document.querySelector(XalConstants.cssQueries.toastContainer);

        if (container) {
            container.appendChild(toastElt);
        } else {
            document.body.appendChild(toastElt);
        }

        // Création et affichage de l'instance Bootstrap Toast
        const toastInstance = new bootstrap.Toast(toastElt, {
            autohide: true,
            delay,
        });

        // Nettoyage du DOM après masquage
        toastElt.addEventListener('hidden.bs.toast', () => {
            toastInstance.dispose();
            toastElt.remove();
        }, { once: true });

        toastInstance.show();
    };

    return {
        /**
         * Affiche un toast de succès.
         *
         * @param {string} message      - Message à afficher.
         * @param {number} [delay]      - Délai en ms avant masquage automatique.
         */
        success(message, delay = DEFAULT_DELAY_MS) {
            _show(message, 'success', delay);
        },

        /**
         * Affiche un toast d'erreur.
         *
         * Utilise aria-live="assertive" pour une annonce immédiate
         * aux technologies d'assistance.
         *
         * @param {string} message      - Message à afficher.
         * @param {number} [delay]      - Délai en ms avant masquage automatique.
         */
        error(message, delay = DEFAULT_DELAY_MS) {
            _show(message, 'error', delay);
        },

        /**
         * Affiche un toast d'avertissement.
         *
         * @param {string} message      - Message à afficher.
         * @param {number} [delay]      - Délai en ms avant masquage automatique.
         */
        warning(message, delay = DEFAULT_DELAY_MS) {
            _show(message, 'warning', delay);
        },

        /**
         * Affiche un toast d'information.
         *
         * @param {string} message      - Message à afficher.
         * @param {number} [delay]      - Délai en ms avant masquage automatique.
         */
        info(message, delay = DEFAULT_DELAY_MS) {
            _show(message, 'info', delay);
        },
    };
})();