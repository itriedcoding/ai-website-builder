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
function jsonSchemaValidator(control: AbstractControl): { [key: string]: any } | null {
  // Use get('responseOutputMimeType') directly on the parent group
  const responseOutputMimeTypeControl = control.parent?.get('responseOutputMimeType');
  const responseOutputMimeType = responseOutputMimeTypeControl?.value;
  const jsonSchemaDescription = control.value;

  // Check if responseOutputMimeType is 'application/json' AND it's not disabled (i.e., Google Search is not enabled)
  // AND the jsonSchemaDescription is empty or just whitespace
  if (responseOutputMimeType === 'application/json' && !responseOutputMimeTypeControl?.disabled && !jsonSchemaDescription?.trim()) {
    return { 'jsonSchemaRequired': true };
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
    'Home', 'About', 'Services', 'Contact', 'Blog', 'Products', 'FAQ', 'Gallery', 'Testimonials', 'Pricing'
  ]);
  websiteTypes = signal(['Blog', 'E-commerce', 'Portfolio', 'Landing Page', 'Corporate', 'Community', 'News Portal']);
  brandTones = signal(['Professional', 'Playful', 'Innovative', 'Minimalist', 'Luxurious', 'Friendly', 'Authoritative']);
  fontStyles = signal(['Sans-serif (Modern)', 'Serif (Classic)', 'Monospace (Techy)']);
  layoutPreferences = signal(['Modern Grid', 'Minimalist', 'Bold & Dynamic', 'Classic & Elegant']);
  iconStyles = signal(['Line Icons', 'Solid Icons', 'Duotone Icons', 'Flat Icons']);
  animationIntensities = signal(['Subtle', 'Moderate', 'Energetic']);
  languagePreferences = signal(['English', 'Spanish', 'French', 'German']);

  constructor(private fb: FormBuilder) {
    this.generatorForm = this.fb.group({
      websiteIdea: ['A sophisticated online portfolio for a freelance graphic designer.', Validators.required],
      websiteType: ['Portfolio', Validators.required],
      industry: ['Graphic Design', Validators.required],
      targetAudience: ['Potential clients seeking high-quality design work', Validators.required],
      primaryColor: ['#3B82F6', Validators.required], // Tailwind blue-500
      accentColor: ['#60A5FA', Validators.required], // Tailwind blue-400
      fontStyle: ['Sans-serif (Modern)', Validators.required],
      brandTone: ['Professional', Validators.required],
      layoutPreference: ['Modern Grid', Validators.required],
      iconStyle: ['Line Icons', Validators.required],

      keyPages: [['Home', 'About', 'Services', 'Contact', 'Gallery'], Validators.required],
      numberOfSections: [5, [Validators.required, minMaxValidator(3, 10)]],
      generateSampleContent: [true],

      includeSEOKeywords: [true],
      seoKeywords: ['graphic design portfolio, freelance designer, branding, web design', Validators.maxLength(200)],

      includeCTA: [true],
      ctaText: ['View My Portfolio', Validators.maxLength(50)],
      ctaLink: ['#portfolio', Validators.maxLength(100)],

      includeTestimonials: [true],
      numberOfTestimonials: [3, [minMaxValidator(1, 5)]],

      includeBlogPosts: [false],
      numberOfBlogPosts: [3, [minMaxValidator(1, 5)]],

      footerContent: ['Copyright 2024. All Rights Reserved. Privacy Policy. Terms of Service.', Validators.maxLength(200)],

      responsiveDesign: [{ value: true, disabled: true }], // Always true, just for UI
      accessibilityAudit: [true],
      performanceTips: [true],
      integrateSocialMedia: [true],
      includeContactForm: [true],
      requireUserAuth: [false],
      includeAnalytics: [true],
      customCssSnippets: ['', Validators.maxLength(500)],
      customJsSnippets: ['', Validators.maxLength(500)],

      // New AI Configuration fields
      temperature: [0.7, [Validators.required, minMaxValidator(0.0, 1.0)]],
      topP: [0.95, [Validators.required, minMaxValidator(0.0, 1.0)]],
      topK: [64, [Validators.required, minMaxValidator(1, 100)]],
      maxOutputTokens: [2048, [Validators.required, minMaxValidator(1, 4096)]],
      thinkingBudget: [500, [Validators.required, minMaxValidator(0, 1000)]], // Specific to gemini-2.5-flash
      systemInstruction: ['', Validators.maxLength(1000)],
      enableGoogleSearch: [false],
      responseOutputMimeType: ['text/plain'], // 'text/plain' or 'application/json'
      jsonSchemaDescription: ['', jsonSchemaValidator], // Custom validator for conditional requirement

      // New Advanced UI/UX & Content fields
      animationIntensity: ['Moderate', Validators.required],
      imageGenerationPrompt: ['', Validators.maxLength(500)],
      videoGenerationPrompt: ['', Validators.maxLength(500)],
      includePreloader: [true],
      includeCookieConsent: [false],
      languagePreference: ['English', Validators.required],

      // New Third-Party Integrations fields
      enablePaymentGatewaySuggestions: [false],
      enableCrmIntegrationSuggestions: [false],
      enableEmailMarketingSuggestions: [false],

      // New Content Strategy & SEO fields
      generateContentStrategy: [false],
      includeStructuredData: [false],
    });

    // Add logic to disable/enable based on Google Search and JSON output
    this.generatorForm.get('enableGoogleSearch')?.valueChanges.subscribe(value => {
      const responseOutputMimeTypeControl = this.generatorForm.get('responseOutputMimeType');
      const jsonSchemaDescriptionControl = this.generatorForm.get('jsonSchemaDescription');

      if (value) {
        responseOutputMimeTypeControl?.setValue('text/plain'); // Force to text/plain if Google Search is on
        responseOutputMimeTypeControl?.disable();
        jsonSchemaDescriptionControl?.disable();
        jsonSchemaDescriptionControl?.setValue(''); // Clear value when disabled
      } else {
        responseOutputMimeTypeControl?.enable();
        // Only enable jsonSchemaDescription if responseOutputMimeType is 'application/json'
        if (responseOutputMimeTypeControl?.value === 'application/json') {
          jsonSchemaDescriptionControl?.enable();
        }
      }
      jsonSchemaDescriptionControl?.updateValueAndValidity(); // Re-validate after enable/disable
    });

    this.generatorForm.get('responseOutputMimeType')?.valueChanges.subscribe(value => {
      const jsonSchemaDescriptionControl = this.generatorForm.get('jsonSchemaDescription');
      const isGoogleSearchEnabled = this.generatorForm.get('enableGoogleSearch')?.value;

      if (value === 'application/json' && !isGoogleSearchEnabled) {
        jsonSchemaDescriptionControl?.enable();
      } else {
        jsonSchemaDescriptionControl?.disable();
        jsonSchemaDescriptionControl?.setValue(''); // Clear value when disabled
      }
      jsonSchemaDescriptionControl?.updateValueAndValidity(); // Re-validate after enable/disable
    });
  }

  // Computed signals for conditional rendering logic
  showSEOKeywords = computed(() => this.generatorForm.get('includeSEOKeywords')?.value);
  showCTADetails = computed(() => this.generatorForm.get('includeCTA')?.value);
  showTestimonialDetails = computed(() => this.generatorForm.get('includeTestimonials')?.value);
  showBlogDetails = computed(() => this.generatorForm.get('includeBlogPosts')?.value);
  showJsonSchemaDescription = computed(() => this.generatorForm.get('responseOutputMimeType')?.value === 'application/json' && !this.generatorForm.get('enableGoogleSearch')?.value);


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
    // Manually trigger validation for jsonSchemaDescription if conditionally required
    this.generatorForm.get('jsonSchemaDescription')?.updateValueAndValidity();

    if (this.generatorForm.valid) {
      this.generate.emit(this.generatorForm.getRawValue()); // Use getRawValue to get disabled fields too
    } else {
      this.generatorForm.markAllAsTouched();
      console.error('Form is invalid. Please check all fields.');
    }
  }

  resetForm() {
    this.generatorForm.reset({
      websiteIdea: 'A sophisticated online portfolio for a freelance graphic designer.',
      websiteType: 'Portfolio',
      industry: 'Graphic Design',
      targetAudience: 'Potential clients seeking high-quality design work',
      primaryColor: '#3B82F6',
      accentColor: '#60A5FA',
      fontStyle: 'Sans-serif (Modern)',
      brandTone: 'Professional',
      layoutPreference: 'Modern Grid',
      iconStyle: 'Line Icons',
      keyPages: ['Home', 'About', 'Services', 'Contact', 'Gallery'],
      numberOfSections: 5,
      generateSampleContent: true,
      includeSEOKeywords: true,
      seoKeywords: 'graphic design portfolio, freelance designer, branding, web design',
      includeCTA: true,
      ctaText: 'View My Portfolio',
      ctaLink: '#portfolio',
      includeTestimonials: true,
      numberOfTestimonials: 3,
      includeBlogPosts: false,
      numberOfBlogPosts: 3,
      footerContent: 'Copyright 2024. All Rights Reserved. Privacy Policy. Terms of Service.',
      responsiveDesign: true,
      accessibilityAudit: true,
      performanceTips: true,
      integrateSocialMedia: true,
      includeContactForm: true,
      requireUserAuth: false,
      includeAnalytics: true,
      customCssSnippets: '',
      customJsSnippets: '',
      // New fields reset
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 2048,
      thinkingBudget: 500, // Correctly set thinkingBudget on reset
      systemInstruction: '',
      enableGoogleSearch: false,
      responseOutputMimeType: 'text/plain',
      jsonSchemaDescription: '',
      animationIntensity: 'Moderate',
      imageGenerationPrompt: '',
      videoGenerationPrompt: '',
      includePreloader: true,
      includeCookieConsent: false,
      languagePreference: 'English',
      enablePaymentGatewaySuggestions: false,
      enableCrmIntegrationSuggestions: false,
      enableEmailMarketingSuggestions: false,
      generateContentStrategy: false,
      includeStructuredData: false,
    });
    // Ensure controls are re-enabled after reset, then valueChanges observers will handle disabling as needed
    this.generatorForm.get('responseOutputMimeType')?.enable();
    this.generatorForm.get('jsonSchemaDescription')?.enable();
  }
}