import { XalConstants } from './XalConstants.js';

/**
 * Initialise la sélection des lignes dans les tables marquées comme autorisant la sélection de lignes.
 * La case d'entête des tables reflète les états vide, partiel et complet.
 * 
 * @param {ParentNode} root Racine DOM dans laquelle recherche les tables.
 */
export function initTableSelection(root = document) {
    root.querySelectorAll(XalConstants.cssQueries.table.selection.selectable).forEach((table) => {
        const selectAll     = table.querySelector(XalConstants.cssQueries.table.selection.checkAll);
        const rowCheckboxes = [...table.querySelectorAll(XalConstants.cssQueries.table.selection.checkRow)];

        if (!selectAll || rowCheckboxes.length === 0) return;

        // Les cases désactivées ne participent pas à la sélection globale
        const getEnabledRows = () => rowCheckboxes.filter((checkbox) => !checkbox.disabled);

        // Récupération du conteneur des actions associées à la table
        const getContainerActions = () => document.querySelector(`div[${XalConstants.dataNames.xalise.tableContainerActions}="#${table.id}"]`);

        // Reflète dans l'entête le nombre de lignes activées qui sont sélectionnées et 
        // active/désactive automatiquement les actions associées à la table
        const updateSelectAllAndActions = () => {
            const enabledRows       = getEnabledRows();
            const selectedCount     = enabledRows.filter((checkbox) => checkbox.checked).length;
            const containerActions  = getContainerActions();

            selectAll.checked       = enabledRows.length > 0 && selectedCount === enabledRows.length;
            selectAll.indeterminate = selectedCount > 0 && selectedCount < enabledRows.length;
            selectAll.disabled      = enabledRows.length === 0;

            if (containerActions) {
                const actionsBtn = [...containerActions.querySelectorAll('button')].filter((btn) => !btn.matches(XalConstants.cssQueries.table.selection.actionNotDynamicState));

                actionsBtn.forEach((btn) => {
                    btn.disabled = selectedCount === 0;
                });
            }

            const selectionCount = document.querySelector(`[${XalConstants.dataNames.xalise.tableContainerSelectionCount}="#${table.id}"]`);
            if (selectionCount) {
                const plural = selectedCount > 1 ? 's' : '';

                selectionCount.textContent = selectedCount > 0 
                    ? ` (${selectedCount} ligne${plural} sélectionnée${plural})`
                    : '';
            }
        };

        // La case d'entête applique son état à toute les lignes activées
        selectAll.addEventListener('change', () => {
            getEnabledRows().forEach((checkbox) => {
                checkbox.checked = selectAll.checked;
            });

            updateSelectAllAndActions();
        });

        // Une modification individuelle recalcule l'état de la case d'entête
        rowCheckboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', updateSelectAllAndActions);
        });

        // Synchronise l'entête au chargement, y compris si des lignes sont précochées
        updateSelectAllAndActions();
    });
}