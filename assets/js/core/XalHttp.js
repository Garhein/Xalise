/**
 * Couche de gestion des requêtes HTTP.
 * 
 * Surcouche de `fetch()` fournissant :
 * - gestion des indicateurs de chargement (navbar, placeholder, toast, overlay)
 * - gestion centralisée des erreurs réseau et HTTP
 * - callbacks personnalisables
 * 
 * Gestion des erreurs :
 * - Erreur réseau (fetch rejeté)    → toast d'erreur générique
 * - Erreur HTTP (statut 4xx, 5xx)   → toast d'erreur avec le statut HTTP
 * - Comportement personnalisable    → paramètre `onError` par appel
 * 
 * Dépendances :
 * - XalLoaderNav
 * - XalLoaderPlaceholder
 * - XalLoaderToast
 * - XalLoaderOverlay
 * - XalToast
 * 
 * @namespace XalHttp
 */
const XalHttp = (() => {
    /**
     * Message d'erreur affiché par défaut en cas d'erreur réseau.
     * 
     * @private
     *
     * @type {string}
     */
    DEFAULT_NETWORK_ERROR_MESSAGE: 'Une erreur réseau est survenue. Veuillez réessayer.';

    /**
     * Messages d'erreur par défaut associés aux statuts HTTP.
     * 
     * @private
     * 
     * @type {Readonly<Record<number, string>>}
     */
    DEFAULT_ERROR_MESSAGES: Object.freeze({
        400: 'Requête invalide.',
        401: 'Accès non autorisé à la ressource demandée.',
        403: 'Accès refusé à la ressource demandée.',
        404: 'Ressource non trouvée.',
        405: 'Méthode HTTP non autorisée pour accéder à la ressource.',
        408: 'Délai d\'envoi de la requête trop long.',
        409: 'Conflit avec l\'état actuel de la ressource.',
        410: 'Ressource supprimée définitivement.',
        422: 'Données invalides.',
        429: 'Limite de requête atteinte ou dépassée.',
        500: 'Une erreur serveur est survenue.',
        501: 'Fonctionnalité non supportée par le serveur.',
        502: 'Réponse invalide d\'un serveur en amont.',
        503: 'Serveur temporairement indisponible.',
        504: 'Délai dépassé en attendant un serveur en amont.',
    });

    /**
     * Active ou désactive les indicateurs visuels de chargement.
     * 
     * La barre de progression située sous la barre de navigation est désactivée si
     * l'overlay est actif car le spinner de l'overlay suffit comme retour visuel.
     * 
     * @private
     * 
     * @param {Object}          indicators              Indicateurs visuels à activer ou désactiver.
     * @param {string}          indicators.placeholder  Sélecteur CSS de la zone du placeholder.
     * @param {string}          indicators.toast        Message du toast.
     * @param {boolean|string}  indicators.overlay      Si `true`, affiche l'overlay sans message.
     *                                                  Si `string`, affiche l'overlay avec ce message.
     * @param {boolean}         show                    `true` pour afficher les indicateurs, `false` pour masquer les indicateurs.
     */
    const _toggleLoadingIndicators = ({ placeholder, toast, overlay }, show) => {
        const action = show ? 'show' : 'hide';

        if (!overlay) {
            show ? XalLoaderNav.start() : XalLoaderNav.stop();
        }

        if (placeholder) XalLoaderPlaceholder[action](placeholder);
        if (toast)       XalLoaderToast[action](toast);

        if (overlay) {
            show
                ? XalLoaderOverlay.show(typeof overlay === 'string' ? overlay : '')
                : XalLoaderOverlay.hide();
        }
    };

    /**
     * Extrait un message d'erreur à partir d'une réponse HTTP.
     * 
     * Tente d'interpréter le corps de la réponse selon son type :
     * - JSON   → retourne la propriété `message` si présente, sinon la réponse sérialisée.
     * - Autre  → retourne le contenu texte brut.
     * 
     * La méthode consomme le body de la réponse.
     * Il est recommandé de lui fournir une copie de la réponse (`response.clone()`) si
     * celle-ci doit être réutilisée ailleurs (ex: pour un autre traitement ou un callback onSuccess).
     * 
     * @private
     * 
     * @param {Response} response Réponse HTTP à analyser.
     * 
     * @return {Promise<string>} Message d'erreur extrait ou message générique en cas d'échec.
     */
    const _extractErrorMessage = async (response) => {
        try {
            const contentType = response.headers.get('content-type');

            if (contentType?.includes('application/json')) {
                const data = await response.json();
                return data.message ?? JSON.stringify(data);
            }

            return await response.text();
        } catch {
            return '[XalHttp] Une erreur est survenue à l\'extraction du message d\'erreur.';
        }
    };

    /**
     * Parse le corps d'une réponse HTTP en fonction de son type de contenu.
     * - JSON   → retourne un objet JavaScript
     * - Autre  → retourne une chaîne de caractères
     * 
     * La méthode consomme le body de la réponse.
     * Il est recommandé de lui fournir une copie de la réponse (`response.clone()`) si
     * celle-ci doit être réutilisée ailleurs (ex: pour un autre traitement ou un callback onSuccess).
     * 
     * @private
     * 
     * @param {Response} response Réponse HTTP à parser.
     * 
     * @returns {Promise<any>} Données parsées (objet ou texte).
     */
    const _parseResponse = async (response) => {
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            return response.json();
        }

        return response.text();
    };

    /**
     * Gère une erreur réseau ou HTTP.
     * 
     * Ordre de priorité pour la résolution du message d'erreur :
     * 1. Callback `onError` fourni par l'appelant
     * 2. Message personnalisé spécifique par statut HTTP fourni par l'appelant
     * 3. Message extrait de la réponse HTTP (si disponible)
     * 4. Message par défaut défini dans DEFAULT_ERROR_MESSAGES
     * 5. Message générique de fallback
     * 
     * @private
     * 
     * @param {Error|Response}          error           Erreur survenue.
     *                                                  Instance de `Response` (erreur HTTP) ou une `Error` (erreur réseau).
     * @param {Function|null}           onError         Callback d'erreur personnalisé fourni par l'appelant.
     * @param {Record<number, string>}  errorMessages   Messages d'erreur personnalisés par statut HTTP fournis par l'appelant.
     */
    const _handleError = async (error, onError, errorMessages) => {
        if (typeof onError === 'function') {
            onError(error);
            return;
        }

        if (error instanceof Response) {
            // Utilisation de `error.clone()` pour éviter de consommer le corps de la réponse,
            // permettant à d'autres traitements d'y accéder si nécessaire.
            const extractedMessage = await this._extractErrorMessage(error.clone());

            const message =
                errorMessages[error.status]
                ?? extractedMessage    
                ?? this.DEFAULT_ERROR_MESSAGES[error.status]
                ?? `Erreur ${error.status} : ${error.statusText || 'Une erreur est survenue.'}`;

            error.status === 409
                ? XalToast.warning(message)
                : XalToast.error(message);

        } else {
            XalToast.error(this.DEFAULT_NETWORK_ERROR_MESSAGE);
        }
    };

    /**
     * Exécute une requête HTTP.
     * 
     * Gère les indicateurs de chargement et les erreurs selon la configuration fournie.
     * Les indicateurs sont systématiquement masqués dans le bloc finally() pour garantir leur nettoyage même en cas d'erreur.
     * 
     * @public
     * 
     * @param {string}                  url                         URL de la ressource demandée.
     * @param {Object}                  [fetchOptions={}]           Options de la requête HTTP.
     * @param {Object}                  [indicators={}]             Indicateurs visuels et callbacks.
     * @param {string}                  [indicators.placeholder]    Sélecteur CSS de la zone du placeholder.
     * @param {string}                  [indicators.toast]          Message du toast.
     * @param {boolean|string}          [indicators.overlay]        Si `true`, affiche l'overlay sans message.
     *                                                              Si `string`, affiche l'overlay avec ce message.
     * @param {Function|null}           [indicators.onSuccess]      Callback appelé après une requête HTTP réussie.
     *                                                              Reçoit la `Response` en paramètre.
     * @param {Function|null}           [indicators.onError]        Callback appelé en cas d'erreur réseau ou HTTP.
     *                                                              Reçoit la `Response` (erreur HTTP) ou une `Error` (erreur réseau) en paramètre.
     *                                                              Si absent, la résolution suit l'ordre de priorité défini.
     * @param {Record<number, string>}  [indicators.errorMessages]  Messages d'erreur personnalisés par statut HTTP.
     *                                                              Prennent le pas sur DEFAULT_ERROR_MESSAGES pour les statuts concernés.
     * 
     * @return {Promise<Response>}                                  Promesse résolue avec la `Response` ou rejetée en cas d'erreur réseau.
     */
    return {
        fetch(url, fetchOptions = {}, { placeholder, toast, overlay = false, onError = null, onSuccess = null, errorMessages = {} } = {}) {
            const indicators = { placeholder, toast, overlay };

            this._toggleLoadingIndicators(indicators, true);

            return fetch(url, fetchOptions)
                .then(async response => {
                    let parsedData;

                    try {
                        parsedData = await this._parseResponse(response.clone());
                    } catch {
                        parsedData = null;
                    }

                    // Les erreurs HTTP ne rejettent pas la promesse nativement.
                    // On doit vérifier response.ok et rejeter manuellement.
                    if (!response.ok) {
                        await this._handleError(response, onError, errorMessages);
                        return Promise.reject(response);
                    }

                    if (typeof onSuccess === 'function') {
                        // Reçoit la `Response` et les données parsées (si disponibles)
                        onSuccess(response, parsedData);
                    }

                    return response;
                })
                .catch(async error => {
                    // Évite de traiter deux fois les erreurs HTTP déjà gérées dans .then()
                    if (!(error instanceof Response)) {
                        await this._handleError(error, onError, errorMessages);
                    }

                    return Promise.reject(error);
                })
                .finally(() => {
                    this._toggleLoadingIndicators(indicators, false);
                });
        },

        /**
         * Simule une requête HTTP.
         * 
         * Déclenche les mêmes indicateurs visuels et la même gestion d'erreurs que `fetch()`,
         * mais retourne une réponse fictive après le délai spécifié.
         * 
         * @public
         * 
         * @param {*}                       [data=null]                 Données fictives à retourner.
         * @param {Object}                  [options={}]                Options de la simulation.
         * @param {number}                  [options.delay=5000]        Délai en ms avant la résolution.
         * @param {boolean}                 [options.fail=false]        Si `true`, simule une erreur réseau.
         * @param {Object}                  [indicators={}]             Indicateurs visuels et callbacks.
         * @param {string}                  [indicators.placeholder]    Sélecteur CSS de la zone du placeholder.
         * @param {string}                  [indicators.toast]          Message du toast.
         * @param {boolean|string}          [indicators.overlay]        Si `true`, affiche l'overlay sans message.
         *                                                              Si `string`, affiche l'overlay avec ce message.
         * @param {Function|null}           [indicators.onSuccess]      Callback appelé après une requête HTTP réussie.
         *                                                              Reçoit les données directement.
         * @param {Function|null}           [indicators.onError]        Callback appelé en cas d'erreur réseau ou HTTP.
         *                                                              Reçoit la `Response` (erreur HTTP) ou une `Error` (erreur réseau) en paramètre.
         *                                                              Si absent, la résolution suit l'ordre de priorité défini.
         * @param {Record<number, string>}  [indicators.errorMessages]  Messages d'erreur personnalisés par statut HTTP.
         *                                                              Prennent le pas sur DEFAULT_ERROR_MESSAGES pour les statuts concernés.
         * 
         * @returns {Promise<*>}                                        Promesse résolue avec les données ou rejetée si fail = `true`.
         */
        mock(data = null, { delay = 5000, fail = false } = {}, { placeholder, toast, overlay = false, onError = null, onSuccess = null, errorMessages = {} } = {}) {
            const indicators = { placeholder, toast, overlay };

            this._toggleLoadingIndicators(indicators, true);

            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    this._toggleLoadingIndicators(indicators, false);

                    if (fail) {
                        const error = new Error('[XalHttp.mock] Erreur simulée.');
                        await this._handleError(error, onError, errorMessages);
                        Promise.reject(error);
                    } else {
                        if (typeof onSuccess === 'function') {
                            onSuccess(data);
                        }

                        Promise.resolve(data);
                    }
                }, delay);
            });
        },
    };
})();