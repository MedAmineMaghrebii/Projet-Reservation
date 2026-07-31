import { Component, HostListener, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../../core/models/clients/client';
import { Router } from '@angular/router'; 
import { ClientService } from '../../../core/services/client';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalComponent, ModalMode } from '../../../shared/modal/modal-component/modal-component';



@Component({
  selector: 'app-clients', 
  standalone: true,
  imports: [CommonModule, FormsModule,ModalComponent,ReactiveFormsModule],
   templateUrl: './liste-clients-component.html',
  styleUrl: './liste-clients-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ListeClientsComponent implements OnInit {

  clients: any[] = [];
  filteredClients: any[] = [];
  
  searchTerm: string = '';
  selectedFilter: string = 'Tous';
  activeView: 'list' | 'calendar' = 'list';
  
  // modal properties
  isDialogOpen = false;

dialogMode: ModalMode = 'view';
activeMenuId = signal<number | string | null>(null);
  activeModal = signal<ModalMode>(null);
  selectedClient = signal<any>(null);
  myForm: FormGroup
  // Editable form state
  editForm = {
    prenom: '',
    nom: '',
    cin: '',
    email: '',
    telephone: ''
  };



  constructor(private fb : FormBuilder,private clientService: ClientService,
    private router: Router ,
      private cdr: ChangeDetectorRef 
  ) {
    

  // Initialize your Reactive Form with Validators
  this.myForm = this.fb.group({
    id : [],
    nom: ['', [Validators.required, Validators.minLength(3)]],
    prenom: ['', [Validators.required, Validators.minLength(3)]],
    cin: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]]
  });

  }


  ngOnInit(): void {
    this.loadClients();
  }



  // Toggle dropdown menu
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
  openViewModal(client: any) {
    this.selectedClient.set(client);
    this.activeModal.set('view');
    this.activeMenuId.set(null);
  }

  openEditModal(client: any) {
    this.selectedClient.set(client);

    this.myForm.patchValue({
      id : client.clientId ?? '',
      nom: client.nom ?? '',
      prenom: client.prenom ?? '',
      cin: client.cin ?? '',
      email: client.email ?? '',
      telephone: client.telephone ?? ''
    });

    this.activeModal.set('edit');
    this.activeMenuId.set(null);
  }

  openDeleteModal(client: any) {
    this.selectedClient.set(client);
    this.activeModal.set('delete');
    this.activeMenuId.set(null);
  }

  closeModal() {
    this.activeModal.set(null);
    this.selectedClient.set(null);
    this.myForm.reset();
  }

  // --- Modal Submit Handlers ---
  saveClientChanges() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched(); // Trigger error visual cues for invalid fields
      return;
    }

    const updatedData = {
      
      ...this.myForm.value
    };
    console.log(updatedData)

    this.clientService.updateClient(updatedData.id,updatedData).subscribe({
      next: (data) => {
        console.log(data)
        this.filterClients();
         this.cdr.detectChanges();
         this.closeModal();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réservations', err);
      }
    });
   
    
    // Call service to save changes here...
    
    this.closeModal();
  }

 confirmDelete() {
  const currentClient = this.selectedClient();
  const clientId = currentClient?.id || currentClient?.clientId;

  if (!clientId) {
    console.error('No client selected for deletion');
    return;
  }

  this.clientService.deleteClient(clientId).subscribe({
    next: () => {
      console.log('Client deleted successfully');

      // 1. Remove the client from the main data array
      this.filteredClients = this.filteredClients.filter(
        c => (c.id || c.clientId) !== clientId
      );

      // 2. Refresh local filter or trigger change detection if needed
      if (typeof this.filterClients === 'function') {
        this.filterClients();
      }
      this.cdr.detectChanges();

      // 3. Close modal
      this.closeModal();
    },
    error: (err) => {
      console.error('Error deleting client:', err);
    }
  });
}

//modal functions
 /* openModal(client: any): void {
    
  this.selectedClient = client;
  this.dialogMode = 'view';
  this.isDialogOpen = true;
  console.log(client, this.isDialogOpen)
}*/




  loadClients(): void {
    this.clientService.getAllClientsSummary().subscribe({
      next: (data) => {
        this.clients = data;
        this.filterClients();
         this.cdr.detectChanges();
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