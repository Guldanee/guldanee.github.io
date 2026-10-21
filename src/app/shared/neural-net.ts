import { AfterViewInit, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { I18nService } from '../core/i18n.service';

interface NetNode { x: number; y: number; l: number; i: number; a: number; }
interface Edge { a: NetNode; b: NetNode; w: number; }
interface Pulse { e: Edge; t: number; s: number; }
type Status =
  | { kind: 'hint' }
  | { kind: 'out'; i: number }
  | { kind: 'neuron'; id: string; n: number }
  | { kind: 'inference' };

const LAYERS = [4, 7, 7, 5, 3];
const OUTPUTS = ['nn.out1', 'nn.out2', 'nn.out3'];
const MINT = '#7CF3D6';
const VIOLET = '#8D7BFF';
const BG = '#0A0C18';

/**
 * Réseau de neurones animé dessiné sur un canvas.
 * Des impulsions traversent les couches ; elles s'intensifient près de la souris
 * et un clic lance une « inférence ». L'animation s'arrête quand le canvas
 * n'est plus visible et respecte prefers-reduced-motion.
 */
@Component({
  selector: 'app-neural-net',
  host: { class: 'nn' },
  template: `
    <canvas #cv class="nn__canvas" role="img" [attr.aria-label]="i18n.t('nn.label')"
            (pointermove)="onMove($event)" (pointerleave)="onLeave()" (click)="onClick()"></canvas>
    <p class="nn__legend" aria-live="polite">{{ legend() }}</p>
  `,
})
export class NeuralNetComponent implements AfterViewInit {
  protected readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('cv');

  private readonly status = signal<Status>({ kind: 'hint' });
  protected readonly legend = computed(() => {
    const s = this.status();
    switch (s.kind) {
      case 'out': return this.i18n.t('nn.output', { name: this.i18n.t(OUTPUTS[s.i]), value: (0.81 + s.i * 0.06).toFixed(2) });
      case 'neuron': return this.i18n.t('nn.neuron', { id: s.id, n: s.n });
      case 'inference': return this.i18n.t('nn.inference');
      default: return this.i18n.t('nn.hint');
    }
  });

  private ctx!: CanvasRenderingContext2D;
  private nodes: NetNode[] = [];
  private edges: Edge[] = [];
  private pulses: Pulse[] = [];
  private mouse: { x: number; y: number } | null = null;
  private hot: NetNode | null = null;
  private raf = 0;
  private last = 0;
  private visible = true;
  private readonly reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  ngAfterViewInit(): void {
    const cv = this.canvas().nativeElement;
    this.ctx = cv.getContext('2d')!;
    const ro = new ResizeObserver(() => { this.layout(); this.loop(); });
    ro.observe(cv);
    const io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) this.loop();
    });
    io.observe(cv);
    this.destroyRef.onDestroy(() => { ro.disconnect(); io.disconnect(); cancelAnimationFrame(this.raf); });
  }

  protected onMove(e: PointerEvent): void {
    const r = this.canvas().nativeElement.getBoundingClientRect();
    this.mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    const m = this.mouse;
    this.hot = this.nodes.find((n) => Math.hypot(n.x - m.x, n.y - m.y) < 14) ?? null;
    const hot = this.hot;
    if (!hot) return;
    if (hot.l === LAYERS.length - 1) this.status.set({ kind: 'out', i: hot.i });
    else this.status.set({ kind: 'neuron', id: `${hot.l}.${hot.i}`, n: this.edges.filter((ed) => ed.a === hot || ed.b === hot).length });
    if (this.reduced) this.draw(0);
  }

  protected onLeave(): void {
    this.mouse = null;
    this.hot = null;
    this.status.set({ kind: 'hint' });
    if (this.reduced) this.draw(0);
  }

  protected onClick(): void {
    for (let i = 0; i < 14; i++) this.spawn();
    this.status.set({ kind: 'inference' });
    this.loop();
  }

  private layout(): void {
    const cv = this.canvas().nativeElement;
    const w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.nodes = [];
    this.edges = [];
    this.pulses = [];
    const labelSpace = Math.min(120, w * 0.24);
    LAYERS.forEach((count, l) => {
      const x = 24 + (l * (w - 24 - labelSpace)) / (LAYERS.length - 1);
      const gap = Math.min(54, (h - 40) / count);
      for (let i = 0; i < count; i++) this.nodes.push({ x, y: h / 2 + (i - (count - 1) / 2) * gap, l, i, a: 0 });
    });
    for (const a of this.nodes) for (const b of this.nodes) if (b.l === a.l + 1) this.edges.push({ a, b, w: Math.random() });
  }

  private spawn(): void {
    const inputs = this.edges.filter((e) => e.a.l === 0);
    if (!inputs.length) return;
    this.pulses.push({ e: inputs[(Math.random() * inputs.length) | 0], t: 0, s: 0.6 + Math.random() * 0.8 });
  }

  private loop(): void {
    cancelAnimationFrame(this.raf);
    this.last = 0;
    this.raf = requestAnimationFrame((t) => this.tick(t));
  }

  private tick(now: number): void {
    if (!this.visible) return;
    const dt = this.last ? Math.min(50, now - this.last) : 16;
    this.last = now;
    if (!this.reduced && Math.random() < (this.mouse ? 0.5 : 0.18)) this.spawn();
    this.draw(dt);
    // En mouvement réduit, on ne boucle que tant que des impulsions (lancées au clic) circulent.
    if (!this.reduced || this.pulses.length) this.raf = requestAnimationFrame((t) => this.tick(t));
  }

  private draw(dt: number): void {
    const ctx = this.ctx, cv = this.canvas().nativeElement;
    const w = cv.clientWidth, h = cv.clientHeight;
    ctx.clearRect(0, 0, w, h);

    for (const e of this.edges) {
      const near = this.hot && (e.a === this.hot || e.b === this.hot);
      ctx.strokeStyle = near ? 'rgba(124,243,214,.7)' : `rgba(141,123,255,${0.08 + e.w * 0.14})`;
      ctx.lineWidth = near ? 1.6 : 1;
      ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
    }

    const next: Pulse[] = [];
    for (const p of this.pulses) {
      p.t += dt * 0.0016 * p.s;
      if (p.t >= 1) {
        p.e.b.a = 1;
        const outs = this.edges.filter((e) => e.a === p.e.b).sort((a, b) => b.w - a.w);
        if (outs.length && Math.random() < 0.8) next.push({ e: outs[(Math.random() * Math.min(3, outs.length)) | 0], t: 0, s: p.s });
        continue;
      }
      const x = p.e.a.x + (p.e.b.x - p.e.a.x) * p.t, y = p.e.a.y + (p.e.b.y - p.e.a.y) * p.t;
      ctx.fillStyle = MINT; ctx.shadowColor = MINT; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      next.push(p);
    }
    this.pulses = next;

    for (const n of this.nodes) {
      n.a *= 0.94;
      if (this.mouse) {
        const d = Math.hypot(n.x - this.mouse.x, n.y - this.mouse.y);
        if (d < 60) n.a = Math.max(n.a, 1 - d / 60);
      }
      const g = n.a, r = n === this.hot ? 10 : 7;
      ctx.fillStyle = `rgb(${(141 + 114 * g) | 0},${(123 + 120 * g) | 0},${(255 - 41 * g) | 0})`;
      ctx.shadowColor = VIOLET; ctx.shadowBlur = 6 + g * 16;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = BG; ctx.lineWidth = 2; ctx.stroke();
    }

    ctx.font = '600 12px "Geist Mono", ui-monospace, monospace';
    ctx.fillStyle = '#B7BCDB';
    ctx.textBaseline = 'middle';
    this.nodes.filter((n) => n.l === LAYERS.length - 1)
      .forEach((n, i) => ctx.fillText(this.i18n.t(OUTPUTS[i]), n.x + 16, n.y));
  }
}
