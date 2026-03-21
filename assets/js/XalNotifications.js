/**
 * Gestion du centre de notifications de l'application.
 *
 * Fonctionnalités implémentées :
 * - gestion de l'état des notifications
 * - actions unitaires et de masse
 *
 * @namespace XalNotifications
 * @author Xavier VILLEMIN
 */
const XalNotifications = (() => {

    /**
     * Durée (en ms) pendant laquelle l'utilisateur peut annuler une suppression unitaire
     * avant que celle-ci soit définitivement appliquée.
     *
     * @type {number}
     */
    const UNDO_DELETE_DELAY_MS = 5000;

    /**
     * Délai simulé (en ms) pour reproduire le temps de réponse d'une API backend
     * chargée de persister les changements d'état (lue, non lue, supprimée).
     *
     * @type {number}
     */
    const MOCK_API_DELAY_MS = 5000;

    /**
     * Centralisation des sélecteurs CSS et classes d'état utilisés
     * par le gestionnaire de notifications.
     *
     * Règles :
     * - aucune chaîne CSS ne doit être utilisée en dehors de cet objet
     * - toute modification de structure DOM ou de nom de classe doit être répercutée ici
     *
     * L'objet est figé pour garantir l'immuabilité des références
     * et éviter toute modification accidentelle à l'exécution.
     */
    const css = Object.freeze({

        /**
         * Sélecteurs CSS ciblant des éléments du DOM.
         *
         * Ces sélecteurs décrivent la structure de l'interface et sont utilisés pour :
         * - la sélection d'éléments statiques
         * - la délégation d'événements
         * - la synchronisation de l'UI
         */
        selectors: Object.freeze({
            // Conteneurs principaux
            notificationsList:      '.xal-notification-center__list',
            emptyItem:              '.xal-notification-center__list-empty',
            notificationItem:       '.xal-notification',
            offcanvas:              '#xal-id-notification-center',

            // Indicateurs de notifications non lues
            badgeCounters:          '.xal-notification-indicator__badge',
            badgeCountersWrapper:   '.xal-notification-indicator',
            badgeCounterDot:        '.xal-notification-indicator__dot',

            // Toast d'annulation de suppression unitaire
            toastUndo:              '#xal-id-notification-toast-undo',
            toastUndoBtn:           '.xal-notification-toast__action',
            toastProgress:          '.xal-notification-toast__progress',

            // Actions unitaires
            singleActions: Object.freeze({
                read:   '.xal-notification__action--mark-read',
                unread: '.xal-notification__action--mark-unread',
                delete: '.xal-notification__action--delete',
            }),

            // Actions de masse
            bulkActions: Object.freeze({
                read:   '.xal-notification-center__bulk-action--read',
                unread: '.xal-notification-center__bulk-action--unread',
                delete: '.xal-notification-center__bulk-action--delete',
            }),

            // Confirmation de suppression de masse
            bulkDeleteConfirm: Object.freeze({
                wrapper: '.xal-notification-center__bulk-confirm',
                count:   '.xal-notification-center__bulk-confirm-counter',
                confirm: '.xal-notification-center__bulk-confirm-delete',
                cancel:  '.xal-notification-center__bulk-confirm-cancel',
            }),
        }),

        /**
         * Classes CSS représentant des états visuels et fonctionnels.
         *
         * Ces classes :
         * - traduisent l'état métier dans l'UI
         * - pilotent l'activation / désactivation des interactions
         * - ne doivent jamais être utilisées comme sélecteurs DOM
         */
        classes: Object.freeze({
            // États de lecture
            read:       'xal-notification--read',
            unread:     'xal-notification--unread',

            // États d'interaction
            busy:       'xal-notification--busy',
            disabled:   'xal-notification-center__bulk-action--disabled',
        }),
    });

    /**
     * Enumération des types d'actions applicables sur une notification.
     *
     * Cette structure centralise les actions possibles afin de :
     * - éviter l'utilisation de chaînes magiques dispersées dans le code
     * - améliorer la lisibilité et la maintenabilité
     * - faciliter l'évolution future (ajout de nouvelles actions)
     *
     * Les clés représentent l'intention métier, tandis que les valeurs
     * correspondent aux identifiants utilisés dans le DOM ou la logique.
     */
    const NotificationActionType = Object.freeze({
        /** Marquer une notification comme lue */
        MARK_AS_READ:   'read',

        /** Marquer une notification comme non lue */
        MARK_AS_UNREAD: 'unread',

        /** Supprimer une notification (action destructive) */
        DELETE:         'delete',
    });

    /**
     * Enumération des phases applicables à une suppression unitaire de notification.
     *
     * Cette structure centralise les phases possibles afin de :
     * - éviter l'utilisation de chaînes magiques dispersées dans le code
     * - améliorer la lisibilité et la maintenabilité
     * - faciliter l'évolution future (ajout de nouvelles phases)
     *
     * Les clés représentent l'intention métier, tandis que les valeurs
     * correspondent aux identifiants utilisés dans le DOM ou la logique.
     */
    const SingleDeletePhase = Object.freeze({
        /** Phase d'annulation : la suppression peut encore être annulée par l'utilisateur */
        UNDO: 'undo',

        /**
         * Phase d'appel API : la suppression est engagée et ne peut plus être annulée.
         * Cette valeur est assignée dans startNotificationDeletionCommit() pour marquer
         * le point de non-retour — elle n'est pas testée directement mais son absence
         * de correspondance dans cancelNotificationDeletion() bloque implicitement l'annulation.
         */
        API: 'api',
    });

    /**
     * Type de l'action de masse actuellement en cours.
     * null = aucune action.
     *
     * @type {'read' | 'unread' | 'delete' | null}
     */
    let _bulkActionType = null;

    /**
     * Verrou applicatif indiquant qu'une action de suppression (unitaire ou de masse) est en cours.
     * Utilisé pour empêcher le déclenchement simultané de plusieurs suppressions concurrentes.
     *
     * @type {boolean}
     */
    let _isDeleteActionLocked = false;

    /**
     * Phase de la suppression unitaire actuellement en cours.
     * null = aucune phase.
     *
     * @type {'undo' | 'api' | null}
     */
    let _singleDeletePhase = null;

    /**
     * Références vers les éléments DOM manipulés par le gestionnaire.
     *
     * Ces éléments :
     * - sont résolus une seule fois à l'initialisation dans init()
     * - servent de points d'entrée pour les mises à jour de l'UI
     * - peuvent être absents selon l'état de l'interface
     *
     * Toute logique dépendante de ces éléments doit vérifier leur existence.
     *
     * @type {HTMLElement|null}
     */
    let notificationsListElt     = null;
    let emptyStateElt            = null;
    let unreadCounterDotElt      = null;
    let bulkDeleteConfirmWrapper = null;
    let toastDeleteElt           = null;
    let toastDeleteProgressElt   = null;

    /**
     * Notification en attente de suppression (undo possible).
     *
     * @type {HTMLElement|null}
     */
    let pendingSingleDeleteItem = null;

    /**
     * Timer associé au délai d'annulation d'une suppression unitaire.
     * Déclenche startNotificationDeletionCommit() à l'expiration du délai.
     *
     * @type {number|null}
     */
    let pendingDeleteTimer = null;

    /**
     * Timer simulant l'appel à l'API de persistance de la suppression unitaire.
     * Déclenche finalizeNotificationDeletion() à l'expiration du délai.
     *
     * @type {number|null}
     */
    let pendingDeleteApiTimer = null;

    /**
     * Timer utilisé pour différer l'exécution d'une suppression de masse.
     * Déclenche la suppression définitive des éléments du DOM à son expiration.
     *
     * @type {number|null}
     */
    let bulkDeleteTimer = null;

    /**
     * Instance Bootstrap Toast utilisée pour permettre l'annulation d'une suppression unitaire.
     * La référence est créée lors de l'affichage du toast et détruite après masquage.
     *
     * @type {import('bootstrap').Toast|null}
     */
    let undoDeleteToast = null;

    /**
     * Abstration nommée qui exécute une fonction après le délai de simulation d'appel API (MOCK_API_DELAY_MS).
     *
     * @param {() => void} fn - Fonction à exécuter après le délai.
     * @returns {number} Identifiant du timer retourné par setTimeout.
     */
    const _delayApi = (fn) => setTimeout(fn, MOCK_API_DELAY_MS);

    /**
     * Abstration nommée qui exécute une fonction après le délai d'annulation (UNDO_DELETE_DELAY_MS).
     *
     * @param {() => void} fn - Fonction à exécuter après le délai.
     * @returns {number} Identifiant du timer retourné par setTimeout.
     */
    const _delayUndo = (fn) => setTimeout(fn, UNDO_DELETE_DELAY_MS);

    /**
     * Réinitialise toutes les références et états transitoires
     * liés au cycle de suppression unitaire.
     *
     * Appelée à l'issue d'une suppression (finalisation ou annulation)
     * pour garantir un état propre avant la prochaine interaction.
     */
    const _resetSingleDeleteState = () => {
        pendingSingleDeleteItem = null;
        pendingDeleteApiTimer   = null;
        undoDeleteToast         = null;
        _singleDeletePhase      = null;
    };

    return {

        //#region Méthodes utilitaires et gestion des états

        /**
         * Indique si une action de suppression (unitaire ou de masse) est en cours.
         *
         * Utilisé comme précondition pour bloquer toute nouvelle action destructive
         * tant que la précédente n'est pas terminée ou annulée.
         *
         * @returns {boolean} true si le verrou de suppression est actif, false sinon.
         */
        isDeleteActionLocked() {
            return _isDeleteActionLocked;
        },

        /**
         * Active le verrou de suppression.
         *
         * Empêche le déclenchement de toute nouvelle action destructive
         * (unitaire ou de masse) tant que ce verrou est actif.
         *
         * Effets de bord :
         * - met à jour la disponibilité des actions de masse
         */
        lockDeleteAction() {
            _isDeleteActionLocked = true;
            this.updateBulkActionsAvailability();
        },

        /**
         * Désactive le verrou de suppression.
         *
         * Libère le verrou posé par lockDeleteAction() et restaure
         * la disponibilité des actions de masse selon les règles métier.
         *
         * Effets de bord :
         * - met à jour la disponibilité des actions de masse
         */
        unlockDeleteAction() {
            _isDeleteActionLocked = false;
            this.updateBulkActionsAvailability();
        },

        /**
         * Indique si une notification est occupée (état "busy").
         *
         * Une notification est considérée comme "busy" lorsqu'elle :
         * - est en cours d'une action (lecture, suppression, etc.)
         * - ne doit plus accepter d'interactions utilisateur
         *
         * @param {HTMLElement} item - Élément notification à tester.
         * @returns {boolean} true si la notification est occupée, false sinon.
         */
        isItemBusy(item) {
            return item?.classList.contains(css.classes.busy);
        },

        /**
         * Applique ou retire l'état "busy" sur une notification.
         *
         * L'état "busy" indique que la notification est temporairement
         * indisponible pour toute interaction utilisateur (action en cours,
         * transition, simulation d'appel API).
         *
         * La classe CSS correspondante permet de :
         * - désactiver visuellement les actions
         * - afficher un feedback visuel (spinner, animation, etc.)
         *
         * @param {HTMLElement} item - Notification concernée.
         * @param {boolean} [value=true] - true pour appliquer l'état "busy", false pour le retirer.
         */
        setItemBusy(item, value = true) {
            item?.classList.toggle(css.classes.busy, value);
        },

        /**
         * Indique si une action de masse est actuellement en cours.
         *
         * Cet état permet de :
         * - bloquer les actions de masse concurrentes
         * - désactiver les contrôles UI associés
         * - refléter visuellement un état global "occupé" sur la liste
         *
         * @returns {boolean} true si une action de masse est en cours, false sinon.
         */
        isBulkActionInProgress() {
            return _bulkActionType !== null;
        },

        /**
         * Applique ou retire l'état visuel "action de masse en cours" sur la liste.
         *
         * Cet état agit comme un verrou visuel et fonctionnel global appliqué
         * à la liste de notifications pendant l'exécution d'une action de masse
         * (lecture, marquage, suppression).
         *
         * @param {boolean} [value=true] - true pour activer l'état, false pour le désactiver.
         */
        setBulkActionVisualState(value = true) {
            notificationsListElt?.classList.toggle(css.classes.busy, value);
        },

        /**
         * Verrouille les actions de masse pour un type donné.
         *
         * Si une action de masse est déjà en cours, le verrouillage est refusé
         * et la méthode retourne false sans modifier l'état.
         *
         * Effets de bord :
         * - applique l'état visuel "busy" sur la liste
         * - met à jour la disponibilité des actions de masse
         *
         * @param {'read' | 'unread' | 'delete'} type - Type de l'action de masse à verrouiller.
         * @returns {boolean} true si le verrouillage a été appliqué, false si une action de masse est déjà en cours.
         */
        lockBulkAction(type) {
            if (this.isBulkActionInProgress()) return false;

            _bulkActionType = type;
            this.setBulkActionVisualState(true);
            this.updateBulkActionsAvailability();

            return true;
        },

        /**
         * Déverrouille toute action de masse en cours.
         *
         * Remet _bulkActionType à null et restaure l'état visuel
         * et la disponibilité des actions de masse.
         *
         * Effets de bord :
         * - retire l'état visuel "busy" de la liste
         * - met à jour la disponibilité des actions de masse
         */
        unlockBulkAction() {
            _bulkActionType = null;
            this.setBulkActionVisualState(false);
            this.updateBulkActionsAvailability();
        },

        //#endregion

        //#region Getters

        /**
         * Retourne la liste actuelle des notifications dans le DOM.
         *
         * Calculée dynamiquement à chaque appel — le DOM est la source de vérité visuelle.
         * Aucune donnée n'est mise en cache : toute modification
         * (ajout, mise à jour, suppression) est immédiatement reflétée.
         *
         * @returns {HTMLElement[]} Tableau des éléments notification.
         */
        items() {
            return Array.from(document.querySelectorAll(css.selectors.notificationItem));
        },

        /**
         * Retourne la liste des notifications actuellement marquées comme non lues.
         *
         * Filtre dynamiquement items() pour ne conserver que les éléments
         * possédant la classe CSS unread.
         *
         * Le DOM reste la source de vérité visuelle : aucun état interne
         * n'est mis en cache, et toute modification est immédiatement reflétée.
         *
         * @returns {HTMLElement[]} Tableau des notifications non lues.
         */
        unreadItems() {
            return this.items().filter(i => i.classList.contains(css.classes.unread));
        },

        /**
         * Retourne la liste des notifications actuellement marquées comme lues.
         *
         * Filtre dynamiquement items() pour ne conserver que les éléments
         * possédant la classe CSS read.
         *
         * Le DOM reste la source de vérité visuelle : aucun état interne
         * n'est mis en cache, et toute modification est immédiatement reflétée.
         *
         * @returns {HTMLElement[]} Tableau des notifications lues.
         */
        readItems() {
            return this.items().filter(i => i.classList.contains(css.classes.read));
        },

        //#endregion

        //#region Actions unitaires

        /**
         * Marque une notification comme lue.
         *
         * Déclenche une action unitaire simulant :
         * - un verrouillage temporaire de la notification
         * - un appel API asynchrone via _delayApi()
         * - une mise à jour de l'état visuel à l'issue du traitement
         *
         * L'action est ignorée si :
         * - la notification est inexistante
         * - une action est déjà en cours sur cet élément (busy)
         * - la notification est déjà marquée comme lue
         *
         * @param {HTMLElement} item - Élément notification à marquer comme lue.
         */
        markNotificationAsRead(item) {
            if (!item || this.isItemBusy(item) || !item.classList.contains(css.classes.unread)) return;

            this.setItemBusy(item);

            _delayApi(() => {
                item.classList.replace(css.classes.unread, css.classes.read);
                this.setItemBusy(item, false);
                this.updateGlobalUIIndicators();
            });
        },

        /**
         * Marque une notification comme non lue.
         *
         * Déclenche une action unitaire simulant :
         * - un verrouillage temporaire de la notification
         * - un appel API asynchrone via _delayApi()
         * - une mise à jour de l'état visuel à l'issue du traitement
         *
         * L'action est ignorée si :
         * - la notification est inexistante
         * - une action est déjà en cours sur cet élément (busy)
         * - la notification est déjà marquée comme non lue
         *
         * @param {HTMLElement} item - Élément notification à marquer comme non lue.
         */
        markNotificationAsUnread(item) {
            if (!item || this.isItemBusy(item) || !item.classList.contains(css.classes.read)) return;

            this.setItemBusy(item);

            _delayApi(() => {
                item.classList.replace(css.classes.read, css.classes.unread);
                this.setItemBusy(item, false);
                this.updateGlobalUIIndicators();
            });
        },

        /**
         * Programme la suppression d'une notification avec possibilité d'annulation.
         *
         * Vérifie les préconditions avant d'initier le cycle de suppression :
         * - l'élément doit exister et ne pas être occupé
         * - aucun verrou de suppression ne doit être actif
         *
         * Si les préconditions sont satisfaites :
         * - active le verrou global des actions de suppression
         * - délègue à startUndoableNotificationDeletion() pour démarrer le cycle
         *
         * La suppression effective n'est pas immédiate :
         * elle sera exécutée automatiquement à l'issue du délai UNDO_DELETE_DELAY_MS
         * si aucune annulation n'est demandée par l'utilisateur.
         *
         * @param {HTMLElement} item - Notification à supprimer.
         */
        scheduleNotificationDeletion(item) {
            if (!item || this.isItemBusy(item) || this.isDeleteActionLocked()) return;

            this.lockDeleteAction();
            this.startUndoableNotificationDeletion(item);
        },

        /**
         * Démarre la phase de suppression unitaire avec possibilité d'annulation (phase UNDO).
         *
         * Cette méthode :
         * - verrouille visuellement la notification concernée
         * - enregistre l'élément comme suppression en attente
         * - configure et affiche le toast d'annulation avec barre de progression
         * - déclenche un compte à rebours via _delayUndo() avant suppression définitive
         *
         * À l'issue du délai, et en l'absence d'annulation explicite,
         * la phase API est automatiquement déclenchée via startNotificationDeletionCommit().
         *
         * @param {HTMLElement} item - Notification concernée par la suppression.
         */
        startUndoableNotificationDeletion(item) {
            this.setItemBusy(item);
            pendingSingleDeleteItem = item;
            _singleDeletePhase      = SingleDeletePhase.UNDO;

            toastDeleteProgressElt?.style.setProperty('--toast-duration', `${UNDO_DELETE_DELAY_MS}ms`);

            undoDeleteToast = new bootstrap.Toast(toastDeleteElt, {
                delay:    UNDO_DELETE_DELAY_MS,
                autohide: true,
            });

            undoDeleteToast.show();

            pendingDeleteTimer = _delayUndo(() => {
                this.startNotificationDeletionCommit(item);
            });
        },

        /**
         * Démarre la phase d'engagement définitif de la suppression (phase API).
         *
         * Appelée automatiquement après l'expiration du délai d'annulation.
         * À partir de ce point, la suppression ne peut plus être annulée.
         *
         * Simule un appel API de persistance via _delayApi(),
         * à l'issue duquel finalizeNotificationDeletion() est appelée
         * pour retirer définitivement l'élément du DOM.
         *
         * @param {HTMLElement} item - Notification concernée par la suppression.
         */
        startNotificationDeletionCommit(item) {
            pendingDeleteTimer = null;
            _singleDeletePhase = SingleDeletePhase.API;

            pendingDeleteApiTimer = _delayApi(() => {
                this.finalizeNotificationDeletion(item);
            });
        },

        /**
         * Finalise la suppression définitive d'une notification.
         *
         * Représente l'ultime étape du cycle de suppression unitaire.
         * À ce stade, la suppression est irréversible du point de vue de l'UI.
         *
         * Effets de bord :
         * - retire l'élément du DOM s'il est encore connecté
         * - annule le timer API résiduel
         * - réinitialise toutes les références et états transitoires via _resetSingleDeleteState()
         * - libère le verrou global des actions destructives
         * - synchronise les indicateurs globaux de l'interface
         *
         * @param {HTMLElement} item - Notification à supprimer définitivement.
         */
        finalizeNotificationDeletion(item) {
            if (item?.isConnected) item.remove();

            clearTimeout(pendingDeleteApiTimer);
            _resetSingleDeleteState();

            this.unlockDeleteAction();
            this.updateGlobalUIIndicators();
        },

        /**
         * Annule la suppression unitaire en attente d'une notification.
         *
         * Déclenchée lorsque l'utilisateur clique sur le bouton d'annulation
         * dans le toast d'undo. N'est effective que si la suppression est
         * encore dans la phase UNDO — toute tentative hors de cette phase est ignorée.
         *
         * Effets de bord :
         * - annule le timer d'undo (pendingDeleteTimer)
         * - réactive visuellement la notification (retire l'état busy)
         * - réinitialise les références de suppression en attente via _resetSingleDeleteState()
         * - libère le verrou global des actions destructives
         * - masque le toast d'annulation
         *
         * Aucune suppression n'est effectuée :
         * la notification reste inchangée dans le DOM.
         */
        cancelNotificationDeletion() {
            if (!pendingSingleDeleteItem) return;
            if (_singleDeletePhase !== SingleDeletePhase.UNDO) return;

            clearTimeout(pendingDeleteTimer);
            pendingDeleteTimer = null;

            this.setItemBusy(pendingSingleDeleteItem, false);

            const toast = undoDeleteToast;
            _resetSingleDeleteState();

            this.unlockDeleteAction();
            toast?.hide();
        },

        //#endregion

        //#region Actions de masse

        /**
         * Marque toutes les notifications non lues comme lues.
         *
         * Déclenche une action de masse simulant :
         * - un verrouillage global de la liste (lockBulkAction)
         * - un appel API asynchrone via _delayApi()
         * - une mise à jour atomique de l'état visuel des notifications concernées
         *
         * L'action est ignorée si :
         * - une suppression est en cours (verrou actif)
         * - aucune notification non lue n'est présente
         *
         * Pendant le traitement :
         * - toutes les notifications ciblées sont marquées comme busy
         * - les actions de masse sont temporairement désactivées
         *
         * À l'issue du traitement :
         * - les notifications sont marquées comme lues
         * - l'état global de l'interface est synchronisé
         */
        markAllUnreadNotificationsAsRead() {
            if (this.isDeleteActionLocked() || !this.lockBulkAction(NotificationActionType.MARK_AS_READ)) return;

            const unreadNotifications = this.unreadItems();

            if (!unreadNotifications.length) {
                this.unlockBulkAction();
                return;
            }

            unreadNotifications.forEach(n => this.setItemBusy(n));

            _delayApi(() => {
                unreadNotifications.forEach(n => {
                    n.classList.replace(css.classes.unread, css.classes.read);
                    this.setItemBusy(n, false);
                });

                this.unlockBulkAction();
                this.updateGlobalUIIndicators();
            });
        },

        /**
         * Marque toutes les notifications lues comme non lues.
         *
         * Déclenche une action de masse simulant :
         * - un verrouillage global de la liste (lockBulkAction)
         * - un appel API asynchrone via _delayApi()
         * - une mise à jour atomique de l'état visuel des notifications concernées
         *
         * L'action est ignorée si :
         * - une suppression est en cours (verrou actif)
         * - aucune notification lue n'est présente
         *
         * Pendant le traitement :
         * - toutes les notifications ciblées sont marquées comme busy
         * - les actions de masse sont temporairement désactivées
         *
         * À l'issue du traitement :
         * - les notifications sont marquées comme non lues
         * - l'état global de l'interface est synchronisé
         */
        markAllReadNotificationsAsUnread() {
            if (this.isDeleteActionLocked() || !this.lockBulkAction(NotificationActionType.MARK_AS_UNREAD)) return;

            const readNotifications = this.readItems();

            if (!readNotifications.length) {
                this.unlockBulkAction();
                return;
            }

            readNotifications.forEach(n => this.setItemBusy(n));

            _delayApi(() => {
                readNotifications.forEach(n => {
                    n.classList.replace(css.classes.read, css.classes.unread);
                    this.setItemBusy(n, false);
                });

                this.unlockBulkAction();
                this.updateGlobalUIIndicators();
            });
        },

        /**
         * Affiche la confirmation de suppression de masse.
         *
         * Méthode strictement visuelle — aucune suppression n'est déclenchée
         * et aucun état métier n'est modifié.
         *
         * Elle :
         * - vérifie qu'aucune action destructive n'est déjà en cours
         * - met à jour le compteur affichant le nombre de notifications concernées
         * - rend visible le bloc de confirmation
         *
         * La suppression effective ne pourra être exécutée
         * qu'après validation explicite de l'utilisateur via confirmAndExecuteBulkDeletion().
         */
        showBulkDeleteConfirmation() {
            if (this.isDeleteActionLocked() || !bulkDeleteConfirmWrapper) return;

            bulkDeleteConfirmWrapper
                .querySelector(css.selectors.bulkDeleteConfirm.count)
                .textContent = this.items().length;

            bulkDeleteConfirmWrapper.hidden = false;
        },

        /**
         * Confirme et exécute la suppression de masse des notifications.
         *
         * Représente le point de non-retour du processus de suppression de masse,
         * après validation explicite de l'utilisateur.
         * Aucune annulation n'est possible après l'appel de cette méthode.
         *
         * Déroulé :
         * - vérifie qu'aucune autre action destructive n'est en cours
         * - verrouille toutes les actions (unitaires et de masse)
         * - masque le bloc de confirmation
         * - place chaque notification en état busy
         * - simule un appel API via _delayApi()
         * - supprime définitivement toutes les notifications du DOM
         * - libère les verrous et synchronise l'interface
         */
        confirmAndExecuteBulkDeletion() {
            if (this.isDeleteActionLocked() || !this.lockBulkAction(NotificationActionType.DELETE)) return;

            const items = this.items();

            if (!items.length) {
                this.unlockBulkAction();
                return;
            }

            this.lockDeleteAction();
            this.hideBulkDeleteConfirmation();

            items.forEach(item => this.setItemBusy(item));

            bulkDeleteTimer = _delayApi(() => {
                items.forEach(item => { if (item?.isConnected) item.remove(); });

                bulkDeleteTimer = null;

                this.unlockDeleteAction();
                this.unlockBulkAction();
                this.updateGlobalUIIndicators();
            });
        },

        //#endregion

        //#region Gestion de l'UI

        /**
         * Masque la confirmation contextuelle de suppression de masse.
         *
         * Méthode strictement visuelle :
         * - aucune suppression n'est déclenchée
         * - aucun état métier ou logique n'est modifié
         *
         * Appelée dans les cas suivants :
         * - annulation explicite par l'utilisateur (bouton Annuler)
         * - fermeture du offcanvas
         * - après confirmation et exécution d'une suppression de masse
         */
        hideBulkDeleteConfirmation() {
            if (bulkDeleteConfirmWrapper) bulkDeleteConfirmWrapper.hidden = true;
        },

        /**
         * Met à jour la disponibilité des actions de masse selon les règles métier.
         *
         * Méthode strictement visuelle — ne modifie que les classes CSS des contrôles
         * et ne déclenche aucune action métier.
         *
         * Parcours unique via tableau de règles, supprimant le double
         * parcours (désactivation globale puis règles spécifiques) de l'implémentation précédente.
         *
         * Capture unique des listes DOM en début de méthode pour éviter
         * les appels DOM redondants au sein d'une même opération de mise à jour.
         *
         * Règles appliquées :
         * - toutes les actions sont désactivées si une suppression ou une action de masse est en cours
         * - "tout marquer comme lu"  : actif uniquement s'il existe des notifications non lues
         * - "tout marquer comme non lu" : actif uniquement s'il existe des notifications lues
         * - "tout supprimer" : actif uniquement s'il existe des notifications
         */
        updateBulkActionsAvailability() {
            const disabled    = this.isDeleteActionLocked() || this.isBulkActionInProgress();
            const allItems    = disabled ? [] : this.items();
            const unreadCount = disabled ? 0  : this.unreadItems().length;
            const readCount   = disabled ? 0  : this.readItems().length;

            const rules = [
                { selector: css.selectors.bulkActions.read,   isDisabled: disabled || unreadCount === 0 },
                { selector: css.selectors.bulkActions.unread, isDisabled: disabled || readCount === 0 },
                { selector: css.selectors.bulkActions.delete, isDisabled: disabled || allItems.length === 0 },
            ];

            rules.forEach(({ selector, isDisabled }) => {
                document.querySelector(selector)?.classList.toggle(css.classes.disabled, isDisabled);
            });
        },

        /**
         * Synchronise l'ensemble des indicateurs globaux de l'interface avec l'état courant du DOM.
         *
         * Le DOM est considéré comme la source de vérité visuelle.
         * Méthode strictement visuelle — ne modifie aucun état métier
         * et ne déclenche aucune action utilisateur.
         *
         * Capture unique de items() et unreadItems() en début de méthode
         * pour éviter les appels DOM redondants au sein d'une même synchronisation.
         *
         * Met à jour :
         * - les compteurs numériques de notifications non lues et leur visibilité
         * - l'indicateur visuel global (dot)
         * - l'état "aucune notification" (liste vide)
         * - la disponibilité des actions de masse
         *
         * Doit être appelée après toute modification du contenu ou de l'état des notifications.
         */
        updateGlobalUIIndicators() {
            const allItems    = this.items();
            const unreadCount = this.unreadItems().length;

            // Mise à jour des compteurs numériques et de leur visibilité
            document.querySelectorAll(css.selectors.badgeCounters).forEach(badge => {
                badge.textContent = unreadCount;
                badge.closest(css.selectors.badgeCountersWrapper).hidden = unreadCount === 0;
            });

            // Indicateur visuel global (dot)
            unreadCounterDotElt?.toggleAttribute('hidden', unreadCount === 0);

            // État "aucune notification"
            emptyStateElt?.toggleAttribute('hidden', allItems.length > 0);

            // Mise à jour des règles de disponibilité des actions de masse
            this.updateBulkActionsAvailability();
        },

        //#endregion

        //#region Gestion des événements

        /**
         * Construit la table de dispatch des actions utilisateur.
         *
         * Retourne une structure déclarative associant des sélecteurs CSS
         * à des handlers d'action. Centralise le routage de toutes les interactions :
         * - actions unitaires sur une notification
         * - actions de masse sur la liste
         * - confirmations contextuelles
         * - annulation d'une suppression (undo)
         *
         * Aucun listener n'est attaché ici — cette méthode décrit uniquement
         * les correspondances entre l'UI et les intentions métier.
         * La résolution effective est effectuée par handleClickAction().
         *
         * Type de retour précisé en {Array<[string, () => void]>}
         * au lieu du générique {Array<[string, Function]>}.
         *
         * @param {HTMLElement} notificationItem - Notification de référence pour les actions unitaires.
         * @returns {Array<[string, () => void]>} Liste de paires [sélecteur CSS, handler].
         */
        createActionDispatchMap(notificationItem) {
            return [
                // Actions unitaires
                [css.selectors.singleActions.read,   () => this.markNotificationAsRead(notificationItem)],
                [css.selectors.singleActions.unread, () => this.markNotificationAsUnread(notificationItem)],
                [css.selectors.singleActions.delete, () => this.scheduleNotificationDeletion(notificationItem)],

                // Actions de masse
                [css.selectors.bulkActions.read,   () => this.markAllUnreadNotificationsAsRead()],
                [css.selectors.bulkActions.unread, () => this.markAllReadNotificationsAsUnread()],
                [css.selectors.bulkActions.delete, () => this.showBulkDeleteConfirmation()],

                // Confirmation contextuelle de suppression de masse
                [css.selectors.bulkDeleteConfirm.confirm, () => this.confirmAndExecuteBulkDeletion()],
                [css.selectors.bulkDeleteConfirm.cancel,  () => this.hideBulkDeleteConfirmation()],

                // Annulation de la suppression unitaire (toast undo)
                [css.selectors.toastUndoBtn, () => this.cancelNotificationDeletion()],
            ];
        },

        /**
         * Résout et exécute l'action associée à un clic sur l'interface des notifications.
         *
         * Parcourt la table de dispatch retournée par createActionDispatchMap() et exécute
         * le premier handler dont le sélecteur correspond à la cible du clic (ou l'un de ses parents).
         *
         * Une seule action est exécutée par clic : la résolution s'arrête
         * dès la première correspondance trouvée.
         *
         * @param {MouseEvent} event - Événement de clic capturé.
         * @param {HTMLElement} notificationItem - Notification de référence pour les actions unitaires.
         */
        handleClickAction(event, notificationItem) {
            for (const [cssSelector, actionHandler] of this.createActionDispatchMap(notificationItem)) {
                // Vérifie si la cible du clic (ou un de ses parents) correspond au sélecteur de l'action
                if (event.target.closest(cssSelector)) {
                    actionHandler();

                    // Stoppe la résolution après la première action trouvée
                    return;
                }
            }
        },

        /**
         * Initialise les gestionnaires d'événements du centre de notifications.
         *
         * Met en place une délégation d'événements globale sur document,
         * ce qui permet à un seul listener de gérer toutes les interactions
         * (actions unitaires, de masse, confirmations, annulations).
         *
         * Attache également un listener sur l'offcanvas pour nettoyer les états
         * transitoires à sa fermeture (timers actifs, confirmations visibles).
         *
         * Cette méthode doit être appelée une seule fois lors de l'initialisation.
         */
        initEventHandlers() {
            // Délégation globale des clics
            document.addEventListener('click', event => {
                // Notification éventuellement concernée par l'action
                const notificationItem = event.target.closest(css.selectors.notificationItem);

                // Blocage des interactions unitaires si la notification est occupée.
                // Les actions globales (masse, confirmation, undo) restent autorisées
                // lorsque notificationItem est null.
                if (notificationItem && this.isItemBusy(notificationItem)) return;

                this.handleClickAction(event, notificationItem);
            });

            // Nettoyage des états transitoires à la fermeture du offcanvas :
            // - annulation des timers actifs
            // - réinitialisation des confirmations contextuelles
            document.querySelector(css.selectors.offcanvas)
                ?.addEventListener('hidden.bs.offcanvas', () => {
                    this.cancelAllDeleteActions();
                });
        },

        /**
         * Annule les actions de suppression non confirmées lors de la fermeture du offcanvas.
         *
         * Règles appliquées :
         * - annule uniquement les états transitoires (phase UNDO)
         * - ne rollback jamais une suppression déjà confirmée (phase API ou bulk confirmé)
         * - nettoie les timers non engagés
         * - masque les confirmations visibles non validées
         * - restaure un état UI cohérent
         *
         * Effets de bord :
         * - retire l'état busy de la notification en attente (si phase UNDO)
         * - masque le toast d'annulation (si phase UNDO)
         * - libère le verrou de suppression (si phase UNDO)
         * - masque la confirmation de suppression de masse (si non confirmée)
         * - synchronise les indicateurs globaux de l'interface
         */
        cancelAllDeleteActions() {
            // Annulation d'une suppression unitaire uniquement si elle est encore dans la phase d'undo
            if (_singleDeletePhase === SingleDeletePhase.UNDO) {
                clearTimeout(pendingDeleteTimer);
                pendingDeleteTimer = null;

                this.setItemBusy(pendingSingleDeleteItem, false);

                const toast = undoDeleteToast;
                _resetSingleDeleteState();

                toast?.hide();
                this.unlockDeleteAction();
            }

            // Masquage d'une confirmation de suppression de masse si affichée mais non confirmée.
            // Si une suppression de masse est confirmée, on ne touche PAS au bulkDeleteTimer :
            // l'opération doit aller à son terme.
            if (!this.isDeleteActionLocked() && bulkDeleteConfirmWrapper) {
                this.hideBulkDeleteConfirmation();
            }

            // Nettoyage visuel global
            this.updateGlobalUIIndicators();
        },

        //#endregion

        //#region Initialisation

        /**
         * Initialise le composant centre de notifications.
         *
         * Point d'entrée unique appelé depuis xalise.js au DOMContentLoaded.
         *
         * Séquence d'initialisation :
         * 1. Résout et stocke les références DOM utilisées par le gestionnaire
         * 2. Attache le listener hidden.bs.toast pour réinitialiser la barre de progression
         * 3. Initialise la délégation d'événements via initEventHandlers()
         * 4. Synchronise l'état initial de l'interface via updateGlobalUIIndicators()
         */
        init() {
            // Résolution des références DOM
            notificationsListElt     = document.querySelector(css.selectors.notificationsList);
            emptyStateElt            = document.querySelector(css.selectors.emptyItem);
            unreadCounterDotElt      = document.querySelector(css.selectors.badgeCounterDot);
            bulkDeleteConfirmWrapper = document.querySelector(css.selectors.bulkDeleteConfirm.wrapper);
            toastDeleteElt           = document.querySelector(css.selectors.toastUndo);
            toastDeleteProgressElt   = document.querySelector(css.selectors.toastProgress);

            // Réinitialise la durée d'animation de la barre de progression
            // lorsque le toast est entièrement masqué (événement Bootstrap hidden.bs.toast),
            // afin d'éviter toute persistance d'état visuel lors d'un affichage ultérieur.
            toastDeleteElt?.addEventListener('hidden.bs.toast', () => {
                toastDeleteProgressElt?.style.removeProperty('--toast-duration');
            });

            this.initEventHandlers();
            this.updateGlobalUIIndicators();
        },

        //#endregion
    };
})();