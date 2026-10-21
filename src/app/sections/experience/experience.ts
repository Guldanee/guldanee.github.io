import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { CONTENT } from '../../core/content';
import { Experience } from '../../core/models';
import { ChipComponent } from '../../shared/chip';

/** Expériences : stage Sodern mis en avant, puis le tutorat. */
@Component({
  selector: 'app-experience',
  imports: [ChipComponent],
  template: `
    <section class="sec" id="experiences" aria-labelledby="experiences-title">
      <p class="layer">{{ i18n.t('layer.experience') }}</p>
      <h2 class="sec__title" id="experiences-title">{{ i18n.t('nav.experience') }}</h2>
      <p class="sec__sub">{{ i18n.t('experience.sub') }}</p>

      <div class="exps">
        @for (e of experience; track e.id; let first = $first) {
          <article class="xp" [class.xp--main]="first">
            <div class="xp__head">
              <div>
                <p class="xp__when">{{ periods(e) }}</p>
                <h3 class="xp__role">{{ i18n.tr(e.role) }}</h3>
                <p class="xp__where">{{ e.company }}, {{ e.place }}</p>
              </div>
              <span class="xp__net" aria-hidden="true">
                @for (n of (first ? dots7 : dots5); track n) { <i></i> }
              </span>
            </div>
            <p class="xp__summary">{{ i18n.tr(e.summary) }}</p>
            <ul class="dots">
              @for (pt of e.points; track $index) { <li>{{ i18n.tr(pt) }}</li> }
            </ul>
            <div class="chips">
              @for (s of e.stack; track $index) { <app-chip [value]="s" /> }
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class ExperienceComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly experience = CONTENT.experience;
  protected readonly dots7 = [1, 2, 3, 4, 5, 6, 7];
  protected readonly dots5 = [1, 2, 3, 4, 5];

  protected periods(e: Experience): string {
    return e.periods.map((p) => this.i18n.period(p)).join(` ${this.i18n.t('journey.and')} `);
  }
}
