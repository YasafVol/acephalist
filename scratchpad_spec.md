# Scratchpad + Excalidraw Spec

## Summary
Add a "Utils" section to the top nav and a /utils landing page that links to two new utilities:
- Scratchpad: in-browser markdown editor with live preview, autosave, and export.
- Draw: self-hosted Excalidraw app with autosave and exports.

Public by default (unlisted), with an easy way to mark a note private. Notes and drawings are saved locally in the browser and synced to Netlify DB/Blobs (not committed to the repo by default). Share links include slug + token. No multi-user or collab in v1. Match current site styling and keep runtime lightweight. Markdown preview disallows raw HTML and is sanitized.

## Goals
- Create and recall drafts quickly.
- Allow public content to be viewable/downloadable from the site without a rebuild.
- Keep stack mostly static and Astro-compatible.
- Reuse open packages and avoid custom editor/drawing code.
- Provide autosave for scratchpad and drawings.

## Non-goals
- Real-time collaboration.
- Multi-user accounts.
- Heavy backend in v1.
- WYSIWYG editor.

## IA / Routes
- Add "Utils" to the main nav (`src/consts.ts`) and drawer.
- /utils: landing page with cards/links to each utility.
- /utils/scratchpad: editor + preview.
- /utils/draw: Excalidraw app.

## UX Details
Scratchpad
- Two-pane layout: left plain text editor, right rendered markdown preview.
- Toolbar: new, open/import .md, export .md, toggle preview, visibility (public/private), copy share link, save version.
- Autosave draft to local storage (localStorage or IndexedDB) every few seconds and on blur.
- Sync saved notes to Netlify DB when online (remote sync on 3-5s idle + on blur) to keep the latest version fresh.
- Allow bursty remote saves; fall back to throttling if Netlify limits are hit.
- Default visibility: public but unlisted; share link is required to access.
- Preview renderer disables raw HTML and sanitizes output.
- Editor UI is styled to match the site (fonts, colors, borders).
- Explicit "save version" creates a new linked version; autosave updates the latest only.

Draw (Excalidraw)
- Full Excalidraw experience, client-only.
- Autosave "dirty state" to local storage by default.
- Auto-save .excalidraw exports to Netlify Blobs on change.
- Export buttons for PNG and SVG; store latest exports in Blobs.
- Optional embed: allow linking a drawing file from a scratchpad entry.

## Data Model (DB/Object Storage)
Notes (Netlify DB)
- id (uuid)
- slug (string)
- shareToken (string)
- title (string)
- body (markdown text, latest)
- summary (string, optional)
- tags (string[], optional)
- visibility (public|private, default public)
- updatedAt, createdAt (timestamps)
- attachments (optional refs to Netlify Blobs)

Note Versions (Netlify DB)
- id (uuid)
- noteId (uuid)
- body (markdown text)
- createdAt (timestamp)
- previousVersionId (uuid, optional)
- Created only on explicit save.

Drawings (Netlify DB + Blobs)
- id (uuid)
- slug (string)
- shareToken (string)
- title (string, optional)
- dataRef (Netlify Blobs key, latest)
- visibility (public|private)
- updatedAt, createdAt (timestamps)

Drawing Versions (Netlify DB)
- id (uuid)
- drawingId (uuid)
- dataRef (Netlify Blobs key)
- createdAt (timestamp)
- previousVersionId (uuid, optional)
- Created only on explicit save.

Public access
- Public notes/drawings are served from the backend or storage without a site rebuild.
- Public access is via unlisted share links only.
- Share pages include `noindex,nofollow`.

## Storage and Persistence (Chosen: Netlify DB + Blobs)
- Netlify Functions for CRUD.
- Netlify DB for notes metadata and markdown bodies (with version history).
- Netlify Blobs for drawings and large artifacts (exports and versioned JSON).
- Pros: stays on Netlify, sync across devices, supports public links without rebuilds.
- Cons: more code, needs auth for write access, network latency.
- Future scale: if DB row limits are hit, move large bodies to Blobs and store a pointer in DB.

## Package Decisions (open source, minimal code)
Editor + Preview (two-pane)
- @uiw/react-md-editor (React island, split editor/preview).

Markdown Rendering
- react-markdown + remark-gfm + rehype-sanitize; no rehype-raw.

Excalidraw
- @excalidraw/excalidraw embedded as a React island under /utils/draw.

## Auth (Chosen: Netlify Identity)
- Netlify Identity protects write endpoints.
- Read access for public items is unlisted via share links.

## Performance Notes
- Load editor and draw only on their routes (client-only islands).
- Keep API calls scoped to these routes; cache public reads where possible.

