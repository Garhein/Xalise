/**
 * Gestion du toast de chargement pour les opérations longues.
 *
 * Affiche un toast Bootstrap non dismissible en bas à droite
 * avec un spinner et un message, pendant une opération longue
 * (export, génération de rapport, traitement batch, etc.).
 * 
 * Le toast reste affiché jusqu'à l'appel explicite de hide() et
 * affiche un spinner de chargement, et non une action à effectuer
 *
 * Le toast est créé dynamiquement dans le DOM lors du premier
 * appel à show() et réutilisé pour les appels suivants.
 *
 * Dépendances :
 * - XalConstants.js → XalConstants
 *
 * @namespace XalLoaderToast
 * @author Xavier VILLEMIN
 */
const XalLoaderToast = (() => {
    /**
     * Message affiché par défaut si aucun message n'est fourni à show().
     *
     * @type {string}
     */
    const DEFAULT_MESSAGE = 'Chargement en cours…';

    /**
     * Instance Bootstrap Toast active.
     * Créée lors du premier appel à show() et détruite dans hide().
     *
     * @type {bootstrap.Toast|null}
     */
    let _toastInstance = null;

    /**
     * Élément DOM du toast.
     * Créé une seule fois et réutilisé.
     *
     * @type {HTMLElement|null}
     */
    let _toastElt = null;

    /**
     * Élément DOM du message à l'intérieur du toast.
     *
     * @type {HTMLElement|null}
     */
    let _messageElt = null;

    /**
     * Crée l'élément DOM du toast et l'insère dans le conteneur de toasts.
     *
     * Le toast est créé sans bouton de fermeture et avec autohide désactivé
     * pour rester visible jusqu'à l'appel explicite de hide().
     *
     * Le conteneur `.toast-container` est supposé déjà présent dans le HTML.
     */
    const _createToastElement = () => {
        _toastElt           = document.createElement('div');
        _toastElt.className = 'toast xal-loader-toast';
        _toastElt.setAttribute(XalConstants.attributeNames.role, XalConstants.attributeValues.status);
        _toastElt.setAttribute(XalConstants.ariaNames.live, XalConstants.attributeValues.polite);
        _toastElt.setAttribute(XalConstants.ariaNames.atomic, XalConstants.attributeValues.true);

        _toastElt.innerHTML = `
            <div class="toast-body">
                <div class="xal-loader-toast__spinner" aria-hidden="true"></div>
                <span class="xal-loader-toast__message"></span>
            </div>
        `;

        // Insertion dans le conteneur de toasts existant
        const container = document.querySelector(XalConstants.cssQueries.toastContainer);

        if (container) {
            container.appendChild(_toastElt);
        } else {
            document.body.appendChild(_toastElt);
        }

        _messageElt = _toastElt.querySelector(XalConstants.cssQueries.toastLoaderMessage);
    };

    return {
        /**
         * Affiche le toast de chargement avec le message fourni.
         *
         * Crée l'élément DOM si c'est le premier appel.
         * Met à jour le message si le toast est déjà visible.
         *
         * @param {string} [message] - Message à afficher. Utilise DEFAULT_MESSAGE si absent.
         */
        show(message = DEFAULT_MESSAGE) {
            if (!_toastElt) {
                _createToastElement();
            }

            // Mise à jour du message
            if (_messageElt) {
                _messageElt.textContent = message;
            }

            // Création ou réutilisation de l'instance Bootstrap Toast
            if (!_toastInstance) {
                _toastInstance = new bootstrap.Toast(_toastElt, {
                    autohide: false,
                });
            }

            _toastInstance.show();
        },

        /**
         * Masque le toast de chargement et libère l'instance Bootstrap
         * après la fin de l'animation de disparition.
         *
         * dispose() est appelé via l'événement hidden.bs.toast pour éviter
         * une erreur "this._element is null" causée par l'appel synchrone
         * de dispose() avant la fin de l'animation Bootstrap.
         *
         * Sans effet si le toast n'est pas affiché.
         */
        hide() {
            if (!_toastInstance) return;

            // Nettoyage différé après la fin de l'animation
            _toastElt.addEventListener('hidden.bs.toast', () => {
                _toastInstance?.dispose();
                _toastInstance = null;
            }, { once: true });

            _toastInstance.hide();
        },

        /**
         * Indique si le toast de chargement est actuellement affiché.
         *
         * @returns {boolean} true si le toast est visible, false sinon.
         */
        isVisible() {
            return _toastInstance !== null;
        },

        /**
         * Met à jour le message affiché sans masquer ni réafficher le toast.
         *
         * Sans effet si le toast n'est pas affiché.
         *
         * @param {string} message - Nouveau message à afficher.
         */
        updateMessage(message) {
            if (!_messageElt || !_toastInstance) return;

            _messageElt.textContent = message;
        },
    };
})();