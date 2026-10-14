import { Component, inject, signal } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { CONTENT } from '../../core/content';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
})
export class ContactComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly p = CONTENT.profile;
  protected readonly year = new Date().getFullYear();
  protected readonly copied = signal(false);
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.p.email);
      this.copied.set(true);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.copied.set(false), 2200);
    } catch {
      window.location.href = `mailto:${this.p.email}`;
    }
  }
}
