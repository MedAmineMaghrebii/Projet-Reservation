import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Client } from '../../../core/models/clients/client';
import { Salle } from '../../../core/models/salle/salle';
import { Reservation } from '../../../core/models/reservations/reservation';
import { StatutReservation } from '../../../core/models/reservations/statut-reservation.enum';
import { Service } from '../../../core/models/service/service';

import { ReservationService } from '../../../core/services/reservation.service';
import { ClientService } from '../../../core/services/client';
import { ServiceService } from '../../../core/services/service.service';
import { SalleService } from '../../../core/services/salle.service';

@Component({
  selector: 'app-ajouter-reservation',
  standalone: true,
  templateUrl: './ajoute-reservation-component.html',
  styleUrl: './ajoute-reservation-component.scss',
  imports: [CommonModule, FormsModule],
})
export class AjouterReservationComponent implements OnInit {

  etapeCourante: number = 1;
  modeClient: 'existant' | 'nouveau' = 'existant';

  // Données
  clientsExistants: Client[] = [];
  sallesDisponibles: Salle[] = [];
  servicesDisponibles: Service[] = [];
  servicesSelectionnes: Service[] = [];
  rechercheClientTerme: string = '';

  // Formulaires
  clientSelectionne?: Client;
  salleSelectionnee?: Salle;

  nouveauClient: Partial<Client> = {
    nom: '',
    prenom: '',
    cin: '',
    telephone: '',
    email: '',
    adresse: ''
  };

  nouvelleReservation: Partial<Reservation> = {
    date: '',
    heureDebut: '',
    heureFin: '',
    montantTotal: 0,
    notes: '',
    statut: StatutReservation.EN_ATTENTE
  };

  tauxAcompte: number = 30;

  constructor(
    private reservationService: ReservationService,
    private clientService: ClientService,
    private salleService: SalleService,
    private serviceService: ServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadSalles();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => this.clientsExistants = data,
      error: (err) => console.error('Erreur lors du chargement des clients :', err)
    });
  }

loadSalles(): void {
  this.salleService.getAllSalles().subscribe({
    next: (data) => {
      this.sallesDisponibles = data;
      
      // Si au moins une salle existe et aucune n'est sélectionnée
      if (this.sallesDisponibles.length > 0 && !this.salleSelectionnee) {
        // Pré-sélectionner la première salle
        this.salleSelectionnee = this.sallesDisponibles[0];
        // Charger ses services immédiatement !
        this.onSalleChange(this.salleSelectionnee);
      }
    },
    error: (err) => console.error('Erreur lors du chargement des salles :', err)
  });
}// Dans le fichier .ts
compareSalles(s1: Salle, s2: Salle): boolean {
  if (!s1 || !s2) return false;
  const id1 = s1.salleId ?? (s1 as any).id;
  const id2 = s2.salleId ?? (s2 as any).id;
  return id1 === id2;
}

  // Déclenché à la sélection d'une salle
  // Remplacez votre méthode onSalleChange par celle-ci :
