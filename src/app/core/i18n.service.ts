import { Injectable, effect, signal } from '@angular/core';
import ui from '../data/ui.json';
import { Lang, Period, Text } from './models';

const UI = ui as Record<string, Record<Lang, string>>;
const LANGS: Lang[] = ['fr', 'en', 'tr', 'es'];

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly languages: { code: Lang; label: string }[] = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'es', label: 'Español' },
  ];

  readonly lang = signal<Lang>(this.initialLang());

  constructor() {
    effect(() => {
      const l = this.lang();
      document.documentElement.lang = l;
      try { localStorage.setItem('lang', l); } catch { /* stockage indisponible */ }
    });
  }

  isLang(value: string): value is Lang {
    return (LANGS as string[]).includes(value);
  }

  /** Libellé d'interface, avec remplacement des {variables}. */
  t(key: string, vars: Record<string, string | number> = {}): string {
    const entry = UI[key];
    let out = entry ? (entry[this.lang()] ?? entry.fr) : key;
    for (const [k, v] of Object.entries(vars)) out = out.replace(`{${k}}`, String(v));
    return out;
  }

  /** Contenu traduit (ou identique dans toutes les langues). */
  tr(value: Text): string {
    return typeof value === 'string' ? value : (value[this.lang()] ?? value.fr);
  }

  /** "2026-05" -> "mai 2026" / "May 2026" / "Mayıs 2026"… */
  month(ym: string, style: 'short' | 'long' = 'short'): string {
    const [y, m] = ym.split('-').map(Number);
    return new Intl.DateTimeFormat(this.lang(), { month: style, year: 'numeric' })
      .format(new Date(Date.UTC(y, m - 1, 15)));
  }

  period(p: Period): string {
    if (p.start === p.end) return this.month(p.start);
    const [sy] = p.start.split('-');
    const [ey] = p.end.split('-');
    if (sy === ey) {
      const startMonth = new Intl.DateTimeFormat(this.lang(), { month: 'short' })
        .format(new Date(Date.UTC(+sy, +p.start.split('-')[1] - 1, 15)));
      return `${startMonth} – ${this.month(p.end)}`;
    }
    return `${this.month(p.start)} – ${this.month(p.end)}`;
  }

  private initialLang(): Lang {
    try {
      const saved = localStorage.getItem('lang');
      if (saved && this.isLang(saved)) return saved;
    } catch { /* stockage indisponible */ }
    const nav = (navigator.language || 'fr').slice(0, 2);
    return this.isLang(nav) ? nav : 'fr';
  }
}
