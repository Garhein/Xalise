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
 * @namespace XalDialog
 */
const XalDialog = (() => {
    /**
     * @typedef {Object} ButtonConfig
     * @property {string}   label               - Libellé du bouton.
     * @property {string[]} [cssClasses=[]]     - Classes CSS Bootstrap à appliquer (ex : ['btn-outline-primary']).
     *                                            Permet de combiner plusieurs classes (ex : ['btn-small', 'btn-primary']).
     * @property {string}   [icon]              - Classe Bootstrap Icons à appliquer sur l'icône (ex : 'bi-trash').
     *                                            L'icône est positionnée avant le libellé.
     * @property {Function} [onClick]           - Callback exécuté au clic.
     *                                            La modale est fermée après exécution.
     */

    /**
     * @typedef {Object} DialogOptions
     * @property {string}           title                   - Titre affiché dans l'en-tête.
     * @property {string}           message                 - Contenu affiché dans le corps.
     * @property {string[]}         [modalClasses=[]]       - Classes CSS à appliquer à la modale.
     * @property {ButtonConfig[]}   [buttons=[]]            - Liste des boutons à afficher
     * @property {boolean}          [dismissible=true]      - Si `true`, la modale peut être fermée via la touche Echap ou le clic extérieur.
     * @property {boolean}          [showCloseButton=true]  - Si `true`, le bouton de fermeture présent dans l'entête est affiché.
     * @property {boolean}          [allowHtml=false]       - Si `true`, le contenu du message est interprété comme du HTML.
     *                                                        Sinon, il est injecté en tant que texte pour éviter les risques de XSS.
     */
    
    /**
     * Référence vers le template HTML de la modale.
     *
     * @type {HTMLTemplateElement|null}
     * @private
     */
    let _modalTemplate = null;

    /**
     * Référence vers le template HTML d'un bouton.
     *
     * @type {HTMLTemplateElement|null}
     * @private
     */
    let _buttonTemplate = null;

    /**
     * Référence vers le template HTML de l'icône affichée dans les boutons.
     *
     * @type {HTMLTemplateElement|null}
     * @private
     */
    let _iconTemplate = null;

    /**
     * Élément DOM de la modale actuellement insérée dans le DOM.
     * Null si aucune modale n'est affichée.
     *
     * @type {HTMLElement|null}
     * @private
     */
    let _modalElement = null;

    /**
     * Instance Bootstrap Modal active.
     * Null si aucune modale n'est affichée.
     *
     * @type {bootstrap.Modal|null}
     * @private
     */
    let _modalInstance = null;

    /**
     * Nettoie la modale après fermeture.
     *
     * @private
     */
    const _cleanup = () => {
        _modalInstance?.dispose();
        _modalElement?.remove();
        _modalInstance = null;
        _modalElement  = null;
    };

    /**
     * Crée un bouton et l'insère dans le footer de la modale.
     *
     * Gère :
     * - les classes CSS
     * - l'ajout d'une icône (via template)
     * - l'exécution du callback associé
     * - la fermeture automatique de la modale
     *
     * @param {HTMLElement}     container       - Conteneur cible
     * @param {ButtonConfig}    buttonConfig    - Configuration du bouton
     *
     * @private
     */
    const _createButton = (container, buttonConfig) => {
        if (!_buttonTemplate) {
            console.warn('[XalDialog] Template de bouton non trouvé.');
            return;
        }

        const clone     = document.importNode(_buttonTemplate.content, true);
        const buttonElt = clone.querySelector(XalConstants.cssQueries.dialog.button);

        if (!buttonElt) return;

        // Application des classes CSS Bootstrap
        if (buttonConfig.cssClasses.length > 0) {
            buttonElt.classList.add(...buttonConfig.cssClasses);
        }

        // Icône positionnée avant le libellé.
        // Clonée depuis le template sans aucune construction HTML dans le JS.
        if (buttonConfig.icon && _iconTemplate) {
            const iconClone = document.importNode(_iconTemplate.content, true);
            const iconElt   = iconClone.querySelector(XalConstants.cssQueries.dialog.icon);

            if (iconElt) {
                iconElt.classList.add(buttonConfig.icon);
                buttonElt.appendChild(iconClone);
            }
        }

        // Injection du libellé dans un noeud texte pour éviter tout XSS
        buttonElt.appendChild(document.createTextNode(buttonConfig.label));

        // La modale est toujours fermée après exécution du callback
        buttonElt.addEventListener('click', async () => {
            try {
                await buttonConfig.onClick?.();
            } finally {
                api.hide();
            }
        });

        container.appendChild(clone);
    };

    const api = {
        /**
         * Affiche la modale.
         *
         * @param {DialogOptions} config - Configuration de la modale.
         * @throws {Error} Si le template est introuvable
         */
        show(config = {}) {
            if (!_modalTemplate) {
                console.warn('[XalDialog] la méthode d\'initialisation doit être appelé avant utilisation.');
                return;
            }

            const {
                title,
                message,
                modalClasses = [],
                buttons = [],
                dismissible = true,
                showCloseButton = true,
                allowHtml = false,
            } = config;

            // Nettoyage de toute modale précédente
            this.hide();

            // Clonage du template
            const clone = document.importNode(_modalTemplate.content, true);
            _modalElement   = clone.querySelector(XalConstants.cssQueries.dialog.container);

            if (!_modalElement) return;

            if (!showCloseButton) {
                const closeBtn = _modalElement.querySelector(XalConstants.cssQueries.dialog.closeButton);
                if (closeBtn) closeBtn.toggleAttribute(XalConstants.attributeNames.hidden, true);
            }

            // Ajout des classes sur la modale
            if (modalClasses.length > 0) {
                const modalDialog = _modalElement.querySelector(XalConstants.cssQueries.modalDialog);
                if (modalDialog) {
                    modalDialog.classList.add(...modalClasses);
                }
            }

            // Injection du titre et du contenu
            const titleElt = _modalElement.querySelector(XalConstants.cssQueries.dialog.title);
            const bodyElt  = _modalElement.querySelector(XalConstants.cssQueries.dialog.body);

            if (titleElt) titleElt.textContent = title;

            if (allowHtml) {
                bodyElt.innerHTML = message;
            } else {
                bodyElt.textContent = message;
            }

            // Génération des boutons dans le pied de la modale
            const footerElt = _modalElement.querySelector(XalConstants.cssQueries.dialog.footer);

            if (footerElt) {
                if (!buttons.length) {
                    _createButton(footerElt, {
                        label: 'Fermer',
                        icon: XalConstants.cssClasses.bootstrapIcon.xCircleFill,
                        cssClasses: [XalConstants.cssClasses.bootstrapBtn.primary],
                    });
                }
                else {
                    buttons.forEach(btnConfig => _createButton(footerElt, btnConfig));
                }
            }

            // Insertion dans le DOM
            document.body.appendChild(_modalElement);

            // Création de l'instance Bootstrap Modal
            _modalInstance = new bootstrap.Modal(_modalElement, {
                backdrop: dismissible ? true : 'static',
                keyboard: dismissible,
            });

            // Nettoyage automatique après fermeture de l'animation Bootstrap
            _modalElement.addEventListener('hidden.bs.modal', () => {
                _cleanup();
            }, { once: true });

            // Focus sur le premier bouton après affichage de la modale
            _modalElement.addEventListener('shown.bs.modal', () => {
                const btn = _modalElement.querySelector('button');
                btn?.focus();
            });

            _modalInstance.show();
        },

        /**
         * Ferme la modale de confirmation si elle est affichée.
         */
        hide() {
            if (!_modalInstance) return;

            _modalInstance.hide();
        },

        /**
         * Indique si la modale est actuellement affichée.
         *
         * @returns {boolean} `true` si la modale est visible, `false` sinon.
         */
        isVisible() {
            return _modalElement?.classList.contains('show') ?? false;
        },

        /**
         * Initialise le composant.
         */
        init() {
            // Assure l'idempotence : évite une double initialisation
            if (_modalTemplate) return;

            _modalTemplate  = XalUIService.getElementById(XalConstants.elementIds.dialog.template);
            _buttonTemplate = XalUIService.getElementById(XalConstants.elementIds.dialog.buttonTemplate);
            _iconTemplate   = XalUIService.getElementById(XalConstants.elementIds.dialog.iconTemplate);
        },
    };

    return api;
})();