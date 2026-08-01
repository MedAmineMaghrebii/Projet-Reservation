import { Component, OnInit, signal, computed, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reservation } from '../../../core/models/reservations/reservation';
import { Router } from '@angular/router'; 
import { ReservationService } from '../../../core/services/reservation.service';
import { CalendrierComponent } from '../calendrier/calendrier-component/calendrier-component';

@Component({
  selector: 'app-reservations', 
  standalone: true, 
  imports: [CommonModule, FormsModule, CalendrierComponent],
  templateUrl: './liste-reservation-component.html',
  styleUrls: ['./liste-reservation-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ListeReservationComponent implements OnInit {

  reservations = signal<Reservation[]>([]);
  
  searchTerm = signal<string>('');
  selectedFilter = signal<string>('Tous');
  
  activeView: 'list' | 'calendar' = 'list';

  // Signal calculé automatiquement (plus besoin de filterReservations() manuel)
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

  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.activeView = 'list';
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data: Reservation[]) => {
        this.reservations.set(data);
        this.activeView = 'list';
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