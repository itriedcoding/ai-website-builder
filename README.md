# Neura AI: Build your next website using AI models. With advanced features, and stuff so you can create your next big business.

Neura AI is an innovative Angular 20+ application designed to empower users to generate dynamic Next.js project structures, components, and content ideas using the power of Google Gemini AI. With a rich set of **over 50 advanced features**, an aesthetic dark and vibrant theme, and engaging animations, this tool transforms your project vision into a tangible Next.js codebase blueprint with unparalleled ease, ready for Vercel deployment.

Define your project's unique requirements through a comprehensive form, and let the AI craft a responsive, modern, and engaging Next.js application outline tailored to your specifications. The application now features a multi-page structure, including a dedicated Home page for the generator, and legal pages for Terms of Service and Privacy Policy, accessible via elegant navigation.

## ✨ Features

This application leverages cutting-edge AI capabilities to offer a plethora of features, enabling detailed control over the generated Next.js project:

### Core Generation & AI Control (New & Enhanced for Next.js)
1.  **Dynamic Next.js Project Type Generation:** Choose from diverse project types like Marketing Site, E-commerce Store, Portfolio, SaaS Landing Page, Admin Dashboard, Community Forum, or News Blog.
2.  **Industry/Niche Specific Code & Content:** AI tailors code structure and content to your specified industry or niche.
3.  **Target Audience Personalization:** Code comments and content examples are adjusted to resonate with your intended target audience.
4.  **Configurable Homepage Sections:** Define the number of sections for your homepage (from 3 to 10), implemented as reusable React components.
5.  **Generate Detailed Sample Content:** Option to populate generated pages and components with illustrative sample text and data.
6.  **Custom Key Page Selection:** Select essential pages to be included in your Next.js `pages/` directory (e.g., Home, About, Services, Contact, Blog, Products, FAQ, Gallery, Testimonials, Pricing, Dashboard).
7.  **Temperature Control (AI Creativity):** Adjust the AI's creativity and randomness in its output (0.0 - 1.0).
8.  **Top P Control (AI Diversity):** Control the diversity of generated text/code (0.0 - 1.0).
9.  **Top K Control (AI Focus):** Limit the AI to choosing from the top K most likely tokens (1 - 100).
10. **Max Output Tokens:** Specify the maximum length of the AI's response (1 - 4096 tokens).
11. **Thinking Budget:** Fine-tune the AI's "thinking time" for `gemini-2.5-flash` to reserve tokens for output (0 - 1000).
12. **Custom System Instruction:** Provide a custom role or overarching directive for the AI model to follow (e.g., "You are an expert Next.js developer").
13. **Google Search Grounding:** Enable real-time Google Search capabilities for up-to-date information, with source URLs displayed for contextual Next.js features or libraries.
14. **Response Output Format:** Choose between a detailed Markdown project description or a structured JSON object representing multiple Next.js project files.
15. **JSON File Structure Description:** Describe the desired JSON output structure for the AI to follow (conditionally available, expecting `filePath` and `fileContent` objects).

### Design & Styling Controls for Next.js
16. **Primary Color Selection:** Visually select your project's main brand color for Tailwind configuration and component styling.
17. **Accent Color Selection:** Choose a complementary accent color for highlights and interactive elements in your Tailwind theme.
18. **Font Style Preference:** Specify desired font styles (e.g., Inter, Roboto, Lora) for Google Fonts integration in `_app.tsx` and Tailwind font classes.
19. **Brand Tone Customization:** Set the overall brand tone (Professional, Playful, Innovative, Minimalist, Luxurious, Friendly, Authoritative, Cutting-edge) to influence component design and content tone.
20. **Layout Preference:** Select preferred structural layouts (Minimalist & Clean, Bold & Dynamic, Classic & Elegant, Component-driven) for page and component architecture.
21. **Icon Style Selection:** Indicate preferred icon aesthetics (e.g., Lucide Icons, Heroicons, Radix Icons) for integration (e.g., React Icons, specific SVG components).
22. **Tailwind CSS Integration:** The AI is instructed to generate Next.js components and pages using modern Tailwind CSS classes.
23. **Sophisticated Hover Animations:** Automatically includes modern hover effects for interactive elements (buttons, links, cards, images) using Tailwind's JIT features.
24. **Smooth Transition Classes:** Ensures fluid UI interactions with automatic Tailwind transition classes.
25. **Responsive Design (Default):** The AI is instructed to generate inherently responsive Next.js structures, ensuring optimal viewing across devices using Tailwind's responsive utilities.
26. **Animation Intensity Preference:** Specify desired animation style (Subtle, Moderate, Energetic, Interactive) for AI guidance, suggesting libraries like Framer Motion or simple CSS.
27. **Dark Theme Integration:** The AI is prompted to generate components optimized for a dark theme by default, aligning with the Neura AI application itself.

### Content & Marketing Enhancements for Next.js
28. **SEO Keyword Integration:** Incorporate specific SEO keywords for better search engine visibility using `next/head` or `next-seo`.
29. **Customizable Call-to-Action (CTA):** Define the text and link for compelling Call-to-Action React components.
30. **Testimonials Section:** Include a configurable number of customer testimonial React components and data examples (1-5).
31. **Blog Post Section:** Generate ideas, summaries, and dynamic pages (`pages/blog/[slug].tsx`) for blog posts (1-5).
32. **Custom Footer Content:** Define specific text and links to be included in a reusable footer component.
33. **Image Generation Prompt:** Dedicated field to guide the AI on types of image placeholders or descriptions for inclusion, utilizing `next/image`.
34. **Video Generation Prompt:** Dedicated field to guide the AI on types of video placeholders or descriptions for inclusion.
35. **Generate Content Strategy:** Option to ask AI for a brief content strategy within code comments for each major section or page.
36. **Include Structured Data:** Option to ask AI to suggest Schema.org structured data markup within pages or a dedicated SEO component.

