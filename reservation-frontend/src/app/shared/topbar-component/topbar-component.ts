import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user-service';
import { EspaceService } from '../../core/services/espace.service';

@Component({
  selector: 'app-topbar-component',
  imports: [CommonModule],
  templateUrl: './topbar-component.html',
  styleUrl: './topbar-component.scss',
})

export class TopbarComponent implements OnInit {
  currentPageTitle: string = 'Vue d’ensemble';
  userName = '—';
  espaceName = '—';
  salleName = '—';
  userInitials = 'AM';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private espaceService: EspaceService
  ) {}

  ngOnInit(): void {
    this.loadAuthenticatedUser();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.activatedRoute.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        if (route.snapshot.data['breadcrumb']) {
          this.currentPageTitle = route.snapshot.data['breadcrumb'];
        }
      });
  }

  private loadAuthenticatedUser(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (user: any) => {
        const firstname = user.firstname ?? user.nom ?? '';
        const lastname = user.lastname ?? user.prenom ?? '';
        this.userName = `${firstname} ${lastname}`.trim() || '—';
        this.userInitials = this.getInitials(this.userName);

        if (user.espace?.nom || user.salle?.nom) {
          this.espaceName = user.espace?.nom ?? '—';
          this.salleName = user.salle?.nom ?? '—';
          return;
        }

        this.espaceService.trouverEspaceParUserId(userId).subscribe({
          next: (espace: any) => {
            this.espaceName = espace.nom ?? '—';
            this.salleName = espace.salles?.[0]?.nom ?? '—';
          },
          error: () => {
            this.espaceName = '—';
            this.salleName = '—';
          }
        });
      },
      error: () => {
        this.userName = 'Utilisateur';
      }
    });
  }

  private getInitials(name: string): string {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) {
      return 'AM';
    }
    return parts.map(p => p[0].toUpperCase()).slice(0, 2).join('');
  }
}