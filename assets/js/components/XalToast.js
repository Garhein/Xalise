/**
 * API de gestion des toasts de notification.
 * 
 * Affiche des toasts Bootstrap signalant le résultat d'une action
 * utilisateur : succès, erreur, avertissement, information ou personnalisé.
 * 
 * Le composant repose sur un élément DOM existant (non dynamique) servant de template,
 * résolu via la méthode `init()` et cloné à chaque affichage de toast.
 * 
 * Chaque toast est automatiquement masqué après un délai configurable (5s par défaut) 
 * et nettoie le DOM à la fin de l'animation de masquage.
 * 
 * Dépendances :
 * - XalConstants
 * 
 * @namespace XalToast
 */
const XalToast = (() => {
    /**
     * @typedef {Object} ToastOptions
     * @property {string}   title               Titre du toast.
     * @property {string}   message             Contenu HTML ou texte brut à afficher.
     * @property {string}   icon                Classes CSS de l'icône Bootstrap à afficher (ex : 'bi-check-circle-fill').
     * @property {string}   color               Classe CSS de couleur à appliquer sur le toast (ex : 'text-bg-success').
     * @property {boolean}  [allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
     */

    /**
     * Délai par défaut en ms avant masquage automatique du toast.
     * 
     * @private
     *
     * @type {number}
     */
    const DEFAULT_DELAY_MS = 5000;

    /**
     * Énumération des différentes variantes supportées par l'API.
     *
     * @private
     *
     * @constant
     * @type {Readonly<Record<string, string>>}
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
     * Le message et l'autorisation du HTML sont remplis dynamiquement
     * dans `_getOptions()` sans muter l'objet source.
     * 
     * @private
     *
     * @constant
     * @type {Readonly<Record<keyof typeof ToastVariant, ToastOptions>>}
     */
    const ToastVariantConfig = Object.freeze({
        success: Object.freeze({
            title:      'Succès',
            icon:       XalConstants.cssClasses.bootstrapIcons.checkCircleFill,
            color:      XalConstants.cssClasses.bootstrapTextBg.success,
        }),
        error: Object.freeze({
            title:      'Erreur',
            icon:       XalConstants.cssClasses.bootstrapIcons.xCircleFill,
            color:      XalConstants.cssClasses.bootstrapTextBg.danger,
        }),
        warning: Object.freeze({
            title:      'Avertissement',
            icon:       XalConstants.cssClasses.bootstrapIcons.exclamationTriangleFill,
            color:      XalConstants.cssClasses.bootstrapTextBg.warning,
        }),
        info: Object.freeze({
            title:      'Information',
            icon:       XalConstants.cssClasses.bootstrapIcons.infoCircleFill,
            color:      XalConstants.cssClasses.bootstrapTextBg.info,
        }),
    });

    /**
     * Référence vers le template HTML des toasts.
     *
     * @private
     * 
     * @type {HTMLTemplateElement|null}
     */
    let _templateElement = null;

    /**
     * Récupère les options du toast à afficher en fonction de la variante souhaitée.
     * 
     * La configuration de la variante est fusionnée avec le message fourni pour construire l'objet d'options complet.
     * Si la variante souhaitée n'existe pas, un avertissement est loggé et la variante "info" est utilisée par défaut.
     * 
     * @private
     *  
     * @param {keyof typeof ToastVariant} variant           Variante du toast.
     * @param {string}                    message           Message à afficher dans le toast.
     * @param {boolean}                   [allowHtml=false] Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
     * 
     * @returns {ToastOptions} Objet d'options complet.
     */
    const _getOptions = (variant, message, allowHtml = false) => {
        if (!ToastVariantConfig[variant]) {
            console.warn(`[XalToast] Variante "${variant}" inconnue, fallback sur la variante "info".`);
        }

        const base = ToastVariantConfig[variant] ?? ToastVariantConfig[ToastVariant.info];
        return Object.freeze({ ...base, message, allowHtml });
    };

    /**
     * Crée, insère et affiche un toast Bootstrap à partir du template HTML.
     * 
     * Séquence d'exécution :
     * 1. Clonage du template et gestion du titre, de l'icône, du message et des classes CSS complémentaires
     * 2. Insertion dans le conteneur des toasts
     * 3. Création de l'instance Bootstrap Toast et affichage
     * 4. Nettoyage du DOM après masquage via hidden.bs.toast
     * 
     * Sans effet si le template n'a pas été résolu dans `init()`.
     * 
     * @private
     * 
     * @param {ToastOptions}    options Configuration du toast.
     * @param {number}          [delay] Délai en ms avant masquage automatique.
     */
    const _show = (options, delay = DEFAULT_DELAY_MS) => {
        if (!_templateElement) {
            console.warn('[XalToast] la méthode d\'initialisation doit être appelée avant utilisation.');
            return;
        }

        // Clone indépendant du template permettant d'afficher plusieurs toasts simultanément
        const fragment = document.importNode(_templateElement.content, true);
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
        const displayTitle = Boolean(options.title);
        const displayIcon  = Boolean(options.icon);

        header.toggleAttribute(XalConstants.attributeNames.hidden, !displayTitle);
        icon.toggleAttribute(XalConstants.attributeNames.hidden, !displayIcon);

        if (displayTitle) {
            label.textContent = options.title;
        }

        if (displayIcon) {
            options.icon.split(' ').forEach(cls => icon.classList.add(cls));
        }

        // Injection du message dans le corps du toast
        if (options.allowHtml) {
            toastElt.querySelector(XalConstants.cssQueries.toast.xalToastMessage).innerHTML = options.message;    
        }
        else {
            toastElt.querySelector(XalConstants.cssQueries.toast.xalToastMessage).textContent = options.message;    
        }

        // Insertion dans le conteneur des toasts ou dans body en dernier recours
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
         * Initialise le composant en résolvant le template HTML.
         * 
         * L'idempotence est assurée : si le template a déjà été résolu, la méthode ne fait rien.
         * 
         * @public
         * 
         * @throws {Error} Si le template du toast n'est pas trouvé dans le DOM.
         */
        init() {
            if (_templateElement) return;

            _templateElement = document.getElementById(XalConstants.elementIds.toastTemplateFeedback);

            if (!_templateElement) {
                throw new Error(`[XalToast] Template "${XalConstants.elementIds.toastTemplateFeedback}" non trouvé dans le DOM.`);
            }
        },
        
        /**
         * Affiche un toast de succès.
         * 
         * @public
         *
         * @param {string}  message             Message à afficher.
         * @param {boolean} [allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
         * @param {number}  [delay]             Délai en ms avant masquage automatique.
         */
        success(message, allowHtml = false, delay = DEFAULT_DELAY_MS) {
            _show(_getOptions(ToastVariant.success, message, allowHtml), delay);
        },

        /**
         * Affiche un toast d'erreur.
         * 
         * @public
         *
         * @param {string}  message             Message à afficher.
         * @param {boolean} [allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
         * @param {number}  [delay]             Délai en ms avant masquage automatique.
         */
        error(message, allowHtml = false, delay = DEFAULT_DELAY_MS) {
            _show(_getOptions(ToastVariant.error, message, allowHtml), delay);
        },

        /**
         * Affiche un toast d'avertissement.
         * 
         * @public
         *
         * @param {string}  message             Message à afficher.
         * @param {boolean} [allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
         * @param {number}  [delay]             Délai en ms avant masquage automatique.
         */
        warning(message, allowHtml = false, delay = DEFAULT_DELAY_MS) {
            _show(_getOptions(ToastVariant.warning, message, allowHtml), delay);
        },

        /**
         * Affiche un toast d'information.
         * 
         * @public
         *
         * @param {string}  message             Message à afficher.
         * @param {boolean} [allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
         * @param {number}  [delay]             Délai en ms avant masquage automatique.
         */
        info(message, allowHtml = false, delay = DEFAULT_DELAY_MS) {
            _show(_getOptions(ToastVariant.info, message, allowHtml), delay);
        },

        /**
         * Affiche un toast de notification personnalisé.
         *
         * Permet d'afficher un toast en dehors des variantes prédéfinies,
         * en fournissant directement un objet options.
         * 
         * @public
         *
         * @param {ToastOptions} options    Configuration du toast.
         * @param {number}       [delay]    Délai en ms avant masquage automatique.
         */
        custom(options, delay = DEFAULT_DELAY_MS) {
            _show(options, delay);
        },
    };
})();