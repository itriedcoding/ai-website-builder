import { ChangeDetectionStrategy, Component, input, signal, WritableSignal, effect } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

interface GeneratedFile {
  filePath: string;
  fileContent: string;
}

interface GeneratedWebsiteOutput {
  htmlContent: string; // Used for text/plain output (e.g., markdown description)
  files?: GeneratedFile[]; // Used for application/json output (structured files)
  groundingUrls: { uri: string; title?: string }[];
  isJson: boolean;
  isStreaming?: boolean; // New property to indicate if content is actively streaming
}

@Component({
  selector: 'app-website-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './website-preview.component.html',
  styleUrls: ['./website-preview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsitePreviewComponent {
  generatedOutput = input.required<GeneratedWebsiteOutput | null>();

  sanitizedContentUrl: WritableSignal<SafeResourceUrl | null> = signal(null);

  constructor(private sanitizer: DomSanitizer) {
    effect(() => {
      const output = this.generatedOutput();
      if (!output) {
        this.sanitizedContentUrl.set(null);
        return;
      }

      let contentToEmbed = '';
      if (output.isJson && output.files) {
        // For JSON output (structured files), display them as code blocks
        contentToEmbed = output.files.map(file => `
          <div class="mb-6 p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 scroll-fade-in">
            <h4 class="text-purple-400 font-semibold mb-2 text-sm"><span class="bg-gray-700 text-gray-300 px-2 py-1 rounded-md mr-2">File:</span> ${file.filePath}</h4>
            <pre class="whitespace-pre-wrap break-words font-mono text-xs text-teal-300 bg-gray-900 p-4 rounded-md overflow-auto border border-gray-700 leading-normal">${this.escapeHtml(file.fileContent)}</pre>
          </div>
        `).join('');
      } else if (output.htmlContent) {
        // For text/plain output (markdown description), display as preformatted text
        contentToEmbed = `<pre class="whitespace-pre-wrap font-mono text-sm bg-gray-800 p-4 rounded-md overflow-auto border border-gray-700 text-gray-200 scroll-fade-in">${this.escapeHtml(output.htmlContent)}</pre>`;
      }

      const fullHtml = `
          <!doctype html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Neura AI Output</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; margin: 0; padding: 1rem; background-color: #111827; color: #E5E7EB; } /* gray-900, gray-200 */
              h1, h2, h3, h4, h5, h6 { color: #A78BFA; } /* purple-400 */
              pre { color: #5EEAD4; } /* teal-300 */
              .scroll-fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
              .scroll-fade-in.animated { opacity: 1; transform: translateY(0); }
            </style>
          </head>
          <body>
            ${contentToEmbed}
            <script>
              document.addEventListener('DOMContentLoaded', () => {
                const elements = document.querySelectorAll('.scroll-fade-in');
                const observer = new IntersectionObserver(entries => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      entry.target.classList.add('animated');
                      observer.unobserve(entry.target);
                    }
                  });
                }, { threshold: 0.1 });
                elements.forEach(el => observer.observe(el));
              });
            </script>
          </body>
          </html>
        `;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        this.sanitizedContentUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    });
  }

  // Helper to escape HTML characters for displaying code inside <pre>
  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  downloadContent() {
    const output = this.generatedOutput();
    if (!output) return;

    let filename: string;
    let type: string;
    let content: string;

    if (output.isJson && output.files) {
      filename = 'nextjs_project_files.json';
      type = 'application/json';
      content = JSON.stringify(output.files, null, 2); // Prettify JSON
    } else if (output.htmlContent) {
      filename = 'nextjs_project_description.md'; // Assuming plain text output will be markdown
      type = 'text/markdown';
      content = output.htmlContent;
    } else {
      return; // No content to download
    }

    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}