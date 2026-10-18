import { XalConstants } from "../core/XalConstants.js";

/**
 * Gestionnaire générique d'une modale Bootstrap construite à partir des
 * templates présents dans la page.
 *
 * La page doit fournir les templates suivants :
 * - `xal-id-modal-template`
 * - `xal-id-modal-button-template`
 * - `xal-id-modal-icon-template`
 * 
 * Le composant expose les méthodes suivantes : 
 * - `init()`
 * - `show()`
 * - `hide()`
 * - `isVisible()`
 * 
 * @requires XalConstants
 * @namespace XalToast
 */
export const XalDialog = (() => {
    const TEMPLATE_IDS = Object.freeze({
        modal:  'xal-id-modal-template',
        button: 'xal-id-modal-button-template',
        icon:   'xal-id-modal-icon-template',
    });

    /**
     * Variantes d'entête et de bouton de fermeture.
     * Les variantes à fond sombre utilise une croix blanche pour conserver un contraste suffisant.
     */
    const VARIANTS = Object.freeze({
        success: {
            headerClass: XalConstants.cssClasses.bootstrapTextBg.success,
            closeButtonClasses: [XalConstants.cssClasses.btnCloseWhite],
        },
        danger: {
            headerClass: XalConstants.cssClasses.bootstrapTextBg.danger,
            closeButtonClasses: [XalConstants.cssClasses.btnCloseWhite],
        },
        info: {
            headerClass: XalConstants.cssClasses.bootstrapTextBg.info,
            closeButtonClasses: [],
        },
        warning: {
            headerClass: XalConstants.cssClasses.bootstrapTextBg.warning,
            closeButtonClasses: [],
        },
    });

    let modalElement                = null;
    let modalInstance               = null;
    let initialized                 = false;
    let isClosing                   = false;
    let activeHeaderClasses         = [];
    let activeTitleClasses          = [];
    let activeCloseButtonClasses    = [];

    /**
     * Récupère la racine d'un template requis par le composant.
     *
     * @param {string} id Identifiant du template.
     * @returns {Element} Élément racine à cloner.
     * @throws {Error} Si le template est absent, invalide ou vide.
     */
    const getTemplateRoot = (id) => {
        const template = document.getElementById(id);

        if (!(template instanceof HTMLTemplateElement)) {
            throw new Error(`[XalDialog] Le template "${id}" est absent ou non valide.`);
        }

        const element = template.content.firstElementChild;

        if (!element) {
            throw new Error(`[XalDialog] Le template "${id}" ne contient aucun élément.`);
        }

        return element;
    };

    /**
     * Initialise le composant en exécutant les traitements suivants :
     * - clonage de la structure de la modale
     * - configuration du titre accessible
     * - mise en place des événements qui suivent la fermeture Bootstrap
     *
     * @returns {void}
     */
    const init = () => {
        if (initialized) return;

        const modalRoot = getTemplateRoot(TEMPLATE_IDS.modal);
        modalElement = modalRoot.cloneNode(true);
        modalElement.setAttribute(XalConstants.ariaNames.labelledBy, XalConstants.elementIds.modal.xalTitle);

        const titleElement = modalElement.querySelector(XalConstants.cssQueries.modal.xalTitle);
        if (!titleElement) {
            throw new Error(`[XalDialog] Le titre "${XalConstants.cssQueries.modal.xalTitle}" est absent du template de modale.`);
        }

        titleElement.id = XalConstants.elementIds.modal.xalTitle;

        if (!window.bootstrap?.Modal) {
            throw new Error('[XalDialog] Bootstrap Modal doit être chargé avant l\'initialisation.');
        }

        document.body.append(modalElement);
        initialized = true;

        modalElement.addEventListener('hide.bs.modal', () => {
            isClosing = true;
        });

        modalElement.addEventListener('hidden.bs.modal', () => {
            isClosing = false;
        });
    };

    /**
     * Remplace le contenu de la modale par un clone du template ou du noeud fourni.
     * Les chaînes sont affichées comme du texte.
     *
     * @param {HTMLElement} body Élément qui reçoit le contenu.
     * @param {HTMLTemplateElement|Node|string|null|undefined} content Contenu à afficher.
     * @returns {void}
     */
    const setContent = (body, content) => {
        body.replaceChildren();

        if (content instanceof HTMLTemplateElement) {
            body.append(content.content.cloneNode(true));
        } 
        else if (content instanceof Node) {
            body.append(content.cloneNode(true));
        }
        // Une chaîne passée comme contenu fixe est traitée comme du texte
        else if (content !== undefined && content !== null) {
            body.textContent = String(content);
        }
    };

    /**
     * Remplace les classes dynamiques posées lors de l'ouverture précédente.
     * Les classes structurelles présentes dans le template sont conservées.
     *
     * @param {Element} element Élément à personnaliser.
     * @param {string[]} activeClasses Classes dynamiques actuellement appliquées.
     * @param {string[]} nextClasses Classes dynamiques à appliquer.
     * @returns {string[]} Classes appliquées, à retirer à la prochaine ouverture.
     */
    const replaceClasses = (element, activeClasses, nextClasses) => {
        element.classList.remove(...activeClasses);
        element.classList.add(...nextClasses);

        return [...nextClasses];
    };

    /**
     * Récupère le contenu fixe fourni ou charge une vue HTML depuis une URL.
     * Le HTML reçu doit provenir d'une source de confiance.
     *
     * @param {Object} options Options de chargement.
     * @param {Node|string|null|undefined} options.content Contenu fixe éventuel.
     * @param {string} [options.url] URL de la vue HTML à charger.
     * @param {AbortSignal} [options.signal] Signal d'annulation de la requête.
     * @returns {Promise<{content?: Node|string|null, html?: string}>}
     */
    const loadContent = async ({ content, url, signal }) => {
        if (url && content !== undefined) {
            throw new TypeError('[XalDialog] Les paramètres "content" et "url" ne peuvent pas être fournis simultanément.');
        }

        if (!url) return { content };

        const response = await fetch(
            url,
            {
                headers: { Accept: 'text/html' },
                signal,
            }
        );

        if (!response.ok) {
            throw new Error(`[XalDialog] Échec du chargement de la modale (${response.status}).`);
        }

        return { html: await response.text() };
    };

    /**
     * Crée un bouton à partir du template, puis relie son action.
     * Par défaut, la modale se ferme après l'action. `closeOnClick: false`
     * permet de la laisser ouverte, par exemple si une validation échoue.
     *
     * @param {Object} config Configuration du bouton.
     * @param {string} config.title Libellé visible du bouton.
     * @param {string[]} config.classes Classes CSS à ajouter au bouton.
     * @param {string} [config.icon] Classe Bootstrap Icons.
     * @param {Function} [config.action] Action appelée au clic.
     * @param {boolean} [config.closeOnClick=true] Ferme la modale après succès de l'action.
     * @param {Object} context Contexte transmis à l'action.
     * @returns {HTMLButtonElement}
     */
    const createButton = (config, context) => {
        if (!config || typeof config.title !== 'string' || !config.title.trim()) {
            throw new TypeError('[XalDialog] Le titre de chaque bouton doit être précisé.');
        }

        if (!Array.isArray(config.classes)) {
            throw new TypeError(`[XalDialog] Les classes CSS du bouton "${config.title}" doivent être un tableau.`);
        }

        if (config.action !== undefined && typeof config.action !== 'function') {
            throw new TypeError(`[XalDialog] L\'action du bouton "${config.title}" doit être une fonction.`);
        }

        const buttonTemplate = getTemplateRoot(TEMPLATE_IDS.button);
        const button         = buttonTemplate.cloneNode(true);
        button.type = 'button';
        button.classList.add(...config.classes);

        if (config.icon) {
            const iconTemplate  = getTemplateRoot(TEMPLATE_IDS.icon);
            const icon          = iconTemplate.cloneNode(true);
            icon.classList.add(config.icon);
            button.append(icon);
        }

        button.append(document.createTextNode(config.title));

        if (!config.icon && config.ariaLabel) {
            button.setAttribute(XalConstants.ariaNames.label, config.ariaLabel);
        }

        button.addEventListener('click', async (event) => {
            button.disabled = true;

            try {
                await config.action?.({ ...context, button, event });

                if (config.closeOnClick !== false) {
                    modalInstance.hide();
                }
            } catch (error) {
                modalElement.dispatchEvent(
                    new CustomEvent(
                        'xal-dialog:error',
                        {
                            bubbles: true,
                            detail: { error, button: config },
                        }
                    )
                );

                console.error('[XalDialog] Échec de l\'action du bouton.', error);
            } finally {
                if (button.isConnected) button.disabled = false;
            }
        });

        return button;
    };

    /**
     * Prépare puis affiche la modale.
     *
     * `variant` accepte `success`, `danger`, `info` ou `warning` et règle aussi
     * la couleur de la croix. Sans variante, l'en-tête reçoit le fond Xalise
     * par défaut. `headerClasses` remplace ce style par une personnalisation
     * libre et ne peut pas être combiné avec `variant`.
     *
     * @param {Object} [options] Options d'affichage.
     * @param {string} [options.title=''] Titre de la modale.
     * @param {HTMLTemplateElement|Node|string} [options.content] Contenu fixe ; une chaîne est affichée comme texte.
     * @param {string} [options.url] URL qui renvoie une vue HTML de confiance.
     * @param {'sm'|'lg'|'xl'|'fullscreen'} [options.size] Taille Bootstrap.
     * @param {'success'|'danger'|'info'|'warning'} [options.variant] Variante sémantique de l'en-tête.
     * @param {string[]} [options.headerClasses] Classes personnalisées de l'en-tête, exclusives de `variant`.
     * @param {string[]} [options.titleClasses=[]] Classes personnalisées du titre.
     * @param {Object[]} [options.buttons=[]] Boutons à afficher dans le pied de modale.
     * @param {boolean} [options.dismissible=true] Autorise la fermeture par Échap et clic sur le fond.
     * @param {boolean} [options.showCloseButton=true] Affiche le bouton de fermeture de l'en-tête.
     * @param {AbortSignal} [options.signal] Signal d'annulation du chargement distant.
     * @returns {Promise<HTMLElement>} Élément de modale affiché.
     */
    const show = async (options = {}) => {
        init();

        if (modalElement.classList.contains('show')) {
            throw new Error('[XalDialog] Fermez la modale active avant d\'en ouvrir une autre.');
        }

        if (isClosing) {
            await new Promise((resolve) => {
                modalElement.addEventListener('hidden.bs.modal', resolve, { once: true });
            });
        }

        const {
            title = '',
            content,
            url,
            size,
            variant = null,
            headerClasses = null,
            titleClasses = [],
            buttons = [],
            dismissible = true,
            showCloseButton = true,
            signal,
        } = options;

        if (!Array.isArray(buttons)) {
            throw new TypeError('[XalDialog] "buttons" doit être un tableau.');
        }

        if (headerClasses !== null && !Array.isArray(headerClasses)) {
            throw new TypeError('[XalDialog] "headerClasses" doit être un tableau de classes CSS.');
        }

        if (variant !== null && !Object.hasOwn(VARIANTS, variant)) {
            throw new TypeError(`[XalDialog] Variante inconnue : "${variant}".`);
        }

        if (variant !== null && headerClasses !== null) {
            throw new TypeError('[XalDialog] Utiliser "variant" ou "headerClasses", mais pas les deux.');
        }

        if (!Array.isArray(titleClasses)) {
            throw new TypeError('[XalDialog] "titleClasses" doit être un tableau de classes CSS.');
        }

        const headerElement = modalElement.querySelector(XalConstants.cssQueries.modal.xalHeader);
        const titleElement  = modalElement.querySelector(XalConstants.cssQueries.modal.xalTitle);
        const body          = modalElement.querySelector(XalConstants.cssQueries.modal.xalBody);
        const footer        = modalElement.querySelector(XalConstants.cssQueries.modal.xalFooter);
        const closeButton   = modalElement.querySelector(XalConstants.cssQueries.modal.xalCloseButton);
        const modalDialog   = modalElement.querySelector(XalConstants.cssQueries.modal.bootstrapClass);

        if (!headerElement || !titleElement || !body || !footer || !modalDialog) {
            throw new Error('[XalDialog] Le template de modale ne contient pas tous les éléments requis.');
        }

        const variantStyle = variant ? VARIANTS[variant] : null;
        const requestedHeaderClasses = headerClasses
            ?? (variantStyle
                ? [variantStyle.headerClass]
                : [XalConstants.cssClasses.modal.xalHeaderDefault]);
        const requestedCloseButtonClasses = variantStyle?.closeButtonClasses ?? [];

        activeHeaderClasses = replaceClasses(
            headerElement,
            activeHeaderClasses,
            requestedHeaderClasses
        );

        activeTitleClasses = replaceClasses(
            titleElement,
            activeTitleClasses,
            titleClasses
        );

        if (closeButton) {
            activeCloseButtonClasses = replaceClasses(
                closeButton,
                activeCloseButtonClasses,
                requestedCloseButtonClasses
            );
        }

        titleElement.textContent = title;
        closeButton?.toggleAttribute('hidden', !showCloseButton);

        // Les tailles Bootstrap s'appliquent au .modal-dialog.
        modalDialog.classList.remove(
            XalConstants.cssClasses.bootstrapModal.size.sm,
            XalConstants.cssClasses.bootstrapModal.size.lg,
            XalConstants.cssClasses.bootstrapModal.size.xl,
            XalConstants.cssClasses.bootstrapModal.size.fullScreen
        );

        if (size && ['sm', 'lg', 'xl', 'fullscreen'].includes(size)) {
            modalDialog.classList.add(`modal-${size}`);
        }

        const loaded = await loadContent({ content, url, signal });

        if (loaded.html !== undefined) {
            // Le HTML chargé doit être une vue de confiance rendue par le serveur.
            const responseTemplate      = document.createElement('template');
            responseTemplate.innerHTML  = loaded.html;
            body.replaceChildren(responseTemplate.content.cloneNode(true));
        } else {
            setContent(body, loaded.content);
        }

        const context = {
            dialog: modalElement,
            body,
            close: () => modalInstance.hide(),
        };

        footer.replaceChildren(...buttons.map((button) => createButton(button, context)));
        footer.classList.toggle(XalConstants.cssClasses.displayNone, buttons.length === 0);

        // Bootstrap conserve sa configuration à la création : recréer l'instance
        // permet à chaque ouverture de choisir son propre comportement de fermeture.
        window.bootstrap.Modal.getInstance(modalElement)?.dispose();

        modalInstance = new window.bootstrap.Modal(modalElement, {
            backdrop: dismissible ? true : 'static',
            keyboard: dismissible,
        });

        modalInstance.show();
        return modalElement;
    };

    /**
     * Demande à Bootstrap de fermer la modale si elle est affichée.
     *
     * @returns {void}
     */
    const hide = () => {
        if (modalInstance && modalElement?.classList.contains('show')) {
            modalInstance.hide();
        }
    };

    /**
     * Indique si la classe d'affichage Bootstrap est présente sur la modale.
     *
     * @returns {boolean}
     */
    const isVisible = () => Boolean(modalElement?.classList.contains('show'));

    return Object.freeze({ init, show, hide, isVisible });
})();
