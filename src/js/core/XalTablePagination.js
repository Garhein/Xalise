import { XalConstants } from './XalConstants.js';

/**
 * Initialise la gestion de la taille de page pour les tables ciblées dans la racine fournie.
 * 
 * Un seul écouteur délégué peut gérer plusieurs sélecteurs. Chaque sélecteur désigne sa table
 * via `data-xal-table-page-size`. Lors d'un changement, la table émet `xal-table:page-size-change`
 * avec la nouvelle taille et la page est réinitialisée à `1`.
 * 
 * @param {ParentNode} root Racine dans laquelle écouter les changements de taille de page.
 */
export function initTablePagination(root = document) {
    root.addEventListener('change', (event) => {
        if (event.target.hasAttribute(XalConstants.dataNames.xalise.tablePageSize)) {
            const tableId   = event.target.getAttribute(XalConstants.dataNames.xalise.tablePageSize);
            const table     = document.querySelector(tableId);
            const pageSize  = Number(event.target.value);

            if (table && Number.isInteger(pageSize) && pageSize > 0) {
                table.dispatchEvent(new CustomEvent('xal-table:page-size-change', {
                    bubbles: true,
                    detail: {
                        pageSize,
                        page: 1,
                    },
                }));
            }
        }
    });
}