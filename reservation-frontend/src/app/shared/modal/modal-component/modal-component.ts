import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

export type ModalMode = 'delete' |'add' | 'edit' | 'view' | 'create' | null;

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-component.html',
  styleUrls: ['./modal-component.scss']
})
export class ModalComponent {

  // Inputs
  isOpen = input(false);
  title = input('');
  subtitle = input('');
  mode = input<ModalMode>('add');

  // Optional customization
  showFooter = input(true);
  showCancel = input(true);
  showSave = input(true);

  cancelText = input('Annuler');
  saveText = input('Enregistrer');

  // Outputs
  closed = output<void>();
  saved = output<void>();

  readonly = computed(() => this.mode() === 'view');

  close() {
    this.closed.emit();
  }

  save() {
    this.saved.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }
}
