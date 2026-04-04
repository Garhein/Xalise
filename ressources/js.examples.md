<div align="center">

# Xalise — Exemples JavaScript

![JavaScript](./badges/JavaScript_ES6.svg) ![Bootstrap](./badges/Bootstrap_5.svg)

</div>

---

## XalHttp — Appels Ajax

> Surcouche de la méthode `fetch()` native pour les appels Ajax, avec gestion automatique des indicateurs visuels de chargement et des erreurs HTTP.

**Signature**

```js
XalHttp.fetch(
    url,
    fetchOptions,
    { placeholder, toast, overlay, onSuccess, onError }
)
```

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `url` | `string` | — | URL de la ressource |
| `fetchOptions` | `Object` | `{}` | Options passées à `fetch()` (`method`, `headers`, `body`, etc.) |
| `placeholder` | `string` | — | Sélecteur CSS de la zone où afficher le placeholder |
| `toast` | `string` | — | Message du toast de chargement. Si renseigné, le toast est affiché |
| `overlay` | `boolean` | `false` | Si `true`, affiche l'overlay sans message |
| `overlay` | `string` | — | Si `string`, affiche l'overlay avec le message indiqué |
| `onSuccess` | `Function` | — | Callback appelé après une réponse HTTP réussie. Reçoit la `Response` en paramètre |
| `onError` | `Function` | — | Callback appelé en cas d'erreur réseau ou HTTP. Reçoit la `Response` (erreur HTTP) ou une `Error` (erreur réseau). Si non renseigné, un toast d'erreur générique est affiché |
| `errorMessages` | `Record<number, string>` | — | Messages d'erreur personnalisés par statut HTTP |

### ![GET](./badges/GET.svg) Chargement d'une liste

```js
XalHttp.fetch('/api/fournisseurs', {},
    {
        placeholder: '#xal-id-table-fournisseurs',
        onSuccess: (response) => {
            response.json().then(data => {
                renderTable(data.items);
                document.querySelector('#xal-id-counter').textContent = data.total;
            });
        },
    });
```

### ![GET](./badges/GET.svg) Chargement avec paramètres de recherche

```js
const params = new URLSearchParams({ search: 'dupont', page: 1, limit: 20 });

XalHttp.fetch(`/api/fournisseurs?${params}`, {}, 
    {
        onSuccess: (response) => {
            response.json().then(data => renderTable(data.items));
        },
    });
```

### ![POST](./badges/POST.svg) Création d'un enregistrement

```js
XalHttp.fetch(
    '/api/fournisseurs',
    {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nom: 'Dupont', siret: '12345678900000' }),
    },
    {
        overlay:   'Enregistrement en cours…',
        onSuccess: (response) => {
            response.json().then(data => {
                XalToast.success(`Fournisseur "${data.nom}" créé avec succès.`);
            });
        },
        onError: (error) => {
            if (error instanceof Response && error.status === 409) {
                XalToast.warning('Un fournisseur avec ce SIRET existe déjà.');
            } else {
                XalToast.error('Impossible de créer le fournisseur.');
            }
        },
    });
```

### ![PUT](./badges/PUT.svg) Mise à jour d'un enregistrement

```js
XalHttp.fetch(
    '/api/fournisseurs/42',
    {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nom: 'Dupont & Fils' }),
    },
    {
        overlay:   'Mise à jour en cours…',
        onSuccess: () => XalToast.success('Fournisseur mis à jour avec succès.'),
        onError:   () => XalToast.error('Impossible de mettre à jour le fournisseur.'),
    });
```

### ![DELETE](./badges/DELETE.svg) Suppression avec surcharge des messages des statuts HTTP

```js
XalHttp.fetch(
    '/api/fournisseurs/42',
    { method: 'DELETE' },
    {
        overlay:       'Suppression en cours…',
        onSuccess: () => {
            XalToast.success('Fournisseur supprimé avec succès.');
            document.querySelector('#xal-id-row-42')?.remove();
        },
        errorMessages: {
            404: 'Ce fournisseur n\'existe plus.',
            409: 'Ce fournisseur est lié à des commandes existantes.',
        },
    });
```

### ![POST](./badges/POST.svg) Upload de fichier

```js
const formData = new FormData();
formData.append('fichier', document.querySelector('#xal-id-input-fichier').files[0]);

XalHttp.fetch(
    '/api/import', 
    { method: 'POST', body: formData },
    {
        overlay: 'Import en cours…',
        onSuccess: (response) => {
            response.json().then(data => {
                XalToast.success(`${data.imported} enregistrement(s) importé(s).`);

                if (data.skipped > 0) {
                    XalToast.warning(`${data.skipped} enregistrement(s) ignoré(s).`);
                }
            });
        },
        onError: () => XalToast.error('L\'import a échoué. Vérifiez le format du fichier.'),
    });
```

### ![GET](./badges/GET.svg) Téléchargement d'un fichier

```js
XalHttp.fetch(
    '/api/export/fournisseurs',
    {},
    {
        toast: 'Génération de l\'export en cours…',
        onSuccess: (response) => {
            response.blob().then(blob => {
                const url  = URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.href     = url;
                link.download = 'fournisseurs.xlsx';
                link.click();

                URL.revokeObjectURL(url);
                XalToast.success('Export téléchargé avec succès.');
            });
        },
        onError: () => XalToast.error('Impossible de générer l\'export.'),
    });
```

