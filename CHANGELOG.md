# Changelog

## Version 2.0.0 - 2024-07-31

### ✨ Major Overhaul & New Features (Neura AI - Next.js Generator)

*   **Application Renamed:** "AI Website Generator" is now **"Neura AI: Next.js Project Generator"**.
*   **Core Purpose Shift:** The application now focuses on generating Next.js project structures, components, API routes, and configurations instead of generic HTML outlines.
*   **UI/UX Redesign (Lovable.dev Inspired):**
    *   **Modern Dark Theme:** Implemented a new aesthetic using Tailwind CSS, featuring dark backgrounds (`bg-gray-900`, `bg-gray-800`), vibrant accent colors (purple and teal), and clean typography.
    *   **Enhanced Component Styling:** All UI components (header, footer, forms, preview, chat) have been restyled to align with the new dark, modern, and developer-centric theme.
    *   Improved readability with contrasting text and background colors.
*   **Advanced AI Next.js Code Generation:**
    *   **Specialized AI Persona:** The AI (`systemInstruction`) is now an "expert Next.js developer and architect," instructed to generate production-ready code.
    *   **Structured JSON Output for Files:** When `responseOutputMimeType` is `application/json`, the AI now generates a structured JSON array of file objects (`{ filePath: string, fileContent: string }`) representing a Next.js project.
    *   **Detailed Markdown Output:** When `responseOutputMimeType` is `text/plain`, the AI provides a comprehensive Markdown description of the Next.js project, including key code snippets and setup instructions.
    *   **Next.js Specific Prompting:** All form features now translate into explicit instructions for generating corresponding Next.js code, including:
        *   **Project Structure:** `pages/`, `components/`, `api/` directories, `tailwind.config.js`, `next.config.js`, `package.json`.
        *   **React Best Practices:** Functional components, hooks, JSX.
        *   **Tailwind CSS Integration:** Generated components directly use Tailwind classes; `tailwind.config.js` is considered.
        *   **Data Fetching:** Suggestions for `getServerSideProps`, `getStaticProps`, `ISR`, `useSWR`.
        *   **API Routes:** Boilerplate for `pages/api` routes.
        *   **Vercel Deployment:** Explicit guidance and considerations for Vercel deployment, including environment variables.
        *   **Backend Integration:** New `databasePreference` option (PostgreSQL, MongoDB, SQLite) to generate relevant schema and basic CRUD API routes with ORM setup (Prisma, Mongoose, Drizzle).
*   **Next.js-Oriented Features:**
    *   **Updated Website/Project Types:** Options like 'SaaS Landing Page', 'Admin Dashboard', 'Community Forum'.
    *   **Next.js Head & SEO:** Integration of SEO keywords via `next/head` or `next-seo`.
    *   **`next/image` Usage:** AI instructed to use `next/image` for image optimization.
    *   **NextAuth.js Boilerplate:** Suggestions for user authentication.
    *   **Vercel Analytics/Google Analytics:** Integration tips.
    *   **Third-Party Backend Integrations:** Enhanced suggestions for Stripe (payment), CRM, and email marketing platforms via API routes.
*   **Preview & Download Enhancements:**
    *   **Code-Focused Preview:** `WebsitePreviewComponent` now displays structured code output (for JSON) with distinct file paths and formatted content or a comprehensive Markdown description.
    *   **Dynamic Download Buttons:** Buttons adapt to download either a `.json` file (for structured project files) or a `.md` file (for text/markdown descriptions).

### ♻️ Refactorings & Improvements

*   **`HomeComponent` Logic:** Substantially rewritten `constructGeminiRequest` to generate Next.js-specific prompts and handle `responseSchema` for JSON file output.
*   **`GeneratorFormComponent`:**
    *   Updated default values, placeholders, and option lists to align with Next.js development.
    *   Added `databasePreference` selection.
    *   Refined `jsonFileSchemaValidator` for structured file output.
*   **`WebsitePreviewComponent`:** Adapted to display code and file structures effectively within its iframe, including new styling for code blocks.
*   **Content Updates:** All static text on `TermsOfServiceComponent`, `PrivacyPolicyComponent`, and `README.md` updated to reflect "Neura AI" and its new purpose.
*   **Tailwind Class Refinement:** Extensive changes to Tailwind classes across all components to establish the new dark, modern, and vibrant theme.

### 🐞 Bug Fixes

*   Ensured consistent `responseMimeType` and `responseSchema` handling within the `GeminiService` and `HomeComponent` when `googleSearch` is enabled or JSON output is requested.
*   Improved JSON parsing and error reporting for AI outputs.
*   Addressed styling inconsistencies introduced by the theme change.