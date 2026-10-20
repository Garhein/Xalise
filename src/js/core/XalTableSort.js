import { XalConstants } from './XalConstants.js';

/**
 * Initialise le tri des colonnes déclarées avec `data-xal-table-sort-column`.
 * 
 * Le sens du tri est porté par `aria-sort` sur le `<th>`. Après chaque changement, la table
 * émet `xal-table:sort` avec la clé du tri et le sens demandé, afin qu'un autre module charge
 * ou trie les résultats.
 * 
 * @param {ParentNode} root Racine dans laquelle écouter les clics de tri.
 */
export function initTableSort(root = document) {
    root.addEventListener('click', (event) => {
        // Le clic peut provenir de l'icône ou du texte à l'intérieur du bouton
        const button = event.target.closest(XalConstants.cssQueries.tableSort.sortColumn);
        if (!button) return;

        const table  = button.closest('table');
        const header = button.closest('th');

        // Ignore les déclencheurs qui ne sont pas placés dans un en-tête de table
        if (!table || !header) return;

        // Alterne le sens à chaque clic sur la colonne active
        const currentDirection  = header.getAttribute(XalConstants.ariaNames.sort);
        const direction         = currentDirection === 'ascending' ? 'descending' : 'ascending';

        // Réinitialise l'état et l'icône de toutes les colonnes triables
        table.querySelectorAll(XalConstants.cssQueries.tableSort.sortColumn)
             .forEach((sortButton) => {
                const sortHeader = sortButton.closest('th');
                const sortIcon   = sortButton.querySelector(XalConstants.cssQueries.tableSort.sortIcon);

                sortHeader?.removeAttribute(XalConstants.ariaNames.sort);

                if (sortIcon) {
                    sortIcon.classList.remove(
                        XalConstants.cssClasses.bootstrapIcons.arrowUp,
                        XalConstants.cssClasses.bootstrapIcons.arrowDown
                    );

                    sortIcon.classList.add(XalConstants.cssClasses.bootstrapIcons.arrowDownUp);
                }
             });

        // Applique le nouvel état à la colonne cliquée
        header.setAttribute(XalConstants.ariaNames.sort, direction);

        // Synchronise l'icône avec le sens annoncé par aria-sort
        const icon = button.querySelector(XalConstants.cssQueries.tableSort.sortIcon);
        if (icon) {
            icon.classList.add(
                direction === 'ascending'
                    ? XalConstants.cssClasses.bootstrapIcons.arrowUp
                    : XalConstants.cssClasses.bootstrapIcons.arrowDown
            );
        }

        // Délègue le tri effectif à l'écouteur de la table
        table.dispatchEvent(new CustomEvent('xal-table:sort', {
            bubbles: true,
            detail: {
                key: button.dataset.xalTableSortColumn,
                direction,
                label: button.dataset.xalTableSortLabel
            },
        }));
    });
}