/**
 * Couche HTTP de l'application Xalise.
 *
 * Enveloppe fetch() avec la gestion automatique des indicateurs
 * visuels de chargement (barre navbar, skeleton, toast).
 *
 * Dépendances :
 * - XalProgressBar.js  → XalProgressBar
 * - XalSkeleton.js     → XalSkeleton
 * - XalLoadingToast.js → XalLoadingToast
 *
 * @namespace XalHttp
 * @author Xavier VILLEMIN
 */
const XalHttp = {
    /**
     * Enveloppe un appel fetch avec les indicateurs visuels appropriés.
     *
     * La barre de progression navbar est toujours activée.
     * Le skeleton et le toast sont optionnels selon le contexte.
     *
     * @param {string}  url                       - URL de la ressource.
     * @param {Object}  [fetchOptions={}]         - Options passées à fetch().
     * @param {Object}  [indicators={}]           - Indicateurs visuels à activer.
     * @param {string}  [indicators.placeholder]  - Sélecteur de la zone de placeholder.
     * @param {string}  [indicators.toast]        - Message du toast de chargement.
     * @returns {Promise<Response>}
     */
    fetch(url, fetchOptions = {}, { placeholder, toast } = {}) {
        XalLoaderNav.start();

        if (placeholder) XalLoaderPlaceholder.show(placeholder);
        if (toast) XalLoaderToast.show(toast);

        return fetch(url, fetchOptions)
            .finally(() => {
                XalLoaderNav.stop();
                if (placeholder) XalLoaderPlaceholder.hide(placeholder);
                if (toast) XalLoaderToast.hide();
            });
    },

    /**
     * Simule un appel HTTP avec un délai configurable.
     *
     * Déclenche les mêmes indicateurs visuels que fetch(),
     * mais retourne une réponse fictive après le délai spécifié.
     * Utile pour le développement front-end sans backend disponible,
     * ou pour tester les états de chargement.
     *
     * @param {*}       [data=null]          - Données fictives à retourner.
     * @param {Object}  [options={}]
     * @param {number}  [options.delay=1000] - Délai en ms avant la résolution.
     * @param {boolean} [options.fail=false] - Si true, simule une erreur réseau.
     * @param {Object}  [indicators={}]      - Mêmes indicateurs que fetch().
     * @param {string}  [indicators.placeholder]
     * @param {string}  [indicators.toast]
     * @returns {Promise<*>} Promesse résolue avec les données ou rejetée si fail=true.
     */
    mock(data = null, { delay = 5000, fail = false } = {}, { placeholder, toast } = {}) {
        XalLoaderNav.start();

        if (placeholder) XalLoaderPlaceholder.show(placeholder);
        if (toast) XalLoaderToast.show(toast);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                XalLoaderNav.stop();
                if (placeholder) XalLoaderPlaceholder.hide(placeholder);
                if (toast) XalLoaderToast.hide();

                if (fail) {
                    reject(new Error('[XalHttp.mock] Erreur simulée.'));
                } else {
                    resolve(data);
                }
            }, delay);
        });
    },
};