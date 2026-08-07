import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Service } from '../../../core/models/service/service';
import { ServiceService } from '../../../core/services/service.service';
import { Salle } from '../../../core/models/salle/salle';

export type CategoryFilter = 'Toutes' | 'Formules' | 'Décoration' | 'Technique' | 'Restauration';

export interface ServiceUI extends Service {
  categorie?: CategoryFilter;
  statut?: 'Disponible' | 'Limité' | 'Indisponible';
}

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-component.html',
  styleUrls: ['./service-component.scss']
})
export class ServiceComponent implements OnInit {
  services: ServiceUI[] = [];
  filteredServices: ServiceUI[] = [];
  
  categories: CategoryFilter[] = ['Toutes', 'Formules', 'Décoration', 'Technique', 'Restauration'];
  formCategories: CategoryFilter[] = ['Formules', 'Décoration', 'Technique', 'Restauration'];
  selectedCategory: CategoryFilter = 'Toutes';

  // État de la modale et Formulaire
  isModalOpen = false;
  serviceForm!: FormGroup;

  constructor(
    private serviceService: ServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadServices();
  }

  // Initialisation du Reactive Form avec les champs de la modale
  initForm(): void {
    this.serviceForm = this.fb.group({
      nom: ['', [Validators.required]],
      description: [''],
      prix: [0, [Validators.required, Validators.min(0)]],
      categorie: ['Formules', [Validators.required]],
      statut: ['Disponible', [Validators.required]],
      salleId: [null]
    });
  }

  loadServices(): void {
    this.serviceService.getAllServices().subscribe({
      next: (data) => {
        this.services = data.map((s) => this.enrichServiceData(s));
        this.filterByCategory(this.selectedCategory);
      },
      error: (err) => console.error('Erreur lors du chargement des services:', err)
    });
  }

  filterByCategory(category: CategoryFilter): void {
    this.selectedCategory = category;
    if (category === 'Toutes') {
      this.filteredServices = [...this.services];
    } else {
      this.filteredServices = this.services.filter(s => s.categorie === category);
    }
  }

  // Actions de la Modale
  openModal(): void {
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

  closeModal(): void {
    this.isModalOpen = false;
  }

  // Soumission du formulaire d'ajout
  onSubmit(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const formVal = this.serviceForm.value;

    // Instanciation de la classe Service avec tes attributs
    const newService = new Service(
      undefined,
      formVal.nom,
      formVal.prix,
      formVal.description || '',
      formVal.salleId ? ({ salleId: formVal.salleId } as Salle) : undefined
    );

    this.serviceService.createService(newService).subscribe({
      next: (createdService) => {
        const uiService: ServiceUI = {
          ...createdService,
          categorie: formVal.categorie,
          statut: formVal.statut
        };

        this.services.push(uiService);
        this.filterByCategory(this.selectedCategory);
        this.closeModal();
      },
      error: (err) => console.error('Erreur lors de la création du service:', err)
    });
  }

  deleteService(id?: number): void {
    if (!id) return;
    if (confirm('Voulez-vous vraiment supprimer ce service ?')) {
      this.serviceService.deleteService(id).subscribe({
        next: () => {
          this.services = this.services.filter(s => s.serviceId !== id);
          this.filterByCategory(this.selectedCategory);
        },
        error: (err) => console.error('Erreur lors de la suppression:', err)
      });
    }
  }

  private enrichServiceData(s: Service): ServiceUI {
    let cat: CategoryFilter = 'Formules';
    let status: 'Disponible' | 'Limité' | 'Indisponible' = 'Disponible';

    const nomLower = s.nom?.toLowerCase() || '';
    if (nomLower.includes('décoration') || nomLower.includes('fleur')) cat = 'Décoration';
    else if (nomLower.includes('dj') || nomLower.includes('technique') || nomLower.includes('sonorisation')) cat = 'Technique';
    else if (nomLower.includes('café') || nomLower.includes('buffet') || nomLower.includes('traiteur')) cat = 'Restauration';

    if (nomLower.includes('régie')) status = 'Limité';

    return { ...s, categorie: cat, statut: status };
  }
}