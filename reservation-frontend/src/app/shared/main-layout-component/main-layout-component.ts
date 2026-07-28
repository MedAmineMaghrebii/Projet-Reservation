import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TopbarComponent } from "../topbar-component/topbar-component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './main-layout-component.html',
  styleUrl: './main-layout-component.scss',
  imports: [
    CommonModule,
    RouterOutlet, // 👈 Indispensable pour afficher les composants enfants !
    RouterLink,
    RouterLinkActive,
    TopbarComponent
],
})
export class SidebarComponent {

  constructor(private router: Router) {}

  onLogout(): void {
    // Vider la session / localstorage
    localStorage.clear();
    
    // Rediriger vers la page de login
    this.router.navigate(['/login']);
  }
}