# Exemples JS — Xalise

## XalHttp — Mock des appels API

Simule un appel HTTP avec un délai configurable et une réponse fictive,
tout en déclenchant les mêmes indicateurs visuels que `XalHttp.fetch()`.

**Signature :**

```js
XalHttp.mock(
    data,
    { delay, fail },
    { placeholder, toast, overlay = false }
)
```

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `data` | `*` | `null` | Données fictives retournées par la promesse |
| `delay` | `number` | `5000` | Délai en ms avant la résolution |
| `fail` | `boolean` | `false` | Si `true`, simule une erreur réseau |
| `placeholder` | `string` | — | Sélecteur CSS de la zone placeholder |
| `toast` | `string` | — | Message du toast de chargement |
| `overlay` | `boolean` | `false` | Si `true`, affiche l'overlay sans message. |
| `overlay` | `string` | — | Si `string`, affiche l'overlay avec ce message. |

---

### Succès avec délai par défaut (5s)

```js
XalHttp.mock({ items: [], total: 0 });
```

---

### Succès avec placeholder et délai personnalisé

```js
XalHttp.mock(
    [{ id: 1, nom: 'Dupont' }, { id: 2, nom: 'Martin' }],
    { delay: 10000 },
    { placeholder: '#tooltip-div' }
);
```

---

### Simulation d'erreur réseau

```js
XalHttp.mock(null, { fail: true })
       .catch(err => console.error(err.message));
```

---

### Simulation d'une opération longue avec toast

```js
XalHttp.mock(
    { url: '/exports/rapport-2026.pdf' },
    { delay: 20000 },
    { toast: 'Génération du PDF en cours…' }
);
```

---

### Overlay bloquant toute interaction avec la page

```js
XalHttp.mock(
    { url: '/exports/rapport-2026.pdf' },
    { delay: 20000 },
    { overlay: true }
);
```

```js
XalHttp.mock(
    { url: '/exports/rapport-2026.pdf' },
    { delay: 20000 },
    { overlay: "Génération du PDF en cours..." }
);
```