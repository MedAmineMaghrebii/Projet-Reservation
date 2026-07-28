import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../core/models/auth/LoginRequest';
import { AuthResponse } from '../../../core/models/auth/auth-response';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {

  email: string = 'admin@salledusoleil.tn';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(loginForm: NgForm): void {

  this.errorMessage = '';

  if (loginForm.invalid) {

    loginForm.control.markAllAsTouched();

    return;
  }

  const loginRequest = new LoginRequest(
    this.email,
    this.password
  );

  this.authService.login(loginRequest).subscribe({

    next: (response: AuthResponse) => {

      localStorage.setItem(
        'accessToken',
        response.accessToken
      );

      localStorage.setItem(
        'refreshToken',
        response.refreshToken
      );

      localStorage.setItem(
        'userId',
        response.userId.toString()
      );

      localStorage.setItem(
        'email',
        response.email
      );

      localStorage.setItem(
        'role',
        response.role
      );


      this.router.navigate(['/Allreservations']);
    },

    error: (error) => {

      if (error.status === 401) {

        this.errorMessage =
          'Email ou mot de passe incorrect.';

      } else {

        this.errorMessage =
          'Une erreur est survenue. Veuillez réessayer.';
      }
    }
  });
}

  onForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  onCreateAccount(): void {
    this.router.navigate(['/register']);
  }
}