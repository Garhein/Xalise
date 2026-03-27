
/**
 * API de gestion des toasts de notification.
 *
 * Fournit des méthodes pour afficher des toasts Bootstrap contextuels
 * signalant le résultat d'une action : succès, erreur, avertissement ou information.
 *
 * Chaque toast est instancié dynamiquement, injecté dans le conteneur `.toast-container`,
 * puis automatiquement masqué et supprimé du DOM après expiration du délai configuré.
 *
 * Cette API est distincte de XalLoaderToast, dédié aux indicateurs de chargement :
 * - XalLoaderToast → opération en cours (spinner, non dismissible)
 * - XalToast       → retour utilisateur (icône, masquage automatique)
 *
 * Dépendances :
 * - XalConstants
 *
 * @namespace XalToast
 */
const XalToast = (() => {
    /**
     * Délai par défaut en ms avant masquage automatique du toast.
     *
     * @type {number}
     */
    const DEFAULT_DELAY_MS = 5000;

    /**
     * Références vers les templates HTML des différentes variantes des toasts.
     * Clé : ID du template.
     * Valeur : HTMLTemplateElement.
     *
     * @type {Map<string, HTMLTemplateElement>}
     */
    let _templates = new Map();

    /**
     * Table de correspondance entre le nom des différentes variantes 
     * des toasts et les identifiants DOM de leur template HTML respectif.
     * 
     * Centralise la résolution interne des variantes sans dupliquer
     * les identifiants définis dans XalConstants.elementIds.
     *
     * Utilisé lors de l'initialisation pour mettre en cache les templates,
     * et à l'affichage pour sélectionner le template à instancier.
     *
     * @constant
     * @readonly
     * @type {Record<string, string>}
     */
    const ToastTemplateIdsByVariant = Object.freeze({
        success: XalConstants.elementIds.toastTemplateSuccess,
        error:   XalConstants.elementIds.toastTemplateError,
        warning: XalConstants.elementIds.toastTemplateWarning,
        info:    XalConstants.elementIds.toastTemplateInfo,
    });

    /**
     * Énumération des différentes variantes des toasts supportées par l'API.
     *
     * Utilisée pour qualifier le type de notification et appliquer
     * le rendu Bootstrap correspondant.
     *
     * @constant
     * @readonly
     * @enum {string}
     */
    const ToastVariantName = Object.freeze({
        success:   'success',
        error:     'error',
        warning:   'warning',
        info:      'info',
    });

    /**
     * Crée, insère et affiche un toast Bootstrap depuis son template HTML.
     *
     * Séquence d'exécution :
     * 1. Résolution du template correspondant à la variante
     * 2. Clonage du template et injection du message
     * 3. Insertion dans le conteneur des toasts
     * 4. Création de l'instance Bootstrap Toast et affichage
     * 5. Nettoyage du DOM après masquage via hidden.bs.toast
     *
     * Si la variante est inconnue, la variante "info" est utilisée par défaut.
     * Sans effet si le template de la variante n'a pas été résolu dans init().
     *
     * @param {string} message  - Message à afficher dans le corps du toast.
     * @param {string} variant  - Variante du toast ('success', 'error', 'warning', 'info').
     * @param {number} [delay]  - Délai en ms avant masquage automatique.
     */
    const _show = (message, variant, delay = DEFAULT_DELAY_MS) => {
        const templateId  = ToastTemplateIdsByVariant[variant] ?? ToastTemplateIdsByVariant.info;
        const templateElt = _templates.get(templateId);

        if (!templateElt) return;

        // Clone indépendant du template permettant d'afficher plusieurs toasts simultanément
        const clone    = document.importNode(templateElt.content, true);
        const toastElt = clone.querySelector(XalConstants.cssQueries.xalToast);

        // Injection du message dans le corps du toast
        toastElt.querySelector(XalConstants.cssQueries.xalToastMessage).textContent = message;

        // Insertion dans le conteneur des toasts, ou dans body en dernier recours
        const container = document.querySelector(XalConstants.cssQueries.toastContainer);
        (container ?? document.body).appendChild(toastElt);

        // Création de l'instance Bootstrap avec masquage automatique
        const toastInstance = new bootstrap.Toast(toastElt, { autohide: true, delay });

        // Nettoyage du DOM après la fin de l'animation de masquage
        // { once: true } garantit que le listener se supprime automatiquement
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
         * @param {string} message  - Message à afficher.
         * @param {number} [delay]  - Délai en ms avant masquage automatique.
         */
        success(message, delay = DEFAULT_DELAY_MS) {
            _show(message, ToastVariantName.success, delay);
        },

        /**
         * Affiche un toast d'erreur.
         *
         * Utilise aria-live="assertive" pour une annonce immédiate
         * aux technologies d'assistance.
         *
         * @param {string} message  - Message à afficher.
         * @param {number} [delay]  - Délai en ms avant masquage automatique.
         */
        error(message, delay = DEFAULT_DELAY_MS) {
            _show(message, ToastVariantName.error, delay);
        },

        /**
         * Affiche un toast d'avertissement.
         *
         * @param {string} message  - Message à afficher.
         * @param {number} [delay]  - Délai en ms avant masquage automatique.
         */
        warning(message, delay = DEFAULT_DELAY_MS) {
            _show(message, ToastVariantName.warning, delay);
        },

        /**
         * Affiche un toast d'information.
         *
         * @param {string} message - Message à afficher.
         * @param {number} [delay] - Délai en ms avant masquage automatique.
         */
        info(message, delay = DEFAULT_DELAY_MS) {
            _show(message, ToastVariantName.info, delay);
        },

        /**
         * Initialise le composant.
         *
         * Résout les références vers les templates HTML des différentes variantes.
         * Doit être appelé une seule fois depuis xalise.js au DOMContentLoaded,
         * avant tout appel à success(), error(), warning() ou info().
         */
        init() {
            Object.values(ToastTemplateIdsByVariant).forEach(id => {
                const templateElt = document.getElementById(id);
                if (templateElt) _templates.set(id, templateElt);
            });
        },
    };
})();