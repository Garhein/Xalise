/**
 * Couche HTTP de l'application Xalise.
 *
 * Surcouche de fetch() fournissant :
 * - gestion des indicateurs de chargement (navbar, placeholder, toast, overlay)
 * - gestion centralisée des erreurs réseau et HTTP
 * - callbacks personnalisables
 *
 * Gestion des erreurs :
 * - Erreur réseau (fetch rejeté)    → toast d'erreur générique
 * - Erreur HTTP (statut 4xx, 5xx)   → toast d'erreur avec le statut HTTP
 * - Comportement personnalisable    → paramètre onError par appel
 *
 * @namespace XalHttp
 */
const XalHttp = {
    /**
     * Message d'erreur affiché par défaut en cas d'erreur réseau.
     *
     * @type {string}
     */
    DEFAULT_NETWORK_ERROR_MESSAGE: 'Une erreur réseau est survenue. Veuillez réessayer.',

    /**
     * Messages d'erreur par défaut associés aux statuts HTTP.
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
    }),

    /**
     * Active ou désactive les indicateurs visuels de chargement.
     * 
     * La barre navbar est désactivée si l'overlay est actif.
     * Le spinner de l'overlay suffit comme retour visuel.
     *
     * @param {Object}          indicators              - Indicateurs visuels.
     * @param {string}          indicators.placeholder
     * @param {string}          indicators.toast
     * @param {boolean|string}  indicators.overlay
     * @param {boolean}         show                    - `true` pour afficher, `false` pour masquer.
     * @private
     */
    _toggleIndicators({ placeholder, toast, overlay }, show) {
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
    },

    /**
     * Extrait un message d'erreur à partir d'une réponse HTTP.
     *
     * Tente d'interpréter le corps de la réponse selon son type :
     * - JSON   → retourne la propriété `message` si présente, sinon la réponse sérialisée
     * - Autre  → retourne le contenu texte brut
     *
     * Cette méthode consomme le body de la réponse.
     * Il est recommandé de passer une copie (`response.clone()`) si la réponse
     * doit être réutilisée ailleurs.
     *
     * @param {Response} response Réponse HTTP à analyser.
     * @returns {Promise<string>} Message d'erreur extrait ou message générique en cas d'échec.
     * @private
     */
    async _extractErrorMessage(response){
        try {
            const contentType = response.headers.get('content-type');

            if (contentType?.includes('application/json')) {
                const data = await response.json();
                return data.message || JSON.stringify(data);
            }

            return await response.text();
        } catch {
            return 'Une erreur est survenue à l\'extraction du message d\'erreur.';
        }
    },

    /**
     * Parse le corps d'une réponse HTTP en fonction de son type de contenu.
     * - JSON   → retourne un objet JavaScript
     * - Autre  → retourne une chaîne de caractères
     *
     * Cette méthode consomme le body de la réponse.
     * Utiliser `response.clone()` si le body doit être lu plusieurs fois.
     *
     * @param {Response} response Réponse HTTP à parser.
     * @returns {Promise<any>} Données parsées (objet ou texte).
     * @private
     */
    async _parseResponse(response) {
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            return response.json();
        }

        return response.text();
    },

    /**
     * Gère une erreur réseau ou HTTP.
     *
     * Ordre de priorité pour la résolution du message d'erreur :
     * 1. Callback onError fourni par l'appelant                → délégation complète
     * 2. Message personnalisé fourni par l'appelant            → message spécifique par statut HTTP
     * 3. Message extrait de la réponse HTTP                    → si disponible
     * 4. Message par défaut défini dans DEFAULT_ERROR_MESSAGES → message par défaut par statut HTTP
     * 5. Message générique                                     → fallback si aucun message n'est défini
     *
     * @param {Error|Response}              error           - Erreur survenue.
     * @param {Function|null}               onError         - Callback d'erreur personnalisé.
     * @param {Record<number, string>}      [errorMessages] - Messages personnalisés par statut HTTP.
     * @returns {Promise<void>}
     * @private
     */
    async _handleError(error, onError, errorMessages = {}) {
        if (typeof onError === 'function') {
            onError(error);
            return;
        }

        if (error instanceof Response) {
            // Utilisation de `error.clone()` pour éviter de consommer le corps de la réponse,
            // permettant ainsi à d'autres traitements d'y accéder si nécessaire.
            const extractedMessage = await this._extractErrorMessage(error.clone());

            const message =
                errorMessages[error.status]
                ?? extractedMessage    
                ?? this.DEFAULT_ERROR_MESSAGES[error.status]
                ?? `Erreur ${error.status} : ${error.statusText || 'Une erreur est survenue.'}`;

            // Avertissement pour les conflits (409), erreur pour les autres cas
            error.status === 409
                ? XalToast.warning(message)
                : XalToast.error(message);

        } else {
            XalToast.error(this.DEFAULT_NETWORK_ERROR_MESSAGE);
        }
    },

    /**
     * Exécute une requête HTTP avec gestion intégrée des indicateurs de chargement et des erreurs.
     *
     * Les indicateurs sont systématiquement masqués dans le bloc finally()
     * afin de garantir leur nettoyage même en cas d'erreur réseau.
     *
     * @param {string}                  url                          - URL de la ressource.
     * @param {Object}                  [fetchOptions={}]            - Options passées à fetch().
     * @param {Object}                  [indicators={}]              - Indicateurs visuels et callbacks.
     * @param {string}                  [indicators.placeholder]     - Sélecteur CSS de la zone placeholder.
     * @param {string}                  [indicators.toast]           - Message du toast de chargement.
     * @param {boolean|string}          [indicators.overlay]         - Si `true`, affiche l'overlay sans message.
     *                                                                 Si `string`, affiche l'overlay avec ce message.
     * @param {Function|null}           [indicators.onSuccess]       - Callback appelé après une réponse HTTP réussie.
     *                                                                 Reçoit la Response en paramètre.
     * @param {Function|null}           [indicators.onError]         - Callback appelé en cas d'erreur réseau ou HTTP.
     *                                                                 Reçoit la Response (erreur HTTP) ou une Error (erreur réseau) en paramètre.
     *                                                                 Si absent, la résolution suit l'ordre de priorité défini.
     * @param {Record<number, string>}  [indicators.errorMessages]   - Messages d'erreur personnalisés par statut HTTP.
     *                                                                 Prennent le pas sur DEFAULT_ERROR_MESSAGES pour les statuts concernés.
     * 
     * @returns {Promise<Response>}                                  Promesse résolue avec la Response ou rejetée en cas d'erreur réseau.
     */
    fetch(url, fetchOptions = {}, { placeholder, toast, overlay = false, onError = null, onSuccess = null, errorMessages = {} } = {}) {
        const indicators = { placeholder, toast, overlay };

        this._toggleIndicators(indicators, true);

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
                this._toggleIndicators(indicators, false);
            });
    },

    /**
     * Simule un appel HTTP.
     *
     * Déclenche les mêmes indicateurs visuels et la même gestion d'erreurs
     * que fetch(), mais retourne une réponse fictive après le délai spécifié.
     *
     * Utile pour le développement front-end sans backend disponible,
     * ou pour tester les états de chargement et les scénarios d'erreur.
     *
     * @param {*}                       [data=null]                 - Données fictives à retourner.
     * @param {Object}                  [options={}]
     * @param {number}                  [options.delay=5000]        - Délai en ms avant la résolution.
     * @param {boolean}                 [options.fail=false]        - Si `true`, simule une erreur réseau.
     * @param {Object}                  [indicators={}]             - Indicateurs visuels et callbacks.
     * @param {string}                  [indicators.placeholder]    - Sélecteur CSS de la zone placeholder.
     * @param {string}                  [indicators.toast]          - Message du toast de chargement.
     * @param {boolean|string}          [indicators.overlay]        - Si `true`, affiche l'overlay sans message.
     *                                                                Si `string`, affiche l'overlay avec ce message.
     * @param {Function|null}           [indicators.onError]        - Callback appelé en cas d'erreur réseau ou HTTP.
     *                                                                Reçoit la Response (erreur HTTP) ou une Error (erreur réseau) en paramètre.
     *                                                                Si absent, la résolution suit l'ordre de priorité défini.
     * @param {Function|null}           [indicators.onSuccess]      - Callback appelé après une réponse HTTP réussie.
     *                                                                Reçoit les données directement.
     * @param {Record<number, string>}  [indicators.errorMessages]  - Messages d'erreur personnalisés par statut HTTP.
     *                                                                Prennent le pas sur DEFAULT_ERROR_MESSAGES pour les statuts concernés.
     * 
     * @returns {Promise<*>}                                        Promesse résolue avec les données ou rejetée si fail=true.
     */
    mock(data = null, { delay = 5000, fail = false } = {}, { placeholder, toast, overlay = false, onError = null, onSuccess = null, errorMessages = {} } = {}) {
        const indicators = { placeholder, toast, overlay };

        this._toggleIndicators(indicators, true);

        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                this._toggleIndicators(indicators, false);

                if (fail) {
                    const error = new Error('[XalHttp.mock] Erreur simulée.');
                    await this._handleError(error, onError, errorMessages);
                    reject(error);
                } else {
                    if (typeof onSuccess === 'function') {
                        onSuccess(data);
                    }

                    resolve(data);
                }
            }, delay);
        });
    },
};