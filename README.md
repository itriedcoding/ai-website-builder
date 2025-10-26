# AI Website Generator

## Unleash Your Creativity and Build Stunning Websites with AI

The AI Website Generator is an innovative Angular 20+ application designed to empower users to generate dynamic website structures and content ideas using the power of Google Gemini AI. With a rich set of **over 50 advanced features**, an aesthetic white and blue theme, and engaging animations, this tool transforms your website vision into a tangible blueprint with unparalleled ease.

Define your project's unique requirements through a comprehensive form, and let the AI craft a responsive, modern, and engaging website outline tailored to your specifications.

## ✨ Features

This application leverages cutting-edge AI capabilities to offer a plethora of features, enabling detailed control over the generated website:

### Core Generation & AI Control (New & Enhanced)
1.  **Dynamic Website Type Generation:** Choose from diverse website types like Blog, E-commerce, Portfolio, Landing Page, Corporate, Community, or News Portal.
2.  **Industry/Niche Specific Content:** AI tailors content to your specified industry or niche.
3.  **Target Audience Personalization:** Content and tone are adjusted to resonate with your intended target audience.
4.  **Configurable Homepage Sections:** Define the number of sections for your homepage (from 3 to 10).
5.  **Generate Detailed Sample Content:** Option to populate generated sections with illustrative sample text.
6.  **Custom Key Page Selection:** Select essential pages to be included in your website structure (e.g., Home, About, Services, Contact, Blog, Products, FAQ, Gallery, Testimonials, Pricing).
7.  **Temperature Control (AI Creativity):** Adjust the AI's creativity and randomness in its output (0.0 - 1.0).
8.  **Top P Control (AI Diversity):** Control the diversity of generated text (0.0 - 1.0).
9.  **Top K Control (AI Focus):** Limit the AI to choosing from the top K most likely tokens (1 - 100).
10. **Max Output Tokens:** Specify the maximum length of the AI's response (1 - 4096 tokens).
11. **Thinking Budget:** Fine-tune the AI's "thinking time" for `gemini-2.5-flash` to reserve tokens for output (0 - 1000).
12. **Custom System Instruction:** Provide a custom role or overarching directive for the AI model to follow.
13. **Google Search Grounding:** Enable real-time Google Search capabilities for up-to-date information, with source URLs displayed in the preview.
14. **Response Output Format:** Choose between plain text or JSON output.
15. **JSON Structure Description:** Describe the desired JSON output structure for the AI to follow (conditionally available).

### Design & Styling Controls
16. **Primary Color Selection:** Visually select your website's main brand color using a color picker.
17. **Accent Color Selection:** Choose a complementary accent color for highlights and interactive elements.
18. **Font Style Preference:** Specify desired font styles (Sans-serif (Modern), Serif (Classic), Monospace (Techy)).
19. **Brand Tone Customization:** Set the overall brand tone (Professional, Playful, Innovative, Minimalist, Luxurious, Friendly, Authoritative).
20. **Layout Preference:** Select preferred structural layouts (Modern Grid, Minimalist, Bold & Dynamic, Classic & Elegant).
21. **Icon Style Selection:** Indicate preferred icon aesthetics (Line Icons, Solid Icons, Duotone Icons, Flat Icons).
22. **Tailwind CSS Integration:** The AI is instructed to generate content with modern Tailwind CSS class suggestions.
23. **Sophisticated Hover Animations:** Automatically includes modern hover effects for interactive elements (buttons, links, cards, images).
24. **Smooth Transition Classes:** Ensures fluid UI interactions with automatic transition classes.
25. **Responsive Design (Default):** The AI is instructed to generate inherently responsive structures, ensuring optimal viewing across devices.
26. **Animation Intensity Preference:** Specify desired animation style (Subtle, Moderate, Energetic) for AI guidance.
27. **Dark Mode Consideration:** AI is now prompted to consider basic dark mode styling.

### Content & Marketing Enhancements
28. **SEO Keyword Integration:** Incorporate specific SEO keywords for better search engine visibility.
29. **Customizable Call-to-Action (CTA):** Define the text and link for compelling Call-to-Action elements.
30. **Testimonials Section:** Include a configurable number of customer testimonial examples (1-5).
31. **Blog Post Section:** Generate ideas and summaries for blog posts (1-5).
32. **Custom Footer Content:** Define specific text and links to be included in the website footer.
33. **Image Generation Prompt:** Dedicated field to guide the AI on types of images or their descriptions for inclusion.
34. **Video Generation Prompt:** Dedicated field to guide the AI on types of videos or their descriptions for inclusion.
35. **Generate Content Strategy:** Option to ask AI for a brief content strategy for each major section.
36. **Include Structured Data:** Option to ask AI to suggest Schema.org structured data markup.