## Prerequisites / Setup
### Netlify DB
- In the Netlify dashboard, open your site and enable Netlify DB.
- Install DB client dependency: `@netlify/neon`.
- Option A: run `npx netlify db init` to provision a DB with the latest CLI.
- Option B: install `@netlify/neon` and run `netlify dev` or `netlify build` once to auto-provision.
- Claim the database in the Netlify UI so it does not expire after 7 days.
- Create tables: `notes`, `note_versions`, `drawings`, `drawing_versions`.
- Use the Data Model above to define columns; prefer `uuid` primary keys, `text` for markdown bodies, and `timestamp` for created/updated fields.
- Add indexes for `slug` and `shareToken` if the DB UI supports indexes.
- Create a migration SQL file and apply it using the DB URL from `netlify env:get NETLIFY_DATABASE_URL`.

### Netlify Blobs
- Enable Netlify Blobs for the site.
- Install Blobs client dependency: `@netlify/blobs`.
- Create namespaces (buckets) for `excalidraw-json`, `excalidraw-png`, and `excalidraw-svg`.
- Record the namespace names and use them consistently in code and Functions.
- Use `getStore` for global stores (production) and `getDeployStore` for deploy-scoped stores (non-production).
- Default consistency is eventual and last-write-wins; use strong consistency only if required.

### Netlify Identity
- Enable Netlify Identity for the site.
- Set registration to invite-only.
- Invite your owner email and complete the confirmation email.
- Verify you can sign in and receive a JWT token.

### Local Dev
- Install the Netlify CLI: `npm i -g netlify-cli`.
- Run `netlify login` and `netlify link` to connect the repo to the site.
- Install `@netlify/vite-plugin` and add it to the Astro Vite config so platform primitives work with `npm run dev`.
- If the Vite plugin is not installed, use `netlify dev` to run local Functions/DB/Blobs/Identity.
- Add `.netlify/` to `.gitignore` (Netlify uses it for internal state only).

### Environment Variables
- Add any Netlify DB/Blobs environment variables provided by Netlify to both local `.env` and the Netlify site settings.
- Confirm Functions can read these variables locally and after deploy.
- In Functions, only read env vars via `Netlify.env.*`.

## Human-in-the-loop Verification
- [ ] Sign in with Netlify Identity; confirm write endpoints reject unauthenticated requests.
- [ ] Create a note, edit for ~10 seconds, refresh, and confirm local autosave persists.
- [ ] Confirm remote sync by loading the note in another logged-in session.
- [ ] Click "Save version" and verify a new version is added; autosave does not create versions.
- [ ] Copy a share link and open in a private window; verify content loads and includes `noindex,nofollow`.
- [ ] Toggle a note to private; verify the share link no longer loads for anonymous users.
- [ ] Create a drawing, refresh, and confirm local autosave restores the scene.
- [ ] Verify Excalidraw JSON/PNG/SVG exports are stored in Blobs and the share link serves the latest.
- [ ] Confirm share links use the slug + token format.

## Implementation Tracker
Shared Site
- [ ] Add "Utils" to the main nav by appending `{ TEXT: "Utils", HREF: "/utils" }` to `LINKS` in `src/consts.ts`; verify the drawer uses `LINKS` or update `src/components/Drawer.astro` to include the new link.
- [ ] Create `src/pages/utils/index.astro` using `PageLayout` + `Container`; render two cards linking to `/utils/scratchpad` and `/utils/draw` using existing card styles (same border/hover classes as blog/project cards).
- [ ] Create `src/pages/utils/scratchpad.astro` with a mount element for the React editor island and a page heading.
- [ ] Create `src/pages/utils/draw.astro` with a mount element for the React Excalidraw island and a page heading.
- [ ] Create `src/pages/u/[slug]-[token].astro` that fetches a note by share token and renders sanitized markdown; include `<meta name="robots" content="noindex,nofollow">`.
- [ ] Create `src/pages/d/[slug]-[token].astro` that fetches a drawing by share token and renders Excalidraw in view-only mode; include `<meta name="robots" content="noindex,nofollow">`.

React Integration
- [ ] Add dependencies: `@astrojs/react`, `react`, `react-dom` in `package.json`.
- [ ] Update `astro.config.mjs` to include the `react()` integration.
- [ ] Render scratchpad and draw components with `client:only="react"`.

