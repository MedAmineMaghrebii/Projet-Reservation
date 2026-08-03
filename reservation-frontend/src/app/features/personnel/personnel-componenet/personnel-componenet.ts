
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

@Component({
  selector: 'app-personnel-componenet',
  imports: [CommonModule, FormsModule,ModalComponent,ReactiveFormsModule],
  templateUrl: './personnel-componenet.html',
  styleUrl: './personnel-componenet.scss',
})
export class PersonnelComponenet {
reservations = signal<Reservation[]>([]);
  users: any[] = [];
  filteredUsers: any[] = [];
  sallesDisponibles = signal<any>([]);
  
  searchTerm: string = '';
  selectedFilter: string = 'Tous';
  activeView: 'list' | 'calendar' = 'list';
  
  // modal properties
  isDialogOpen = false;

dialogMode: ModalMode = 'view';
activeMenuId = signal<number | string | null>(null);
  activeModal = signal<ModalMode>(null);
  selectedUser = signal<any>(null);
  myForm: FormGroup
  addForm : FormGroup

  constructor(private fb : FormBuilder,private userService: UserService, 
    private reservationService : ReservationService,
    private router: Router ,
      private cdr: ChangeDetectorRef ,
      private salleService : SalleService
  ) {
    

    this.addForm = this.fb.group({
    userId : [],
    lastname: ['', [Validators.required, Validators.minLength(3)]],
    firstname: ['', [Validators.required, Validators.minLength(3)]],
    post: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    statut: ['', [Validators.required]],
    hashPassword: ['', [Validators.required, Validators.minLength(8)]],
    salle: [null, Validators.required],
  });

  // Initialize your Reactive Form with Validators
  this.myForm = this.fb.group({
    userId : [],
    lastname: ['', [Validators.required, Validators.minLength(3)]],
    firstname: ['', [Validators.required, Validators.minLength(3)]],
    post: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    statut: ['', [Validators.required]],
    
  });

  }


  ngOnInit(): void {
    this.loadUsers();
  }


loadSalles(): void {
    this.salleService.getAllSalles().subscribe({
      next: (data) => {
        this.sallesDisponibles().set(data || []);
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
  openViewModal(user: User) {
    this.selectedUser.set(user);
    console.log(this.selectedUser())
     
    
    this.activeModal.set('view');
    this.activeMenuId.set(null);
  }
  
openAddModal(){
  this.activeModal.set('add')
}
  openEditModal(user: any) {
    this.selectedUser.set(user);

    this.myForm.patchValue({
      userId : user.userId ?? '',
      lastname: user.lastname ?? '',
      firstname: user.firstname ?? '',
      post: user.post ?? '',
      email: user.email ?? '',
      telephone: user.telephone ?? '',
      statut: user.statut ?? '',
    });

    this.activeModal.set('edit');
    this.activeMenuId.set(null);
  }

  openDeleteModal(User: any) {
    this.selectedUser.set(User);
    this.activeModal.set('delete');
    this.activeMenuId.set(null);
  }

  closeModal() {
    this.activeModal.set(null);
    this.selectedUser.set(null);
    this.myForm.reset();
    this.addForm.reset()
  }



  //create USer
  createUser() {
  if (this.addForm.invalid) {
    this.addForm.markAllAsTouched();
    return;
  }

  const user = {
    firstname: this.addForm.value.firstname,
    lastname: this.addForm.value.lastname,
    email: this.addForm.value.email,
    telephone: this.addForm.value.telephone,
    post: this.addForm.value.post,
    statut: this.addForm.value.statut,
    hashPassword: this.addForm.value.hashPassword,

    // if backend expects the whole object
    salle: this.addForm.value.salle
  };

  this.userService.createUser(user).subscribe({
    next: (response) => {
      console.log("Utilisateur créé :", response);

      this.closeModal();

      this.addForm.reset();

      // reload your users list if needed
      this.loadUsers();
    },

    error: (error) => {
      console.error("Erreur création utilisateur :", error);
    }
  });
}

  // --- Modal Submit Handlers ---
  saveUserChanges() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched(); // Trigger error visual cues for invalid fields
      return;
    }

    const updatedData = {
      
      ...this.myForm.value
    };
    console.log(updatedData)

    this.userService.updateUser(updatedData.userId,updatedData).subscribe({
      next: (data) => {
        console.log(data)
        this.loadUsers();
         
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
  const currentUser = this.selectedUser();
  const UserId = currentUser?.id || currentUser?.UserId;

  if (!UserId) {
    console.error('No User selected for deletion');
    return;
  }

  this.userService.deleteUser(UserId).subscribe({
    next: () => {
      console.log('User deleted successfully');

      // 1. Remove the User from the main data array
      this.filteredUsers = this.filteredUsers.filter(
        c => (c.id || c.UserId) !== UserId
      );

      // 2. Refresh local filter or trigger change detection if needed
      if (typeof this.filterUsers === 'function') {
        this.filterUsers();
      }
      this.cdr.detectChanges();

      // 3. Close modal
      this.closeModal();
    },
    error: (err) => {
      console.error('Error deleting User:', err);
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




  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filterUsers();
         this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des users', err);
      }
    });
  }
  goToAddUser(): void {
    this.router.navigate(['/ajouter-User']); 
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(res => {
      const UserName = `${res.firstname || ''} ${res.lastname || ''}`.toLowerCase();
      
      const matchesSearch = UserName.includes(this.searchTerm.toLowerCase())  
                            

      

      return matchesSearch ;
    });
  }

  deleteUser(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce Personnel ?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers();
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
