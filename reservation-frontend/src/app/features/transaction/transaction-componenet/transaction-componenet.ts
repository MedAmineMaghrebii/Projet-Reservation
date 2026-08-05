import { ChangeDetectorRef, Component, HostListener, signal } from '@angular/core';
import { ModalComponent, ModalMode } from '../../../shared/modal/modal-component/modal-component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction/transaction-service';
import { Router } from '@angular/router'; 
import * as XLSX from 'xlsx';
import { saveAs }  from 'file-saver';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-componenet',
  imports: [CommonModule, FormsModule,ModalComponent,ReactiveFormsModule],
  templateUrl: './transaction-componenet.html',
  styleUrl: './transaction-componenet.scss',
})
export class TransactionComponenet {

  transactions = signal<any[]>([]);
  users: any[] = [];
  filteredTransactions= signal<any[]>([]);
  //sallesDisponibles = signal<Salle[]>([]);
  
  searchTerm: string = '';
  selectedFilter: string = 'Tous';
  activeView: 'list' | 'calendar' = 'list';
  
  // modal properties
  isDialogOpen = false;

dialogMode: ModalMode = 'view';
activeMenuId = signal<number | string | null>(null);
  activeModal = signal<ModalMode>(null);
  selectedTransaction = signal<any>(null);
  myForm: FormGroup
  addForm : FormGroup

  constructor(private fb : FormBuilder,private transactionService: TransactionService, 
    
    private router: Router ,
      private cdr: ChangeDetectorRef ,
      
  ) {
    

    this.addForm = this.fb.group({
    transactionId : [],
    libelle: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(3)]],
    type: ['', [Validators.required]],
    
    montant: ['', [Validators.required]],
    statut: ['', [Validators.required]],
    dateTransaction: [new Date(), [Validators.required]],
    
  });

  // Initialize your Reactive Form with Validators
  this.myForm = this.fb.group({
   transactionId : [],
    libelle: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(3)]],
    type: ['', [Validators.required]],
    
    montant: ['', [Validators.required]],
    statut: ['', [Validators.required]],
    dateTransaction: ['', [Validators.required]],
    
  });

  }


  ngOnInit(): void {
    this.loadTransactions();
    
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
  openViewModal(transaction: any) {
    this.selectedTransaction.set(transaction);
    console.log(this.selectedTransaction())
     
    
    this.activeModal.set('view');
    this.activeMenuId.set(null);
  }
  
openAddModal(){
  
  this.activeModal.set('add');
}
  openEditModal(transaction: any) {
    this.selectedTransaction.set(transaction);

    this.myForm.patchValue({
      transactionId : transaction.transactionId ?? '',
      libelle: transaction.libelle ?? '',
      description: transaction.description ?? '',
      type: transaction.type ?? '',
      
      dateTransaction: transaction.dateTransaction ?? '',
      montant: transaction.montant ?? '',
      statut: transaction.statut ?? '',
    });

    this.activeModal.set('edit');
    this.activeMenuId.set(null);
  }

  openDeleteModal(transaction: any) {
    this.selectedTransaction.set(transaction);
    this.activeModal.set('delete');
    this.activeMenuId.set(null);
  }

  closeModal() {
    this.activeModal.set(null);
    this.selectedTransaction.set(null);
    this.myForm.reset();
    this.addForm.reset()
  }



  //create USer
  createTransaction() {
  if (this.addForm.invalid) {
    this.addForm.markAllAsTouched();
    return;
  }

  const transaction = {
    libelle: this.addForm.value.libelle,
    description: this.addForm.value.description,
    type: this.addForm.value.type,
    montant: this.addForm.value.montant,
    dateTransaction: this.addForm.value.dateTransaction,
    
    statut: this.addForm.value.statut,
    

    
  };

  this.transactionService.createTransaction(transaction).subscribe({
    next: (response) => {
      console.log("Transaction créée:", response);

      this.closeModal();

      this.addForm.reset();

      // reload your users list if needed
      this.loadTransactions();
    },

    error: (error) => {
      console.error("Erreur création transaction :", error);
    }
  });
}

  // --- Modal Submit Handlers ---
  saveTransactionChanges() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched(); // Trigger error visual cues for invalid fields
      return;
    }

    const updatedData = {
      
      ...this.myForm.value
    };
    console.log(updatedData)

    this.transactionService.updateTransaction(updatedData.transactionId,updatedData).subscribe({
      next: (data) => {
        console.log(data)
        this.loadTransactions();
         
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
  const currentTransaction = this.selectedTransaction();
  const transactionId = currentTransaction?.id || currentTransaction?.transactionId;

  if (!transactionId) {
    console.error('No transaction selected for deletion');
    return;
  }

  this.transactionService.deleteTransaction(transactionId).subscribe({
    next: () => {
      console.log('Transaction deleted successfully');

      // 1. Remove the User from the main data array
      this.filteredTransactions.set(this.filteredTransactions().filter(
        c => (c.id || c.transactionId) !== transactionId
      ));

      // 2. Refresh local filter or trigger change detection if needed
      if (typeof this.filterTransactions === 'function') {
        this.filterTransactions();
      }
      this.cdr.detectChanges();

      // 3. Close modal
      this.closeModal();
    },
    error: (err) => {
      console.error('Error deleting Transaction:', err);
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




  loadTransactions(): void {
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.filterTransactions();
         this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des transactions', err);
      }
    });
  }
  goToAddTransaction(): void {
    this.router.navigate(['/ajouter-transaction']); 
  }

  filterTransactions(): void {
    this.filteredTransactions .set(this.transactions().filter(res => {
      const transactionName = `${res.libelle || ''} ${res.description || ''}`.toLowerCase();
      
      const matchesSearch = transactionName.includes(this.searchTerm.toLowerCase())  
                            

      

      return matchesSearch ;
    })
  );
  }

  deleteTransaction(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette Transaction ?')) {
      this.transactionService.deleteTransaction(id).subscribe(() => {
        this.loadTransactions();
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

  // Classe CSS dynamique pour le badge de statut
  getTypeClass(type: string): string {
    switch (type?.toUpperCase()) {
      
      case 'REVENU':
        return 'badge-confirmed';
      case 'DEPENSE':
        return 'badge-danger';
      
      default:
        return 'badge-default';
    }
  }
}
