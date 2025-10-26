import { ChangeDetectionStrategy, Component, EventEmitter, input, output, signal, WritableSignal, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';

@Component({
  selector: 'app-website-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScrollAnimationDirective],
  templateUrl: './website-chat.component.html',
  styleUrls: ['./website-chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsiteChatComponent {
  chatHistory = input.required<{ role: 'user' | 'model'; text: string }[]>();
  isLoading = input.required<boolean>();
  errorMessage = input.required<string | null>();
  isDisabled = input.required<boolean>(); // To disable chat before initial generation

  onSendMessage = output<string>();

  chatInput = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  @ViewChild('chatMessagesContainer') private chatMessagesContainer!: ElementRef;

  constructor() {
    effect(() => {
      // Scroll to bottom when chat history changes and is not loading
      if (this.chatHistory().length > 0 && !this.isLoading()) {
        setTimeout(() => { // Give DOM a moment to update
          this.scrollToBottom();
        }, 100);
      }
    });
  }

  sendMessage() {
    if (this.chatInput.valid && !this.isLoading() && !this.isDisabled()) {
      this.onSendMessage.emit(this.chatInput.value);
      this.chatInput.reset();
    }
  }

  scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Could not scroll to bottom:', err);
    }
  }
}