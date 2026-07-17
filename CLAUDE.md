# dashbz — Dashboard admin

Panel administrativo (gestión de empresas, usuarios, conexiones y suscripciones a nivel plataforma). Más simple que `crmbz`. Next.js 10 + React 17 + Redux + Ant Design. `package.json` name: `dash`. Puerto **3004**.

> Contexto global: `../CLAUDE.md`. API que consume: `../docs/api-reference.md`.

## Correr

```bash
npm run dev     # next -p 3004 (NODE_OPTIONS=--openssl-legacy-provider)
npm run build
npm run start   # next start -p 3004
npm run lint    # standard
```

## Estructura `src/`

| Carpeta | Qué hay |
|---------|---------|
| `pages/` | Rutas admin (login, companies, users, connections, subscriptions…) |
| `components/` `views/` | UI (conjunto reducido) |
| `containers/` | Lógica de página |
| `hooks/` | Hooks reutilizables |
| `redux/` | Estado por dominio |
| `layouts/` `styles/` | Wrappers y estilos |

## Notas

- Consume la misma API `apibz` (`/api/*`) que `crmbz`, con vistas orientadas a administración global.
- Estructura más liviana y menos interactiva que el CRM; sin chat en tiempo real intensivo.
- UI: Ant Design v3 + styled-components. Textos en **español**. Comparte `dbbz`/`utilsbz`.
