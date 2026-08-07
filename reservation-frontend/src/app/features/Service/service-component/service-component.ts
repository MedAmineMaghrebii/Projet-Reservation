import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Service } from '../../../core/models/service/service';
import { ServiceService } from '../../../core/services/service.service';
import { Salle } from '../../../core/models/salle/salle';
import { SalleService } from '../../../core/services/salle.service';
import { Toast } from '../../../shared/toast/toast';
import { EnumLabelPipe } from '../../../shared/enumLabel/enum-label-pipe';

export type CategoryFilter = 'Toutes' | 'FORMULES' | 'DECORATION' | 'TECHNIQUE' | 'RESTAURATION'
|'ANIMATION' |  'PHOTOGRAPHIE' |'AUTRE';



@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,Toast,EnumLabelPipe],
  templateUrl: './service-component.html',
  styleUrls: ['./service-component.scss']
})
export class ServiceComponent implements OnInit {
  services= signal<Service[]>([]);
  selectedService= signal<any>(null);
  salles= signal<Salle[]>([]);
  filteredServices= signal<Service[]>([]);
  
  categories: CategoryFilter[] = ['Toutes', 'FORMULES', 'DECORATION', 'TECHNIQUE', 'RESTAURATION'];
  formCategories: CategoryFilter[] = ['FORMULES','TECHNIQUE','DECORATION', 'RESTAURATION',
    'ANIMATION', 'PHOTOGRAPHIE','AUTRE'];
  selectedCategory: CategoryFilter = 'Toutes';

  // État de la modale et Formulaire
  isModalOpen = false;
  showEditModal= false;
  serviceForm!: FormGroup;
  editForm!: FormGroup;


  
  //Toast vars
  toastVisible = signal(false);
  toastMessage = signal('');
  toastType= signal<'success' | 'error'>('success');
  private toastTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private serviceService: ServiceService,
    private fb: FormBuilder,
    private salleService : SalleService
  ) {


    this.editForm = this.fb.group({
      serviceId : [],
      nom: ['', [Validators.required]],
      description: [''],
      prix: ['', [Validators.required, Validators.min(0)]],
      categorie: ['', [Validators.required]],
      statut: ['', [Validators.required]],
      salleId: [null,[Validators.required]]
    });
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
    this.loadServices();
  }



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
  // Initialisation du Reactive Form avec les champs de la modale
  initForm(): void {
    this.serviceForm = this.fb.group({
      nom: ['', [Validators.required]],
      description: [''],
      prix: ['', [Validators.required, Validators.min(0)]],
      categorie: ['', [Validators.required]],
      statut: ['', [Validators.required]],
      salleId: [null,[Validators.required]]
    });
  }

  loadServices(): void {
    this.serviceService.getAllServices().subscribe({
      next: (data) => {
        this.services.set(data)
        this.filterByCategory(this.selectedCategory);
      },
      error: (err) => console.error('Erreur lors du chargement des services:', err)
    });
  }

  filterByCategory(category: CategoryFilter): void {
    this.selectedCategory = category;
    if (category === 'Toutes') {
      this.filteredServices.set([...this.services()]);
    } else {
      this.filteredServices.set(this.services().filter(s => s.categorie === category));
    }
  }

  // Actions de la Modale
  openModal(): void {
    this.loadSalles()
    this.serviceForm.reset({
      nom: '',
      description: '',
      prix: 0,
      categorie: 'Formules',
      statut: 'Disponible',
      salleId: null
    });
    this.isModalOpen = true;
  }

  openEditModal(service: Service): void {
    this.loadSalles()
    console.log('Edit clicked', service);
  this.selectedService.set(service);

  this.editForm.patchValue({
    serviceId : service.serviceId,
    nom: service.nom,
    description: service.description,
    prix: service.prix,
    categorie: service.categorie,
    statut: service.statut,
    salleId: service.salle?.salleId
  });

  this.showEditModal = true;
}

  closeModal(): void {
    this.isModalOpen = false;
    this.showEditModal = false;
    this.salles.set([]);
    this.selectedService.set(null)
  }


   loadSalles(): void {
    this.salleService.getAllSalles().subscribe({
      next: (data) => {
        this.salles.set(data);
        
         
      },
      error: (err) => {
        console.error('Erreur lors du chargement des users', err);
      }
    });
  }



  updateService(): void {
  if (this.editForm.invalid || !this.selectedService) {
    this.editForm.markAllAsTouched();
    return;
  }

  const service: Service = {
    serviceId : this.selectedService().serviceId,
    nom: this.editForm.value.nom,
    description: this.editForm.value.description,
    prix: this.editForm.value.prix,
    categorie: this.editForm.value.categorie,
    statut: this.editForm.value.statut,
    salle :{salleId: this.editForm.value.salleId} as Salle
  };
  console.log(service)

  this.serviceService
    .updateService(this.selectedService().serviceId!, service)
    .subscribe({
      next: (response) => {
        this.showToast(response.message,'success');
        this.loadServices();
        this.closeModal();
      },
      error: (err) => {
        this.showToast(err.error.message,'error');
        
      }
    });
}

  // Soumission du formulaire d'ajout
  onSubmit(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const formVal = this.serviceForm.value;

    // Instanciation de la classe Service avec tes attributs
    const newService: Service = {
    nom: formVal.nom,
    description: formVal.description || '',
    prix: formVal.prix,
    categorie: formVal.categorie,
    statut: formVal.statut,
    salle: { salleId: formVal.salleId} as Salle
  };
    console.log(newService)

    this.serviceService.createService(newService).subscribe({
      next: (response) => {
        
        this.showToast(response.message,'success')
        this.services().push(response.data);
        this.filterByCategory(this.selectedCategory);
        this.closeModal();
      },
      error: (err) => this.showToast(err.error.message,'error')
    });
  }

  deleteService(id?: number): void {
    if (!id) return;
    if (confirm('Voulez-vous vraiment supprimer ce service ?')) {
      this.serviceService.deleteService(id).subscribe({
        next: () => {
          this.services.set(this.services().filter(s => s.serviceId !== id));
          this.filterByCategory(this.selectedCategory);
        },
        error: (err) => console.error('Erreur lors de la suppression:', err)
      });
    }
  }
/*
  private enrichServiceData(s: Service): Service {
    let cat: CategoryFilter = 'Formules';
    let status: 'Disponible' | 'Limité' | 'Indisponible' = 'Disponible';

    const nomLower = s.nom?.toLowerCase() || '';
    if (nomLower.includes('décoration') || nomLower.includes('fleur')) cat = 'Décoration';
    else if (nomLower.includes('dj') || nomLower.includes('technique') || nomLower.includes('sonorisation')) cat = 'Technique';
    else if (nomLower.includes('café') || nomLower.includes('buffet') || nomLower.includes('traiteur')) cat = 'Restauration';

    if (nomLower.includes('régie')) status = 'Limité';

    return { ...s, categorie: cat, statut: status };
  }*/
}