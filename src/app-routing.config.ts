import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'terms', component: TermsOfServiceComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: '**', redirectTo: '/home' }, // Wildcard route for any other path
];
