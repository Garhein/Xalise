/**
 * API de gestion des toasts de notification.
 *
 * Permet d'afficher des toasts Bootstrap signalant le résultat
 * d'une action utilisateur : succès, erreur, avertissement, information ou personnalisé.
 *
 * Les toasts sont instanciés dynamiquement, injectés dans `.toast-container`,
 * puis automatiquement masqués et supprimés du DOM après expiration du délai configuré.
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
     * @typedef {Object} ToastOptions
     * @property {string} title
     * @property {string} message
     * @property {string} icon
     * @property {string} color
     */

    /**
     * Délai par défaut en ms avant masquage automatique du toast.
     *
     * @type {number}
     */
    const DEFAULT_DELAY_MS = 5000;

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
    const ToastVariant = Object.freeze({
        success:    'success',
        error:      'error',
        warning:    'warning',
        info:       'info',
    });

    /**
     * Configuration des différentes variantes des toasts.
     *
     * Chaque variante définit le titre, l'icône et la classe de couleur
     * appliqués lors de l'affichage du toast.
     *
     * Le champ message est intentionnellement vide. Il est rempli dynamiquement
     * dans _getOptions() sans muter l'objet source.
     *
     * @constant
     * @readonly
     * @type {Readonly<Record<keyof typeof ToastVariant, ToastOptions>>}
     */
    const ToastVariantConfig = Object.freeze({
        success: Object.freeze({
            title:      'Succès',
            icon:       XalConstants.cssClasses.bootstrapIcon.checkCircleFill,
            color:      XalConstants.cssClasses.bootstrapTextBg.success,
        }),
        error: Object.freeze({
            title:      'Erreur',
            icon:       XalConstants.cssClasses.bootstrapIcon.xCircleFill,
            color:      XalConstants.cssClasses.bootstrapTextBg.danger,
        }),
        warning: Object.freeze({
            title:      'Avertissement',
            icon:       XalConstants.cssClasses.bootstrapIcon.exclamationTriangleFill,
            color:      XalConstants.cssClasses.bootstrapTextBg.warning,
        }),
        info: Object.freeze({
            title:      'Information',
            icon:       XalConstants.cssClasses.bootstrapIcon.infoCircleFill,
            color:      XalConstants.cssClasses.bootstrapTextBg.info,
        }),
    });

    /**
     * Référence vers le template HTML des toasts.
     * Résolu une seule fois dans init() depuis le HTML statique.
     *
     * @type {HTMLTemplateElement|null}
     */
    let _templateElt = null;

    /**
     * Construit les options d'un toast à partir de sa variante.
     *
     * Fusionne la configuration associée à la variante avec le message fourni.
     * Si la variante est inconnue, la variante `info` est utilisée par défaut.
     *
     * @param {keyof typeof ToastVariant} variant - Variante du toast (ex : success, error, warning, info)
     * @param {string}                    message - Message à afficher dans le toast
     * @returns {ToastOptions}
     */
    const _getOptions = (variant, message) => {
        if (!ToastVariantConfig[variant]) {
            console.warn(`[XalToast] Variante inconnue "${variant}", fallback sur "info".`);
        }

        const base = ToastVariantConfig[variant] ?? ToastVariantConfig[ToastVariant.info];
        return Object.freeze({ ...base, message });
    };

    /**
     * Crée, insère et affiche un toast Bootstrap à partir du template HTML.
     *
     * Séquence d'exécution :
     * 1. Clonage du template et injection du message
     * 2. Insertion dans le conteneur des toasts
     * 3. Création de l'instance Bootstrap Toast et affichage
     * 4. Nettoyage du DOM après masquage via hidden.bs.toast
     *
     * Sans effet si le template n'a pas été résolu dans init().
     *
     * @param {ToastOptions} options    - Configuration du toast issue de _getOptions() ou de custom().
     * @param {number} [delay]          - Délai en ms avant masquage automatique.
     */
    const _show = (options, delay = DEFAULT_DELAY_MS) => {
        if (!_templateElt) {
            console.warn('[XalToast] init() doit être appelé avant utilisation.');
            return;
        }

        // Clone indépendant du template permettant d'afficher plusieurs toasts simultanément
        const fragment = document.importNode(_templateElt.content, true);
        const toastElt = fragment.querySelector(XalConstants.cssQueries.toast.xalToast);

        if (!toastElt) {
            console.warn('[XalToast] Template invalide : élément toast introuvable.');
            return;
        }

        const header = toastElt.querySelector(XalConstants.cssQueries.toast.header);
        const icon   = toastElt.querySelector(XalConstants.cssQueries.toast.xalToastIcon);
        const label  = toastElt.querySelector(XalConstants.cssQueries.toast.xalToastLabel);

        // Classe supplémentaire sur le toast
        if (options.color) toastElt.classList.add(options.color);

        // Gestion du titre et de l'icône bootstrap
        const hasTitle = Boolean(options.title);
        const hasIcon  = Boolean(options.icon);

        header.toggleAttribute(XalConstants.attributeNames.hidden, !hasTitle);
        icon.toggleAttribute(XalConstants.attributeNames.hidden, !hasIcon);

        if (hasTitle) {
            label.textContent = options.title;
        }

        if (hasIcon) {
            options.icon.split(' ').forEach(cls => icon.classList.add(cls));
        }

        // Injection du message dans le corps du toast
        toastElt.querySelector(XalConstants.cssQueries.toast.xalToastMessage).innerHTML = options.message;

        // Insertion dans le conteneur des toasts, ou dans body en dernier recours
        const container = document.querySelector(XalConstants.cssQueries.toast.container);
        const parent    = container ?? document.body;
        parent.appendChild(toastElt);

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
            _show(_getOptions(ToastVariant.success, message), delay);
        },

        /**
         * Affiche un toast d'erreur.
         *
         * @param {string} message  - Message à afficher.
         * @param {number} [delay]  - Délai en ms avant masquage automatique.
         */
        error(message, delay = DEFAULT_DELAY_MS) {
            _show(_getOptions(ToastVariant.error, message), delay);
        },

        /**
         * Affiche un toast d'avertissement.
         *
         * @param {string} message  - Message à afficher.
         * @param {number} [delay]  - Délai en ms avant masquage automatique.
         */
        warning(message, delay = DEFAULT_DELAY_MS) {
            _show(_getOptions(ToastVariant.warning, message), delay);
        },

        /**
         * Affiche un toast d'information.
         *
         * @param {string} message - Message à afficher.
         * @param {number} [delay] - Délai en ms avant masquage automatique.
         */
        info(message, delay = DEFAULT_DELAY_MS) {
            _show(_getOptions(ToastVariant.info, message), delay);
        },

        /**
         * Affiche un toast avec une configuration personnalisée.
         *
         * Permet d'afficher un toast en dehors des variantes prédéfinies,
         * en fournissant directement un objet options.
         *
         * @param {ToastOptions} options   - Configuration du toast.
         * @param {number}       [delay]   - Délai en ms avant masquage automatique.
         */
        custom(options, delay = DEFAULT_DELAY_MS) {
            _show(options, delay);
        },

        /**
         * Initialise le composant en résolvant le template HTML.
         *
         * Doit être appelé avant toute utilisation de l'API.
         */
        init() {
            // Assure l'idempotence : évite une double initialisation
            if (_templateElt) return;

            _templateElt = document.getElementById(XalConstants.elementIds.toastTemplateFeedback);
        
            if (!_templateElt) {
                console.warn('[XalToast] Élément introuvable dans le DOM.');
                return;
            }
        },
    };
})();