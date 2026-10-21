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

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Historique
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

document
    .querySelectorAll('.xal-table__row-actions--history')
    .forEach((historyButton) => {
        const details   = document.getElementById('xal-id-static-integration-history');
        const recordRow = historyButton.closest('[data-xal-record-id]');
        const recordId  = recordRow?.dataset.xalRecordId;

        historyButton.addEventListener('click', async (event) => {
            await XalDialog.show({
                title: `Historique de la demande ${recordId}`,
                content: details.innerHTML,
                contentIsHtml: true,
                size: 'lg',
            });
        });
    });

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Tri des colonnes
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

const table = document.querySelector('#xal-id-table-integration-request');

table?.addEventListener('xal-table:sort', (event) => {
    // Prépare les paramètres que le serveur utilisera pour trier les résultats
    const { key, direction } = event.detail;
    const url = new URL(table.dataset.xalTableSortUrl, window.location.origin);

    url.searchParams.set('sort', key);
    url.searchParams.set('direction', direction);

    // TODO: appeler le serveur et remplacer les lignes du tableau avec sa réponse (penser à mettre async (event))
    /*
    const response = await fetch(url);
    if (!response.ok) {
        console.error('Impossible de trier les demandes d\'intégration.');
        return;
    }

    const rowsHtml = await response.text();
    table.querySelector('tbody').innerHTML = rowsHtml;
    */

    console.log(url);
});