### Advanced Development & Integrations
37. **AI Accessibility Audit Suggestions:** The AI provides recommendations for improving website accessibility.
38. **AI Performance Optimization Tips:** The AI offers insights and tips for enhancing site loading speed and performance.
39. **Social Media Integration:** Suggests or includes social media links and integration points.
40. **Contact Form Inclusion:** Generates a basic structure for a contact form.
41. **User Authentication Requirement:** Option to specify if the generated website requires user login/authentication features.
42. **Analytics Integration:** Guidance or placeholders for integrating analytics platforms.
43. **Custom CSS Snippets:** Allows users to inject custom CSS rules directly into the generated site.
44. **Custom JS Snippets:** Allows users to inject custom JavaScript code into the generated site.
45. **Payment Gateway Suggestions:** AI can suggest payment gateway options for e-commerce sites.
46. **CRM Integration Suggestions:** AI can suggest CRM platforms for contact form integration.
47. **Email Marketing Suggestions:** AI can suggest email marketing platform integrations.

### User Experience & Technical Features
48. **Real-time Website Preview:** Displays the generated HTML structure and content within an interactive iframe.
49. **Interactive Scroll Animations:** Utilizes Angular directives for smooth scroll-based content revealing (fade-in, translate-y).
50. **Comprehensive Loading State:** Provides clear visual feedback during the AI generation process.
51. **Robust Error Handling:** Displays user-friendly messages for AI generation failures.
52. **Form Reset Functionality:** Easily clear and revert all form inputs to their default values.
53. **Reactive Form Validation:** Ensures data quality and guides user input with immediate feedback.
54. **Include Preloader:** Option to include suggestions for a simple preloader/loading animation.
55. **Include Cookie Consent:** Option to include a cookie consent banner suggestion.
56. **Multi-language Support:** Select the primary language for the generated website content.
57. **Download Generated Content:** New buttons to download the generated HTML (or JSON) directly from the preview.

## 🚀 Technologies Used

*   **Angular v20+:** The powerful framework for building dynamic web applications.
*   **TypeScript:** Type-safe JavaScript for robust development.
*   **Tailwind CSS:** A utility-first CSS framework for rapid and consistent styling, providing an aesthetic white and blue theme.
*   **Google Gemini API (`@google/genai`):** Powers the AI content generation logic.
*   **Signals:** Angular's modern reactivity model for state management.
*   **Standalone Components:** Modern Angular architecture for improved modularity.

## ⚙️ Setup and Installation

Follow these steps to get the AI Website Generator up and running on your local machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   A Google Cloud Project with the Gemini API enabled.
*   An API Key for the Google Gemini API.

### 1. Clone the Repository

```bash
git clone <repository_url>
cd ai-website-generator
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Google Gemini API Key

The application expects the Gemini API key to be available via `process.env.API_KEY`.
You need to set this environment variable before running the application.

**Local Development (Example with `dotenv` or direct export):**

1.  Create a `.env` file in the root directory of your project.
2.  Add your API key to this file:
    ```
    API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```
    *(Note: For Applets environments, `process.env.API_KEY` is automatically provided. This step is mainly for local testing and development outside the Applets environment if you were to run it as a standard Angular app.)*

Alternatively, you can export it directly in your terminal (for the current session):
```bash
export API_KEY="YOUR_GEMINI_API_KEY_HERE"
```
Or, when running the `npm start` command:
```bash
API_KEY="YOUR_GEMINI_API_KEY_HERE" npm start
```

### 4. Run the Application

```bash
npm start
# or
yarn start
```

This will compile and launch the application. Open your browser and navigate to `http://localhost:4200` (or the port specified in your terminal).

## 💡 Usage

1.  **Configure Your Website:** Use the comprehensive form on the left side to define your website's type, industry, audience, design preferences (colors, fonts, layout, animation intensity), key pages, AI configuration, and advanced features.
2.  **Input Your Vision:** Provide a clear website idea or description.
3.  **Click "Generate Website":** The AI will process your inputs and generate a comprehensive website outline and content suggestions, optionally using Google Search or returning JSON.
4.  **Preview and Refine:** The generated content will appear in the preview pane on the right. You can download the generated HTML or JSON, and review any Google Search sources. Refine your inputs in the form and regenerate to iterate on the design and content.

## 🤝 Contributing

We welcome contributions to the AI Website Generator! Please refer to our [Contribution Guidelines](CONTRIBUTION.md) for more details on how to get involved.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

**Built with 💙 by Your Name/Team**
_Powered by Google Gemini_

See [CHANGELOG.md](CHANGELOG.md) for detailed release notes.