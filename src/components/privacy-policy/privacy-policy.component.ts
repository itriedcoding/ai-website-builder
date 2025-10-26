import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, ScrollAnimationDirective],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyComponent {
  lastUpdated = computed(() => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
}
