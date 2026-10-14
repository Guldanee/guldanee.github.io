import { Component, effect, inject } from '@angular/core';
import { I18nService } from './core/i18n.service';
import { CONTENT } from './core/content';
import { HeaderComponent } from './sections/header/header';
import { HeroComponent } from './sections/hero/hero';
import { ProjectsComponent } from './sections/projects/projects';
import { JourneyComponent } from './sections/journey/journey';
import { SkillsComponent } from './sections/skills/skills';
import { ContactComponent } from './sections/contact/contact';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, HeroComponent, ProjectsComponent, JourneyComponent, SkillsComponent, ContactComponent],
  template: `
    <a class="skip-link" href="#main">{{ i18n.t('a11y.skip') }}</a>
    <app-header />
    <main id="main" class="page">
      <app-hero />
      <app-projects />
      <app-journey />
      <app-skills />
      <app-contact />
    </main>
  `,
})
export class App {
  protected readonly i18n = inject(I18nService);

  constructor() {
    // Titre de l'onglet traduit
    effect(() => {
      document.title = `${CONTENT.profile.name}, ${this.i18n.tr(CONTENT.profile.role).toLowerCase()}`;
    });
  }
}
