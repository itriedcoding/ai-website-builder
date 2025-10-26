# Changelog

## Version 1.1.0 - 2024-07-30

### ✨ New Features

*   **Advanced AI Configuration Controls:**
    *   **Temperature Control:** Users can now adjust the AI's creativity (0.0 - 1.0).
    *   **Top P Control:** Added control for AI diversity via Top P sampling (0.0 - 1.0).
    *   **Top K Control:** Introduced Top K sampling control for token selection (1 - 100).
    *   **Max Output Tokens:** Configurable maximum length of the AI-generated response (1 - 4096 tokens).
    *   **Thinking Budget:** Fine-tune the AI's "thinking time" for `gemini-2.5-flash` to reserve tokens for output (0 - 1000).
    *   **Custom System Instruction:** Provide a custom role or instruction for the AI model to follow.
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

*   **Centralized AI Configuration:** Consolidated AI generation parameters from `AppComponent` into a structured object passed to `GeminiService`.
*   **Improved Gemini Service API:** `GeminiService` now accepts a more flexible `GenerateContentParameters` object, allowing direct control over `config` and `tools`, and returns the full `GenerateContentResponse`.
*   **Structured Output Handling:** `AppComponent` now processes the full `GenerateContentResponse` from `GeminiService` to extract text, grounding URLs, and determine output type.
*   **Dynamic Preview Update:** `WebsitePreviewComponent` now accepts a structured `GeneratedWebsiteOutput` object, enabling display of HTML, JSON, and grounding URLs.
*   **Conditional Field Disabling:** Added logic to disable JSON output options when Google Search Grounding is enabled, respecting API limitations.
*   **`new Date()` in Template Fixed:** Replaced direct `new Date().getFullYear()` in `app.component.html` with a computed signal in `AppComponent` for better practice.
*   **Enhanced Error Messages:** Improved clarity of error messages during AI generation.
*   **Updated README.md:** Reflected all new features and usage instructions.
*   **Form Validation:** Implemented `minMaxValidator` for numerical range inputs and a conditional `jsonSchemaValidator` for JSON output description.
*   **Form Organization:** Grouped related advanced features into new, distinct sections within the generator form for improved user experience.

### 🐞 Bug Fixes

*   Ensured form validation correctly triggers for dynamically enabled/disabled fields.
*   Addressed potential issues with JSON parsing for download functionality.
