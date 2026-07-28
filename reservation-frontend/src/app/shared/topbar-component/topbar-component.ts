import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-topbar-component',
  imports: [],
  templateUrl: './topbar-component.html',
  styleUrl: './topbar-component.scss',
})

export class TopbarComponent implements OnInit {
  currentPageTitle: string = 'Vue d’ensemble';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
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
}