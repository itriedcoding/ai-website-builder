import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { GeneratorFormComponent } from './components/generator-form/generator-form.component';
import { WebsitePreviewComponent } from './components/website-preview/website-preview.component';
import { GeminiService } from './services/gemini.service';
import { CommonModule } from '@angular/common';
import { ScrollAnimationDirective } from './directives/scroll-animation.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GeneratorFormComponent, WebsitePreviewComponent, ScrollAnimationDirective],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'AI Website Generator';
  generatedContent: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(false);
  errorMessage: WritableSignal<string | null> = signal(null);

  constructor(private geminiService: GeminiService) {}

  async generateWebsite(formData: any) {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.generatedContent.set(''); // Clear previous content

    const prompt = this.constructPrompt(formData);

    try {
      const responseText = await this.geminiService.generateText(prompt);
      this.generatedContent.set(responseText);
    } catch (error: any) {
      console.error('Generation failed:', error);
      this.errorMessage.set(`Failed to generate website: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      this.isLoading.set(false);
    }
  }

  private constructPrompt(formData: any): string {
    let prompt = `Generate a website outline and content for a ${formData.websiteType} website.
    The website is for the industry "${formData.industry}" and targets "${formData.targetAudience}".
    The brand tone should be "${formData.brandTone}".
    Key pages to include are: ${formData.keyPages.join(', ')}.
    Design preferences: primary color ${formData.primaryColor}, accent color ${formData.accentColor}, font style ${formData.fontStyle}, layout ${formData.layoutPreference}, icon style ${formData.iconStyle}.
    The homepage should have around ${formData.numberOfSections} sections.`;

    if (formData.generateSampleContent) {
      prompt += ` Generate detailed sample content for these sections.`;
    }

    if (formData.includeSEOKeywords && formData.seoKeywords) {
      prompt += ` Incorporate these SEO keywords: ${formData.seoKeywords}.`;
    }

    if (formData.includeCTA) {
      prompt += ` Include a strong Call-to-Action with text "${formData.ctaText}" linking to "${formData.ctaLink}".`;
    }

    if (formData.includeTestimonials) {
      prompt += ` Add a testimonials section with ${formData.numberOfTestimonials} examples.`;
    }

    if (formData.includeBlogPosts) {
      prompt += ` Include a blog section with ${formData.numberOfBlogPosts} post ideas/summaries.`;
    }

    if (formData.footerContent) {
      prompt += ` The footer should include: ${formData.footerContent}.`;
    }

    prompt += `
    Additional features to consider:
    - Responsive Design: ${formData.responsiveDesign ? 'Yes' : 'No'}
    - Accessibility Audit: ${formData.accessibilityAudit ? 'Provide suggestions' : 'No'}
    - Performance Optimization: ${formData.performanceTips ? 'Provide tips' : 'No'}
    - Social Media Integration: ${formData.integrateSocialMedia ? 'Yes' : 'No'}
    - Contact Form: ${formData.includeContactForm ? 'Yes' : 'No'}
    - User Authentication: ${formData.requireUserAuth ? 'Yes' : 'No'}
    - Analytics Integration: ${formData.includeAnalytics ? 'Yes' : 'No'}
    `;

    if (formData.customCssSnippets) {
      prompt += ` Also, assume the generated website might include custom CSS like: ${formData.customCssSnippets}.`;
    }
    if (formData.customJsSnippets) {
      prompt += ` And custom JS like: ${formData.customJsSnippets}.`;
    }

    prompt += `
    Provide a concise HTML-like structure outline for the main homepage elements and example content for its sections, using modern web design principles and Tailwind CSS class suggestions.
    Crucially, include sophisticated hover animations for interactive elements (buttons, links, cards, images) using Tailwind CSS classes like hover:scale-105, hover:shadow-xl, hover:bg-blue-600, hover:text-white, hover:translate-y-[-4px], and smooth transition classes (e.g., transition duration-300 ease-in-out).
    Also, incorporate scroll animations for major sections or components using classes similar to 'scroll-fade-in'.
    `;

    return prompt;
  }
}