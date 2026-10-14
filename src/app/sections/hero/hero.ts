import { Component, computed, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { CONTENT } from '../../core/content';

function monthsBetween(start: string, end: string): number {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
}

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
})
export class HeroComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly c = CONTENT;
  protected readonly p = CONTENT.profile;

  private readonly sodern = CONTENT.experience.find((e) => e.id === 'sodern');
  private readonly tutoring = CONTENT.experience.find((e) => e.id === 'tutorat');

  protected readonly stats = computed(() => [
    { value: CONTENT.projects.length, label: this.i18n.t('stats.projects') },
    { value: this.sodern ? monthsBetween(this.sodern.periods[0].start, this.sodern.periods[0].end) : 4, label: this.i18n.t('stats.months') },
    { value: this.tutoring?.periods.length ?? 2, label: this.i18n.t('stats.tutoring') },
    { value: CONTENT.languages.length, label: this.i18n.t('stats.languages') },
  ]);

  protected readonly available = computed(() =>
    this.i18n.t('hero.available', { date: this.i18n.month(this.p.availableFrom, 'long') }),
  );
}
