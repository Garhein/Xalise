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
        const recordId  = recordRow?.dataset.xalRecordId;

        contentButton.addEventListener('click', async (event) => {
            await XalDialog.show({
                title: `Contenu brut de la demande ${recordId}`,
                content: details.content,
                size: 'xl',
            });
        });
    });

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Tri des colonnes
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

/**
 * Écoute les événements de tri émis par les tables et prépare l'URL de la requête.
 * 
 * La table émettrice est récupérée depuis `event.target`. Ses paramètres de tri sont
 * ajoutés à l'URL définie dans son attribut `data-xal-refresh-url`.
 * 
 * @param {CustomEvent} event Événement émis par une table.
 */
document.addEventListener('xal-table:sort', (event) => {
    const table = event.target;
    const url   = table.getAttribute(XalConstants.dataNames.xalise.refreshUrl);

    if (!url) return;

    const { key, direction } = event.detail;
    const urlSearch = new URL(url, window.location.origin);

    urlSearch.searchParams.set('sort', key);
    urlSearch.searchParams.set('direction', direction);

    // TODO: appeler le serveur et remplacer les lignes du tableau avec sa réponse (penser à mettre async (event))
    /*
    const response = await fetch(urlSearch);
    if (!response.ok) {
        console.error('Impossible de trier les demandes d\'intégration.');
        return;
    }

    const rowsHtml = await response.text();
    table.querySelector('tbody').innerHTML = rowsHtml;
    */

    console.log(urlSearch);
});

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //
// Taille de la pagination
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- //

document.addEventListener('xal-table:page-size-change', (event) => {
    const table = event.target;
    const url   = table.getAttribute(XalConstants.dataNames.xalise.refreshUrl);

    if (!url) return;

    const { pageSize, page } = event.detail;
    const urlSearch = new URL(url, window.location.origin);

    urlSearch.searchParams.set('pageSize', pageSize);
    urlSearch.searchParams.set('page', page);

    // TODO: appeler le serveur pour mettre à jour les lignes du tableau et la pagination (penser à mettre async (event))

    console.log(urlSearch);
});