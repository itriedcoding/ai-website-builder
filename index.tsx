
import '@angular/compiler';
import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './src/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideProtractorTestingSupport(), // Recommended for Applets environment
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
