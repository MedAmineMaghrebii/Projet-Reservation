import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../../core/models/clients/client';
import { Router } from '@angular/router'; 
import { ClientService } from '../../../core/services/client';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-clients', 
  standalone: true,
  imports: [CommonModule, FormsModule],
   templateUrl: './liste-clients-component.html',
  styleUrl: './liste-clients-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ListeClientsComponent implements OnInit {

  clients: Client[] = [];
  filteredClients: any[] = [];
  
  searchTerm: string = '';
  selectedFilter: string = 'Tous';
  activeView: 'list' | 'calendar' = 'list';

  constructor(private clientService: ClientService,
    private router: Router ,
      private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClientsSummary().subscribe({
      next: (data) => {
        this.clients = data;
        this.filterClients();
        console.log(data)
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réservations', err);
      }
    });
  }
  goToAddClient(): void {
    this.router.navigate(['/ajouter-client']); 
  }

  filterClients(): void {
    this.filteredClients = this.clients.filter(res => {
      const clientName = `${res.prenom || ''} ${res.nom || ''}`.toLowerCase();
      
      const matchesSearch = clientName.includes(this.searchTerm.toLowerCase())  
                            

      

      return matchesSearch ;
    });
  }

  deleteclient(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
      this.clientService.deleteClient(id).subscribe(() => {
        this.loadClients();
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