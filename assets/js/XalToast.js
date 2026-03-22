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
     * Référence vers les templates HTML des variantes de toast.
     * Clé : ID du template, Valeur : HTMLTemplateElement.
     *
     * @type {Map<string, HTMLTemplateElement>}
     */
    let _templates = new Map();

    /**
     * Table de correspondance entre les noms de variantes de toast
     * et les identifiants DOM de leurs templates HTML respectifs.
     *
     * Centralise la résolution interne des variantes sans dupliquer
     * les identifiants définis dans XalConstants.elementIds.
     *
     * Utilisée dans init() pour résoudre les références aux templates,
     * et dans _show() pour sélectionner le template à cloner.
     *
     * @type {Readonly<Record<string, string>>}
     */
    const VARIANT_TEMPLATE_IDS = Object.freeze({
        success: XalConstants.elementIds.toastTemplateSuccess,
        error:   XalConstants.elementIds.toastTemplateError,
        warning: XalConstants.elementIds.toastTemplateWarning,
        info:    XalConstants.elementIds.toastTemplateInfo,
    });

    /**
     * Crée, insère et affiche un toast Bootstrap depuis son template HTML.
     *
     * Séquence d'exécution :
     * 1. Résolution du template correspondant à la variante
     * 2. Clonage du template et injection du message
     * 3. Insertion dans le conteneur de toasts
     * 4. Création de l'instance Bootstrap Toast et affichage
     * 5. Nettoyage du DOM après masquage via hidden.bs.toast
     *
     * Si la variante est inconnue, la variante "info" est utilisée par défaut.
     * Sans effet si le template de la variante n'a pas été résolu dans init().
     *
     * @param {string} message          - Message à afficher dans le corps du toast.
     * @param {string} variant          - Variante du toast ('success', 'error', 'warning', 'info').
     * @param {number} [delay]          - Délai en ms avant masquage automatique.
     */
    const _show = (message, variant, delay = DEFAULT_DELAY_MS) => {
        const templateId  = VARIANT_TEMPLATE_IDS[variant] ?? VARIANT_TEMPLATE_IDS.info;
        const templateElt = _templates.get(templateId);

        if (!templateElt) return;

        // Clone indépendant du template — permet plusieurs toasts simultanés
        const clone    = document.importNode(templateElt.content, true);
        const toastElt = clone.querySelector(XalConstants.cssQueries.toast);

        // Injection du message dans le corps du toast
        toastElt.querySelector(XalConstants.cssQueries.toastMessage).textContent = message;

        // Insertion dans le conteneur de toasts, ou dans body en dernier recours
        const container = document.querySelector(XalConstants.cssQueries.toastContainer);
        (container ?? document.body).appendChild(toastElt);

        // Création de l'instance Bootstrap avec masquage automatique
        const toastInstance = new bootstrap.Toast(toastElt, { autohide: true, delay });

        // Nettoyage du DOM après la fin de l'animation de masquage —
        // { once: true } garantit que le listener se supprime automatiquement.
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

        /**
         * Initialise le composant.
         *
         * Résout les références vers les templates HTML de chaque variante.
         * Doit être appelé une seule fois depuis xalise.js au DOMContentLoaded,
         * avant tout appel à success(), error(), warning() ou info().
         */
        init() {
            Object.values(VARIANT_TEMPLATE_IDS).forEach(id => {
                const templateElt = document.getElementById(id);
                if (templateElt) _templates.set(id, templateElt);
            });
        },
    };
})();