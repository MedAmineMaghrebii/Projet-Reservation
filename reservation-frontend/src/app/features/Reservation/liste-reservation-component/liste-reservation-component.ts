import { Component, OnInit, signal, computed, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { Reservation } from '../../../core/models/reservations/reservation';
import { ReservationService } from '../../../core/services/reservation.service';
import { CalendrierComponent } from '../calendrier/calendrier-component/calendrier-component';
import { ModalComponent, ModalMode } from '../../../shared/modal/modal-component/modal-component';

@Component({
  selector: 'app-reservations', 
  standalone: true, 
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CalendrierComponent],
  templateUrl: './liste-reservation-component.html',
  styleUrls: ['./liste-reservation-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ListeReservationComponent implements OnInit {
  
  // --- Signals & State ---
  servicesList = signal([
    { id: 1, nom: 'Pack décoration', prix: 450, checked: true },
    { id: 2, nom: 'Sonorisation & DJ', prix: 350, checked: true },
    { id: 3, nom: 'Service traiteur', prix: 1200, checked: false }
  ]);

  reservations = signal<Reservation[]>([]);
  searchTerm = signal<string>('');
  selectedFilter = signal<string>('Tous');

  activeView: 'list' | 'calendar' = 'list';
  isDialogOpen = false;
  dialogMode: ModalMode = 'view';
  activeMenuId = signal<number | string | null>(null);
  activeModal = signal<ModalMode>(null);
  selectedReservation = signal<any>(null);

  myForm: FormGroup;

  // --- Computed Properties ---
  filteredReservations = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const filter = this.selectedFilter();
    
    return this.reservations().filter(res => {
      const clientName = `${res.client?.prenom || ''} ${res.client?.nom || ''}`.toLowerCase();
      const salleName = (res.salle?.nom || '').toLowerCase();
      const matchesSearch = clientName.includes(term) || 
                            salleName.includes(term) ||
                            (res.numeroReservation && res.numeroReservation.toLowerCase().includes(term));

      const matchesStatus = filter === 'Tous' || res.statut === filter;

      return matchesSearch && matchesStatus;
    });
  });

  extrasTotal = computed(() => {
    return this.servicesList()
      .filter(s => s.checked)
      .reduce((sum, item) => sum + item.prix, 0);
  });

  calculatedTotal = computed(() => {
    return (this.selectedReservation()?.montantTotal || 0) + this.extrasTotal();
  });

  // --- Constructor ---
  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      reservationId: [null],
      date: ['', [Validators.required]],
      heureDebut: ['', [Validators.required]],
      heureFin: ['', [Validators.required]],
      montantTotal: [0, [Validators.required, Validators.min(0)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.activeView = 'list';
    this.loadReservations();
  }

  // --- Menu & Dropdown Actions ---
  toggleMenu(id: number | string, event: MouseEvent) {
    event.stopPropagation();
    this.activeMenuId.set(this.activeMenuId() === id ? null : id);
  }

  @HostListener('document:click')
  closeMenus() {
    this.activeMenuId.set(null);
  }

  // --- Modal Open Actions ---
  openViewModal(reservation: any) {
    this.selectedReservation.set(reservation);
    this.activeModal.set('view');
    this.activeMenuId.set(null);
  }

  openEditModal(reservation: any) {
    this.selectedReservation.set(reservation);

    this.myForm.patchValue({
      reservationId: reservation.reservationId,
      date: reservation.date,
      heureDebut: reservation.heureDebut,
      heureFin: reservation.heureFin,
      montantTotal: reservation.montantTotal,
      notes: reservation.notes
    });

    this.activeModal.set('edit');
    this.activeMenuId.set(null);
  }

  openDeleteModal(reservation: any) {
    this.selectedReservation.set(reservation);
    this.activeModal.set('delete');
    this.activeMenuId.set(null);
  }

  closeModal() {
    this.activeModal.set(null);
    this.selectedReservation.set(null);
    this.myForm.reset();
  }

  toggleService(service: any): void {
    this.servicesList.update(list =>
      list.map(s => s.id === service.id ? { ...s, checked: !s.checked } : s)
    );
  }

  saveReservationChanges(): void {
    console.log('Final payload saved to Backend:', {
      ...this.selectedReservation(),
      montantFinalCalculated: this.calculatedTotal(),
      extras: this.servicesList().filter(s => s.checked)
    });
    this.closeModal();
  }

  saveClientChanges(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const formValues = this.myForm.value;
    
    this.selectedReservation.update(prev => ({
      ...prev,
      date: formValues.date,
      heureDebut: formValues.heureDebut,
      heureFin: formValues.heureFin,
      montantTotal: formValues.montantTotal,
      notes: formValues.notes,
      dateModification: new Date().toISOString()
    }));

    this.activeModal.set('view');
  }

  confirmDelete(): void {
    console.log('Deleting Reservation with ID:', this.selectedReservation()?.reservationId);
    this.closeModal();
  }

  addExtra(): void {
    console.log('Add Extra clicked');
  }

  // --- API Communications ---
  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data: Reservation[]) => {
        this.reservations.set(data);
        this.activeView = 'list';
        console.log(data);
      },
      error: (err: unknown) => {
        console.error('Erreur lors du chargement des réservations', err);
      }
    });
  }

  goToAddReservation(): void {
    this.router.navigate(['/ajouter-reservation']); 
  }

  deleteReservation(id?: number): void {
    if (!id) {
      console.error('ID de réservation manquant');
      return;
    }

    if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
      this.reservationService.deleteReservation(id).subscribe(() => {
        this.loadReservations();
      });
    }
  }

  // --- Helper UI Methods ---
  getInitials(prenom: string, nom: string): string {
    if (!prenom && !nom) return '??';
    const first = prenom ? prenom.charAt(0).toUpperCase() : '';
    const last = nom ? nom.charAt(0).toUpperCase() : '';
    return `${first}${last}`;
  }

  getAvatarClass(id?: number): string {
    const classes = ['bg-purple', 'bg-green', 'bg-blue', 'bg-pink'];
    const index = id ?? 0;
    return classes[index % classes.length];
  }

  getStatusClass(statut: string): string {
    switch (statut?.toUpperCase()) {
      case 'CONFIRMEE':
      case 'CONFIRME':
        return 'badge-confirmed';
      case 'EN_ATTENTE':
        return 'badge-pending';
      case 'ANNULEE':
      case 'ANNULE':
        return 'badge-cancelled';
      default:
        return 'badge-default';
    }
  }
}