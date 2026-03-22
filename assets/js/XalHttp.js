/**
 * Couche HTTP de l'application Xalise.
 *
 * Enveloppe fetch() avec la gestion automatique des indicateurs
 * visuels de chargement (barre navbar, skeleton, toast).
 *
 * Dépendances :
 * - XalLoaderNav.js            → XalLoaderNav
 * - XalLoaderPlaceholder.js    → XalLoaderPlaceholder
 * - XalLoaderToast.js          → XalLoaderToast
 * - XalLoaderOverlay.js        → XalLoaderOverlay
 *
 * @namespace XalHttp
 * @author Xavier VILLEMIN
 */
const XalHttp = {
    /**
     * Enveloppe un appel fetch avec les indicateurs visuels appropriés.
     *
     * La barre de progression navbar est toujours activée.
     * Les indicateurs placeholder, toast et overlay sont optionnels
     * et peuvent être combinés librement selon le contexte.
     *
     * Les indicateurs sont systématiquement masqués dans le bloc finally()
     * afin de garantir leur nettoyage même en cas d'erreur réseau.
     *
     * @param {string}          url                      - URL de la ressource.
     * @param {Object}          [fetchOptions={}]        - Options passées à fetch().
     * @param {Object}          [indicators={}]          - Indicateurs visuels à activer.
     * @param {string}          [indicators.placeholder] - Sélecteur CSS de la zone placeholder.
     * @param {string}          [indicators.toast]       - Message du toast de chargement.
     * @param {boolean|string}  [indicators.overlay]     - Si true, affiche l'overlay sans message.
     *                                                     Si string, affiche l'overlay avec ce message.
     * @returns {Promise<Response>}
     */
    fetch(url, fetchOptions = {}, { placeholder, toast, overlay = false } = {}) {
        // La barre navbar est inutile si l'overlay est actif —
        // le spinner et le message de l'overlay suffisent comme retour visuel.
        if (!overlay) XalLoaderNav.start();

        if (placeholder) XalLoaderPlaceholder.show(placeholder);
        if (toast)       XalLoaderToast.show(toast);
        if (overlay)     XalLoaderOverlay.show(typeof overlay === 'string' ? overlay : '');

        return fetch(url, fetchOptions)
            .finally(() => {
                if (!overlay)    XalLoaderNav.stop();

                if (placeholder) XalLoaderPlaceholder.hide(placeholder);
                if (toast)       XalLoaderToast.hide();
                if (overlay)     XalLoaderOverlay.hide();
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
     * @param {*}               [data=null]                 - Données fictives à retourner.
     * @param {Object}          [options={}]
     * @param {number}          [options.delay=1000]        - Délai en ms avant la résolution.
     * @param {boolean}         [options.fail=false]        - Si true, simule une erreur réseau.
     * @param {Object}          [indicators={}]             - Mêmes indicateurs que fetch().
     * @param {string}          [indicators.placeholder]    - Sélecteur CSS de la zone placeholder.
     * @param {string}          [indicators.toast]          - Message du toast de chargement.
     * @param {boolean|string}  [indicators.overlay]        - Si true, affiche l'overlay sans message.
     *                                                        Si string, affiche l'overlay avec ce message.
     * @returns {Promise<*>} Promesse résolue avec les données ou rejetée si fail=true.
     */
    mock(data = null, { delay = 5000, fail = false } = {}, { placeholder, toast, overlay = false } = {}) {
        // La barre navbar est inutile si l'overlay est actif —
        // le spinner et le message de l'overlay suffisent comme retour visuel.
        if (!overlay) XalLoaderNav.start();

        if (placeholder) XalLoaderPlaceholder.show(placeholder);
        if (toast)       XalLoaderToast.show(toast);
        if (overlay)     XalLoaderOverlay.show(typeof overlay === 'string' ? overlay : '');

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!overlay)    XalLoaderNav.stop();

                if (placeholder) XalLoaderPlaceholder.hide(placeholder);
                if (toast)       XalLoaderToast.hide();
                if (overlay)     XalLoaderOverlay.hide();

                if (fail) {
                    reject(new Error('[XalHttp.mock] Erreur simulée.'));
                } else {
                    resolve(data);
                }
            }, delay);
        });
    },
};