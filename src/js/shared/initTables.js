import { XalConstants } from '../core/XalConstants.js';
import { initTableSelection } from '../core/XalTableSelection.js';
import { initTableSort } from '../core/XalTableSort.js';
import { initTablePagination } from '../core/XalTablePagination.js';

const tableStates = new WeakMap();

/**
 * Récupère ou initialise l'état de tri et de pagination d'une table.
 *
 * @param {HTMLTableElement} table Table concernée.
 * @returns {{sort: string|null, direction: string|null, pageSize: number, page: number}} État courant de la table.
 */
function getTableState(table) {
    if (!tableStates.has(table)) {
        tableStates.set(table, {
            sort: null,
            direction: null,
            pageSize: 10,
            page: 1,
        });
    }

    return tableStates.get(table);
}

/**
 * Construit l'URL de rafraîchissement à partir de l'état courant de la table.
 *
 * @param {HTMLTableElement} table Table concernée.
 * @param {{sort: string|null, direction: string|null, pageSize: number, page: number}} state État à transmettre.
 * @returns {URL} URL enrichie des paramètres de tri et de pagination.
 */
function buildTableRefreshUrl(table, state) {
    const url = new URL(table.getAttribute(XalConstants.dataNames.xalise.refreshUrl), window.location.origin);

    if (state.sort) {
        url.searchParams.set('sort', state.sort);
        url.searchParams.set('direction', state.direction);
    }

    url.searchParams.set('pageSize', state.pageSize);
    url.searchParams.set('page', state.page);

    return url;
}

/**
 * Initialise les interactions génériques des tables dans la racine fournie : sélection,
 * tri, taille de page et préparation des URL de rafraîchissement.
 *
 * À ce stade, les URL sont journalisées dans la console ; le chargement des données
 * n'est pas encore implémenté.
 *
 * @param {ParentNode} [root=document] Racine contenant les tables à initialiser.
 */
export function initTables(root = document) {
    initTableSelection(root);
    initTableSort(root);
    initTablePagination(root);

    root.addEventListener('xal-table:sort', (event) => {
        const table = event.target;
        if (!(table instanceof HTMLTableElement)) return;

        const state = getTableState(table);
        const { key, direction } = event.detail;

        state.sort      = key;
        state.direction = direction;
        state.page      = 1;

        const url = buildTableRefreshUrl(table, state);

        // TODO : transmettre l'URL au chargeur de données de l'application.
        console.log(url);
    });

    root.addEventListener('xal-table:page-size-change', (event) => {
        const table = event.target;
        if (!(table instanceof HTMLTableElement)) return;

        const state     = getTableState(table);
        state.pageSize  = event.detail.pageSize;
        state.page      = 1;

        const url = buildTableRefreshUrl(table, state);

        // TODO : transmettre l'URL au chargeur de données de l'application.
        console.log(url);
    });
}
