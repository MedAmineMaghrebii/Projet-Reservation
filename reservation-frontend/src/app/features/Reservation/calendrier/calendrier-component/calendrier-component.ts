import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../../../core/models/reservations/reservation';

@Component({
  selector: 'app-calendrier-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendrier-component.html',
  styleUrls: ['./calendrier-component.scss'],
})
export class CalendrierComponent implements OnInit, OnChanges {
  @Input() reservationsList: Reservation[] = [];

  currentMonth = new Date();
  weekDays = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
  weeks: Array<Array<{ date: Date | null; reservations: Reservation[] }>> = [];

  ngOnInit(): void {
    this.buildCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reservationsList']) {
      this.buildCalendar();
    }
  }

  buildCalendar(): void {
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

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.buildCalendar();
  }

  formatMonth(): string {
    return this.currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  getReservationLabel(reservation: Reservation): string {
    const clientName = `${reservation.client?.prenom || ''} ${reservation.client?.nom || ''}`.trim();
    return reservation.notes ? `${clientName} · ${reservation.notes}` : clientName || 'Réservation';
  }

  getReservationClass(reservation: Reservation): string {
    switch (reservation.statut?.toUpperCase()) {
      case 'CONFIRMEE':
      case 'CONFIRME':
        return 'event-confirmed';
      case 'EN_ATTENTE':
        return 'event-pending';
      case 'ANNULEE':
      case 'ANNULE':
        return 'event-cancelled';
      default:
        return 'event-default';
    }
  }
}