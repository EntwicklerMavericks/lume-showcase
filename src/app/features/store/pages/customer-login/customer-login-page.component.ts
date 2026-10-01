import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-customer-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customer-login-page.component.html',
  styleUrls: ['./customer-login-page.component.scss']
})
export class CustomerLoginPageComponent implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeTab = signal<'login' | 'register'>('login');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  returnUrl = '/';

  loginEmail = '';
  loginPassword = '';

  registerName = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/conta/pedidos';

    // Se já estiver autenticado como cliente, redireciona para a página desejada
    if (this.authService.isAuthenticated() && this.authService.isCustomer()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  setTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  simulateGoogleLogin(): void {
    this.isLoading.set(true);
    setTimeout(() => {
      this.authService.loginWithGoogle().subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigateByUrl(this.returnUrl);
        }
      });
    }, 600);
  }

  onLogin(): void {
    if (!this.loginEmail || !this.loginPassword) {
      this.errorMessage.set('Preencha seu e-mail e sua senha.');
      return;
    }

    this.isLoading.set(true);
    setTimeout(() => {
      this.authService.login({ email: this.loginEmail, password: this.loginPassword }).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigateByUrl(this.returnUrl);
        }
      });
    }, 500);
  }

  onRegister(): void {
    if (!this.registerName || !this.registerEmail || !this.registerPassword) {
      this.errorMessage.set('Preencha todos os campos obrigatórios.');
      return;
    }

    if (this.registerPassword.length < 6) {
      this.errorMessage.set('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.errorMessage.set('As senhas digitadas não coincidem.');
      return;
    }

    this.isLoading.set(true);
    setTimeout(() => {
      this.authService.register({
        name: this.registerName,
        email: this.registerEmail,
        password: this.registerPassword
      }).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigateByUrl(this.returnUrl);
        }
      });
    }, 500);
  }
}
