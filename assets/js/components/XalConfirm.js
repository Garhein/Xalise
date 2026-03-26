/**
 * Gestion de la modale de confirmation réutilisable.
 *
 * Affiche une modale Bootstrap avec un titre, un contenu et des boutons
 * configurables, chacun associé à un callback et à des classes CSS.
 *
 * Cas d'usage typiques :
 * - Confirmation avant suppression d'un enregistrement
 * - Demande de validation avant modification
 *
 * La structure HTML est entièrement définie dans index.html via trois templates :
 * - xal-id-confirm-template        → structure de la modale
 * - xal-id-confirm-button-template → structure d'un bouton
 * - xal-id-confirm-icon-template   → structure d'une icône Bootstrap Icons
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
     * Référence vers le template HTML d'une icône Bootstrap Icons.
     * Cloné uniquement si un bouton spécifie une icône.
     *
     * @type {HTMLTemplateElement|null}
     */
    let _iconTemplate = null;

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
     * Si une icône est spécifiée, elle est clonée depuis le template d'icône
     * et insérée avant le libellé du bouton.
     * La modale est systématiquement fermée après exécution du callback onClick.
     *
     * @param {HTMLElement} container                       - Conteneur des boutons de la modale.
     * @param {Object}      buttonConfig                    - Configuration du bouton.
     * @param {string}      buttonConfig.label              - Libellé du bouton.
     * @param {string[]}    [buttonConfig.cssClasses=[]]    - Classes CSS Bootstrap à appliquer (ex : ['btn-outline-primary']).
     *                                                        Permet de combiner plusieurs classes (ex : ['btn-small', 'btn-primary']).
     * @param {string}      [buttonConfig.icon]             - Classe Bootstrap Icons à appliquer sur l'icône (ex : 'bi-trash').
     *                                                        L'icône est positionnée avant le libellé.
     * @param {Function}    [buttonConfig.onClick]          - Callback exécuté au clic.
     *                                                        La modale est fermée après exécution.
     */
    const _createButton = (container, { label, cssClasses = [], icon, onClick }) => {
        if (!_buttonTemplate) return;

        const clone     = document.importNode(_buttonTemplate.content, true);
        const buttonElt = clone.querySelector(XalConstants.cssQueries.confirmButton);

        if (!buttonElt) return;

        // Application des classes CSS Bootstrap
        if (cssClasses.length > 0) {
            buttonElt.classList.add(...cssClasses);
        }

        // Icône positionnée avant le libellé — clonée depuis le template
        // sans aucune construction HTML dans le JS.
        if (icon && _iconTemplate) {
            const iconClone = document.importNode(_iconTemplate.content, true);
            const iconElt   = iconClone.querySelector(XalConstants.cssQueries.confirmIcon);

            if (iconElt) {
                iconElt.classList.add(icon);
                buttonElt.appendChild(iconClone);
            }
        }

        // Injection du libellé dans un nœud texte pour éviter tout XSS
        buttonElt.appendChild(document.createTextNode(label));

        // La modale est toujours fermée après exécution du callback
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
         * @param {Object}      config                              - Configuration de la modale.
         * @param {string}      config.title                        - Titre affiché dans l'en-tête.
         * @param {string}      config.message                      - Contenu affiché dans le corps.
         * @param {Object[]}    config.modalClasses                 - Classes CSS à appliquer à la modale.
         * @param {Object[]}    [config.buttons=[]]                 - Liste des boutons à afficher.
         * @param {string}      config.buttons[].label              - Libellé du bouton.
         * @param {string[]}    [config.buttons[].cssClasses=[]]    - Classes CSS Bootstrap à appliquer.
         * @param {string}      [config.buttons[].icon]             - Classe Bootstrap Icons (ex : 'bi-trash').
         * @param {Function}    [config.buttons[].onClick]          - Callback exécuté au clic.
         * @param {boolean}     [config.dismissible=true]           - Si true, la modale peut être fermée via la touche Echap ou le clic extérieur.
         * @param {boolean}     [config.showCloseButton=true]       - Si true, le bouton de fermeture présent dans l'entête est affiché
         */
        show({ title, message, modalClasses = [], buttons = [], dismissible = true, showCloseButton = true } = {}) {
            if (!_modalTemplate) return;

            // Nettoyage de toute modale précédente
            this.hide();

            // Clonage du template
            const clone = document.importNode(_modalTemplate.content, true);
            _modalElt   = clone.querySelector(XalConstants.cssQueries.confirmModal);

            if (!_modalElt) return;

            if (!showCloseButton) {
                const closeBtn = _modalElt.querySelector(XalConstants.cssQueries.confirmCloseButton);
                if (closeBtn) closeBtn.toggleAttribute(XalConstants.attributeNames.hidden, true);
            }

            // Ajout des classes sur la modale
            if (modalClasses.length > 0) {
                const modalDialog = _modalElt.querySelector(XalConstants.cssQueries.confirmModalDialog);
                if (modalDialog) {
                    modalDialog.classList.add(...modalClasses);
                }
            }

            // Injection du titre et du contenu
            const titleElt = _modalElt.querySelector(XalConstants.cssQueries.confirmTitle);
            const bodyElt  = _modalElt.querySelector(XalConstants.cssQueries.confirmBody);

            if (titleElt) titleElt.textContent = title;
            if (bodyElt)  bodyElt.innerHTML    = message;

            // Génération des boutons dans le pied de la modale
            const footerElt = _modalElt.querySelector(XalConstants.cssQueries.confirmFooter);

            if (footerElt) {
                buttons.forEach(buttonConfig => _createButton(footerElt, buttonConfig));
            }

            // Insertion dans le DOM
            document.body.appendChild(_modalElt);

            // Création de l'instance Bootstrap Modal
            _modalInstance = new bootstrap.Modal(_modalElt, {
                backdrop: dismissible ? true : 'static',
                keyboard: dismissible,
            });

            // Nettoyage automatique après fermeture de l'animation Bootstrap
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
         *
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
            _iconTemplate   = document.getElementById(XalConstants.elementIds.confirmIconTemplate);
        },
    };

    return api;
})();