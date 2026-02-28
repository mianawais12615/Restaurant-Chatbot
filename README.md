# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

### Running the local proxy server

This project uses a small Express proxy (`server.js`) to call the
Google Generative Language API. Doing the request from the backend:

1. keeps your API key out of the browser
2. allows the frontend to avoid CORS issues and gives a single origin
3. provides a place to add retries or rate‑limit handling

#### Setup

1. Create a `.env` file in the workspace root (it's already in `.gitignore`):

```env
VITE_GEMINI_API_KEY=your_google_api_key_here
```

2. Install the new dependencies and dev tooling:

```bash
npm install
```

3. Start both servers during development:

```bash
npm run dev:all    # runs `server` + `dev` concurrently
```

Alternatively you can run the proxy on its own (`npm run server`) and
load the frontend via `npm run dev` in a second terminal.

When you deploy, make sure the `server.js` process is available and the
`VITE_GEMINI_API_KEY` environment variable is set on the host.

## React Compiler

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
