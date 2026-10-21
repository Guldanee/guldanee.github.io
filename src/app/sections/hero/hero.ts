import { Component, computed, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { CONTENT } from '../../core/content';
import { NeuralNetComponent } from '../../shared/neural-net';

@Component({
  selector: 'app-hero',
  imports: [NeuralNetComponent],
  template: `
    <section class="hero" aria-labelledby="hero-name">
      <div class="hero__text">
        <p class="tag">{{ i18n.t('hero.tag') }}</p>
        <h1 class="hero__name" id="hero-name">Güldane<br><span>Acar</span></h1>
        <p class="hero__role">{{ i18n.tr(p.role) }}</p>
        <p class="hero__lead">{{ i18n.tr(p.intro) }}</p>
        <p class="avail"><i aria-hidden="true"></i><span><strong>{{ available() }}</strong> {{ i18n.t('hero.internship') }}</span></p>
        <div class="btns">
          <a class="btn" href="#projets">{{ i18n.t('hero.ctaProjects') }}</a>
          <a class="btn btn--ghost" href="#contact">{{ i18n.t('hero.ctaContact') }}</a>
        </div>
      </div>
      <app-neural-net />
    </section>
  `,
})
export class HeroComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly p = CONTENT.profile;
  protected readonly available = computed(() =>
    this.i18n.t('hero.available', { date: this.i18n.month(this.p.availableFrom, 'long') }),
  );
}
