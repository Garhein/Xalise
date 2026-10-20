import { XalDialog } from './components/XalDialog.js';

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Suppression
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

document
    .querySelectorAll('.xal-table__row-actions--delete')
    .forEach((deleteButton) => {
        deleteButton.addEventListener('click', async () => {
            const recordRow = deleteButton.closest('[data-xal-record-id]');
            const recordId  = recordRow?.dataset.xalRecordId;

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
