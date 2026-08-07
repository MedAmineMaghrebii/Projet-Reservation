
import { Component, HostListener, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/models/user/user';
import { Router } from '@angular/router'; 
import { UserService } from '../../../core/services/user-service';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalComponent, ModalMode } from '../../../shared/modal/modal-component/modal-component';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../core/models/reservations/reservation';
import { SalleService } from '../../../core/services/salle.service';
import { Salle } from '../../../core/models/salle/salle';
import * as XLSX from 'xlsx';
import { saveAs }  from 'file-saver';
import { Toast } from '../../../shared/toast/toast';

@Component({
  selector: 'app-salle-componenet',
  imports: [CommonModule, FormsModule,ModalComponent,ReactiveFormsModule,Toast],
  templateUrl: './salle-component.html',
  styleUrl: './salle-component.scss',
})
export class SalleComponenet {


  //Toast vars
  toastVisible = signal(false);
  toastMessage = signal('');
  toastType= signal<'success' | 'error'>('success');
  private toastTimer?: ReturnType<typeof setTimeout>;
  //
reservations = signal<Reservation[]>([]);
  salles= signal<any[]>([]);
  filteredSalles= signal<any[]>([]);
  sallesDisponibles = signal<Salle[]>([]);
  
  searchTerm= signal<string>('');
  selectedFilter: string = 'Tous';
  activeView: 'list' | 'calendar' = 'list';
  
  // modal properties
  isDialogOpen = false;

dialogMode: ModalMode = 'view';
activeMenuId = signal<number | string | null>(null);
  activeModal = signal<ModalMode>(null);
  selectedSalle = signal<any>(null);
  myForm: FormGroup
  addForm : FormGroup

  constructor(private fb : FormBuilder,private userService: UserService, 
    private reservationService : ReservationService,
    private router: Router ,
      private cdr: ChangeDetectorRef ,
      private salleService : SalleService
  ) {
    

   // Form for adding a salle
this.addForm = this.fb.group({
  salleId: [],
  nom: ['', [Validators.required,Validators.minLength(3)]],
  capaciteMax: [null, [Validators.required, Validators.min(1)]],
  description: ['', [Validators.maxLength(500)]],
  adresse: [''],
  ville: [''],
  telephone: ['', [Validators.pattern('^[0-9]{8}$')]],
  email: ['', [ Validators.email]],
  espace: [null] // or Validators.required if every salle must belong to an espace
});

  // Initialize your Reactive Form with Validators
  this.myForm = this.fb.group({
     salleId: [],
    nom: ['', [Validators.required,Validators.minLength(3)]],
    capaciteMax: [null, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.maxLength(500)]],
    adresse: [''],
    ville: [''],
    telephone: ['', [Validators.pattern('^[0-9]{8}$')]],
    email: ['', [ Validators.email]],
    espace: [null] // or Validators.required if every salle must belong to an espace
    
    });

  }


  ngOnInit(): void {
    this.loadSalles();
    
  }



//test excel
private saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], {
    type:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });
  saveAs(data, `${fileName}_${new Date().getDate()}_${new Date().getMonth()+1}_${new Date().getFullYear()}_${new Date().getHours()}_${new Date().getMinutes()}.xlsx`);
}
exportTable(): void {
 
  const tableElement = document.getElementById('exportTable')!;
  const rows = tableElement.querySelectorAll('tr:not(.noExport)');
  
  
  if (rows.length <= 1) { 
    alert('Table vide. Ne peut pas export.');
    return;
  }
  
  const clonedTable = tableElement.cloneNode(true) as HTMLElement;
 
  clonedTable.querySelectorAll('.noExport').forEach((el) => el.remove());
  
  const worksheet = XLSX.utils.table_to_sheet(clonedTable);
  const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, 'dom_table_export');
}


//toast 
private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.toastVisible .set(true);
    

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toastVisible.set(false);
      
    }, 2500);
  }


