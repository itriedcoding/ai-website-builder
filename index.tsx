import '@angular/compiler';
import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './src/app.component';
import { appRoutes } from './src/app-routing.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideProtractorTestingSupport(), // Recommended for Applets environment
    provideRouter(appRoutes, withHashLocation()), // Configure hash-based routing
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.