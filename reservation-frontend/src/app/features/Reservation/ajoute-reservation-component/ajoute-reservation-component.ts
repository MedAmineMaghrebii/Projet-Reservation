import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Client } from '../../../core/models/clients/client';
import { Salle } from '../../../core/models/salle/salle';
import { Reservation } from '../../../core/models/reservations/reservation';
import { StatutReservation } from '../../../core/models/reservations/statut-reservation.enum';
import { Service } from '../../../core/models/service/service';
import { TypePeriode } from '../../../core/models/salle/TypePeriode.enum';
import { TarificationSalle } from '../../../core/models/salle/tarification-salle';

import { ClientService } from '../../../core/services/client';
import { SalleService } from '../../../core/services/salle.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { ServiceService } from '../../../core/services/service.service';
import { TarificationSalleService } from '../../../core/services/tarification-salle.service';

@Component({
  selector: 'app-ajouter-reservation',
  standalone: true,
  templateUrl: './ajoute-reservation-component.html',
  styleUrl: './ajoute-reservation-component.scss',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AjouterReservationComponent implements OnInit {

  etapeCourante: number = 1;
  modeClient: 'existant' | 'nouveau' = 'existant';

  clientsExistants: Client[] = [];
  sallesDisponibles: Salle[] = [];
  servicesDisponibles: Service[] = [];
  servicesSelectionnes: Service[] = [];

  rechercheClientTerme: string = '';
  clientSelectionne?: Client;

  // Formulaire Réactif pour Nouveau Client
  clientForm!: FormGroup;

  // Formulaire Réactif pour la Réservation & Tarification
  reservationForm!: FormGroup;

  tauxAcompte: number = 30;
  tarificationSelectionnee?: TarificationSalle;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private clientService: ClientService,
    private salleService: SalleService,
    private serviceService: ServiceService,
    private tarificationSalleService: TarificationSalleService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadClients();
    this.loadSalles();
  }

  private initForms(): void {
    // Initialisation du formulaire Nouveau Client avec Validators
    this.clientForm = this.fb.group({
      cin: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(3)]],
      telephone: ['', [Validators.pattern(/^[0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['']
    });

    // Initialisation du formulaire Réservation
    this.reservationForm = this.fb.group({
      salleSelectionnee: [null, Validators.required],
      date: ['', Validators.required],
      typePeriode: [null, Validators.required],
      montantTotal: [0, [Validators.required, Validators.min(0)]],
      tauxAcompte: [30],
      notes: ['']
    });

    this.reservationForm.get('tauxAcompte')?.valueChanges.subscribe(val => {
      this.tauxAcompte = val;
      this.cdr.markForCheck();
    });

    this.reservationForm.get('typePeriode')?.valueChanges.subscribe(() => {
      this.updateTarificationSelection();
      this.cdr.markForCheck();
    });
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clientsExistants = data || [];
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur lors du chargement des clients :', err)
    });
  }

  loadSalles(): void {
    this.salleService.getAllSalles().subscribe({
      next: (data) => {
        this.sallesDisponibles = data || [];
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur lors du chargement des salles :', err)
    });
  }

  compareSalles(s1: Salle, s2: Salle): boolean {
    if (!s1 || !s2) return false;
    const id1 = s1.salleId ?? (s1 as any).id;
    const id2 = s2.salleId ?? (s2 as any).id;
    return id1 === id2;
  }

  onSalleChange(): void {
    this.servicesSelectionnes = [];
    this.servicesDisponibles = [];
    const salle: Salle = this.reservationForm.get('salleSelectionnee')?.value;
    const salleId = salle?.salleId;

    if (!salleId) {
      this.tarificationSelectionnee = undefined;
      this.calculerMontantTotal();
      this.cdr.markForCheck();
      return;
    }

    this.serviceService.getServicesBySalleId(salleId).subscribe({
      next: (data) => {
        this.servicesDisponibles = Array.isArray(data) ? data : [];
        this.updateTarificationSelection();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des services :', err);
        this.servicesDisponibles = [];
        this.updateTarificationSelection();
        this.cdr.markForCheck();
      }
    });
  }

  private updateTarificationSelection(): void {
    const salle: Salle = this.reservationForm.get('salleSelectionnee')?.value;
    const typePeriode: TypePeriode | null = this.reservationForm.get('typePeriode')?.value;

    if (!salle || !typePeriode) {
      this.tarificationSelectionnee = undefined;
      this.calculerMontantTotal();
      return;
    }

    const salleId = salle.salleId;
    if (!salleId) {
      this.tarificationSelectionnee = undefined;
      this.calculerMontantTotal();
      return;
    }

    this.tarificationSalleService.findBySalleId(salleId).subscribe({
      next: (tarifications) => {
        this.tarificationSelectionnee = tarifications.find(t => t.typePeriode === typePeriode);
        this.calculerMontantTotal();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tarifications :', err);
        this.tarificationSelectionnee = undefined;
        this.calculerMontantTotal();
        this.cdr.markForCheck();
      }
    });
  }

  private getServiceId(service: Service): number | string | null {
    if (!service) return null;
    return service.serviceId ?? (service as any).id ?? null;
  }

  toggleService(service: Service): void {
    const id = this.getServiceId(service);
    if (id === null || id === undefined) return;

    const index = this.servicesSelectionnes.findIndex(s => this.getServiceId(s) === id);

    if (index > -1) {
      this.servicesSelectionnes.splice(index, 1);
    } else {
      this.servicesSelectionnes.push(service);
    }

    this.calculerMontantTotal();
    this.cdr.markForCheck();
  }

  isServiceSelected(service: Service): boolean {
    const id = this.getServiceId(service);
    if (id === null || id === undefined) return false;
    return this.servicesSelectionnes.some(s => this.getServiceId(s) === id);
  }

  trackByService = (index: number, service: Service): any => {
    return this.getServiceId(service) ?? index;
  };

  calculerMontantTotal(): void {
    const prixSalle = this.tarificationSelectionnee?.prix ?? 0;
    const totalServices = this.servicesSelectionnes.reduce((sum, s) => sum + (s.prix || 0), 0);
    this.reservationForm.patchValue({ montantTotal: prixSalle + totalServices }, { emitEvent: false });
  }

  get clientsFiltres(): Client[] {
    if (!this.rechercheClientTerme || !this.rechercheClientTerme.trim()) {
      return this.clientsExistants;
    }

    const term = this.rechercheClientTerme.toLowerCase().trim();
    return this.clientsExistants.filter(c => {
      const nom = c.nom ? c.nom.toLowerCase() : '';
      const prenom = c.prenom ? c.prenom.toLowerCase() : '';
      const cin = c.cin ? c.cin.toLowerCase() : '';
      const email = c.email ? c.email.toLowerCase() : '';
      const telephone = c.telephone ? c.telephone.toLowerCase() : '';

      return nom.includes(term) ||
             prenom.includes(term) ||
             cin.includes(term) ||
             email.includes(term) ||
             telephone.includes(term);
    });
  }

  get montantAcompte(): number {
    const total = this.reservationForm.get('montantTotal')?.value || 0;
    return (total * this.tauxAcompte) / 100;
  }

  changerEtape(etape: number): void {
    if (this.etapeCourante === 1 && etape === 2) {
      if (this.modeClient === 'existant' && !this.clientSelectionne) {
        alert('Veuillez sélectionner un client dans la liste.');
        return;
      }
      if (this.modeClient === 'nouveau') {
        if (this.clientForm.invalid) {
          this.clientForm.markAllAsTouched();
          alert('Veuillez corriger les erreurs du formulaire client avant de continuer.');
          return;
        }
      }
    }

    if (this.etapeCourante === 2 && etape === 3) {
      const salle = this.reservationForm.get('salleSelectionnee')?.value;
      const date = this.reservationForm.get('date')?.value;
      const heureDebut = this.reservationForm.get('heureDebut')?.value;
      const heureFin = this.reservationForm.get('heureFin')?.value;

      if (!salle) {
        alert('Veuillez sélectionner une salle.');
        return;
      }
      if (!date) {
        alert('Veuillez renseigner la date de réservation.');
        return;
      }
      if (!this.reservationForm.get('typePeriode')?.value) {
        alert('Veuillez sélectionner un type de période.');
        return;
      }
    }

    if (etape >= 1 && etape <= 4) {
      this.etapeCourante = etape;
      this.cdr.markForCheck();
    }
  }

  soumettreReservation(): void {
    if (this.modeClient === 'nouveau') {
      if (this.clientForm.invalid) {
        this.clientForm.markAllAsTouched();
        return;
      }
      this.clientService.createClient(this.clientForm.value as Client).subscribe({
        next: (createdClient) => this.enregistrerReservation(createdClient),
        error: (err) => {
          console.error('Erreur création client :', err);
          alert('Erreur lors de la création du client. Vérifiez les données saisies.');
        }
      });
    } else {
      if (!this.clientSelectionne) return;
      this.enregistrerReservation(this.clientSelectionne);
    }
  }

  private enregistrerReservation(client: Client): void {
    const resValue = this.reservationForm.value;

    if (!resValue.salleSelectionnee) {
      alert('Veuillez sélectionner une salle.');
      return;
    }

    if (!resValue.date) {
      alert('Veuillez remplir la date de réservation.');
      return;
    }

    if (!resValue.typePeriode) {
      alert('Veuillez sélectionner un type de période avant d’enregistrer.');
      return;
    }

    const reservationToSave = new Reservation(
      undefined,
      `RES-${Date.now().toString().slice(-5)}`,
      resValue.date,
      StatutReservation.EN_ATTENTE,
      resValue.montantTotal || 0,
      client,
      resValue.salleSelectionnee,
      this.servicesSelectionnes,
      resValue.notes,
      undefined,
      this.tarificationSelectionnee,
      undefined,
      [],
      new Date().toISOString(),
      new Date().toISOString(),
      resValue.typePeriode
    );

    reservationToSave.notes = resValue.notes;
    reservationToSave.typePeriode = resValue.typePeriode;

    this.reservationService.createReservation(reservationToSave).subscribe({
      next: () => {
        alert('Réservation enregistrée avec succès !');
        this.router.navigate(['/finalisation']);
      },
      error: (err) => console.error('Erreur lors de la réservation :', err)
    });
  }
}