---

## XalHttp — Mock des appels Ajax

> Simule un appel HTTP avec un délai configurable et une réponse fictive, tout en déclenchant les mêmes indicateurs visuels que `XalHttp.fetch()`.

**Signature**

```js
XalHttp.mock(
    data,
    { delay, fail },
    { placeholder, toast, overlay, onSuccess, onError }
)
```

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `data` | `*` | `null` | Données fictives retournées par la promesse |
| `delay` | `number` | `5000` | Délai en ms avant la résolution |
| `fail` | `boolean` | `false` | Si `true`, simule une erreur réseau |
| `placeholder` | `string` | — | Sélecteur CSS de la zone où afficher le placeholder |
| `toast` | `string` | — | Message du toast de chargement. Si renseigné, le toast est affiché |
| `overlay` | `boolean` | `false` | Si `true`, affiche l'overlay sans message |
| `overlay` | `string` | — | Si `string`, affiche l'overlay avec le message indiqué |
| `onSuccess` | `Function` | — | Callback appelé après une réponse HTTP réussie. Reçoit la `Response` en paramètre |
| `onError` | `Function` | — | Callback appelé en cas d'erreur réseau ou HTTP. Reçoit la `Response` (erreur HTTP) ou une `Error` (erreur réseau). Si non renseigné, un toast d'erreur générique est affiché |
| `errorMessages` | `Record<number, string>` | — | Messages d'erreur personnalisés par statut HTTP |

### Succès avec délai par défaut (5s)

```js
XalHttp.mock({ items: [], total: 0 });
```

### Succès avec placeholder et délai personnalisé

```js
XalHttp.mock(
    [{ id: 1, nom: 'Dupont' }, { id: 2, nom: 'Martin' }],
    { delay: 10000 },
    { placeholder: '#tooltip-div' }
);
```

![Loader placeholder](./screenshots/loader-placeholder.png)

### Simulation d'erreur réseau

```js
XalHttp.mock(null, { fail: true })
       .catch(err => console.error(err.message));
```

![Mock network error](./screenshots/mock-network-error.png)

### Simulation d'une opération longue avec toast

> Le toast est affiché dans le coin inférieur droit de la page.

```js
XalHttp.mock(
    { url: '/exports/rapport-2026.pdf' },
    { delay: 20000 },
    { toast: 'Génération du PDF en cours…' }
);
```

![Loader toast](./screenshots/loader-toast.png)

### Overlay bloquant toute interaction avec la page

```js
// Sans message
XalHttp.mock(
    { url: '/exports/rapport-2026.pdf' },
    { delay: 20000 },
    { overlay: true }
);
```

![Loader overlay](./screenshots/loader-overlay.png)

```js
// Avec message
XalHttp.mock(
    { url: '/exports/rapport-2026.pdf' },
    { delay: 20000 },
    { overlay: 'Génération du PDF en cours…' }
);
```

![Loader overlay](./screenshots/loader-overlay-message.png)

### Mise à jour du message de l'overlay en cours d'opération

```js
XalHttp.mock(
    { url: '/exports/rapport-2026.pdf' },
    { delay: 20000 },
    {
        overlay: 'Initialisation…',
        onSuccess: (data) => {
            XalLoaderOverlay.setMessage('Finalisation…');
        }
    }
);
```

---

## XalToast — Toasts de feedback

> Affiche des toasts Bootstrap contextuels pour informer l'utilisateur du résultat d'une opération. Ceux-ci sont affichés dans le coin inférieur droit de la page.

**Signature**

```js
XalToast.success(message, delay)
XalToast.error(message, delay)
XalToast.warning(message, delay)
XalToast.info(message, delay)
```

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `message` | `string` | — | Message à afficher dans le corps du toast |
| `delay` | `number` | `5000` | Délai en ms avant masquage automatique |

### Toast de succès

```js
XalToast.success('Fournisseur créé avec succès.');
```

![Toast de succès](./screenshots/toast-success.png)

### Toast d'erreur

```js
XalToast.error('Une erreur est survenue. Veuillez réessayer.');
```

![Toast d'erreur](./screenshots/toast-error.png)

### Toast d'avertissement

```js
XalToast.warning('Ce fournisseur est lié à des commandes existantes.');
```

![Toast d'avertissement](./screenshots/toast-warning.png)

### Toast d'information

```js
XalToast.info('Les données ont été mises à jour.');
```

![Toast d'information](./screenshots/toast-info.png)

### Délai personnalisé

```js
// Toast affiché pendant 10 secondes
XalToast.success('Export généré avec succès.', 10000);

// Toast affiché pendant 2 secondes
XalToast.info('Recherche en cours…', 2000);
```

### Toast personnalisé

```js
XalToast.custom( 
    { 
        title: 'Titre personnalisé', 
        icon: 'bi-activity', 
        color: 'text-bg-xalise', 
        message: 'Message du toast' 
    }
);
```

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `options.title` | `string` | — | Message à afficher dans le titre du toast |
| `options.icon` | `string` | — | Classe de l'icône à afficher dans le titre du toast |
| `options.color` | `string` | — | Classe de la couleur de fond |
| `options.message` | `string` | — | Message à afficher dans le corps du toast |
| `delay` | `number` | `5000` | Délai en ms avant masquage automatique |

![Toast personnalisé](./screenshots/toast-custom.png)