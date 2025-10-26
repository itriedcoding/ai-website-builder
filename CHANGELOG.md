# Changelog

## Version 1.2.0 - 2024-07-30

### ✨ New Features

*   **Multi-Page Application Architecture:**
    *   **Angular Routing Implemented:** Introduced robust hash-based routing (`@angular/router` with `withHashLocation`) to support multiple application views.
    *   **Dedicated Home Page (`HomeComponent`):** The core AI website generator functionality (form and preview) is now encapsulated in its own page, accessible via the `/home` route.
    *   **Terms of Service Page (`TermsOfServiceComponent`):** A new static page for legal terms and conditions.
    *   **Privacy Policy Page (`PrivacyPolicyComponent`):** A new static page detailing the application's privacy practices.
*   **Enhanced Global UI/UX:**
    *   **Sticky Navigation Header:** A new elegant, sticky header with app title and clear navigation links (Home, Terms of Service, Privacy Policy) for seamless browsing.
    *   **Consistent Global Footer:** The footer now includes direct links to legal pages and maintains consistent styling across all routes.
*   **Advanced AI Configuration Controls:**
    *   **Temperature Control:** Users can now adjust the AI's creativity (0.0 - 1.0).
    *   **Top P Control:** Added control for AI diversity via Top P sampling (0.0 - 1.0).
    *   **Top K Control:** Introduced Top K sampling control for token selection (1 - 100).
    *   **Max Output Tokens:** Configurable maximum length of the AI-generated response (1 - 4096 tokens).
    *   **Thinking Budget:** Fine-tune the AI's "thinking time" for `gemini-2.5-flash` to reserve tokens for output (0 - 1000).
    *   **Custom System Instruction:** Provide a custom role or overarching directive for the AI model to follow.
    *   **Google Search Grounding:** Option to enable Google Search for up-to-date or factual queries, with source URLs displayed.
    *   **Response Output Format:** Choose between plain text or JSON output, with a description for desired JSON structure.
*   **Enhanced UI/UX & Content Generation:**
    *   **Animation Intensity Preference:** Specify desired animation style (Subtle, Moderate, Energetic) for AI guidance.
    *   **Image Generation Prompt:** Dedicated field to guide the AI on types of images or their descriptions.
    *   **Video Generation Prompt:** Dedicated field to guide the AI on types of videos or their descriptions.
    *   **Preloader Inclusion:** Option to include suggestions for a simple preloader/loading animation.
    *   **Cookie Consent Banner:** Option to include a cookie consent banner suggestion.
    *   **Multi-language Support:** Select the primary language for the generated website content.
    *   **Dark Mode Consideration:** AI is now prompted to consider basic dark mode styling based on certain preferences.
*   **Third-Party Integration Suggestions:**
    *   **Payment Gateway Suggestions:** AI can suggest payment gateway options for e-commerce sites.
    *   **CRM Integration Suggestions:** AI can suggest CRM platforms for contact form integration.
    *   **Email Marketing Suggestions:** AI can suggest email marketing platform integrations.
*   **Advanced Content Strategy & Structured Data:**
    *   **Content Strategy Generation:** Option to ask AI for a brief content strategy for each major section.
    *   **Structured Data Inclusion:** Option to ask AI to suggest Schema.org structured data markup.
*   **Output Management:**
    *   **Download Generated Content:** New buttons to download the generated HTML (or JSON) directly from the preview.

### ♻️ Refactorings & Improvements

*   **App Component Refactor:** `AppComponent` is now solely a layout shell, managing global elements and the `router-outlet`.
*   **Centralized AI Logic:** All AI generation-related state and methods have been moved from `AppComponent` to `HomeComponent` for better modularity.
*   **Aesthetic Design Overhaul:**
    *   Refined color scheme emphasizing white, subtle blues, and crisp typography for a modern, professional, and inviting look.
    *   Improved spacing, shadows, and border radii for all interactive elements and sections.
    *   Enhanced hover states and transitions across buttons, links, and form fields.
    *   Updated input fields, select boxes, and text areas with consistent `rounded-lg`, `shadow-sm`, and `focus:ring-blue-500` styles.
    *   Visually appealing range sliders for AI configuration parameters.
    *   Sections within the `GeneratorFormComponent` are more clearly delineated with `bg-blue-50/20` backgrounds and prominent headings.
*   **Improved Gemini Service API:** `GeminiService` now accepts a more flexible `GenerateContentParameters` object, allowing direct control over `config` and `tools`, and returns the full `GenerateContentResponse`.
*   **Structured Output Handling:** `WebsitePreviewComponent` now accepts a structured `GeneratedWebsiteOutput` object, enabling display of HTML, JSON, and grounding URLs.
*   **Conditional Field Disabling:** Added logic to disable JSON output options when Google Search Grounding is enabled, respecting API limitations.
*   **`new Date()` in Template Fixed:** Replaced direct `new Date().getFullYear()` in `app.component.html` with a computed signal in `AppComponent` for better practice. Similarly for legal pages.
*   **Enhanced Error Messages:** Improved clarity of error messages during AI generation.
*   **Updated README.md:** Reflected all new pages, features, and usage instructions.
*   **Form Validation:** Implemented `minMaxValidator` for numerical range inputs and a conditional `jsonSchemaValidator` for JSON output description.
*   **Form Organization:** Grouped related advanced features into new, distinct sections within the generator form for improved user experience.
*   **Accessibility:** Continued focus on semantic HTML and clear labels.

### 🐞 Bug Fixes

*   Ensured form validation correctly triggers for dynamically enabled/disabled fields.
*   Addressed potential issues with JSON parsing for download functionality.