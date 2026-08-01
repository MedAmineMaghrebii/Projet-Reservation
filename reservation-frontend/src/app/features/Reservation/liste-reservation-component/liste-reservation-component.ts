import { Component, computed, HostListener, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reservation } from '../../../core/models/reservations/reservation';
import { Router } from '@angular/router'; 
import { ReservationService } from '../../../core/services/reservation.service';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalComponent, ModalMode } from '../../../shared/modal/modal-component/modal-component';



@Component({
  selector: 'app-reservations', 
  standalone: true,
  imports: [CommonModule, FormsModule,ModalComponent,ReactiveFormsModule],
   templateUrl: './liste-reservation-component.html',
  styleUrl: './liste-reservation-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ListeReservationComponent implements OnInit {
servicesList = signal([
    { id: 1, nom: 'Pack décoration', prix: 450, checked: true },
    { id: 2, nom: 'Sonorisation & DJ', prix: 350, checked: true },
    { id: 3, nom: 'Service traiteur', prix: 1200, checked: false }
  ]);
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  
  searchTerm: string = '';
  selectedFilter: string = 'Tous';
  activeView: 'list' | 'calendar' = 'list';

   // modal properties
  isDialogOpen = false;

dialogMode: ModalMode = 'view';
activeMenuId = signal<number | string | null>(null);
  activeModal = signal<ModalMode>(null);
  selectedReservation = signal<any>(null);
  extrasTotal = computed(() => {
    return this.servicesList()
      .filter(s => s.checked)
      .reduce((sum, item) => sum + item.prix, 0);
  });

  calculatedTotal = computed(() => {
    return (this.selectedReservation()?.montantTotal || 0) + this.extrasTotal();
  });
  myForm: FormGroup 

  constructor(private reservationService: ReservationService,
    private router: Router ,
      private cdr: ChangeDetectorRef ,
      private fb : FormBuilder
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
    this.loadReservations();
  }







  toggleMenu(id: number | string, event: MouseEvent) {
    event.stopPropagation();
    this.activeMenuId.set(this.activeMenuId() === id ? null : id);
  }

  // Close dropdown menu when clicking anywhere outside
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



  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        console.log(data)
        this.filterReservations();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réservations', err);
      }
    });
  }
  goToAddReservation(): void {
    this.router.navigate(['/ajouter-reservation']); 
  }

  filterReservations(): void {
    this.filteredReservations = this.reservations.filter(res => {
      const clientName = `${res.client?.prenom || ''} ${res.client?.nom || ''}`.toLowerCase();
      const salleName = (res.salle?.nom || '').toLowerCase();
      const matchesSearch = clientName.includes(this.searchTerm.toLowerCase()) || 
                            salleName.includes(this.searchTerm.toLowerCase()) ||
                            (res.numeroReservation && res.numeroReservation.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesStatus = this.selectedFilter === 'Tous' || res.statut === this.selectedFilter;

      return matchesSearch && matchesStatus;
    });
  }

  deleteReservation(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
      this.reservationService.deleteReservation(id).subscribe(() => {
        this.loadReservations();
      });
    }
  }

  // Génère les initiales (ex: "Ahmed & Sarra" -> "A&", "Mariem Ben Ali" -> "MB")
  getInitials(prenom: string, nom: string): string {
    if (!prenom && !nom) return '??';
    const first = prenom ? prenom.charAt(0).toUpperCase() : '';
    const last = nom ? nom.charAt(0).toUpperCase() : '';
    return `${first}${last}`;
  }

  // Classe CSS dynamique pour la couleur du badge initiales
  getAvatarClass(id: number): string {
    const classes = ['bg-purple', 'bg-green', 'bg-blue', 'bg-pink'];
    return classes[id % classes.length];
  }

  // Classe CSS dynamique pour le badge de statut
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