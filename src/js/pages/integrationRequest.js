import { XalConstants } from '../core/XalConstants.js';
import { XalDialog } from '../components/XalDialog.js';
import { XalToast } from '../components/XalToast.js';
import { XalLoaderOverlay } from '../loaders/XalLoaderOverlay.js';
import { getClosestAttributeContext, getTemplateById } from '../shared/dom.js';
import { initPopovers } from '../shared/initPopovers.js';
import { initTables } from '../shared/initTables.js';

const SELECTORS = Object.freeze({
    delete:     '.xal-table__row-actions--delete',
    history:    '.xal-table__row-actions--history',
    content:    '.xal-table__row-actions--content',
    failure:    '.xal-table__failure-trigger',
    record:     '[data-xal-record-id]',
});

const TEMPLATE_IDS = Object.freeze({
    history:    'xal-id-static-integration-history',
    rawContent: 'xal-id-static-integration-raw-content',
    error:      'xal-id-static-integration-error',
});

// =-=-=-=-=-=-=-=-=-=-=-=-
// Actions de ligne
// =-=-=-=-=-=-=-=-=-=-=-=-

async function confirmDelete(trigger) {
    const context = getClosestAttributeContext(
        trigger,
        SELECTORS.record,
        XalConstants.dataNames.xalise.recordId
    );

    if (!context) return;

    const content = document.createElement('p');
    content.classList.add('text-justify');
    content.append('Êtes-vous sûr de vouloir supprimer la demande d\'intégration ');

    const identifier = document.createElement('b');
    identifier.textContent = context.value;
    content.append(identifier, ' ?');

    await XalDialog.show({
        title: 'Supprimer la demande',
        content,
        dismissible: false,
        showCloseButton: false,
        preset: 'deleteConfirmation',
        variant: 'danger',
        buttonOverrides: {
            delete: {
                action: async () => {
                    context.element.remove();
                },
            },
        },
    });
}

async function showHistory(trigger) {
    const context = getClosestAttributeContext(
        trigger,
        SELECTORS.record,
        XalConstants.dataNames.xalise.recordId
    );

    if (!context) return;

    const details = getTemplateById(TEMPLATE_IDS.history);
    if (!details) return;

    await XalDialog.show({
        title: `Historique de la demande ${context.value}`,
        content: details.content,
        contentIsHtml: true,
        size: 'lg',
    });
}

async function showRawContent(trigger) {
    const context = getClosestAttributeContext(
        trigger,
        SELECTORS.record,
        XalConstants.dataNames.xalise.recordId
    );

    if (!context) return;

    const details = getTemplateById(TEMPLATE_IDS.rawContent);
    if (!details) return;

    await XalDialog.show({
        title: `Contenu brut de la demande ${context.value}`,
        content: details.content,
        size: 'xl',
    });
}

async function showIntegrationFailure(trigger) {
    const context = getClosestAttributeContext(
        trigger,
        SELECTORS.record,
        XalConstants.dataNames.xalise.recordId
    );
    
    if (!context) return;

    const details = getTemplateById(TEMPLATE_IDS.error);
    if (!details) return;

    await XalDialog.show({
        title: `Échec du transport - Demande ${context.value}`,
        content: details.content,
        variant: 'danger',
        dismissible: false,
        buttons: [
            {
                title: 'Fermer',
                classes: [
                    XalConstants.cssClasses.bootstrapBtn.size.sm,
                    XalConstants.cssClasses.bootstrapBtn.outlineSecondary,
                ],
                icon: XalConstants.cssClasses.bootstrapIcons.xLg,
            },
            {
                title: 'Rejouer l\'intégration',
                classes: [
                    XalConstants.cssClasses.bootstrapBtn.size.sm,
                    XalConstants.cssClasses.bootstrapBtn.xalise,
                ],
                icon: XalConstants.cssClasses.bootstrapIcons.arrowRepeat,
                action: () => replayIntegrationRequest(context.value),
            },
        ],
    });
}

async function replayIntegrationRequest(recordId) {
    // TODO : appeler le serveur, mettre à jour la demande et signaler le résultat.
    XalLoaderOverlay.show('Enregistrement en cours...');

    try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    finally {
        XalLoaderOverlay.hide();
    }

    XalToast.custom({
        title: 'Rejeu demandé',
        message: `Demande ${recordId} transmise pour rejeu.`,
        icon: XalConstants.cssClasses.bootstrapIcons.arrowRepeat,
        color: XalConstants.cssClasses.bootstrapTextBg.xalise,
    });
}

// =-=-=-=-=-=-=-=-=-=-=-=-
// Initialisation déléguée
// =-=-=-=-=-=-=-=-=-=-=-=-

/**
 * Initialise les actions de ligne des demandes d'intégration par délégation de clic.
 * L'écouteur unique prend également en charge les lignes ajoutées après l'initialisation.
 *
 * @param {ParentNode} [root=document] Racine contenant le tableau des demandes.
 */
export function initIntegrationRequestActions(root = document) {
    root.addEventListener('click', (event) => {
        if (!(event.target instanceof Element)) return;

        const trigger = event.target.closest(
            `${SELECTORS.delete}, ${SELECTORS.history}, ${SELECTORS.content}, ${SELECTORS.failure}`
        );
        
        if (!trigger || !root.contains(trigger)) return;

        if (trigger.matches(SELECTORS.delete)) {
            void confirmDelete(trigger);
        }
        else if (trigger.matches(SELECTORS.history)) {
            void showHistory(trigger);
        }
        else if (trigger.matches(SELECTORS.content)) {
            void showRawContent(trigger);
        }
        else if (trigger.matches(SELECTORS.failure)) {
            void showIntegrationFailure(trigger);
        }
    });
}

function exposeDialogDebugModule() {
    if (!new URLSearchParams(window.location.search).has('debug')) return;

    window.xaliseDebug = Object.freeze({
        ...window.xaliseDebug,
        XalDialog,
    });
}

function initIntegrationRequestPage() {
    initTables();
    initPopovers();
    initIntegrationRequestActions();
    exposeDialogDebugModule();

    document.addEventListener('xal-dialog:error', (event) => {
        const { error, button } = event.detail;

        console.log('Événement reçu : xal-dialog:error');
        console.log('Bouton concerné : ', button.title);
        console.error(error);

        XalToast.error('Le rejeu a échoué.');
    });
}

initIntegrationRequestPage();
