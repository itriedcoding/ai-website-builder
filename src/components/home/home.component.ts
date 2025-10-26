import { ChangeDetectionStrategy, Component, signal, WritableSignal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneratorFormComponent } from '../generator-form/generator-form.component';
import { WebsitePreviewComponent } from '../website-preview/website-preview.component';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';
import { GenerateContentResponse, GenerateContentParameters, Part, Tool } from '@google/genai';
import { GeminiService } from '../../services/gemini.service';

interface GeneratedWebsiteOutput {
  htmlContent: string;
  groundingUrls: { uri: string; title?: string }[];
  isJson: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GeneratorFormComponent, WebsitePreviewComponent, ScrollAnimationDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  generatedOutput: WritableSignal<GeneratedWebsiteOutput | null> = signal(null);
  isLoading: WritableSignal<boolean> = signal(false);
  errorMessage: WritableSignal<string | null> = signal(null);

  private geminiService = inject(GeminiService);

  async generateWebsite(formData: any) {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.generatedOutput.set(null); // Clear previous content

    const { contents, config, tools } = this.constructGeminiRequest(formData);

    try {
      const response: GenerateContentResponse = await this.geminiService.generateContent({
        model: this.geminiService.MODEL_NAME,
        contents: contents,
        config: config,
        tools: tools,
      });

      const htmlContent = response.text;
      const groundingUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title,
      })) || [];
      const isJson = formData.responseOutputMimeType === 'application/json';

      this.generatedOutput.set({ htmlContent, groundingUrls, isJson });

    } catch (error: any) {
      console.error('Generation failed:', error);
      this.errorMessage.set(`Failed to generate website: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      this.isLoading.set(false);
    }
  }

  private constructGeminiRequest(formData: any): { contents: GenerateContentParameters['contents']; config?: GenerateContentParameters['config']; tools?: GenerateContentParameters['tools'] } {
    let textPrompt = `Generate a website outline and content for a ${formData.websiteType} website.
    The website idea is: "${formData.websiteIdea}".
    The website is for the industry "${formData.industry}" and targets "${formData.targetAudience}".
    The brand tone should be "${formData.brandTone}" with an ${formData.animationIntensity.toLowerCase()} animation style.
    Key pages to include are: ${formData.keyPages.join(', ')}.
    Design preferences: primary color ${formData.primaryColor}, accent color ${formData.accentColor}, font style ${formData.fontStyle}, layout ${formData.layoutPreference}, icon style ${formData.iconStyle}.
    The homepage should have around ${formData.numberOfSections} sections.`;

    if (formData.generateSampleContent) {
      textPrompt += ` Generate detailed sample content for these sections.`;
    }
    if (formData.generateContentStrategy) {
      textPrompt += ` Also, provide a brief content strategy for each major section.`;
    }
    if (formData.includeStructuredData) {
      textPrompt += ` Suggest relevant Schema.org structured data markup examples.`;
    }

    if (formData.includeSEOKeywords && formData.seoKeywords) {
      textPrompt += ` Incorporate these SEO keywords: ${formData.seoKeywords}.`;
    }

    if (formData.includeCTA) {
      textPrompt += ` Include a strong Call-to-Action with text "${formData.ctaText}" linking to "${formData.ctaLink}".`;
    }

    if (formData.includeTestimonials) {
      textPrompt += ` Add a testimonials section with ${formData.numberOfTestimonials} examples.`;
    }

    if (formData.includeBlogPosts) {
      textPrompt += ` Include a blog section with ${formData.numberOfBlogPosts} post ideas/summaries.`;
    }

    if (formData.footerContent) {
      textPrompt += ` The footer should include: ${formData.footerContent}.`;
    }

    if (formData.imageGenerationPrompt) {
      textPrompt += ` For images, consider: ${formData.imageGenerationPrompt}.`;
    }
    if (formData.videoGenerationPrompt) {
      textPrompt += ` For videos, consider: ${formData.videoGenerationPrompt}.`;
    }
    if (formData.includePreloader) {
      textPrompt += ` Include a simple preloader/loading animation suggestion.`;
    }
    if (formData.includeCookieConsent) {
      textPrompt += ` Add a cookie consent banner suggestion.`;
    }

    textPrompt += `
    Additional features to consider:
    - Responsive Design: ${formData.responsiveDesign ? 'Yes' : 'No'}
    - Accessibility Audit: ${formData.accessibilityAudit ? 'Provide suggestions' : 'No'}
    - Performance Optimization: ${formData.performanceTips ? 'Provide tips' : 'No'}
    - Social Media Integration: ${formData.integrateSocialMedia ? 'Yes' : 'No'}
    - Contact Form: ${formData.includeContactForm ? 'Yes' : 'No'}
    - User Authentication: ${formData.requireUserAuth ? 'Yes' : 'No'}
    - Analytics Integration: ${formData.includeAnalytics ? 'Yes' : 'No'}
    `;

    if (formData.enablePaymentGatewaySuggestions) {
      textPrompt += ` Suggest payment gateway integration for e-commerce sites.`;
    }
    if (formData.enableCrmIntegrationSuggestions) {
      textPrompt += ` Suggest CRM integrations for the contact form.`;
    }
    if (formData.enableEmailMarketingSuggestions) {
      textPrompt += ` Suggest email marketing platform integrations.`;
    }

    if (formData.customCssSnippets) {
      textPrompt += ` Also, assume the generated website might include custom CSS like: ${formData.customCssSnippets}.`;
    }
    if (formData.customJsSnippets) {
      textPrompt += ` And custom JS like: ${formData.customJsSnippets}.`;
    }

    textPrompt += `
    The generated content should be primarily in ${formData.languagePreference}.
    Provide a concise HTML-like structure outline for the main homepage elements and example content for its sections, using modern web design principles and Tailwind CSS class suggestions.
    Crucially, include sophisticated hover animations for interactive elements (buttons, links, cards, images) using Tailwind CSS classes like hover:scale-105, hover:shadow-xl, hover:bg-blue-600, hover:text-white, hover:translate-y-[-4px], and smooth transition classes (e.g., transition duration-300 ease-in-out).
    Also, incorporate scroll animations for major sections or components using classes similar to 'scroll-fade-in'.
    Include dark mode considerations if the animation intensity is 'Energetic'.
    `;

    const config: GenerateContentParameters['config'] = {
      temperature: formData.temperature,
      topP: formData.topP,
      topK: formData.topK,
      maxOutputTokens: formData.maxOutputTokens,
      thinkingConfig: { thinkingBudget: formData.thinkingBudget },
      systemInstruction: formData.systemInstruction || undefined,
      responseMimeType: formData.responseOutputMimeType,
    };

    const tools: GenerateContentParameters['tools'] = [];
    if (formData.enableGoogleSearch) {
      tools.push({ googleSearch: {} } as Tool); // Cast to Tool type
      // If google search is enabled, responseMimeType and responseSchema are not allowed.
      config.responseMimeType = 'text/plain'; // Override if JSON was selected
      config.responseSchema = undefined; // Ensure no schema is sent
    } else if (formData.responseOutputMimeType === 'application/json' && formData.jsonSchemaDescription) {
      // If JSON output is requested without Google Search, instruct AI in prompt
      textPrompt += ` The output must be valid JSON matching this described structure: ${formData.jsonSchemaDescription}.`;
      // We are not attempting to parse free-text into `responseSchema` directly due to complexity and strict API types.
      // Instead, we rely on `responseMimeType: "application/json"` and strong prompt guidance.
    }

    return { contents: textPrompt, config, tools };
  }
}
