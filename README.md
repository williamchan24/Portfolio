# williamchanwinghong.com

My personal site, built with **Astro + TypeScript**. It's hosted on Exabyte (cPanel): Astro builds the site into plain HTML files, and a small PHP file handles the contact form.

## First-time setup

1. Install **Node.js 22.12 or newer** (LTS) from nodejs.org.
2. Install **VS Code** plus the **Astro** extension. VS Code will suggest the extension when you open this folder.
3. In this folder, run:
   ```bash
   npm install      # downloads Astro + dependencies (once)
   npm run dev      # starts the site at http://localhost:4321 and live-reloads as you edit
   ```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with live reload. The contact form won't send here because PHP isn't running. |
| `npm run build` | Type-checks everything, then builds the final site into `dist/` |
| `npm run preview` | Builds, then serves `dist/` with PHP at http://localhost:8080 so you can test the contact form. Needs PHP installed. |

## Where things live

```
src/
├── config/site.ts           ✏️ your text: about, interests, toolkit, socials, email
├── content/projects/*.md    ✏️ one file per project (+ screenshots next to them)
├── content.config.ts        the "shape" of a project file, checked at build time
├── components/              each section of the page is its own component
├── layouts/Base.astro       the <html>/<head> wrapper every page uses
├── pages/                   every file here becomes a page (index → /, 404 → /404.html)
└── styles/global.css        all the styling; colours are at the top
public/                      copied as-is into dist/ (favicon, .htaccess, contact.php)
private/                     server-only: contact settings + saved messages (never public)
```

## Adding a project

Create `src/content/projects/my-thing.md`:

```md
---
title: My Thing
tech: [Astro, TypeScript]
image: ./my-thing.png        # optional: put the screenshot in the same folder
live: https://...            # optional
repo: https://github.com/... # optional
order: 1                     # lower shows first
draft: false                 # true hides it
---

A short description. **Markdown** works here.
```

If you get a field wrong (e.g. `live: not-a-url`), `npm run build` tells you exactly which file and field.

## Deploying to Exabyte (cPanel)

1. Run `npm run build`.
2. **First time only:** upload the `private/` folder to your home folder, *next to* `public_html` (not inside it).
   - In `private/`, copy `config.example.php` to `config.php` and set `notify_email`.
   - Set `private/storage` permissions to **750**.
3. Upload **everything inside `dist/`** into `public_html/`, replacing the old files.
   - `.htaccess` is a hidden file. In File Manager, turn on **Settings → Show Hidden Files**.
4. **First time only:**
   - Delete the old site files: `index.php`, `login.php`, `dashboard.php`, `styles.css`, etc.
   - Delete the old `william_db` database in cPanel.
   - Ask your friend to enable SSL, then uncomment the HTTPS redirect in `public/.htaccess` and redeploy.

```
/home/youruser/
├── private/        ← config.php + storage/ (contact messages backup)
└── public_html/    ← contents of dist/
```

After that, every update is: edit → `npm run build` → upload `dist/` again.

## Astro cheat sheet

- **`---` fences** at the top of a `.astro` file hold TypeScript that runs **at build time** on your computer. Below them is HTML with `{expressions}`.
- **Props:** `<ProjectCard project={p} />` passes data in, and the component reads it with `Astro.props`.
- **`<slot />`** is where child content goes (see `layouts/Base.astro`).
- **`<script>`** inside a component runs **in the browser**. Astro bundles it as TypeScript. `<script is:inline>` skips bundling.
- **Loops and ifs** in templates use plain JS: `{items.map((i) => <li>{i}</li>)}` and `{cond && <p>…</p>}`.
- **Want React?** Run `npx astro add react` and you can use `.tsx` components inside `.astro` pages.

Docs: https://docs.astro.build
