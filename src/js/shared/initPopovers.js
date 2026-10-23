import { XalConstants } from '../core/XalConstants.js';

/**
 * Construit le contenu texte enrichi d'une popover à partir des attributs du déclencheur.
 *
 * @param   {HTMLElement} trigger   Élément qui porte les attributs de la popover.
 * @returns {HTMLElement}           Contenu DOM de la popover.
 */
function createSourcePopoverContent(trigger) {
    const content    = document.createElement('span');
    const label      = trigger.getAttribute(XalConstants.dataNames.xalise.popoverLabel);
    const valueText  = trigger.getAttribute(XalConstants.dataNames.xalise.popoverValue);
    const cssClasses = trigger.getAttribute(XalConstants.dataNames.xalise.popoverValueCssClasses);

    content.append(`${label} : `);

    const value = document.createElement('span');
    value.classList.add(cssClasses);
    value.textContent = valueText;

    content.append(value);

    return content;
}

/**
 * Initialise les popovers Bootstrap dans la racine fournie et veille à n'en afficher
 * qu'une à la fois.
 *
 * @param {ParentNode} [root=document] Racine DOM contenant les déclencheurs.
 */
export function initPopovers(root = document) {
    const triggers = root.querySelectorAll(XalConstants.cssQueries.bootstrap.togglePopover);

    // Activation des popovers en autorisant les balises `time`.
    const popoverAllowList = {
        ...bootstrap.Popover.Default.allowList,
        time: ['datetime'],
    };

    triggers.forEach((trigger) => {
        const selector = trigger.getAttribute(XalConstants.dataNames.xalise.popoverContent);
        const source   = selector ? document.querySelector(selector) : null;

        const options = {
            container: 'body',
            allowList: popoverAllowList,
        };

        if (trigger.hasAttribute(XalConstants.dataNames.xalise.popoverValue)) {
            options.html = true;
            options.content = () => createSourcePopoverContent(trigger);
        }
        else if (source) {
            options.html = true;
            options.content = () => source.innerHTML;
        }

        bootstrap.Popover.getOrCreateInstance(trigger, options);
    });

    // Pour afficher une seule popover à la fois.
    root.addEventListener('show.bs.popover', (event) => {
        const openedTrigger = event.target;

        triggers.forEach((trigger) => {
            if (trigger === openedTrigger) return;

            bootstrap.Popover.getInstance(trigger)?.hide();
        });
    });
}
