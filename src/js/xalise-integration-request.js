import { XalConstants } from './core/XalConstants.js';
import { XalDialog } from './components/XalDialog.js';

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Suppression
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

document
    .querySelectorAll('.xal-table__row-actions--delete')
    .forEach((deleteButton) => {
        deleteButton.addEventListener('click', async () => {
            const recordRow = deleteButton.closest('[data-xal-record-id]');
            const recordId  = recordRow?.getAttribute(XalConstants.dataNames.xalise.recordId);

            if (!recordId) {
                console.error('Identifiant de la demande d\'intégration introuvable.');
                return;
            }

            await XalDialog.show({
                title: 'Supprimer la demande',
                content: `<p class="text-justify">Êtes-vous sûr de vouloir supprimer la demande d\'intégration <b>${recordId}</b> ?</p>`,
                dismissible: false,
                showCloseButton: false,
                contentIsHtml: true,
                preset: 'deleteConfirmation',
                variant: 'danger',
                buttonOverrides: {
                    delete: {
                        action: async () => {
                            recordRow.remove();
                        }
                    }
                }
            });
        });
    });

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Historique
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

document
    .querySelectorAll('.xal-table__row-actions--history')
    .forEach((historyButton) => {
        const details   = document.getElementById('xal-id-static-integration-history');
        const recordRow = historyButton.closest('[data-xal-record-id]');
        const recordId  = recordRow?.getAttribute(XalConstants.dataNames.xalise.recordId);

        historyButton.addEventListener('click', async (event) => {
            await XalDialog.show({
                title: `Historique de la demande ${recordId}`,
                content: details.content,
                contentIsHtml: true,
                size: 'lg',
            });
        });
    });

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Contenu brut
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

document
    .querySelectorAll('.xal-table__row-actions--content')
    .forEach((contentButton) => {
        const details   = document.getElementById('xal-id-static-integration-raw-content');
        const recordRow = contentButton.closest('[data-xal-record-id]');
        const recordId  = recordRow?.getAttribute(XalConstants.dataNames.xalise.recordId);

        contentButton.addEventListener('click', async (event) => {
            await XalDialog.show({
                title: `Contenu brut de la demande ${recordId}`,
                content: details.content,
                size: 'xl',
            });
        });
    });