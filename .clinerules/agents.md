# Project Context
this is an astro project for a personal web site 
- all content is to be loaded dynamically
- after human approval - update as needed
    - documentation folder
    - readme
    - git: add & commit
    - git: ask whether to push   

# Content Guidelines
## Content Collections Structure
- **Blog Posts**: `src/content/blog/[post-name]/index.md`
- **Projects**: `src/content/projects/[project-name]/index.md` 
- **About Content**: `src/content/about/index.md`
- **Work Experience**: `src/content/work/[company].md`
- **Legal**: `src/content/legal/[document].md`

## Frontmatter Requirements
Follow schema defined in `src/content/config.ts`:
- Blog posts: title, summary, date, tags, draft (optional)
- Projects: title, summary, demoUrl, repoUrl (both optional)
- Work: company, role, startDate, endDate (optional)

## Content Rules
- Use markdown for text content
- Use MDX only when interactive components are needed
- All content must be loaded dynamically via `getCollection()`
- Do not hardcode content in components when content collections exist

# Development Workflow
## File Organization
- **Components**: `src/components/` (Astro .astro files, SolidJS .tsx files)
- **Pages**: `src/pages/` (file-based routing)
- **Layouts**: `src/layouts/` (page templates)
- **Utilities**: `src/lib/` (shared functions)
- **Constants**: `src/consts.ts` (site configuration)

## Styling Guidelines
- Use TailwindCSS utility classes only
- Custom CSS only in `src/styles/global.css`
- Maintain dark/light theme compatibility
- Use `cn()` utility from `src/lib/utils.ts` for class merging

## TypeScript Rules
- All new files must use TypeScript
- Follow existing type patterns
- Use types auto-generated from content collections
- Maintain strict typing throughout

# Safety Rules
## Files Requiring Explicit Approval
- `astro.config.mjs` - build configuration
- `package.json` - dependencies and scripts
- `src/content/config.ts` - content collection schemas
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.mjs` - styling configuration

## Architectural Patterns to Preserve
- Content-first approach with collections
- Islands architecture for interactive components
- File-based routing structure
- Component composition patterns
- Dynamic content loading via `getCollection()`

## Component Guidelines
- Follow existing naming conventions
- Use Astro components for static content and layouts
- Use SolidJS components for interactive elements
- Import components using existing patterns
- Maintain responsive design principles

# Allowed Commands
## Standard Commands
- `pnpm dev` - development server
- `pnpm build` - production build
- `pnpm preview` - preview production build
- `pnpm astro` - astro CLI commands
- `pnpm lint` - code linting
- `pnpm lint:fix` - auto-fix linting issues

## Human Approval Only Commands:
- `rm` - file deletion
- `git push` - pushing to remote repository
