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
import { Toast } from '../../../shared/toast/toast';
import { AlertComponent } from '../../../shared/alert/alert';

@Component({
  selector: 'app-ajouter-reservation',
  standalone: true,
  templateUrl: './ajoute-reservation-component.html',
  styleUrl: './ajoute-reservation-component.scss',
  imports: [CommonModule, ReactiveFormsModule, Toast, AlertComponent],
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

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  alertVisible = false;
  alertTitle = '';
  alertMessage = '';
  alertType: 'danger' | 'warning' | 'info' = 'warning';
  private toastTimer?: ReturnType<typeof setTimeout>;
  private alertAction?: () => void;

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

  selectionnerClient(client: Client): void {
    this.clientSelectionne = client;
    this.showToast(`Client sélectionné : ${client.nom} ${client.prenom}`, 'success');
  }

  onSalleChange(): void {
    this.servicesSelectionnes = [];
    this.servicesDisponibles = [];
    const salle: Salle = this.reservationForm.get('salleSelectionnee')?.value;
    const salleId = salle?.salleId ?? (salle as any)?.id;

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

    const salleId = salle.salleId ?? (salle as any)?.id;
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

  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    this.cdr.markForCheck();

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
      this.cdr.markForCheck();
    }, 2500);
  }

  private showAlert(title: string, message: string, type: 'danger' | 'warning' | 'info' = 'warning', action?: () => void): void {
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;
    this.alertAction = action;
    this.cdr.markForCheck();
  }

  onAlertConfirm(): void {
    const action = this.alertAction;
    this.alertVisible = false;
    this.alertAction = undefined;
    this.cdr.markForCheck();
    action?.();
  }

  onAlertCancel(): void {
    this.alertVisible = false;
    this.alertAction = undefined;
    this.cdr.markForCheck();
  }

  // 🛡️ Vérification des conflits de créneaux avant de passer à l'étape suivante
  private verifierDisponibiliteAvantValidation(callback: () => void): void {
    const salle = this.reservationForm.get('salleSelectionnee')?.value;
    const date = this.reservationForm.get('date')?.value;
    const typePeriode = this.reservationForm.get('typePeriode')?.value;

    const salleId = salle?.salleId ?? salle?.id;

    if (!salleId || !date || !typePeriode) {
      callback();
      return;
    }

    this.reservationService.findByDate(date).subscribe({
      next: (reservations) => {
        const conflit = reservations.find(r => {
          const rSalleId = r.salle?.salleId ?? (r.salle as any)?.id;
          const rPeriode = r.typePeriode || r.tarificationAppliquee?.typePeriode;
          const rStatut = r.statut;

          if (rStatut === StatutReservation.ANNULEE) return false;
          if (rSalleId !== salleId) return false;

          // Règle de chevauchement
          if (rPeriode === typePeriode) return true;
          if (rPeriode === 'JOURNEE') return true;
          if (typePeriode === 'JOURNEE') return true;

          return false;
        });

        if (conflit) {
          this.showAlert(
            'Conflit de réservation',
            `La salle est déjà réservée pour cette date et cette période. Veuillez choisir une autre date ou une autre salle.`,
            'warning'
          );
        } else {
          this.showToast('Étape 2 validée. Vous pouvez poursuivre vers la tarification.', 'success');
          callback(); // Pas de conflit, on avance
        }
      },
      error: (err) => {
        console.error('Erreur lors de la vérification de disponibilité :', err);
        callback(); // En cas de problème réseau, le backend bloquera de toute façon
      }
    });
  }

  changerEtape(etape: number): void {
    if (this.etapeCourante === 1 && etape === 2) {
      if (this.modeClient === 'existant' && !this.clientSelectionne) {
        this.showAlert('Client requis', 'Veuillez sélectionner un client dans la liste avant de continuer.', 'warning');
        return;
      }
      if (this.modeClient === 'nouveau') {
        if (this.clientForm.invalid) {
          this.clientForm.markAllAsTouched();
          this.showAlert('Informations client incomplètes', 'Veuillez corriger les erreurs du formulaire client avant de continuer.', 'warning');
          return;
        }
      }
    }

    if (this.etapeCourante === 2 && etape === 3) {
      const salle = this.reservationForm.get('salleSelectionnee')?.value;
      const date = this.reservationForm.get('date')?.value;
      const typePeriode = this.reservationForm.get('typePeriode')?.value;

      if (!salle) {
        this.showAlert('Salle requise', 'Veuillez sélectionner une salle avant de continuer.', 'warning');
        return;
      }
      if (!date) {
        this.showAlert('Date requise', 'Veuillez renseigner la date de réservation.', 'warning');
        return;
      }
      if (!typePeriode) {
        this.showAlert('Période requise', 'Veuillez sélectionner un type de période.', 'warning');
        return;
      }

      // Vérification avant de passer à l'étape 3
      this.verifierDisponibiliteAvantValidation(() => {
        this.etapeCourante = etape;
        this.cdr.markForCheck();
      });
      return;
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
          this.showToast('Erreur lors de la création du client. Vérifiez les données saisies.', 'error');
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
      this.showAlert('Salle requise', 'Veuillez sélectionner une salle avant d’enregistrer.', 'warning');
      return;
    }

    if (!resValue.date) {
      this.showAlert('Date requise', 'Veuillez remplir la date de réservation.', 'warning');
      return;
    }

    if (!resValue.typePeriode) {
      this.showAlert('Période requise', 'Veuillez sélectionner un type de période avant d’enregistrer.', 'warning');
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
      next: (createdReservation) => {
        this.showToast('Réservation enregistrée avec succès !', 'success');
        setTimeout(() => this.router.navigate(['/finalisation'], { state: { reservation: createdReservation } }), 800);
      },
      error: (err) => {
        console.error('Erreur lors de la réservation :', err);
        this.showToast(err.error?.message || 'Erreur lors de la création de la réservation.', 'error');
      }
    });
  }
}