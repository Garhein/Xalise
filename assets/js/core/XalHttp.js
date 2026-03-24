/**
 * Couche HTTP de l'application Xalise.
 *
 * Surcouche de la méthode fetch() native pour les appels Ajax,
 * avec gestion automatique des indicateurs visuels de chargement 
 * (barre navbar, placeholder, toast, overlay) et la gestion
 * des erreurs HTTP.
 *
 * Gestion des erreurs :
 * - Erreur réseau (fetch rejeté)    → toast d'erreur générique
 * - Erreur HTTP (statut 4xx, 5xx)   → toast d'erreur avec le statut HTTP
 * - Comportement personnalisable    → paramètre onError par appel
 *
 * Dépendances :
 * - XalLoaderNav.js         → XalLoaderNav
 * - XalLoaderPlaceholder.js → XalLoaderPlaceholder
 * - XalLoaderToast.js       → XalLoaderToast
 * - XalLoaderOverlay.js     → XalLoaderOverlay
 * - XalToast.js             → XalToast
 *
 * @namespace XalHttp
 * @author Xavier VILLEMIN
 */
const XalHttp = {
    /**
     * Message d'erreur affiché par défaut lors d'une erreur réseau.
     *
     * @type {string}
     */
    DEFAULT_NETWORK_ERROR_MESSAGE: 'Une erreur réseau est survenue. Veuillez réessayer.',

    /**
     * Messages d'erreur par défaut associés aux statuts HTTP courants.
     * Utilisés par _handleError() quand aucun errorMessages n'est fourni
     * et qu'aucun callback onError n'est défini.
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
     * @param {Object}          indicators              - Indicateurs visuels.
     * @param {string}          indicators.placeholder
     * @param {string}          indicators.toast
     * @param {boolean|string}  indicators.overlay
     * @param {boolean}         show                    - true pour afficher, false pour masquer.
     */
    _toggleIndicators({ placeholder, toast, overlay }, show) {
        const action = show ? 'show' : 'hide';

        if (!overlay) show ? XalLoaderNav.start() : XalLoaderNav.stop();

        if (placeholder) XalLoaderPlaceholder[action](placeholder);
        if (toast)       XalLoaderToast[action](toast);
        if (overlay)     show
            ? XalLoaderOverlay.show(typeof overlay === 'string' ? overlay : '')
            : XalLoaderOverlay.hide();
    },

    /**
     * Gère une erreur survenue lors d'un appel HTTP.
     *
     * Ordre de priorité pour la résolution du message d'erreur :
     * 1. Callback onError fourni par l'appelant    → délégation complète
     * 2. errorMessages fourni par l'appelant       → message spécifique par statut
     * 3. DEFAULT_ERROR_MESSAGES                    → message par défaut par statut
     * 4. Message générique                         → fallback si aucun message n'est défini
     *
     * @param {Error|Response}              error           - Erreur survenue.
     * @param {Function|null}               onError         - Callback d'erreur personnalisé.
     * @param {Record<number, string>}      [errorMessages] - Messages personnalisés par statut HTTP.
     */
    _handleError(error, onError, errorMessages = {}) {
        if (typeof onError === 'function') {
            onError(error);
            return;
        }

        if (error instanceof Response) {
            const message =
                errorMessages[error.status]
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
     * Enveloppe un appel fetch avec les indicateurs visuels appropriés
     * et la gestion des erreurs HTTP.
     *
     * La barre navbar est désactivée si l'overlay est actif —
     * le spinner de l'overlay suffit comme retour visuel.
     *
     * Les réponses HTTP avec un statut 4xx ou 5xx sont considérées
     * comme des erreurs et déclenchent la résolution du message d'erreur
     * selon l'ordre de priorité suivant :
     * 1. Callback onError fourni → délégation complète
     * 2. errorMessages fourni → message spécifique par statut HTTP
     * 3. DEFAULT_ERROR_MESSAGES → message par défaut par statut HTTP
     * 4. Message générique → fallback si aucun message n'est défini
     *
     * Les indicateurs sont systématiquement masqués dans le bloc finally()
     * afin de garantir leur nettoyage même en cas d'erreur réseau.
     *
     * @param {string}                  url                          - URL de la ressource.
     * @param {Object}                  [fetchOptions={}]            - Options passées à fetch().
     * @param {Object}                  [indicators={}]              - Indicateurs visuels et callbacks.
     * @param {string}                  [indicators.placeholder]     - Sélecteur CSS de la zone placeholder.
     * @param {string}                  [indicators.toast]           - Message du toast de chargement.
     * @param {boolean|string}          [indicators.overlay]         - Si true, affiche l'overlay sans message.
     *                                                                 Si string, affiche l'overlay avec ce message.
     * @param {Function|null}           [indicators.onSuccess]       - Callback appelé après une réponse HTTP réussie.
     *                                                                 Reçoit la Response en paramètre.
     * @param {Function|null}           [indicators.onError]         - Callback appelé en cas d'erreur réseau ou HTTP.
     *                                                                 Reçoit la Response (erreur HTTP) ou une Error (erreur réseau) en paramètre.
     *                                                                 Si absent, la résolution suit l'ordre de priorité défini.
     * @param {Record<number, string>}  [indicators.errorMessages]   - Messages d'erreur personnalisés par statut HTTP.
     *                                                                 Prennent le pas sur DEFAULT_ERROR_MESSAGES
     *                                                                 pour les statuts concernés.
     * @returns {Promise<Response>}
     */
    fetch(url, fetchOptions = {}, { placeholder, toast, overlay = false, onError = null, onSuccess = null, errorMessages = {} } = {}) {
        const indicators = { placeholder, toast, overlay };

        this._toggleIndicators(indicators, true);

        return fetch(url, fetchOptions)
            .then(response => {
                // Les erreurs HTTP ne rejettent pas la promesse nativement —
                // on doit vérifier response.ok et rejeter manuellement.
                if (!response.ok) {
                    this._handleError(response, onError, errorMessages);
                    return Promise.reject(response);
                }

                if (typeof onSuccess === 'function') {
                    onSuccess(response);
                }

                return response;
            })
            .catch(error => {
                // Évite de traiter deux fois les erreurs HTTP déjà gérées dans .then()
                if (!(error instanceof Response)) {
                    this._handleError(error, onError, errorMessages);
                }

                return Promise.reject(error);
            })
            .finally(() => {
                this._toggleIndicators(indicators, false);
            });
    },

    /**
     * Simule un appel HTTP avec un délai configurable.
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
     * @param {boolean}                 [options.fail=false]        - Si true, simule une erreur réseau.
     * @param {Object}                  [indicators={}]             - Mêmes indicateurs que fetch().
     * @param {string}                  [indicators.placeholder]    - Sélecteur CSS de la zone placeholder.
     * @param {string}                  [indicators.toast]          - Message du toast de chargement.
     * @param {boolean|string}          [indicators.overlay]        - Si true, affiche l'overlay sans message.
     *                                                                Si string, affiche l'overlay avec ce message.
     * @param {Function|null}           [indicators.onError]        - Callback appelé en cas d'erreur réseau ou HTTP.
     *                                                                Reçoit la Response (erreur HTTP) ou une Error (erreur réseau) en paramètre.
     *                                                                Si absent, la résolution suit l'ordre de priorité défini.
     * @param {Function|null}           [indicators.onSuccess]      - Callback appelé après une réponse HTTP réussie.
     *                                                                Reçoit les données directement.
     * @param {Record<number, string>}  [indicators.errorMessages]  - Messages d'erreur personnalisés par statut HTTP.
     *                                                                Prennent le pas sur DEFAULT_ERROR_MESSAGES
     *                                                                pour les statuts concernés.
     * @returns {Promise<*>} Promesse résolue avec les données ou rejetée si fail=true.
     */
    mock(data = null, { delay = 5000, fail = false } = {}, { placeholder, toast, overlay = false, onError = null, onSuccess = null, errorMessages = {} } = {}) {
        const indicators = { placeholder, toast, overlay };

        this._toggleIndicators(indicators, true);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this._toggleIndicators(indicators, false);

                if (fail) {
                    const error = new Error('[XalHttp.mock] Erreur simulée.');
                    this._handleError(error, onError, errorMessages);
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