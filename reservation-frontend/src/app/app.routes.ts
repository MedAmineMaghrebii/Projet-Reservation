import { Routes } from '@angular/router';
import { LoginComponent } from './features/Auth/login-component/login-component';
import { ListeReservationComponent } from './features/Reservation/liste-reservation-component/liste-reservation-component';
import { AjouterReservationComponent } from './features/Reservation/ajoute-reservation-component/ajoute-reservation-component';
import { SidebarComponent } from './shared/main-layout-component/main-layout-component';
import { FinalisationComponent } from './features/finalisation-component/finalisation-component';
import { ListeClientsComponent } from './features/clients/liste-clients-component/liste-clients-component';
import { PersonnelComponenet } from './features/personnel/personnel-componenet/personnel-componenet';
import { TransactionComponenet } from './features/transaction/transaction-componenet/transaction-componenet';
import { SalleComponenet } from './features/salle/salle-component/salle-component';
import { ServiceComponent } from './features/Service/service-component/service-component';

export const routes: Routes = [
  // Page de connexion (hors layout, sans la sidebar)
  {
    path: 'login',
    component: LoginComponent
  },

  // Routes de l'application (AVEC la sidebar via MainLayoutComponent)
  {
    path: '',
    component:SidebarComponent,
    children: [
      {
        path: 'all-reservations',
        component: ListeReservationComponent
      },
      {
        path: 'ajouter-reservation',
        component: AjouterReservationComponent
      },
      {
        path: 'service',
        component: ServiceComponent
      },
       {
        path: 'finalisation',
        component: FinalisationComponent
      },
      {
        path: 'clients',
        component: ListeClientsComponent
      },
        {
        path: 'personnel',
        component: PersonnelComponenet
      },
        {
        path: 'finances',
        component: TransactionComponenet
      },
       {
        path: 'salle',
        component: SalleComponenet
      },
      {
        path: '',
        redirectTo: 'all-reservations',
        pathMatch: 'full'
      }
    ]
  },

  // Catch-all : Redirection si la route n'existe pas (toujours en DERNIER)
  /*{
    path: '**',
    redirectTo: 'login'
  }*/
];