import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finalisation-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finalisation-component.html',
  styleUrl: './finalisation-component.scss',
})
export class FinalisationComponent implements OnInit {
  reservationData: any;
  clientName = '—';
  salleName = '—'; 
  reservationDate = '—';
  reservationNumber = '—';
  montantTotal = 0;
  services: string[] = [];
  typePeriode = '—';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const stateFromRouter = navigation?.extras?.state as any;
    const stateFromHistory =
      typeof window !== 'undefined' &&
      typeof window.history !== 'undefined' &&
      (window.history.state as any)?.reservation
        ? window.history.state
        : null;
    const state = stateFromRouter ?? stateFromHistory;

    this.reservationData = state?.reservation ?? null;

    if (this.reservationData) {
      this.clientName = `${this.reservationData.client?.nom ?? ''} ${this.reservationData.client?.prenom ?? ''}`.trim() || '—';
      this.salleName = this.reservationData.salle?.nom ?? '—';
      this.reservationDate = this.reservationData.date ?? '—';
      this.reservationNumber = this.reservationData.numeroReservation ?? '—';
      this.montantTotal = this.reservationData.montantTotal ?? 0;
      this.services = (this.reservationData.services ?? []).map((s: any) => s.nom ?? 'Service');
      this.typePeriode = this.reservationData.typePeriode ?? this.reservationData.tarificationAppliquee?.typePeriode ?? this.reservationData.tarificationsAppliquees?.[0]?.typePeriode ?? '—';
    }
  }

  imprimerFacture(): void {
    window.print();
  }
}
