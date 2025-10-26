import { ChangeDetectionStrategy, Component, input, signal, WritableSignal, computed, SimpleChanges, OnChanges, effect } from '@angular/core';
import { CommonModule, DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-website-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './website-preview.component.html',
  styleUrls: ['./website-preview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsitePreviewComponent {
  content = input.required<string>(); // Input signal for generated content

  sanitizedContentUrl: WritableSignal<SafeResourceUrl | null> = signal(null);

  constructor(private sanitizer: DomSanitizer) {
    effect(() => {
      const currentContent = this.content();
      if (currentContent) {
        // Wrap the generated content in a basic HTML structure with Tailwind CSS CDN
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
            ${currentContent}
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
        // Create a Blob containing the HTML content
        const blob = new Blob([fullHtml], { type: 'text/html' });
        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);
        this.sanitizedContentUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
      } else {
        this.sanitizedContentUrl.set(null);
      }
    });
  }
}