### Advanced Development & Integrations for Next.js
37. **AI Accessibility Audit Suggestions:** The AI provides recommendations and implements ARIA attributes for improving website accessibility in generated JSX.
38. **AI Performance Optimization Tips:** The AI offers insights and implements strategies for enhancing site loading speed and performance (e.g., `next/image`, data fetching methods).
39. **Social Media Integration:** Generates components for social media links and integration points.
40. **Contact Form Inclusion:** Generates a basic structure for a contact form React component with a corresponding Next.js API route for submission.
41. **User Authentication Requirement:** Option to specify if the generated project requires user login/authentication features, with boilerplate for `NextAuth.js`.
42. **Analytics Integration:** Guidance or placeholders for integrating analytics platforms (e.g., Vercel Analytics, Google Analytics snippet in `_app.tsx`).
43. **Custom CSS Snippets:** Allows users to inject custom CSS rules directly into `styles/globals.css` or component styles.
44. **Custom JS Snippets:** Allows users to inject custom JavaScript/TypeScript code into `_app.tsx` or utility hooks.
45. **Payment Gateway Integration (Stripe):** AI can suggest and provide boilerplate code for Stripe payment gateway integration in an API route.
46. **CRM Integration Suggestions:** AI can suggest CRM integrations (e.g., Salesforce, HubSpot) via API routes and webhook examples.
47. **Email Marketing Suggestions:** AI can suggest email marketing platform integrations (e.g., Mailchimp, SendGrid) via API routes.
48. **Database Preference:** Choose a database (PostgreSQL, MongoDB, SQLite) for the AI to generate relevant schema and basic CRUD API routes, along with an ORM setup (e.g., Prisma, Mongoose, Drizzle).

### User Experience & Technical Features (Neura AI App)
49. **Real-time Next.js Code Preview:** Displays the generated Next.js code structure and content within an interactive iframe, formatted for readability.
50. **Interactive Scroll Animations:** Utilizes Angular directives for smooth scroll-based content revealing (fade-in, translate-y) within the Neura AI app itself.
51. **Comprehensive Loading State:** Provides clear visual feedback during the AI generation process.
52. **Robust Error Handling:** Displays user-friendly messages for AI generation failures.
53. **Form Reset Functionality:** Easily clear and revert all form inputs to their default values.
54. **Reactive Form Validation:** Ensures data quality and guides user input with immediate feedback.
55. **Include Preloader:** Option to include suggestions for a simple preloader/loading animation in the generated Next.js app.
56. **Include Cookie Consent:** Option to include a cookie consent banner suggestion in the generated Next.js app.
57. **Multi-language Support (for Generated Content):** Select the primary language for the generated Next.js content.
58. **Download Generated Content:** New buttons to download the generated Next.js project files (as JSON) or Markdown description directly from the preview.

## 📄 Pages
The application now features the following pages:
*   **Home:** The main Neura AI Next.js Generator interface with the form and preview.
*   **Terms of Service:** A dedicated page outlining the application's terms and conditions.
*   **Privacy Policy:** A dedicated page explaining how user data is handled.

## 🚀 Technologies Used

*   **Angular v20+:** The powerful framework for building the Neura AI web application.
*   **TypeScript:** Type-safe JavaScript for robust development.
*   **Tailwind CSS:** A utility-first CSS framework for rapid and consistent styling, providing an aesthetic dark and vibrant theme for Neura AI.
*   **Google Gemini API (`@google/genai`):** Powers the AI Next.js code generation logic.
*   **Signals:** Angular's modern reactivity model for state management.
*   **Standalone Components:** Modern Angular architecture for improved modularity.
*   **Angular Router:** For seamless multi-page navigation within Neura AI.

## ⚙️ Setup and Installation

Follow these steps to get Neura AI up and running on your local machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   A Google Cloud Project with the Gemini API enabled.
*   An API Key for the Google Gemini API.

### 1. Clone the Repository

```bash
git clone <repository_url>
cd neura-ai-nextjs-generator
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

1.  **Navigate the App:** Use the header navigation to switch between the Home (Neura AI Generator), Terms of Service, and Privacy Policy pages.
2.  **Configure Your Next.js Project (on Home page):** Use the comprehensive form on the left side to define your project's type, industry, audience, design preferences (colors, fonts, layout, animation intensity), key pages, AI configuration, and advanced features.
3.  **Input Your Vision:** Provide a clear project idea or description.
4.  **Click "Generate Next.js Project":** The AI will process your inputs and generate either a comprehensive Markdown description of your project or a structured JSON output representing the project files.
5.  **Preview and Refine:** The generated content will appear in the preview pane on the right. You can download the generated Markdown or JSON, and review any Google Search sources. Refine your inputs in the form and regenerate to iterate on the project structure and code.
6.  **Backend & Vercel:** The AI will provide suggestions for backend integration (e.g., database setup, API routes) and considerations for easy deployment to Vercel.

## 🤝 Contributing

We welcome contributions to Neura AI! Please refer to our [Contribution Guidelines](CONTRIBUTION.md) for more details on how to get involved.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

**Built with 💙 by Your Name/Team**
_Powered by Google Gemini_

See [CHANGELOG.md](CHANGELOG.md) for detailed release notes.
