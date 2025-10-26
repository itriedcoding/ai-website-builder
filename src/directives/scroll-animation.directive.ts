
import { Directive, ElementRef, OnInit, Renderer2, signal, WritableSignal, effect } from '@angular/core';

@Directive({
  selector: '[appScrollAnimation]',
  standalone: true,
})
export class ScrollAnimationDirective implements OnInit {
  private hasAnimated: WritableSignal<boolean> = signal(false);

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    effect(() => {
      if (this.hasAnimated()) {
        this.renderer.removeClass(this.el.nativeElement, 'opacity-0');
        this.renderer.removeClass(this.el.nativeElement, 'translate-y-4');
        this.renderer.addClass(this.el.nativeElement, 'opacity-100');
        this.renderer.addClass(this.el.nativeElement, 'translate-y-0');
      }
    });
  }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, 'opacity-0'); // Start hidden
    this.renderer.addClass(this.el.nativeElement, 'translate-y-4'); // Start slightly below
    this.renderer.addClass(this.el.nativeElement, 'transition-all');
    this.renderer.addClass(this.el.nativeElement, 'duration-1000');
    this.renderer.addClass(this.el.nativeElement, 'ease-out');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.hasAnimated()) {
          this.hasAnimated.set(true);
          observer.unobserve(this.el.nativeElement);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(this.el.nativeElement);
  }
}