onSalleChange(salle?: Salle): void {
  // Réinitialise la sélection actuelle
  this.servicesSelectionnes = [];
  this.servicesDisponibles = [];

  // Utilise la salle passée en paramètre ou salleSelectionnee
  const targetSalle = salle || this.salleSelectionnee;

  if (!targetSalle) {
    return;
  }

  // Extrait l'ID quelle que soit sa structure (salleId ou id)
  const salleId = targetSalle.salleId ?? (targetSalle as any).id;

  if (!salleId) {
    console.warn('Aucun ID trouvé pour la salle sélectionnée :', targetSalle);
    return;
  }

  console.log('Chargement des services pour la salle ID :', salleId);

  this.serviceService.getServicesBySalleId(salleId).subscribe({
    next: (data) => {
      console.log('Services reçus :', data);
      // Assure que data est bien un tableau
      this.servicesDisponibles = Array.isArray(data) ? data : [];
    },
    error: (err) => {
      console.error('Erreur lors du chargement des services :', err);
      this.servicesDisponibles = [];
    }
  });
}

  // Récupère l'ID unique du service (gère 'serviceId' ou 'id')
  private getServiceId(service: Service): number | string | null {
    if (!service) return null;
    return service.serviceId ?? (service as any).id ?? null;
  }

  // Basculer la sélection (permet de sélectionner / désélectionner plusieurs services)
  toggleService(service: Service): void {
    const id = this.getServiceId(service);
    if (id === null || id === undefined) return;

    const index = this.servicesSelectionnes.findIndex(
      s => this.getServiceId(s) === id
    );

    if (index > -1) {
      // Si déjà sélectionné, on le retire
      this.servicesSelectionnes.splice(index, 1);
    } else {
      // Sinon, on l'ajoute à la liste des services sélectionnés
      this.servicesSelectionnes.push(service);
    }
    this.calculerMontantTotal();
  }

  // Vérifie si un service donné est sélectionné
  isServiceSelected(service: Service): boolean {
    const id = this.getServiceId(service);
    if (id === null || id === undefined) return false;

    return this.servicesSelectionnes.some(
      s => this.getServiceId(s) === id
    );
  }

  // Permet à Angular d'identifier chaque carte de manière unique
 trackByService = (index: number, service: Service): any => {
  return this.getServiceId(service) ?? index;
};

  calculerMontantTotal(): void {
    const totalServices = this.servicesSelectionnes.reduce((sum, s) => sum + (s.prix || 0), 0);
    this.nouvelleReservation.montantTotal = totalServices;
  }

  get clientsFiltres(): Client[] {
    if (!this.rechercheClientTerme) return this.clientsExistants;
    const term = this.rechercheClientTerme.toLowerCase();
    return this.clientsExistants.filter(c => 
      c.nom.toLowerCase().includes(term) || 
      c.prenom.toLowerCase().includes(term) || 
      c.cin.includes(term)
    );
  }

  get montantAcompte(): number {
    return ((this.nouvelleReservation.montantTotal || 0) * this.tauxAcompte) / 100;
  }

  changerEtape(etape: number): void {
    if (this.etapeCourante === 1 && etape === 2) {
      if (this.modeClient === 'existant' && !this.clientSelectionne) {
        alert('Veuillez sélectionner un client dans la liste.');
        return;
      }
      if (this.modeClient === 'nouveau') {
        if (!this.nouveauClient.nom || !this.nouveauClient.prenom || !this.nouveauClient.cin) {
          alert('Veuillez remplir au moins le NOM, PRÉNOM et CIN du nouveau client.');
          return;
        }
      }
    }

    if (this.etapeCourante === 2 && etape === 3) {
      if (!this.salleSelectionnee) {
        alert('Veuillez sélectionner une salle.');
        return;
      }
    }

    if (etape >= 1 && etape <= 4) {
      this.etapeCourante = etape;
    }
  }

  soumettreReservation(): void {
    if (this.modeClient === 'nouveau') {
      this.clientService.createClient(this.nouveauClient as Client).subscribe({
        next: (createdClient) => this.enregistrerReservation(createdClient),
        error: (err) => console.error('Erreur création client :', err)
      });
    } else {
      if (!this.clientSelectionne) return;
      this.enregistrerReservation(this.clientSelectionne);
    }
  }

  private enregistrerReservation(client: Client): void {
    if (!this.salleSelectionnee) return;

    const reservationToSave = new Reservation(
      0,
      `RES-${Date.now().toString().slice(-5)}`,
      this.nouvelleReservation.date!,
      this.nouvelleReservation.heureDebut!,
      this.nouvelleReservation.heureFin!,
      StatutReservation.EN_ATTENTE,
      this.nouvelleReservation.montantTotal || 0,
      client,
      this.salleSelectionnee
    );

    reservationToSave.notes = this.nouvelleReservation.notes;

    this.reservationService.createReservation(reservationToSave).subscribe({
      next: () => {
        alert('Réservation enregistrée avec succès !');
        this.router.navigate(['/reservations']);
      },
      error: (err) => console.error('Erreur lors de la réservation :', err)
    });
  }
}