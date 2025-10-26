import { ChangeDetectionStrategy, Component, input, signal, WritableSignal, effect } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

interface GeneratedWebsiteOutput {
  htmlContent: string;
  groundingUrls: { uri: string; title?: string }[];
  isJson: boolean;
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
      if (output && output.htmlContent) {
        let contentToEmbed = output.htmlContent;
        let isJson = output.isJson;

        // If JSON, format it for display in a <pre> tag within the iframe
        if (isJson) {
          try {
            const parsedJson = JSON.parse(contentToEmbed);
            contentToEmbed = `<pre class="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md overflow-auto">${JSON.stringify(parsedJson, null, 2)}</pre>`;
          } catch (e: any) {
            contentToEmbed = `<div class="bg-red-100 text-red-800 p-4 rounded-md">Error parsing JSON: ${e.message || 'Unknown error'}. Raw content: <pre>${contentToEmbed}</pre></div>`;
          }
        }

        const fullHtml = `
          <!doctype html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>AI Generated Site</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { font-family: sans-serif; margin: 0; padding: 1rem; background-color: #f8fafc; color: #334155; }
              section { margin-bottom: 2rem; padding: 1.5rem; border-radius: 0.5rem; background-color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
              h1, h2, h3 { color: #1e3a8a; }

              /* Dark Mode - Basic example for AI consideration */
              @media (prefers-color-scheme: dark) {
                body { background-color: #1a202c; color: #e2e8f0; }
                section { background-color: #2d3748; box-shadow: none; }
                h1, h2, h3 { color: #90cdf4; }
              }

              /* Hover effects for interactive elements */
              .btn, button {
                transition: all 0.3s ease-in-out;
                cursor: pointer;
              }
              .btn:hover, button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Tailwind shadow-lg */
                background-color: #2563eb; /* Tailwind blue-600 */
                color: white;
              }

              a {
                transition: color 0.3s ease-in-out;
              }
              a:hover {
                color: #2563eb; /* Tailwind blue-600 */
                text-decoration: underline;
              }

              .card-hover-effect {
                transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
              }
              .card-hover-effect:hover {
                transform: scale(1.02);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* Tailwind shadow-xl */
              }

              .image-hover-effect {
                transition: transform 0.3s ease-in-out;
                overflow: hidden; /* important for scale to not break layout */
              }
              .image-hover-effect:hover {
                transform: scale(1.05);
              }

              /* Scroll animation classes */
              .scroll-fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
              .scroll-fade-in.animated { opacity: 1; transform: translateY(0); }
            </style>
          </head>
          <body>
            ${contentToEmbed}
            <script>
              // Basic IntersectionObserver for scroll animations inside the iframe
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
      } else {
        this.sanitizedContentUrl.set(null);
      }
    });
  }

  downloadHtml() {
    const output = this.generatedOutput();
    if (output && output.htmlContent) {
      const filename = output.isJson ? 'generated_content.json' : 'generated_website.html';
      const type = output.isJson ? 'application/json' : 'text/html';
      let content = output.htmlContent;
      if (output.isJson) {
        try {
          content = JSON.stringify(JSON.parse(output.htmlContent), null, 2); // Prettify JSON
        } catch (e) {
          console.error("Error pretty-printing JSON for download:", e);
          // Fallback to raw content if parsing fails
        }
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
}