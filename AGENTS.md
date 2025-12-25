# AGENTS.md

## Commands
- `npm run dev` - Start dev server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Code Style
- **Imports**: React first, then external libs, then internal with relative paths (`../` notation)
- **Types**: Explicit interfaces for props in `types.ts` or inline with `interface Props`
- **Components**: Functional with `React.FC<Props>`, use `export default ComponentName`
- **Naming**: camelCase for vars/functions, PascalCase for components, UPPER_SNAKE_CASE for constants
- **Error Handling**: `try-catch` with `console.error()`, return `{ error: string | null }` pattern
- **Services**: Static classes with async methods, return `{ data, error }` objects
- **State**: Hooks at top, then handlers, then JSX
- **i18n**: Use `useLanguage()` hook with `t('key')` for translations
- **Icons**: Import from `lucide-react`
- **Styling**: Tailwind CSS classes, RTL support with `rtl:` prefix
- **Comments**: Minimal inline comments (none unless necessary)
