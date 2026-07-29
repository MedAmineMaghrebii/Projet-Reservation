import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reservation } from '../../../core/models/reservations/reservation';
import { Router } from '@angular/router'; 
import { ReservationService } from '../../../core/services/reservation.service';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-reservations', 
  standalone: true,
  imports: [CommonModule, FormsModule],
   templateUrl: './liste-reservation-component.html',
  styleUrl: './liste-reservation-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ListeReservationComponent implements OnInit {

  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  
  searchTerm: string = '';
  selectedFilter: string = 'Tous';
  activeView: 'list' | 'calendar' = 'list';

  constructor(private reservationService: ReservationService,
    private router: Router ,
      private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
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