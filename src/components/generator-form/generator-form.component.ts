import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal, WritableSignal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';

// Custom validator for numerical ranges
function minMaxValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (value !== null && (value < min || value > max)) {
      return { 'minMax': { 'min': min, 'max': max, 'actual': value } };
    }
    return null;
  };
}

// Custom validator for JSON schema description based on mime type
function jsonFileSchemaValidator(control: AbstractControl): { [key: string]: any } | null {
  const responseOutputMimeTypeControl = control.parent?.get('responseOutputMimeType');
  const responseOutputMimeType = responseOutputMimeTypeControl?.value;
  const fileSchemaDescription = control.value;

  if (responseOutputMimeType === 'application/json' && !responseOutputMimeTypeControl?.disabled && !fileSchemaDescription?.trim()) {
    return { 'jsonFileSchemaRequired': true };
  }
  return null;
}

@Component({
  selector: 'app-generator-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScrollAnimationDirective],
  templateUrl: './generator-form.component.html',
  styleUrls: ['./generator-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratorFormComponent {
  @Output() generate = new EventEmitter<any>();

  generatorForm: FormGroup;

  keyPagesOptions = signal([
    'Home', 'About', 'Services', 'Contact', 'Blog', 'Products', 'FAQ', 'Gallery', 'Testimonials', 'Pricing', 'Dashboard'
  ]);
  websiteTypes = signal(['Marketing Site', 'E-commerce Store', 'Portfolio', 'SaaS Landing Page', 'Admin Dashboard', 'Community Forum', 'News Blog']);
  brandTones = signal(['Professional', 'Playful', 'Innovative', 'Minimalist', 'Luxurious', 'Friendly', 'Authoritative', 'Cutting-edge']);
  fontStyles = signal(['Inter (Modern Sans-serif)', 'Roboto (Clean Sans-serif)', 'Open Sans (Versatile Sans-serif)', 'Lora (Elegant Serif)', 'Space Mono (Developer Monospace)']);
  layoutPreferences = signal(['Minimalist & Clean', 'Bold & Dynamic', 'Classic & Elegant', 'Component-driven']);
  iconStyles = signal(['Lucide Icons (Line)', 'Heroicons (Solid)', 'Radix Icons (Outline)', 'Tabler Icons (Outline)']);
  animationIntensities = signal(['Subtle', 'Moderate', 'Energetic', 'Interactive']);
  languagePreferences = signal(['TypeScript', 'JavaScript']);
  databasePreferences = signal(['PostgreSQL (Prisma)', 'MongoDB (Mongoose)', 'SQLite (Drizzle)']);

  constructor(private fb: FormBuilder) {
    this.generatorForm = this.fb.group({
      websiteIdea: ['A modern Next.js SaaS landing page with authentication and a dashboard.', Validators.required],
      websiteType: ['SaaS Landing Page', Validators.required],
      industry: ['Software as a Service (SaaS)', Validators.required],
      targetAudience: ['Tech startups and small businesses looking for robust solutions', Validators.required],
      primaryColor: ['#8B5CF6', Validators.required], // Tailwind purple-500
      accentColor: ['#2DD4BF', Validators.required], // Tailwind teal-400
      fontStyle: ['Inter (Modern Sans-serif)', Validators.required],
      brandTone: ['Cutting-edge', Validators.required],
      layoutPreference: ['Component-driven', Validators.required],
      iconStyle: ['Lucide Icons (Line)', Validators.required],

      keyPages: [['Home', 'About', 'Features', 'Pricing', 'Contact', 'Dashboard'], Validators.required],
      numberOfSections: [5, [Validators.required, minMaxValidator(3, 10)]],
      generateSampleContent: [true],

      includeSEOKeywords: [true],
      seoKeywords: ['Next.js SaaS, modern web app, component library, full-stack', Validators.maxLength(200)],

      includeCTA: [true],
      ctaText: ['Start Free Trial', Validators.maxLength(50)],
      ctaLink: ['/signup', Validators.maxLength(100)],

      includeTestimonials: [true],
      numberOfTestimonials: [3, [minMaxValidator(1, 5)]],

      includeBlogPosts: [true],
      numberOfBlogPosts: [3, [minMaxValidator(1, 5)]],

      footerContent: ['Copyright 2024. Neura AI. All Rights Reserved. Powered by Gemini. Privacy. Terms.', Validators.maxLength(200)],

      responsiveDesign: [{ value: true, disabled: true }], // Always true, just for UI
      accessibilityAudit: [true],
      performanceTips: [true],
      integrateSocialMedia: [true],
      includeContactForm: [true],
      requireUserAuth: [true],
      includeAnalytics: [true],
      customCssSnippets: ['/* Add your custom Tailwind classes or CSS here */', Validators.maxLength(500)],
      customJsSnippets: ['// Add your custom React hooks or client-side logic here', Validators.maxLength(500)],

      // New AI Configuration fields
      temperature: [0.7, [Validators.required, minMaxValidator(0.0, 1.0)]],
      topP: [0.95, [Validators.required, minMaxValidator(0.0, 1.0)]],
      topK: [64, [Validators.required, minMaxValidator(1, 100)]],
      maxOutputTokens: [2048, [Validators.required, minMaxValidator(1, 4096)]],
      thinkingBudget: [500, [Validators.required, minMaxValidator(0, 1000)]], // Specific to gemini-2.5-flash
      systemInstruction: ['You are an expert Next.js developer and architect.', Validators.maxLength(1000)],
      enableGoogleSearch: [false],
      responseOutputMimeType: ['text/plain'], // 'text/plain' or 'application/json'
      jsonFileSchemaDescription: ['', jsonFileSchemaValidator], // Custom validator for conditional requirement

      // New Advanced UI/UX & Content fields
      animationIntensity: ['Moderate', Validators.required],
      imageGenerationPrompt: ['A futuristic, minimalist server room with glowing blue and purple lights.', Validators.maxLength(500)],
      videoGenerationPrompt: ['A smooth animation of data flowing through a network, abstract and digital.', Validators.maxLength(500)],
      includePreloader: [true],
      includeCookieConsent: [true],
      languagePreference: ['TypeScript', Validators.required],

      // New Third-Party Integrations fields
      enablePaymentGatewaySuggestions: [true],
      enableCrmIntegrationSuggestions: [false],
      enableEmailMarketingSuggestions: [true],
      databasePreference: ['PostgreSQL (Prisma)', Validators.required], // Default for backend

      // New Content Strategy & SEO fields
      generateContentStrategy: [false],
      includeStructuredData: [true],
    });

    // Add logic to disable/enable based on Google Search and JSON output
    this.generatorForm.get('enableGoogleSearch')?.valueChanges.subscribe(value => {
      const responseOutputMimeTypeControl = this.generatorForm.get('responseOutputMimeType');
      const jsonFileSchemaDescriptionControl = this.generatorForm.get('jsonFileSchemaDescription');

      if (value) {
        responseOutputMimeTypeControl?.setValue('text/plain'); // Force to text/plain if Google Search is on
        responseOutputMimeTypeControl?.disable();
        jsonFileSchemaDescriptionControl?.disable();
        jsonFileSchemaDescriptionControl?.setValue(''); // Clear value when disabled
      } else {
        responseOutputMimeTypeControl?.enable();
        // Only enable jsonFileSchemaDescription if responseOutputMimeType is 'application/json'
        if (responseOutputMimeTypeControl?.value === 'application/json') {
          jsonFileSchemaDescriptionControl?.enable();
        }
      }
      jsonFileSchemaDescriptionControl?.updateValueAndValidity(); // Re-validate after enable/disable
    });

    this.generatorForm.get('responseOutputMimeType')?.valueChanges.subscribe(value => {
      const jsonFileSchemaDescriptionControl = this.generatorForm.get('jsonFileSchemaDescription');
      const isGoogleSearchEnabled = this.generatorForm.get('enableGoogleSearch')?.value;

      if (value === 'application/json' && !isGoogleSearchEnabled) {
        jsonFileSchemaDescriptionControl?.enable();
      } else {
        jsonFileSchemaDescriptionControl?.disable();
        jsonFileSchemaDescriptionControl?.setValue(''); // Clear value when disabled
      }
      jsonFileSchemaDescriptionControl?.updateValueAndValidity(); // Re-validate after enable/disable
    });
  }

  // Computed signals for conditional rendering logic
  showSEOKeywords = computed(() => this.generatorForm.get('includeSEOKeywords')?.value);
  showCTADetails = computed(() => this.generatorForm.get('includeCTA')?.value);
  showTestimonialDetails = computed(() => this.generatorForm.get('includeTestimonials')?.value);
  showBlogDetails = computed(() => this.generatorForm.get('includeBlogPosts')?.value);
  showJsonFileSchemaDescription = computed(() => this.generatorForm.get('responseOutputMimeType')?.value === 'application/json' && !this.generatorForm.get('enableGoogleSearch')?.value);


  onCheckboxChange(event: Event, controlName: string, option: string) {
    const control = this.generatorForm.get(controlName) as FormControl;
    const currentValues: string[] = control.value || [];
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      if (!currentValues.includes(option)) {
        control.setValue([...currentValues, option]);
      }
    } else {
      control.setValue(currentValues.filter(val => val !== option));
    }
  }

  onSubmit() {
    // Manually trigger validation for jsonFileSchemaDescription if conditionally required
    this.generatorForm.get('jsonFileSchemaDescription')?.updateValueAndValidity();

    if (this.generatorForm.valid) {
      this.generate.emit(this.generatorForm.getRawValue()); // Use getRawValue to get disabled fields too
    } else {
      this.generatorForm.markAllAsTouched();
      console.error('Form is invalid. Please check all fields.');
    }
  }

  resetForm() {
    this.generatorForm.reset({
      websiteIdea: 'A modern Next.js SaaS landing page with authentication and a dashboard.',
      websiteType: 'SaaS Landing Page',
      industry: 'Software as a Service (SaaS)',
      targetAudience: 'Tech startups and small businesses looking for robust solutions',
      primaryColor: '#8B5CF6', // Tailwind purple-500
      accentColor: '#2DD4BF', // Tailwind teal-400
      fontStyle: 'Inter (Modern Sans-serif)',
      brandTone: 'Cutting-edge',
      layoutPreference: 'Component-driven',
      iconStyle: 'Lucide Icons (Line)',
      keyPages: ['Home', 'About', 'Features', 'Pricing', 'Contact', 'Dashboard'],
      numberOfSections: 5,
      generateSampleContent: true,
      includeSEOKeywords: true,
      seoKeywords: 'Next.js SaaS, modern web app, component library, full-stack',
      includeCTA: true,
      ctaText: 'Start Free Trial',
      ctaLink: '/signup',
      includeTestimonials: true,
      numberOfTestimonials: 3,
      includeBlogPosts: true,
      numberOfBlogPosts: 3,
      footerContent: 'Copyright 2024. Neura AI. All Rights Reserved. Powered by Gemini. Privacy. Terms.',
      responsiveDesign: true,
      accessibilityAudit: true,
      performanceTips: true,
      integrateSocialMedia: true,
      includeContactForm: true,
      requireUserAuth: true,
      includeAnalytics: true,
      customCssSnippets: '/* Add your custom Tailwind classes or CSS here */',
      customJsSnippets: '// Add your custom React hooks or client-side logic here',
      // New fields reset
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 2048,
      thinkingBudget: 500, // Correctly set thinkingBudget on reset
      systemInstruction: 'You are an expert Next.js developer and architect.',
      enableGoogleSearch: false,
      responseOutputMimeType: 'text/plain',
      jsonFileSchemaDescription: '',
      animationIntensity: 'Moderate',
      imageGenerationPrompt: 'A futuristic, minimalist server room with glowing blue and purple lights.',
      videoGenerationPrompt: 'A smooth animation of data flowing through a network, abstract and digital.',
      includePreloader: true,
      includeCookieConsent: true,
      languagePreference: 'TypeScript',
      enablePaymentGatewaySuggestions: true,
      enableCrmIntegrationSuggestions: false,
      enableEmailMarketingSuggestions: true,
      databasePreference: 'PostgreSQL (Prisma)',
      generateContentStrategy: false,
      includeStructuredData: true,
    });
    // Ensure controls are re-enabled after reset, then valueChanges observers will handle disabling as needed
    this.generatorForm.get('responseOutputMimeType')?.enable();
    this.generatorForm.get('jsonFileSchemaDescription')?.enable();
  }
}