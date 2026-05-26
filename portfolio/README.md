# Cyber-tech portfolio (Vite + React + Tailwind)

Single-page portfolio with glassmorphism nav, timeline, skills terminal, project tabs, client-side recruiter chat simulator, and Web3Forms-ready contact.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Contact form (Web3Forms)

1. Create an access key at [web3forms.com](https://web3forms.com).
2. Copy `.env.example` to `.env` and set `VITE_WEB3FORMS_ACCESS_KEY`.
3. Restart the dev server.

**Formspree:** change the form `action` to `https://formspree.io/f/<your-id>` and remove the `access_key` hidden field (keep `name`, `email`, `message`).

## Stack

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- [Lucide React](https://lucide.dev/) icons

## Structure

- `src/components/` — `Navbar`, `Hero`, `ExperienceTimeline`, `SkillsTerminal`, `ProjectsGrid`, `AIChatSim`, `ContactForm`
- `src/hooks/useActiveSection.ts` — scroll-spy for nav highlighting
- `src/constants/sections.ts` — section ids shared by layout and nav

---

<details>
<summary>Original Vite template notes</summary>

The sections below are from the default Vite template (ESLint expansion, React Compiler).

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      tseslint.configs.recommendedTypeChecked,
      // Alternatively, for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific ESLint rules.

</details>
