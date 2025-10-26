# Contribution Guidelines

We welcome and appreciate contributions to the AI Website Generator! By contributing, you help us improve this tool for everyone. Please take a moment to review this document to understand how to contribute effectively.

## 🌟 How to Contribute

There are many ways to contribute, including:

*   Reporting bugs
*   Suggesting new features or enhancements
*   Improving documentation
*   Writing code (bug fixes, new features)

## 🐛 Reporting Bugs

If you find a bug, please open an issue on the GitHub repository with the following information:

1.  **Clear Title:** A concise and descriptive title.
2.  **Steps to Reproduce:** Detailed steps to reliably reproduce the bug.
3.  **Expected Behavior:** What you expected to happen.
4.  **Actual Behavior:** What actually happened.
5.  **Screenshots/Videos (Optional):** Visual aids can be very helpful.
6.  **Environment:** Your operating system, browser, Angular version, etc.

## ✨ Suggesting Features

We love new ideas! If you have a feature request or suggestion:

1.  **Check Existing Issues:** See if your idea has already been proposed.
2.  **Open a New Issue:** Describe your feature request in detail.
3.  **Explain the Problem:** What problem does this feature solve?
4.  **Describe the Solution:** How do you envision this feature working?
5.  **Use Cases:** Provide examples of how this feature would be used.

## 💻 Local Development Setup

To set up your local development environment:

1.  **Fork the Repository:** Click the "Fork" button on the top right of the GitHub repository page.
2.  **Clone Your Fork:**
    ```bash
    git clone https://github.com/YOUR_GITHUB_USERNAME/ai-website-generator.git
    cd ai-website-generator
    ```
3.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
4.  **Set up API Key:** The application uses `process.env.API_KEY` for the Google Gemini API key. For local development, create a `.env` file in the root directory and add `API_KEY="YOUR_GEMINI_API_KEY_HERE"`.
5.  **Run the Application:**
    ```bash
    npm start
    # or
    yarn start
    ```
    The app will typically be available at `http://localhost:4200`.

## 🌳 Branching Strategy

We use a simple `main` branch for stable releases and feature branches for development.

*   **`main` branch:** Represents the latest stable and released version. All pull requests should be merged into `main`.
*   **Feature branches:** For developing new features or bug fixes. These should branch off `main`. Use a descriptive name like `feat/new-feature` or `bugfix/issue-description`.

## 📝 Commit Message Guidelines

Please follow conventional commits for your commit messages. This helps with automatic changelog generation and makes the history easier to understand.

**Format:** `<type>(<scope>): <subject>`

*   **`type`**: `feat` (new feature), `fix` (bug fix), `docs` (documentation), `style` (formatting, missing semicolons, etc.), `refactor` (refactoring code), `test` (adding missing tests, refactoring tests), `chore` (maintenance, build tools, etc.)
*   **`scope` (optional):** The part of the codebase affected (e.g., `generator-form`, `gemini-service`, `readme`).
*   **`subject`**: A brief, imperative description of the change.

**Examples:**

*   `feat(form): add font style selection`
*   `fix(preview): correct iframe loading issue`
*   `docs: update contribution guidelines`
*   `chore(deps): upgrade angular dependencies`

## 🔃 Pull Request Process

1.  **Create a New Branch:** Branch off `main` for your changes.
2.  **Implement Your Changes:** Write clean, well-commented code following existing code styles.
3.  **Test Your Changes:** Ensure your changes don't introduce new bugs and existing features still work.
4.  **Commit Your Changes:** Use clear and concise commit messages as described above.
5.  **Push Your Branch:**
    ```bash
    git push origin your-feature-branch
    ```
6.  **Open a Pull Request (PR):**
    *   Target the `main` branch.
    *   Provide a clear description of your changes, including:
        *   What problem it solves.
        *   How it was implemented.
        *   Any relevant screenshots or GIFs.
    *   Reference any related issues (e.g., `Closes #123`).
7.  **Address Feedback:** Be prepared to discuss your changes and make revisions based on feedback from maintainers.

## ✍️ Code Style

*   Follow Angular best practices (standalone components, signals, `OnPush` change detection).
*   Use TypeScript for strict typing.
*   Adhere to existing file structures and naming conventions.
*   Ensure all new features are styled with Tailwind CSS, maintaining the white and blue theme.
*   Ensure generated HTML from AI models adheres to accessibility guidelines and modern web standards.

## 🚨 Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project, you agree to abide by its terms.

Thank you for contributing to the AI Website Generator!