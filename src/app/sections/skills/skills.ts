import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { CONTENT } from '../../core/content';
import { Text } from '../../core/models';
import { ChipComponent } from '../../shared/chip';

@Component({
  selector: 'app-skills',
  imports: [ChipComponent],
  templateUrl: './skills.html',
})
export class SkillsComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly groups = CONTENT.skills;
  protected readonly interests = CONTENT.interests;

  protected isFavorite(item: Text): boolean {
    return item === 'Angular';
  }
}
