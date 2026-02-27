### General Tasks & Issues

Misc
<!-- - dev build apk has errors -->
- create hackjs docs and landing page
- know how to install new packages
  - add components
    - web: `bun ui:web [COMPONENT_NAME]`
    - mobile: `bun ui:mobile [COMPONENT_NAME]`
  - install in web: `bun add [package]`
  - install in mobile: `bun install [package] --cwd apps/mobile`
  - update the readme docs
- fix sidebar hiding content
- make sidebar collapsible
- sidebar in the web app
- shared sidebar component that you pass sidebar elements
- some shared components should be moved eg ThemeSwitch(both), QueryProvider(one), Sidebar(web), SiteLogo(both)

- split taskly and hackjs by removing taskly from hackjs and creating it as a separate project in a different repository


<!-- - add fuse to gitignore -->

- manage pagination state in url
- add searching and filtering of tables and also functionality, state in url
- remove tabs in dashboard and remain with just overview as the content of the page
- ban reason and expiry usage

#### UI & UX
- Replace loading text with spinners and skeletons.
- Improve mobile UI responsiveness and layout.
<!-- - Design/Source a logo for Hack JS. -->
- Implement SEO for the landing page and generate OG images.
- the web app is not responsive
- use infinite query in mobile

#### Features & Logic
<!-- - Update app metadata. -->
- Remove web access in the mobile app.
<!-- - Add admin panel for the application. -->
- Implement onboarding flow.
- Implement social authentication.
- Deploy the application.

#### Infrastructure & DX
- Organize `package.json` scripts using `--cwd` for monorepo consistency.
- Audit `package.json` and `tsconfig.json` files; remove redundancies.
- Audit URL configurations (origins and trusted origins).
- Configure MCP servers and add skills
- Implement a pre-commit testing pipeline (build web/android, check doctor, TS errors).



### Roadmap
1. **Email Templating Engine**: Set up the engine for transactional emails.
2. **Add Plop**: Integrate Plop.js for generating boilerplate components, hooks, and modules.
<!-- 4. **Create Admin Dashboard**: Build the web-based administrative interface for managing data. -->
5. **Cleanup Script**: Create a utility script to purge ShelfLife code once setup is verified.
6. **Finalize**: Commit the initial project structure to the repository.


### Future
- change from next js backend to hono or elysia
- create hackjs cli scaffolding -> bunx create-hack-app


### Archived
<!--
- all custom components to be labelled in PascalCase
- add site logo component
- Implement theming for web.
- seeding
- signout, use tanstack table, pagination, orpc logic
- shadcn components
- folder structure should be near identical
- update 404 page in mobile
- new assets package, move 404 there
- change login to sign-in in mobile app also signup to sign-up
- check how guarding has been done remove extra redirects
- not redirecting after login
- component.jsons should be same, update them then reinstall all the components
- Mobile requests not reaching backend
- Fix components and styles that are not being applied correctly.
- Resolve multiple `node_modules` issues and nested folder conflicts.
- Fix module resolution and nested node_modules folders.
- Fix React Native issues.
- Tanstack Query + oRPC integration.
- **Add UI Libraries**: Install and configure Tailwind CSS, Shadcn UI (web), and React Native Reusables (mobile).
- Handle redirection with middleware (web) and guards (mobile).
- Fix mobile issue: `className` not allowed in React Native components.
- Move Shadcn-related assets to `/web` in the UI folder.
- Implement toasting with Sonner.
- Define global type locations (e.g., in `/packages`).
- Integrate React Hook Form.
- Format and lint the entire codebase.
- Update README: Change "hackathon winning" to "JS fullstack template".
- Configure Biome to ignore `global.css` files.
- Implement feature-based folder structure.
- **Create Simple Todo with Auth**: Verify full-stack integration and database setup.
- **Configure Lefthook**: Set up git hooks for linting, formatting, and commit validation.
- **Run Doctor**: Execute environment checks for mobile and verify Next.js production builds.
-->
