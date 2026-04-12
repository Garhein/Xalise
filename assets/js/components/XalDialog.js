/**
 * API de gestion d'une modale basée sur Bootstrap Modal, avec configuration
 * dynamique du contenu et des boutons.
 * 
 * Une seule instance de modale est présente dans le DOM à tout moment.
 * Elle est réinitialisée à chaque appel à `show()`, garantissant un état propre 
 * et évitant les fuites mémoire liées à des instances Bootstrap obsolètes.
 * 
 * @requires XalConstants
 * 
 * @namespace XalDialog
 */
const XalDialog = (() => {
    /**
     * @typedef {Object} ButtonOptions      Options de configuration d'un bouton de la modale.
     * @property {string}   label           Libellé du bouton.
     * @property {string[]} [cssClasses=[]] Classes CSS Bootstrap à appliquer.
     *                                      Permet de combiner plusieurs classes (ex : ['btn-small', 'btn-primary']).
     * @property {string}   [icon]          Classe Bootstrap Icons à appliquer sur l'icône (ex : 'bi-trash').
     *                                      L'icône est positionnée avant le libellé.
     * @property {Function} [onClick]       Callback exécuté au clic.
     */

    /**
     * @typedef {Object} DialogOptions                      Options de configuration de la modale.
     * @property {string}           title                   Titre affiché dans l'en-tête.
     * @property {string}           message                 Contenu affiché dans le corps.
     * @property {string[]}         [modalClasses=[]]       Classes CSS à appliquer à la modale.
     * @property {ButtonOptions[]}  [buttons=[]]            Liste des boutons à afficher
     * @property {boolean}          [dismissible=true]      Si `true`, la modale peut être fermée via la touche d'échappement ou le clic extérieur.
     * @property {boolean}          [showCloseButton=true]  Si `true`, le bouton de fermeture présent dans l'en-tête est affiché.
     * @property {boolean}          [allowHtml=false]       Si `true`, le contenu du message est interprété comme du HTML.
     *                                                      Sinon, il est injecté en tant que texte pour éviter les risques de XSS.
     */
    
    /**
     * Référence vers le template HTML de la modale.
     *
     * @private
     * 
     * @type {HTMLTemplateElement|null}
     */
    let _modalTemplate = null;

    /**
     * Référence vers le template HTML d'un bouton.
     *
     * @private
     * 
     * @type {HTMLTemplateElement|null}
     */
    let _buttonTemplate = null;

    /**
     * Référence vers le template HTML de l'icône affichée dans les boutons.
     *
     * @private
     * 
     * @type {HTMLTemplateElement|null}
     */
    let _iconTemplate = null;

    /**
     * Élément DOM de la modale actuellement insérée dans le DOM.
     * Null si aucune modale n'est affichée.
     *
     * @private
     * 
     * @type {HTMLElement|null}
     */
    let _modalElement = null;

    /**
     * Instance Bootstrap Modal active.
     * Null si aucune modale n'est affichée.
     *
     * @private
     * 
     * @type {bootstrap.Modal|null}
     */
    let _modalInstance = null;

    /**
     * Nettoie la modale après sa fermeture.
     *
     * Libère les ressources associées à l'instance Bootstrap et
     * supprime l'élément du DOM, puis réinitialise les références internes.
     *
     * Cette méthode garantit l'absence de fuite mémoire et un état propre
     * avant une prochaine ouverture de la modale.
     * 
     * @private
     * 
     * @returns {void}
     */
    const _cleanup = () => {
        _modalInstance?.dispose();
        _modalElement?.remove();
        _modalInstance = null;
        _modalElement  = null;
    };

    /**
     * Crée un bouton de modale à partir du template et l'insère dans le conteneur.
     *
     * Gère :
     * - l'application des classes CSS
     * - l'ajout d'une icône optionnelle (via template)
     * - l'injection sécurisée du libellé (prévention XSS)
     * - l'exécution du callback associé
     * - la fermeture automatique de la modale après clic
     *
     * @private
     *
     * @param {HTMLElement}  container      Conteneur DOM recevant le bouton (footer de la modale).
     * @param {ButtonOptions}   buttonOptions   Configuration du bouton
     *
     * @returns {void}
     */
    const _createButton = (container, buttonOptions) => {
        if (!_buttonTemplate) {
            console.warn('[XalDialog] Template de bouton non trouvé.');
            return;
        }

        const clone     = document.importNode(_buttonTemplate.content, true);
        const buttonElt = clone.querySelector(XalConstants.cssQueries.dialog.button);

        if (!buttonElt) return;

        // Application des classes CSS Bootstrap
        if (buttonOptions.cssClasses && buttonOptions.cssClasses.length > 0) {
            buttonElt.classList.add(...buttonOptions.cssClasses);
        }
        else {
            buttonElt.classList.add(XalConstants.cssClasses.bootstrapBtn.secondary);
        }

        // Icône positionnée avant le libellé.
        if (buttonOptions.icon && _iconTemplate) {
            const iconClone = document.importNode(_iconTemplate.content, true);
            const iconElt   = iconClone.querySelector(XalConstants.cssQueries.dialog.icon);

            if (iconElt) {
                iconElt.classList.add(buttonOptions.icon);
                buttonElt.appendChild(iconClone);
            }
        }

        // Injection du libellé dans un noeud texte pour éviter tout XSS
        buttonElt.appendChild(document.createTextNode(buttonOptions.label));

        // La modale est toujours fermée après exécution du callback
        buttonElt.addEventListener('click', async () => {
            try {
                if (typeof buttonOptions.onClick === 'function') {
                    await buttonOptions.onClick();
                }
            } finally {
                api.hide();
            }
        });

        container.appendChild(clone);
    };

    const api = {
        /**
         * Initialise le composant en résolvant les templates HTML.
         * 
         * L'idempotence est assurée : si le template de la modale a déjà été résolu, la méthode ne fait rien.
         * 
         * @public
         * 
         * @throws {Error} Si le template de la modale, du bouton ou de l'icône n'est pas trouvé dans le DOM.
         * 
         * @returns {void}
         */
        init() {
            if (_modalTemplate) return;

            _modalTemplate = document.getElementById(XalConstants.elementIds.dialog.template);

            if (!_modalTemplate) {
                throw new Error(`[XalDialog] Template "${XalConstants.elementIds.dialog.template}" non trouvé dans le DOM.`);
            }

            _buttonTemplate = document.getElementById(XalConstants.elementIds.dialog.buttonTemplate);

            if (!_buttonTemplate) {
                throw new Error(`[XalDialog] Template "${XalConstants.elementIds.dialog.buttonTemplate}" non trouvé dans le DOM.`);
            }

            _iconTemplate = document.getElementById(XalConstants.elementIds.dialog.iconTemplate);

            if (!_iconTemplate) {
                throw new Error(`[XalDialog] Template "${XalConstants.elementIds.dialog.iconTemplate}" non trouvé dans le DOM.`);
            }
        },

        /**
         * Affiche la modale avec la configuration fournie.
         *
         * Gère :
         * - le clonage et l’initialisation du template
         * - l’injection du titre et du contenu (HTML ou texte sécurisé)
         * - l’ajout de classes CSS personnalisées
         * - la génération dynamique des boutons
         * - la configuration du comportement (dismissible, bouton de fermeture)
         * - l’instanciation et l’affichage de la modale Bootstrap
         * - le focus automatique sur le premier bouton
         * - le nettoyage automatique après fermeture
         *
         * Nettoie systématiquement toute modale existante avant affichage.
         *
         * @public
         *
         * @param {DialogOptions} config    Configuration de la modale.
         *
         * @returns {void}
         */
        show(config = {}) {
            if (!_modalTemplate) {
                console.warn('[XalDialog] La méthode d\'initialisation doit être appelée avant utilisation.');
                return;
            }

            const {
                title,
                message,
                modalClasses    = [],
                buttons         = [],
                dismissible     = true,
                showCloseButton = true,
                allowHtml       = false,
            } = config;

            // Nettoyage de toute modale précédente
            this.hide();

            // Clonage du template
            const clone   = document.importNode(_modalTemplate.content, true);
            _modalElement = clone.querySelector(XalConstants.cssQueries.dialog.container);

            if (!_modalElement) {
                console.warn('[XalDialog] Template invalide : élément modale introuvable.');
                return;
            }

            // Affichage conditionnel du bouton de fermeture dans l'en-tête
            if (!showCloseButton) {
                const closeBtn = _modalElement.querySelector(XalConstants.cssQueries.dialog.closeButton);
                
                if (closeBtn) { 
                    closeBtn.toggleAttribute(XalConstants.attributeNames.hidden, true);
                }
            }

            // Ajout des classes sur la modale
            if (modalClasses.length > 0) {
                const modalDialog = _modalElement.querySelector(XalConstants.cssQueries.dialog.dialog);

                if (modalDialog) {
                    modalDialog.classList.add(...modalClasses);
                }
            }

            // Injection du titre et du contenu
            const titleElt = _modalElement.querySelector(XalConstants.cssQueries.dialog.title);
            const bodyElt  = _modalElement.querySelector(XalConstants.cssQueries.dialog.body);

            if (titleElt) titleElt.textContent = title;

            if (bodyElt) {
                if (allowHtml) {
                    bodyElt.innerHTML = message;
                } else {
                    bodyElt.textContent = message;
                }
            }

            // Génération des boutons dans le pied de la modale
            const footerElt = _modalElement.querySelector(XalConstants.cssQueries.dialog.footer);

            if (footerElt) {
                if (!buttons.length) {
                    _createButton(footerElt, {
                        label: 'Fermer',
                        icon: XalConstants.cssClasses.bootstrapIcons.xCircleFill,
                        cssClasses: [XalConstants.cssClasses.bootstrapBtn.secondary],
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
         * Ferme la modale si elle est actuellement affichée.
         *
         * Déclenche la fermeture via l'API Bootstrap, ce qui entraîne
         * l'événement `hidden.bs.modal` et le nettoyage associé.
         *
         * Aucun effet si aucune instance de modale n'est active.
         *
         * @public
         *
         * @returns {void}
         */
        hide() {
            if (!_modalInstance) return;

            _modalInstance.hide();
        },

        /**
         * Indique si la modale est actuellement visible.
         *
         * Utilise l'API Bootstrap pour récupérer l'instance associée à l'élément
         * et vérifie son état interne (`_isShown`).
         *
         * Plus fiable qu’un test sur la classe CSS `show`, car reflète l’état réel
         * du composant Bootstrap (y compris pendant les transitions).
         *
         * Retourne `false` si aucune instance n'est initialisée.
         *
         * @public
         *
         * @returns {boolean} `true` si la modale est affichée, `false` sinon.
         */
        isVisible() {
            if (!_modalElement) return false;

            const instance = bootstrap.Modal.getInstance(_modalElement);

            return instance?._isShown ?? false;
        },
    };

    return api;
})();