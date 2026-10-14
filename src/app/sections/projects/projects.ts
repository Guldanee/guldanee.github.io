import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { CONTENT } from '../../core/content';
import { ChipComponent } from '../../shared/chip';
import { Project } from '../../core/models';

@Component({
  selector: 'app-projects',
  imports: [ChipComponent],
  templateUrl: './projects.html',
})
export class ProjectsComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly categories = CONTENT.categories;

  protected readonly filter = signal<string>('all');
  protected readonly selected = signal<Project | null>(null);

  protected readonly visible = computed(() => {
    const f = this.filter();
    return f === 'all' ? CONTENT.projects : CONTENT.projects.filter((p) => p.cats.includes(f));
  });

  protected readonly counts = computed(() => {
    const map: Record<string, number> = { all: CONTENT.projects.length };
    for (const c of this.categories) map[c.id] = CONTENT.projects.filter((p) => p.cats.includes(c.id)).length;
    return map;
  });

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private lastTrigger: HTMLElement | null = null;

  protected catLabel(id: string): string {
    const c = this.categories.find((x) => x.id === id);
    return c ? this.i18n.tr(c.label) : id;
  }

  protected open(project: Project, trigger: HTMLElement): void {
    this.lastTrigger = trigger;
    this.selected.set(project);
    this.dialog().nativeElement.showModal();
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }

  protected onDialogClose(): void {
    this.selected.set(null);
    this.lastTrigger?.focus({ preventScroll: true });
  }

  /** Clic sur le fond (hors de la feuille) : fermeture. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }
}
