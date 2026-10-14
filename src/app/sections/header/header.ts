import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { ThemeService } from '../../core/theme.service';
import { CONTENT } from '../../core/content';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
})
export class HeaderComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly theme = inject(ThemeService);
  protected readonly profile = CONTENT.profile;

  protected readonly links = [
    { href: '#projets', key: 'nav.projects' },
    { href: '#parcours', key: 'nav.journey' },
    { href: '#competences', key: 'nav.skills' },
    { href: '#contact', key: 'nav.contact' },
  ];
}
