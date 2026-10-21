import { AfterViewInit, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { CONTENT } from '../../core/content';

const PATH_HEIGHT = 190;

/** Formation : les diplômes reliés comme des neurones, puis une carte par diplôme. */
@Component({
  selector: 'app-formation',
  template: `
    <section class="sec" id="formation" aria-labelledby="formation-title">
      <p class="layer">{{ i18n.t('layer.formation') }}</p>
      <h2 class="sec__title" id="formation-title">{{ i18n.t('nav.formation') }}</h2>
      <p class="sec__sub">{{ i18n.t('formation.sub') }}</p>

      <div class="path" #path>
        <svg class="path__svg" [attr.viewBox]="'0 0 ' + width() + ' ' + height" aria-hidden="true">
          <defs>
            <linearGradient id="path-grad" x1="0" x2="1">
              <stop offset="0" stop-color="#8D7BFF" />
              <stop offset="1" stop-color="#7CF3D6" />
            </linearGradient>
          </defs>
          @for (d of curves(); track $index) {
            <path [attr.d]="d" fill="none" stroke="url(#path-grad)" stroke-width="2" stroke-opacity=".85" />
          }
        </svg>
        <ol class="path__nodes">
          @for (n of nodes(); track n.id) {
            <li class="path__node" [class.path__node--now]="n.now" [style.left.px]="n.x" [style.top.px]="n.y">
              <i aria-hidden="true"></i>
              <span><b>{{ i18n.tr(n.short) }}</b><small>{{ n.years }}</small></span>
            </li>
          }
        </ol>
      </div>

      <div class="edu">
        @for (e of chrono; track e.id; let last = $last) {
          <article class="det" [class.det--now]="last">
            <p class="det__when">{{ i18n.period(e) }}</p>
            <h3 class="det__title">{{ i18n.tr(e.degree) }}</h3>
            <p class="det__where">{{ e.school }}</p>
            <p class="det__text">{{ i18n.tr(e.detail) }}</p>
          </article>
        }
      </div>
    </section>
  `,
})
export class FormationComponent implements AfterViewInit {
  protected readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pathEl = viewChild.required<ElementRef<HTMLElement>>('path');

  /** Du plus ancien au plus récent. */
  protected readonly chrono = [...CONTENT.education].reverse();
  protected readonly height = PATH_HEIGHT;
  protected readonly width = signal(1000);

  protected readonly nodes = computed(() => {
    const w = this.width(), n = this.chrono.length;
    return this.chrono.map((e, i) => ({
      id: e.id,
      short: e.short,
      years: `${e.start.slice(0, 4)} – ${e.end.slice(0, 4)}`,
      now: i === n - 1,
      x: 80 + (i * (w - 160)) / Math.max(1, n - 1),
      y: PATH_HEIGHT / 2 + (i % 2 ? -32 : 32),
    }));
  });

  protected readonly curves = computed(() => {
    const pts = this.nodes();
    return pts.slice(1).map((b, i) => {
      const a = pts[i], mx = (a.x + b.x) / 2;
      return `M${a.x} ${a.y} C${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
    });
  });

  ngAfterViewInit(): void {
    const el = this.pathEl().nativeElement;
    const ro = new ResizeObserver(() => this.width.set(el.clientWidth || 1000));
    ro.observe(el);
    this.destroyRef.onDestroy(() => ro.disconnect());
  }
}
