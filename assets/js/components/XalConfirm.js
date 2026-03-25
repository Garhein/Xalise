/**
 * Gestion de la modale de confirmation réutilisable.
 *
 * Affiche une modale Bootstrap avec un titre, un contenu et des boutons
 * configurables, chacun associé à un callback ou à la fermeture de la modale.
 *
 * Cas d'usage typiques :
 * - Confirmation avant suppression d'un enregistrement
 * - Demande de validation avant modification
 *
 * La structure HTML est entièrement définie dans index.html via deux templates :
 * - xal-id-confirm-template        → structure de la modale
 * - xal-id-confirm-button-template → structure d'un bouton
 *
 * Une seule instance de modale est présente dans le DOM à tout moment.
 * Elle est réinitialisée à chaque appel à show().
 *
 * Dépendances :
 * - XalConstants.js → XalConstants
 *
 * @namespace XalConfirm
 * @author Xavier VILLEMIN
 */
const XalConfirm = (() => {
    /**
     * Référence vers le template HTML de la modale.
     *
     * @type {HTMLTemplateElement|null}
     */
    let _modalTemplate = null;

    /**
     * Référence vers le template HTML d'un bouton.
     *
     * @type {HTMLTemplateElement|null}
     */
    let _buttonTemplate = null;

    /**
     * Élément DOM de la modale actuellement insérée dans le DOM.
     * Null si aucune modale n'est affichée.
     *
     * @type {HTMLElement|null}
     */
    let _modalElt = null;

    /**
     * Instance Bootstrap Modal active.
     * Null si aucune modale n'est affichée.
     *
     * @type {bootstrap.Modal|null}
     */
    let _modalInstance = null;

    /**
     * Nettoie la modale après fermeture.
     *
     * Détruit l'instance Bootstrap, retire l'élément du DOM
     * et réinitialise les références internes.
     */
    const _cleanup = () => {
        _modalInstance?.dispose();
        _modalElt?.remove();
        _modalInstance = null;
        _modalElt      = null;
    };

    /**
     * Crée un bouton depuis le template HTML et l'insère dans le conteneur de boutons.
     *
     * Attache le callback onClick si fourni, ou ferme la modale si onClose est true.
     *
     * @param {HTMLElement} container                           - Conteneur des boutons de la modale.
     * @param {Object}      buttonConfig                        - Configuration du bouton.
     * @param {string}      [buttonConfig.label]                - Libellé du bouton.
     * @param {string}      [buttonConfig.variant='secondary']  - Variante Bootstrap (btn-primary, btn-danger, etc.).
     * @param {Function}    [buttonConfig.onClick]              - Callback exécuté au clic. La modale est fermée après exécution.
     * @param {boolean}     [buttonConfig.onClose=false]        - Si true, ferme simplement la modale sans callback.
     */
    const _createButton = (container, { label, variant = 'btn-secondary', onClick, onClose = false }) => {
        if (!_buttonTemplate) return;

        const clone     = document.importNode(_buttonTemplate.content, true);
        const buttonElt = clone.querySelector(XalConstants.cssQueries.confirmButton);

        if (!buttonElt) return;

        // Application de la variante Bootstrap
        buttonElt.classList.add(variant);
        buttonElt.textContent = label;

        buttonElt.addEventListener('click', () => {
            if (typeof onClick === 'function') {
                onClick();
            }

            api.hide();
        });

        container.appendChild(clone);
    };

    const api = {
        /**
         * Affiche la modale de confirmation.
         *
         * Réinitialise toute modale précédente avant affichage.
         * Clone le template, injecte le titre, le contenu et les boutons,
         * puis affiche la modale via Bootstrap.
         *
         * @param {Object}      config                          - Configuration de la modale.
         * @param {string}      config.title                    - Titre affiché dans l'en-tête de la modale.
         * @param {string}      config.message                  - Contenu affiché dans le corps de la modale.
         * @param {Object[]}    config.buttons                  - Liste des boutons à afficher.
         * @param {string}      [config.buttons[].label]        - Libellé du bouton.
         * @param {string}      [config.buttons[].variant]      - Variante Bootstrap du bouton.
         * @param {Function}    [config.buttons[].onClick]      - Callback exécuté au clic.
         * @param {boolean}     [config.buttons[].onClose]      - Si true, ferme la modale sans callback.
         * @param {boolean}     [config.dismissible=true]       - Si true, la modale peut être fermée
         *                                                        via la touche Echap ou le clic extérieur.
         */
        show({ title, message, buttons = [], dismissible = true } = {}) {
            if (!_modalTemplate) return;

            // Nettoyage de toute modale précédente
            this.hide();

            // Clonage du template
            const clone = document.importNode(_modalTemplate.content, true);
            _modalElt   = clone.querySelector(XalConstants.cssQueries.confirmModal);

            if (!_modalElt) return;

            // Injection du titre et du contenu
            const titleElt = _modalElt.querySelector(XalConstants.cssQueries.confirmTitle);
            const bodyElt  = _modalElt.querySelector(XalConstants.cssQueries.confirmBody);

            if (titleElt) titleElt.textContent = title;
            if (bodyElt)  bodyElt.textContent  = message;

            // Génération des boutons
            const footerElt = _modalElt.querySelector(XalConstants.cssQueries.confirmFooter);

            if (footerElt) {
                buttons.forEach(buttonConfig => _createButton(footerElt, buttonConfig));
            }

            // Insertion dans le DOM
            document.body.appendChild(_modalElt);

            // Création et affichage de l'instance Bootstrap Modal
            _modalInstance = new bootstrap.Modal(_modalElt, {
                backdrop: dismissible ? true : 'static',
                keyboard: dismissible,
            });

            // Nettoyage automatique après fermeture
            _modalElt.addEventListener('hidden.bs.modal', () => {
                _cleanup();
            }, { once: true });

            _modalInstance.show();
        },

        /**
         * Ferme la modale de confirmation si elle est affichée.
         * Sans effet si aucune modale n'est active.
         */
        hide() {
            if (!_modalInstance) return;

            _modalInstance.hide();
        },

        /**
         * Indique si la modale est actuellement affichée.
         * @returns {boolean} true si la modale est visible, false sinon.
         */
        isVisible() {
            return _modalInstance !== null;
        },

        /**
         * Initialise le composant.
         *
         * Résout les références vers les templates HTML depuis le DOM statique.
         * Doit être appelé une seule fois depuis xalise.js au DOMContentLoaded,
         * avant tout appel à show().
         */
        init() {
            _modalTemplate  = document.getElementById(XalConstants.elementIds.confirmTemplate);
            _buttonTemplate = document.getElementById(XalConstants.elementIds.confirmButtonTemplate);
        },
    };

    return api;
})();