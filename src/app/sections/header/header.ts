import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { CONTENT } from '../../core/content';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
})
export class HeaderComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly profile = CONTENT.profile;

  protected readonly links = [
    { href: '#projets', key: 'nav.projects' },
    { href: '#formation', key: 'nav.formation' },
    { href: '#experiences', key: 'nav.experience' },
    { href: '#competences', key: 'nav.skills' },
    { href: '#contact', key: 'nav.contact' },
  ];
}
