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
 * Le gestionnaire fournit les variantes d'en-tête les groupes de boutons prédéfinis suivant(e)s :
 * - variantes :  `success`, `danger`, `warning` et `info`
 * - groupe : `confirmation`, `deleteConfirmation` et `information`
 * 
 * Le composant expose les méthodes suivantes : 
 * - `init()`
 * - `show()`
 * - `hide()`
 * - `isVisible()`
 * 
 * @requires XalConstants
 * @namespace XalDialog
 */
export const XalDialog = (() => {
    const TEMPLATE_IDS = Object.freeze({
        modal:  'xal-id-modal-template',
        button: 'xal-id-modal-button-template',
        icon:   'xal-id-modal-icon-template',
    });

    /**
     * Variantes d'en-tête et de bouton de fermeture.
     * Les variantes à fond sombre utilisent une croix blanche pour conserver un contraste suffisant.
     */
    const VARIANTS = Object.freeze({
        success: {
            headerClass:        XalConstants.cssClasses.bootstrapTextBg.success,
            closeButtonClasses: [XalConstants.cssClasses.bootstrapBtn.closeWhite],
        },
        danger: {
            headerClass:        XalConstants.cssClasses.bootstrapTextBg.danger,
            closeButtonClasses: [XalConstants.cssClasses.bootstrapBtn.closeWhite],
        },
        info: {
            headerClass:        XalConstants.cssClasses.bootstrapTextBg.info,
            closeButtonClasses: [],
        },
        warning: {
            headerClass:        XalConstants.cssClasses.bootstrapTextBg.warning,
            closeButtonClasses: [],
        },
    });
  
    /**
     * Configuration des groupes de boutons prédéfinis.
     */
    const BUTTON_PRESETS = Object.freeze({
        confirmation: Object.freeze({
            cancel: Object.freeze({
                title:      'Annuler',
                classes:    [XalConstants.cssClasses.bootstrapBtn.size.sm, XalConstants.cssClasses.bootstrapBtn.outlineSecondary],
                icon:       XalConstants.cssClasses.bootstrapIcons.xLg,
            }),
            confirm: Object.freeze({
                title:      'Confirmer',
                classes:    [XalConstants.cssClasses.bootstrapBtn.size.sm, XalConstants.cssClasses.bootstrapBtn.xalise],
                icon:       XalConstants.cssClasses.bootstrapIcons.checkLg,
            }),
        }),
        deleteConfirmation: Object.freeze({
            cancel: Object.freeze({
                title:      'Annuler',
                classes:    [XalConstants.cssClasses.bootstrapBtn.size.sm, XalConstants.cssClasses.bootstrapBtn.outlineSecondary],
                icon:       XalConstants.cssClasses.bootstrapIcons.xLg,
            }),
            delete: Object.freeze({
                title:      'Supprimer',
                classes:    [XalConstants.cssClasses.bootstrapBtn.size.sm, XalConstants.cssClasses.bootstrapBtn.danger],
                icon:       XalConstants.cssClasses.bootstrapIcons.trash,
            }),
        }),
        information: Object.freeze({
            close: Object.freeze({
                title:      'Fermer',
                classes:    [XalConstants.cssClasses.bootstrapBtn.size.sm, XalConstants.cssClasses.bootstrapBtn.xalise],
                icon:       XalConstants.cssClasses.bootstrapIcons.xLg,
            }),
        }),
    });

    let modalElement                = null;
    let modalInstance               = null;
    let initialized                 = false;
    let isClosing                   = false;
    let activeHeaderClasses         = [];
    let activeTitleClasses          = [];
    let activeCloseButtonClasses    = [];

    /**
     * Récupère le premier élément d'un template HTML identifié par son ID.
     *
     * @param   {string}    id Identifiant du template.
     * @returns {Element}   Premier élément du contenu du template.
     * @throws  {Error}     Si le template est introuvable, n'est pas un élément `<template>` ou ne contient aucun élément.
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
     * Initialise le gestionnaire de modale s'il ne l'a pas déjà été.
     * 
     * Traitements d'initialisation exécutés :
     * - clonage du template de modale
     * - configuration du titre accessible
     * - ajout de la modale au document
     * - préparation des événements nécessaires au suivi du début et de la fin de la fermeture de la modale
     *
     * @returns {void}
     * @throws  {Error} Si un template requis est absent ou invalide, si le titre attendu est absent ou si Bootstrap Modal n'est pas disponible.
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
            throw new Error('[XalDialog] Le module Bootstrap Modal doit être chargé avant l\'initialisation.');
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
     * Remplace le contenu du corps de la modale par le contenu fourni.
     *
     * Les chaînes sont insérées comme texte. Les noeuds DOM et le contenu HTML sont clonés 
     * avant insertion afin de conserver le contenu d'origine.
     *
     * @param   {HTMLElement}                   body    Élément qui reçoit le contenu.
     * @param   {string|Node|null|undefined}    content Contenu texte ou vue déjà chargée sous forme de noeud DOM.
     * @param   {boolean}                       isHtml  `true` si le contenu doit être interprété comme du HTML, sinon `false`.
     * @returns {void}
     */
    const setContent = (body, content, isHtml = false) => {
        body.replaceChildren();

        if (content instanceof Node) {
            body.append(content.cloneNode(true));
            return;
        }

        if (content === null || content === undefined) return;

        
        if (isHtml) {
            const template = document.createElement('template');
            template.innerHTML = String(content);
            body.append(template.content.cloneNode(true));
            return;
        }

        body.textContent = String(content);
    };

    /**
     * Remplace les classes dynamiques d'un élément sans toucher aux classes dites `structurelles`.
     * 
     * Les classes appliquées lors de l'ouverture de la précédente modale sont retirées, puis les 
     * nouvelles classes sont appliquées.
     *
     * @param   {Element}   element         Élément dont les classes dynamiques sont mises à jour.
     * @param   {string[]}  activeClasses   Classes dynamiques appliquées précédemment.
     * @param   {string[]}  nextClasses     Classes dynamiques à appliquer.
     * @returns {string[]}                  Classes dynamiques appliquées par cet appel, à retirer au prochain appel.
     */
    const replaceClasses = (element, activeClasses, nextClasses) => {
        element.classList.remove(...activeClasses);
        element.classList.add(...nextClasses);

        return [...nextClasses];
    };

    /**
     * Détermine les boutons à afficher dans la modale.
     * 
     * Sans `preset`, les boutons personnalisés `buttons` sont retournés à la méthode appelante. Avec un 
     * `preset`, les boutons par défaut de celui-ci sont combinés avec les surcharges `buttonOverrides`.
     * Les surcharges ne peuvent cibler que les boutons définis par ce `preset`.
     *
     * @param   {Object[]}      buttons             Boutons personnalisés à utiliser sans preset.
     * @param   {string|null}   preset              Nom du preset de boutons, ou `null` si aucun preset n'est demandé.
     * @param   {Object}        buttonOverrides     Surcharges partielles indexées par le nom des boutons du preset.
     * @returns {Object[]}                          Configuration des boutons à afficher.
     * @throws  {TypeError}                         Erreurs gérées :
     *                                              - Si des surcharges sont fournies sans preset
     *                                              - Si le preset est inconnu
     *                                              - Si des boutons personnalisés sont combinés avec un preset
     *                                              - Si une surcharge cible un bouton absent du preset.
     */
    const resolveButtons = (buttons, preset, buttonOverrides) => {
        if (!preset) {
            if (Object.keys(buttonOverrides).length > 0) {
                throw new TypeError('[XalDialog] La surcharge des boutons par défaut d\'un groupe nécessite que celui-ci soit renseigné.');
            }

            return buttons;
        }

        if (!Object.hasOwn(BUTTON_PRESETS, preset)) {
            throw new TypeError(`[XalDialog] Groupe de boutons "${preset}" inconnu.`);
        }

        if (buttons.length > 0) {
            throw new TypeError('[XalDialog] Impossible de combiner des boutons personnalisés et un groupe de boutons.');
        }

        const presetButtons      = BUTTON_PRESETS[preset];
        const unknownButtonNames = Object.keys(buttonOverrides).filter((name) => !Object.hasOwn(presetButtons, name));

        if (unknownButtonNames.length > 0) {
            throw new TypeError(`[XalDialog] Le groupe de boutons "${preset}" ne contient pas de bouton "${unknownButtonNames[0]}".`);
        }

        return Object.entries(presetButtons).map(([name, defaults]) => ({
            ...defaults,
            ...buttonOverrides[name],
        }));
    };

    /**
     * Crée un bouton à partir du template, puis configure son apparence et son comportement au clic.
     * 
     * Au clic, le bouton est désactivé et le callback éventuel de `config.action` est exécuté. La modale 
     * se ferme si le callback réussit, sauf si `config.closeOnClick` est positionné sur `false`. En l'absence
     * de callback, la modale se ferme après le clic. Si le callback échoue, l'événement `xal-dialog:error` est
     * émis et la modale reste ouverte.
     *
     * @param   {Object}    config                      Configuration du bouton.
     * @param   {string}    config.title                Libellé visible du bouton.
     * @param   {string[]}  config.classes              Classes CSS à appliquer au bouton.
     * @param   {string}    [config.icon]               Classe Bootstrap Icons à insérer avant le libellé.
     * @param   {Function}  [config.action]             Callback exécuté au clic.
     * @param   {boolean}   [config.closeOnClick=true]  `true` si la modale est fermée après l'appel au callback, sinon `false`.
     * @param   {string}    [config.ariaLabel]          Libellé accessible appliqué si aucune icône n'est affichée.
     * @param   {Object}    context                     Données et méthodes transmises au callback.
     * @returns {HTMLButtonElement}                     Bouton créé, prêt à être ajouté au pied de la modale.
     * @throws  {TypeError}                             Si le titre, les classes ou le callback ne respectent pas le format attendu.
     */
    const createButton = (config, context) => {
        if (!config || typeof config.title !== 'string' || !config.title.trim()) {
            throw new TypeError('[XalDialog] Le titre de chaque bouton doit être précisé.');
        }

        if (!Array.isArray(config.classes)) {
            throw new TypeError(`[XalDialog] Les classes CSS du bouton "${config.title}" doivent être un tableau.`);
        }

        if (config.action !== undefined && typeof config.action !== 'function') {
            throw new TypeError(`[XalDialog] L\'action déclenchée par le bouton "${config.title}" doit être une fonction.`);
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
                            detail: { 
                                error, 
                                button: config, // Configuration du bouton, pas l'élément HTML
                            },
                        }
                    )
                );

                console.error(`[XalDialog] Échec de l'action du bouton "${config.title}".`, error);
            } finally {
                if (button.isConnected) button.disabled = false;
            }
        });

        return button;
    };

    /**
     * Configure puis affiche la modale avec le contenu et les options fournis.
     * 
     * Les boutons peuvent être définis directement avec `buttons`, ou générés depuis un preset
     * et personnalisés avec `buttonOverrides`. Le contenu doit avoir été préparé par l'appelant : cette
     * fonction ne charge pas de données depuis le serveur.
     * 
     * Si une modale est déjà ouverte, l'appel échoue. Si sa fermeture est en cours, la fonction attend
     * qu'elle soit terminée avant de préparer la prochaine ouverture.
     *
     * @param   {Object}                                                [options]                       Options d'affichage de la modale.
     * @param   {string}                                                [options.title='']              Titre affiché dans l'en-tête.
     * @param   {Node|string|null}                                      [options.content]               Contenu de la modale.
     * @param   {'sm'|'lg'|'xl'|'fullscreen'}                           [options.size]                  Taille Bootstrap de la modale.
     * @param   {'success'|'danger'|'info'|'warning'}                   [options.variant]               Variante de couleur de l'en-tête et de l'icône de fermeture.
     * @param   {string[]}                                              [options.headerClasses]         Classes personnalisées de l'en-tête, incompatibles avec `variant`.
     * @param   {string[]}                                              [options.titleClasses=[]]       Classes personnalisées du titre.
     * @param   {'confirmation'|'deleteConfirmation'|'information'}     [options.preset]                Preset de boutons à afficher.
     * @param   {Object}                                                [options.buttonOverrides={}]    Surcharge des boutons du preset, indexées par leur nom.
     * @param   {Object[]}                                              [options.buttons=[]]            Boutons personnalisés, incompatibles avec `preset`.
     * @param   {boolean}                                               [options.dismissible=true]      `true` si la fermeture par Échap et clic sur le fond est autorisée, sinon `false`.
     * @param   {boolean}                                               [options.showCloseButton=true]  `true` si le bouton de fermeture de l'en-tête est affiché, sinon `false`.
     * @param   {boolean}                                               [options.contentIsHtml=false]   `true` si le contenu doit être interprété comme du HTML, sinon `false`.
     * @returns {Promise<HTMLElement>}                                                                  Élément de modale affiché.
     * @throws  {Error}                                                                                 Si l'initialisation échoue ou si une modale est déjà ouverte.
     * @throws  {TypeError}                                                                             Si les options ou les boutons ne respectent pas le format attendu.
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
            title           = '',
            content,
            size,
            variant         = null,
            headerClasses   = null,
            titleClasses    = [],
            preset          = null,
            buttonOverrides = {},
            buttons         = [],
            dismissible     = true,
            showCloseButton = true,
            contentIsHtml   = false
        } = options;

        if (!Array.isArray(buttons)) {
            throw new TypeError('[XalDialog] Le paramètre "buttons" doit être un tableau.');
        }

        if (!buttonOverrides || typeof buttonOverrides !== 'object' || Array.isArray(buttonOverrides)) {
            throw new TypeError('[XalDialog] Le paramètre "buttonOverrides" doit être un objet.');
        }

        if (headerClasses !== null && !Array.isArray(headerClasses)) {
            throw new TypeError('[XalDialog] Le paramètre "headerClasses" doit être un tableau de classes CSS.');
        }

        if (variant !== null && !Object.hasOwn(VARIANTS, variant)) {
            throw new TypeError(`[XalDialog] La variante "${variant}" est inconnue.`);
        }

        if (variant !== null && headerClasses !== null) {
            throw new TypeError('[XalDialog] Impossible de combiner une variante ("variant") et des classes personnalisées ("headerClasses") pour l\'en-tête.');
        }

        if (!Array.isArray(titleClasses)) {
            throw new TypeError('[XalDialog] Le paramètre "titleClasses" doit être un tableau de classes CSS.');
        }

        const resolvedButtons   = resolveButtons(buttons, preset, buttonOverrides);
        const headerElement     = modalElement.querySelector(XalConstants.cssQueries.modal.xalHeader);
        const titleElement      = modalElement.querySelector(XalConstants.cssQueries.modal.xalTitle);
        const body              = modalElement.querySelector(XalConstants.cssQueries.modal.xalBody);
        const footer            = modalElement.querySelector(XalConstants.cssQueries.modal.xalFooter);
        const closeButton       = modalElement.querySelector(XalConstants.cssQueries.modal.xalCloseButton);
        const modalDialog       = modalElement.querySelector(XalConstants.cssQueries.modal.bootstrapClass);

        if (!headerElement || !titleElement || !body || !footer || !modalDialog) {
            throw new Error('[XalDialog] Le template de la modale ne contient pas tous les éléments requis.');
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

        setContent(body, content, contentIsHtml);

        const context = {
            dialog: modalElement,
            body,
            close: () => modalInstance.hide(),
        };

        footer.replaceChildren(...resolvedButtons.map((button) => createButton(button, context)));
        footer.classList.toggle(XalConstants.cssClasses.displayNone, resolvedButtons.length === 0);

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
     * Ferme la modale si elle est actuellement affichée.
     * 
     * La fermeture est demandée à l'instance Bootstrap. L'événement
     * `hidden.bs.modal` est déclenché lorsque la transition de fermeture
     * est terminée.
     *
     * @returns {void}
     */
    const hide = () => {
        if (modalInstance && modalElement?.classList.contains('show')) {
            modalInstance.hide();
        }
    };

    /**
     * Indique si la modale est actuellement affichée.
     * 
     * Le résultat est déterminé à partir de la classe `show` appliquée
     * par Bootstrap à l'élément de la modale.
     *
     * @returns {boolean} `true` si la modale possède la classe `show`, sinon `false`.
     */
    const isVisible = () => Boolean(modalElement?.classList.contains('show'));

    return Object.freeze({ init, show, hide, isVisible });
})();
