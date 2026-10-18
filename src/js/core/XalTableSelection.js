import { XalConstants } from './XalConstants.js';

/**
 * Initialise la sélection des lignes dans les tables marquées comme autorisant la sélection de lignes.
 * La case d'entête des tables reflète les états vide, partiel et complet.
 * 
 * @param {ParentNode} root Racine DOM dans laquelle recherche les tables.
 */
export function initTableSelection(root = document) {
    root.querySelectorAll(XalConstants.cssQueries.tableSelection.selectable).forEach((table) => {
        const selectAll     = table.querySelector(XalConstants.cssQueries.tableSelection.selectAll);
        const rowCheckboxes = [...table.querySelectorAll(XalConstants.cssQueries.tableSelection.selectRow)];

        if (!selectAll || rowCheckboxes.length === 0) return;

        // Les cases désactivées ne participent pas à la sélection globale
        const getEnabledRows = () => rowCheckboxes.filter((checkbox) => !checkbox.disabled);

        // Reflète dans l'entête le nombre de lignes activées qui sont sélectionnées
        const updateSelectAll = () => {
            const enabledRows   = getEnabledRows();
            const selectedCount = enabledRows.filter((checkbox) => checkbox.checked).length;

            selectAll.checked       = enabledRows.length > 0 && selectedCount === enabledRows.length;
            selectAll.indeterminate = selectedCount > 0 && selectedCount < enabledRows.length;
            selectAll.disabled      = enabledRows.length === 0;
        };

        // La case d'entête applique son état à toute les lignes activées
        selectAll.addEventListener('change', () => {
            getEnabledRows().forEach((checkbox) => {
                checkbox.checked = selectAll.checked;
            });

            updateSelectAll();
        });

        // Une modification individuelle recalcule l'état de la case d'entête
        rowCheckboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', updateSelectAll);
        });

        // Synchronise l'entête au chargement, y compris si des lignes sont précochées
        updateSelectAll();
    });
}