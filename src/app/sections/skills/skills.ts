import { AfterViewInit, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { CONTENT } from '../../core/content';
import { Text } from '../../core/models';
import { iconFor } from '../../core/icons';
import { ChipComponent } from '../../shared/chip';

/** Couleur de chaque groupe de compétences dans l'espace latent. */
const CLUSTER_COLORS: Record<string, string> = {
  backend: '#8D7BFF', frontend: '#FF6FB5', ai: '#7CF3D6', data: '#FFB86B', quality: '#6FB6FF', systems: '#C6F36B',
};
/** Centres des groupes (en fraction de la largeur / hauteur), grand écran puis mobile. */
const CENTERS_WIDE = [[0.17, 0.3], [0.47, 0.24], [0.8, 0.3], [0.2, 0.74], [0.52, 0.72], [0.82, 0.72]];
const CENTERS_NARROW = [[0.3, 0.12], [0.68, 0.27], [0.3, 0.43], [0.68, 0.58], [0.3, 0.74], [0.68, 0.89]];

@Component({
  selector: 'app-skills',
  imports: [ChipComponent],
  template: `
    <section class="sec" id="competences" aria-labelledby="competences-title">
      <p class="layer">{{ i18n.t('layer.skills') }}</p>
      <h2 class="sec__title" id="competences-title">{{ i18n.t('skills.latent') }}</h2>
      <p class="sec__sub">{{ i18n.t('skills.latentSub') }}</p>

      <div class="emb" #map [style.height.px]="height()">
        <svg class="emb__lines" [attr.viewBox]="'0 0 ' + width() + ' ' + height()" aria-hidden="true">
          @for (pt of points(); track pt.key) {
            <line [attr.x1]="pt.cx" [attr.y1]="pt.cy" [attr.x2]="pt.x" [attr.y2]="pt.y" [attr.stroke]="pt.color" stroke-opacity=".2" />
          }
        </svg>
        @for (c of clusters(); track c.id) {
          <h3 class="emb__label" [style.left.px]="c.x" [style.top.px]="c.y" [style.--c]="c.color">{{ i18n.tr(c.label) }}</h3>
        }
        <ul class="emb__pts">
          @for (pt of points(); track pt.key) {
            <li class="pt" tabindex="0" [style.left.px]="pt.x" [style.top.px]="pt.y" [style.--c]="pt.color" [attr.aria-label]="i18n.tr(pt.item)">
              @if (pt.icon.src) {
                <img [src]="pt.icon.src" [attr.data-logo]="pt.icon.name" alt="" width="18" height="18" loading="lazy">
              } @else {
                <span class="pt__emoji" aria-hidden="true">{{ pt.icon.emoji ?? '•' }}</span>
              }
              <span class="pt__name">{{ i18n.tr(pt.item) }}</span>
            </li>
          }
        </ul>
      </div>

      <div class="weights">
        @for (l of languages; track $index) {
          <div class="w">
            <b>{{ i18n.tr(l.name) }}</b>
            <small>{{ i18n.t('skills.weight', { w: (l.score / 5).toFixed(1) }) }}, {{ i18n.tr(l.level) }}</small>
            <span class="w__bar" aria-hidden="true"><span [style.width.%]="l.score * 20"></span></span>
          </div>
        }
      </div>

      <div class="duo">
        <div class="box">
          <h3 class="box__title">{{ i18n.t('skills.softTitle') }}</h3>
          <p class="box__text">{{ i18n.t('skills.soft') }}</p>
        </div>
        <div class="box">
          <h3 class="box__title">{{ i18n.t('card.interests') }}</h3>
          <div class="chips">
            @for (it of interests; track $index) { <app-chip [value]="it" /> }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class SkillsComponent implements AfterViewInit {
  protected readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly map = viewChild.required<ElementRef<HTMLElement>>('map');

  protected readonly languages = CONTENT.languages;
  protected readonly interests = CONTENT.interests;
  protected readonly width = signal(1000);
  protected readonly narrow = computed(() => this.width() < 700);
  protected readonly height = computed(() => (this.narrow() ? 800 : 520));

  protected readonly clusters = computed(() => {
    const w = this.width(), h = this.height(), centers = this.narrow() ? CENTERS_NARROW : CENTERS_WIDE;
    return CONTENT.skills.map((g, i) => ({
      id: g.id, label: g.label, color: CLUSTER_COLORS[g.id] ?? '#8D7BFF',
      x: centers[i % centers.length][0] * w,
      y: centers[i % centers.length][1] * h - (this.narrow() ? 66 : 96),
    }));
  });

  protected readonly points = computed(() => {
    const w = this.width(), h = this.height(), narrow = this.narrow(), centers = narrow ? CENTERS_NARROW : CENTERS_WIDE;
    // Générateur pseudo-aléatoire déterministe : la carte est identique à chaque visite.
    let seed = 7;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    return CONTENT.skills.flatMap((g, gi) => {
      const [fx, fy] = centers[gi % centers.length], cx = fx * w, cy = fy * h, color = CLUSTER_COLORS[g.id] ?? '#8D7BFF';
      return g.items.map((item: Text, k) => {
        const ang = k * 2.4 + rnd();
        const rad = (narrow ? 22 : 26) + Math.sqrt(k) * (narrow ? 17 : 18) * (0.85 + rnd() * 0.3);
        return {
          key: `${g.id}-${k}`, item, color, cx, cy,
          x: cx + Math.cos(ang) * rad * 1.15,
          y: cy + Math.sin(ang) * rad * 0.75,
          icon: iconFor(item),
        };
      });
    });
  });

  ngAfterViewInit(): void {
    const el = this.map().nativeElement;
    const ro = new ResizeObserver(() => this.width.set(el.clientWidth || 1000));
    ro.observe(el);
    this.destroyRef.onDestroy(() => ro.disconnect());
  }
}
