import { XalConstants } from '../core/XalConstants.js';

/**
 * Affiche des toasts bootstrap signalant le résultat d'une action
 * utilisateur : succès, erreur, avertissement, information ou personnalisé.
 * 
 * Le composant repose sur un élément DOM existant (non dynamique) servant de template,
 * résolu via la méthode `init()` et cloné à chaque affichage de toast.
 * 
 * Chaque toast est automatiquement masqué après un délai configurable (5s par défaut) 
 * et nettoie le DOM à la fin de l'animation de masquage.
 * 
 * @requires XalConstants
 * @namespace XalToast
 */
export const XalToast = (() => {
    /**
     * @typedef {Object} ToastOptions           Options de configuration d'un toast.
     * @property {string}   title               Titre du toast.
     * @property {string}   message             Contenu HTML ou texte brut à afficher.
     * @property {string}   icon                Classes CSS de l'icône Bootstrap à afficher (ex : `bi-check-circle-fill`).
     * @property {string}   color               Classe CSS de couleur à appliquer sur le toast (ex : `text-bg-success`).
     * @property {boolean}  [allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
     */

    /**
     * Délai par défaut en ms avant masquage automatique du toast.
     * 
     * @type {number}
     */
    const DEFAULT_DELAY_MS = 5000;

    /**
     * Énumération des différentes variantes supportées par le module.
     * 
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
     * par `_getOptions()` sans muter l'objet source.
     * 
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
     * Élément DOM du template HTML, résolu par `init()`.
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
     * Crée, insère et affiche un toast bootstrap à partir du template HTML.
     * 
     * Séquence d'exécution :
     * 1. Clonage du template et gestion du titre, de l'icône, du message et des classes CSS complémentaires
     * 2. Insertion dans le conteneur des toasts
     * 3. Création de l'instance Bootstrap Toast et affichage
     * 4. Nettoyage du DOM après masquage via hidden.bs.toast
     * 
     * @param {ToastOptions}    options Configuration du toast.
     * @param {number}          [delay] Délai en ms avant masquage automatique.
     */
    const _show = (options, delay = DEFAULT_DELAY_MS) => {
        if (!_templateElement) {
            throw new Error(`[XalToast] Template "${XalConstants.elementIds.toastTemplateFeedback}" introuvable dans le DOM.`);
        }

        // Clone indépendant du template permettant d'afficher plusieurs toasts simultanément
        const fragment = document.importNode(_templateElement.content, true);
        const toastElt = fragment.querySelector(XalConstants.cssQueries.toast.xalToast);

        if (!toastElt) {
            throw new Error(`[XalToast] Template invalide : élément toast introuvable.`);
        }

        // Classe supplémentaire sur le toast
        if (options.color) toastElt.classList.add(options.color);

        // Gestion du titre et de l'icône bootstrap
        const displayTitle = Boolean(options.title);
        const displayIcon  = Boolean(options.icon);

        const icon   = toastElt.querySelector(XalConstants.cssQueries.toast.xalToastIcon);
        const label  = toastElt.querySelector(XalConstants.cssQueries.toast.xalToastLabel);
        const msgElt = toastElt.querySelector(XalConstants.cssQueries.toast.xalToastMessage);

        if (!msgElt) {
            throw new Error(`[XalToast] Template invalide : élément du message "${XalConstants.cssQueries.toast.xalToastMessage}" introuvable.`);
        }

        if (label) {
            if (displayTitle) {
                label.textContent = options.title;
            }
            else {
                // Entête du toast sans titre : on ne cache pas l'élément pour conserver l'affichage du bouton de fermeture, 
                // mais on vide le texte pour ne rien afficher.
                label.textContent = '';
            }
        }

        if (icon && displayIcon) {
            options.icon.split(' ').forEach(cls => icon.classList.add(cls));
        }

        // Injection du message dans le corps du toast
        if (msgElt) {
            const message = options.message ?? '';

            if (options.allowHtml) {
                msgElt.innerHTML = message;
            }
            else {
                msgElt.textContent = message;
            }
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

    return Object.freeze({
        /**
         * Initialise le module en résolvant le template HTML.
         * Les appels suivants sont sans effet.
         * 
         * @throws {Error} Si le template est introuvable dans le DOM.
         */
        init() {
            if (_templateElement) return;

            const templateId    = XalConstants.elementIds.toastTemplateFeedback;
            const templateElt   = document.getElementById(templateId);

            if (!templateElt) {
                throw new Error(`[XalToast] Template "${templateId}" introuvable dans le DOM.`);
            }

            _templateElement = templateElt;
        },
        
        /**
         * Affiche un toast de succès.
         *
         * @param {string}  message                     Message à afficher.
         * @param {object}  [options]                   Options d'affichage du toast.
         * @param {boolean} [options.allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
         * @param {number}  [options.delay]             Délai en ms avant masquage automatique.
         */
        success(message, { allowHtml = false, delay = DEFAULT_DELAY_MS } = {}) {
            _show(_getOptions(ToastVariant.success, message, allowHtml), delay);
        },

        /**
         * Affiche un toast d'erreur.
         *
         * @param {string}  message                     Message à afficher.
         * @param {object}  [options]                   Options d'affichage du toast.
         * @param {boolean} [options.allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
         * @param {number}  [options.delay]             Délai en ms avant masquage automatique.
         */
        error(message, { allowHtml = false, delay = DEFAULT_DELAY_MS } = {}) {
            _show(_getOptions(ToastVariant.error, message, allowHtml), delay);
        },

        /**
         * Affiche un toast d'avertissement.
         *
         * @param {string}  message                     Message à afficher.
         * @param {object}  [options]                   Options d'affichage du toast.
         * @param {boolean} [options.allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
         * @param {number}  [options.delay]             Délai en ms avant masquage automatique.
         */
        warning(message, { allowHtml = false, delay = DEFAULT_DELAY_MS } = {}) {
            _show(_getOptions(ToastVariant.warning, message, allowHtml), delay);
        },

        /**
         * Affiche un toast d'information.
         *
         * @param {string}  message                     Message à afficher.
         * @param {object}  [options]                   Options d'affichage du toast.
         * @param {boolean} [options.allowHtml=false]   Si `true`, le message est interprété comme du HTML, sinon comme du texte brut.
         * @param {number}  [options.delay]             Délai en ms avant masquage automatique.
         */
        info(message, { allowHtml = false, delay = DEFAULT_DELAY_MS } = {}) {
            _show(_getOptions(ToastVariant.info, message, allowHtml), delay);
        },

        /**
         * Affiche un toast de notification personnalisé.
         * Permet d'afficher un toast en dehors des variantes prédéfinies, en fournissant directement un objet options.
         *
         * @param {ToastOptions} options    Configuration du toast.
         * @param {number}       [delay]    Délai en ms avant masquage automatique.
         */
        custom(options, delay = DEFAULT_DELAY_MS) {
            _show(options, delay);
        },
    });
})();