// Espaces
loadEspaces(): void {
    this.salleService.getAllSalles().subscribe({
      next: (data) => {
        this.filteredSalles.set(data);
        console.log("data", data);
        console.log("salles", this.sallesDisponibles())
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur lors du chargement des salles :', err)
    });
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
  openViewModal(salle: Salle) {
    this.selectedSalle.set(salle);
    console.log(this.selectedSalle())
     
    
    this.activeModal.set('view');
    this.activeMenuId.set(null);
  }
  
openAddModal(){
  this.loadSalles();
  this.activeModal.set('add');
}
  openEditModal(salle: any) {
    this.selectedSalle.set(salle);

    this.myForm.patchValue({
      salleId: salle.salleId ?? '',
      nom: salle.nom ?? '',
      capaciteMax: salle.capaciteMax ?? null,
      description: salle.description ?? '',
      adresse: salle.adresse ?? '',
      ville: salle.ville ?? '',
      telephone: salle.telephone ?? '',
      email: salle.email ?? '',
      espace: salle.espace ?? null,
    });

    this.activeModal.set('edit');
    this.activeMenuId.set(null);
  }

  openDeleteModal(Salle: any) {
    this.selectedSalle.set(Salle);
    this.activeModal.set('delete');
    this.activeMenuId.set(null);
  }

  closeModal() {
    this.activeModal.set(null);
    this.selectedSalle.set(null);
    this.myForm.reset();
    this.addForm.reset()
  }



  //create Salle
  createSalle() {
  if (this.addForm.invalid) {
    this.addForm.markAllAsTouched();
    return;
  }

  const salle = {
  nom: this.addForm.value.nom,
  capaciteMax: this.addForm.value.capaciteMax,
  description: this.addForm.value.description,
  adresse: this.addForm.value.adresse,
  ville: this.addForm.value.ville,
  telephone: this.addForm.value.telephone,
  email: this.addForm.value.email,

  // if backend expects the whole Espace object
  espace: this.addForm.value.espace,
  tarifications: [],
  services: []
};

  this.salleService.createSalle(salle).subscribe({
    next: (response) => {
      this.showToast(response.message,'success')

      this.closeModal();

      this.addForm.reset();

      // reload your users list if needed
      this.loadSalles();
    },

    error: (error) => {
      console.error("Erreur création salle :", error);
      this.showToast(error.error.message,'error')
    }
  });
}

  // --- Modal Submit Handlers ---
  saveSalleChanges() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched(); // Trigger error visual cues for invalid fields
      return;
    }

    const updatedData = {
      
      ...this.myForm.value
    };
    //console.log(updatedData)

    this.salleService.updateSalle(updatedData.salleId,updatedData).subscribe({
      next: (response) => {
        console.log(response)
        this.showToast(response.message,'success')
        this.loadSalles();
         
         this.closeModal();
      },
      error: (err) => {
        this.showToast(err.error.message,'error')
        console.error('Erreur lors du chargement des réservations', err);
      }
    });
   
    
    // Call service to save changes here...
    
    this.closeModal();
  }

 confirmDelete() {
  const currentSalle = this.selectedSalle();
  const salleId = currentSalle?.id || currentSalle?.salleId;

  if (!salleId) {
    console.error('No Salle selected for deletion');
    return;
  }

  this.salleService.deleteSalle(salleId).subscribe({
    next: (res) => {
      console.log('User deleted successfully');
      this.showToast(res.message,'success')

      // 1. Remove the salle from the main data array
      this.filteredSalles.set(this.filteredSalles().filter(
        c => (c.id || c.salleId) !== salleId
      )
    );

      // 2. Refresh local filter or trigger change detection if needed
      if (typeof this.filterSalles === 'function') {
        this.filterSalles();
      }
      this.loadSalles()
     

      // 3. Close modal
      this.closeModal();
    },
    error: (err) => {
      console.error('Error deleting Salle:', err);
      this.showToast(err.error.message,'error')
    }
  });
}

//modal functions
 /* openModal(User: any): void {
    
  this.selectedUser = User;
  this.dialogMode = 'view';
  this.isDialogOpen = true;
  console.log(User, this.isDialogOpen)
}*/




  loadSalles(): void {
    this.salleService.getAllSalles().subscribe({
      next: (data) => {
        this.salles.set(data);
        this.filterSalles();
         this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des users', err);
      }
    });
  }
 

  filterSalles(): void {
    this.filteredSalles.set (this.salles().filter(res => {
      const UserName = `${res.firstname || ''} ${res.lastname || ''}`.toLowerCase();
      
      const matchesSearch = UserName.includes(this.searchTerm().toLowerCase())  
                            

      

      return matchesSearch ;
    }));
  }

  deleteSalle(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce Personnel ?')) {
      this.salleService.deleteSalle(id).subscribe({
      next: (response) => {
        this.showToast(response.message,'success')
        this.filterSalles();
         
      },
      error: (err) => {
        console.error('Erreur lors du chargement des users', err);
        this.showToast(err.error.message,'error')
      }
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
      
      case 'ACTIF':
        return 'badge-confirmed';
      case 'EN_CONGE':
        return 'badge-pending';
      
      default:
        return 'badge-default';
    }
  }
}
