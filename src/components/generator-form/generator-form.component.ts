
import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal, WritableSignal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';

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
      numberOfSections: [5, [Validators.required, Validators.min(3), Validators.max(10)]],
      generateSampleContent: [true],

      includeSEOKeywords: [true],
      seoKeywords: ['graphic design portfolio, freelance designer, branding, web design', Validators.maxLength(200)],

      includeCTA: [true],
      ctaText: ['View My Portfolio', Validators.maxLength(50)],
      ctaLink: ['#portfolio', Validators.maxLength(100)],

      includeTestimonials: [true],
      numberOfTestimonials: [3, [Validators.min(1), Validators.max(5)]],

      includeBlogPosts: [false],
      numberOfBlogPosts: [3, [Validators.min(1), Validators.max(5)]],

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
    });
  }

  // Computed signals for conditional rendering logic
  showSEOKeywords = computed(() => this.generatorForm.get('includeSEOKeywords')?.value);
  showCTADetails = computed(() => this.generatorForm.get('includeCTA')?.value);
  showTestimonialDetails = computed(() => this.generatorForm.get('includeTestimonials')?.value);
  showBlogDetails = computed(() => this.generatorForm.get('includeBlogPosts')?.value);

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
    });
  }
}