Netlify Backend
- [ ] Add server dependencies: `@netlify/functions`, `@netlify/neon`, `@netlify/blobs`.
- [ ] Create all Functions in `netlify/functions/*.mts` using the latest Netlify function format (default export `(req, context)` + exported `config` with `path`).
- [ ] Do not add CORS headers unless explicitly requested.
- [ ] Create Netlify DB table `notes` using the Data Model (id uuid pk, slug text unique, shareToken text unique, title text, body text, summary text nullable, tags text/json, visibility text, createdAt timestamp, updatedAt timestamp).
- [ ] Create Netlify DB table `note_versions` (id uuid pk, noteId uuid fk, body text, createdAt timestamp, previousVersionId uuid nullable).
- [ ] Create Netlify DB table `drawings` (id uuid pk, slug text unique, shareToken text unique, title text nullable, dataRef text, visibility text, createdAt timestamp, updatedAt timestamp).
- [ ] Create Netlify DB table `drawing_versions` (id uuid pk, drawingId uuid fk, dataRef text, createdAt timestamp, previousVersionId uuid nullable).
- [ ] Create Netlify Blobs namespaces `excalidraw-json`, `excalidraw-png`, `excalidraw-svg` and standardize keys like `drawings/{drawingId}/{versionId|latest}.{ext}`.
- [ ] Implement `POST /api/notes-upsert` (auth required) to create/update the latest note and return `{id, slug, shareToken, updatedAt}`.
- [ ] Implement `POST /api/notes-version` (auth required) to insert a `note_versions` row for explicit saves.
- [ ] Implement `GET /api/notes-share?token=...` (public) to fetch a note by `shareToken` for share pages.
- [ ] Implement `GET /api/notes-list` (auth required) to list owner notes (id, title, updatedAt, visibility).
- [ ] Implement `POST /api/drawings-upsert` (auth required) to create/update drawing metadata and latest `dataRef`.
- [ ] Implement `POST /api/drawings-version` (auth required) to insert a `drawing_versions` row for explicit saves.
- [ ] Implement `GET /api/drawings-share?token=...` (public) to fetch a drawing by `shareToken`.
- [ ] Implement `POST /api/blobs-upload` (auth required) to write JSON/PNG/SVG to the correct namespace and return the blob key.
- [ ] Implement `GET /api/blobs-get?ns=...&key=...` (public) to read blobs for share pages.

Auth
- [ ] Add Netlify Identity login UI on `/utils` pages (sign in/out + show user email).
- [ ] Attach the Identity JWT to all write requests as `Authorization: Bearer <token>`.
- [ ] Reject write requests when the token is missing or invalid (`context.clientContext.user` is absent).

Scratchpad
- [ ] Build a React component (e.g., `src/components/utils/Scratchpad.tsx`) that renders `@uiw/react-md-editor`.
- [ ] Wire preview to `react-markdown` + `remark-gfm` + `rehype-sanitize` and disable raw HTML.
- [ ] Implement note state `{id, slug, shareToken, title, body, summary, tags, visibility}` with public default.
- [ ] Implement "New note" to clear state and create a local temp id.
- [ ] Implement "Import .md" using a file input; load body and set title from filename if empty.
- [ ] Implement "Export .md" download with YAML frontmatter (title/summary/tags/visibility) + body.
- [ ] Implement "Toggle preview" to hide/show the preview pane.
- [ ] Implement "Visibility" toggle to switch public/private.
- [ ] Implement "Copy share link" using the returned slug + token.
- [ ] Implement "Save version" to call `notes-version` (explicit save only).
- [ ] Implement local autosave to localStorage/IndexedDB and restore on page load.
- [ ] Implement remote autosave on 3-5s idle and on blur to `notes-upsert` (update latest only).
- [ ] Implement the read-only share view using the same renderer and styling.

Draw
- [ ] Build a React component (e.g., `src/components/utils/Draw.tsx`) that renders `@excalidraw/excalidraw`.
- [ ] Enable embedded images and ensure they persist in the scene.
- [ ] Implement local autosave of the scene to localStorage/IndexedDB and restore on load.
- [ ] Implement remote autosave: serialize the scene to JSON, upload to Blobs, then call `drawings-upsert` with `dataRef`.
- [ ] Implement "Save version" to upload JSON to Blobs and create a `drawing_versions` row.
- [ ] Implement PNG export: generate PNG blob, upload to `excalidraw-png`, store latest key.
- [ ] Implement SVG export: generate SVG blob, upload to `excalidraw-svg`, store latest key.
- [ ] Implement share view with Excalidraw `viewModeEnabled` using the stored JSON.

Styling
- [ ] Override editor UI styles to match site fonts/colors/borders (add CSS in `src/styles/global.css` or a dedicated imported file).
- [ ] Apply site typography classes to share views for consistent rendering.

## Acceptance Criteria
- "Utils" appears in top nav and links to /utils.
- /utils lists Scratchpad and Draw using existing card styles.
- Scratchpad supports two-pane editing, autosave, and .md export/import.
- Scratchpad preview disallows raw HTML and sanitizes output.
- Editor UI matches the site styling.
- Excalidraw runs as full app, autosaves locally, and exports drawings.
- Public content is accessible via unlisted share links without a rebuild.
- Share links use slug + token format.
- Share pages are noindex/nofollow.
- Explicit save creates a new linked version; delete is hard delete.

## Decisions (Chosen)
- Auth: Netlify Identity.
- Public access: unlisted share links only (no public index).
- Share links: slug + token format.
- Visibility default: public (unlisted).
- Deletes: hard delete only; versions only on explicit save.
- Autosave: remote sync on 3-5s idle + on blur; local autosave always on; latest stays fresh; allow bursts, throttle on limits.
- /utils layout: reuse existing card styles.
- Excalidraw: embedded images enabled; .excalidraw auto-saved to Blobs; latest PNG/SVG stored.
