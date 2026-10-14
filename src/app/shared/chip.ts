import { Component, computed, inject, input } from '@angular/core';
import { I18nService } from '../core/i18n.service';
import { iconFor } from '../core/icons';
import { Text } from '../core/models';

/** Pastille avec logo (ou emoji) + libellé traduit. */
@Component({
  selector: 'app-chip',
  host: { class: 'chip' },
  template: `
    @if (icon().src; as src) {
      <img class="chip__icon" [src]="src" [attr.data-logo]="icon().name" alt="" width="18" height="18" loading="lazy">
    } @else if (icon().emoji; as emoji) {
      <span class="chip__icon chip__emoji" aria-hidden="true">{{ emoji }}</span>
    }
    <span>{{ i18n.tr(value()) }}</span>
  `,
})
export class ChipComponent {
  protected readonly i18n = inject(I18nService);
  readonly value = input.required<Text>();
  protected readonly icon = computed(() => iconFor(this.value()));
}
