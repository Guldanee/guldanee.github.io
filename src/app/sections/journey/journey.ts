import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { CONTENT } from '../../core/content';
import { ChipComponent } from '../../shared/chip';
import { Experience } from '../../core/models';

@Component({
  selector: 'app-journey',
  imports: [ChipComponent],
  templateUrl: './journey.html',
})
export class JourneyComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly experience = CONTENT.experience;
  protected readonly education = CONTENT.education;

  protected periods(e: Experience): string {
    return e.periods.map((p) => this.i18n.period(p)).join(` ${this.i18n.t('journey.and')} `);
  }
}
