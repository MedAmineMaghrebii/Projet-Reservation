import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../../../core/models/reservations/reservation';
import { StatutReservation } from '../../../../core/models/reservations/statut-reservation.enum';

@Component({
  selector: 'app-calendrier-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendrier-component.html',
  styleUrls: ['./calendrier-component.scss'],
})
export class CalendrierComponent implements OnInit, OnChanges {
  @Input() reservationsList: Reservation[] = [];

  currentMonth = new Date(2026, 7, 1); // Mois d'Août 2026 selon la capture
  todayDate = new Date(2026, 7, 7);    // Le 7 Août
  weekDays = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
  weeks: Array<Array<{ date: Date | null; reservations: Reservation[] }>> = [];

  // Compteurs des statistiques
  totalReservations = 0;
  countPayee = 0;
  countConfirmee = 0;
  countEnAttente = 0;
  countAnnulee = 0;

  ngOnInit(): void {
    this.buildCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reservationsList']) {
      this.calculateStats();
      this.buildCalendar();
    }
  }

  calculateStats(): void {
    this.totalReservations = this.reservationsList.length;
    this.countPayee = this.reservationsList.filter(r => r.statut === StatutReservation.PAYEE).length;
    this.countConfirmee = this.reservationsList.filter(r => r.statut === StatutReservation.CONFIRMEE).length;
    this.countEnAttente = this.reservationsList.filter(r => r.statut === StatutReservation.EN_ATTENTE).length;
    this.countAnnulee = this.reservationsList.filter(r => r.statut === StatutReservation.ANNULEE).length;
  }

  buildCalendar(): void {
    this.calculateStats();
    
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const days: Array<{ date: Date | null; reservations: Reservation[] }> = [];

    for (let i = 0; i < startDayIndex; i++) {
      days.push({ date: null, reservations: [] });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      
      const yearStr = date.getFullYear();
      const monthStr = String(date.getMonth() + 1).padStart(2, '0');
      const dayStr = String(date.getDate()).padStart(2, '0');
      const key = `${yearStr}-${monthStr}-${dayStr}`;

      const dailyReservations = this.reservationsList.filter(r => r.date === key);
      days.push({ date, reservations: dailyReservations });
    }

    while (days.length % 7 !== 0) {
      days.push({ date: null, reservations: [] });
    }

    this.weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.weeks.push(days.slice(i, i + 7));
    }
  }

  formatMonth(): string {
    return this.currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    return (
      date.getDate() === this.todayDate.getDate() &&
      date.getMonth() === this.todayDate.getMonth() &&
      date.getFullYear() === this.todayDate.getFullYear()
    );
  }

  getReservationLabel(reservation: Reservation): string {
    return `${reservation.client?.prenom || ''} ${reservation.client?.nom || ''}`.trim() || 'Client';
  }

  getReservationClass(reservation: Reservation): string {
    switch (reservation.statut) {
      case StatutReservation.PAYEE: return 'event-payee';
      case StatutReservation.CONFIRMEE: return 'event-confirmee';
      case StatutReservation.EN_ATTENTE: return 'event-en-attente';
      case StatutReservation.TERMINEE: return 'event-terminee';
      case StatutReservation.ANNULEE: return 'event-annulee';
      default: return '';
    }
  }

  getStatusBadgeLabel(statut: StatutReservation): string {
    switch (statut) {
      case StatutReservation.PAYEE: return 'PAYÉE';
      case StatutReservation.CONFIRMEE: return 'CONFIRMÉE';
      case StatutReservation.EN_ATTENTE: return 'EN ATTENTE';
      case StatutReservation.TERMINEE: return 'TERMINÉE';
      case StatutReservation.ANNULEE: return 'ANNULÉE';
      default: return '';
    }
  }
}