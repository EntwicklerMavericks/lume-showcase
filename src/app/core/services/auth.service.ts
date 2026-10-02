import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../models/auth.models';

const DEMO_ADMIN: User = {
  id: 'usr-admin-demo',
  name: 'Vendedor Lume',
  email: 'admin@lumestore.com.br',
  role: 'ADMIN',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
};

const DEMO_CUSTOMER: User = {
  id: 'usr-customer-demo',
  name: 'Ana Carolina Santos',
  email: 'ana.santos@email.com',
  role: 'CUSTOMER',
  phone: '(11) 98765-4321',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
};

const TOKEN_KEY = 'lume_showcase_token';
const USER_KEY = 'lume_showcase_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  public currentUser = signal<User | null>(DEMO_CUSTOMER);
  public token = signal<string | null>('demo_jwt_token_customer');
  public isAuth = signal<boolean>(true);

  public isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  public isCustomer = computed(() => this.currentUser()?.role === 'CUSTOMER' || (this.isAuth() && this.currentUser()?.role !== 'ADMIN'));
  public firstName = computed(() => {
    const name = this.currentUser()?.name;
    if (!name) return 'Minha Conta';
    return name.split(' ')[0];
  });
  public userInitials = computed(() => {
    const name = this.currentUser()?.name;
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  });

  constructor() {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (savedToken && savedUser) {
        try {
          this.token.set(savedToken);
          this.currentUser.set(JSON.parse(savedUser));
          this.isAuth.set(true);
          return;
        } catch (e) {
          // fallback
        }
      }

      // Por padrão na vitrine, define como cliente logado para demonstrar o recurso de Meus Pedidos
      this.token.set('demo_jwt_token_customer');
      this.currentUser.set(DEMO_CUSTOMER);
      this.isAuth.set(true);
      localStorage.setItem(TOKEN_KEY, 'demo_jwt_token_customer');
      localStorage.setItem(USER_KEY, JSON.stringify(DEMO_CUSTOMER));
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const isAdmin = credentials.email.includes('admin');
    const user: User = {
      id: 'usr-' + Date.now(),
      name: isAdmin ? 'Administrador Lume' : (credentials.email.split('@')[0] || 'Cliente Lume'),
      email: credentials.email,
      role: isAdmin ? 'ADMIN' : 'CUSTOMER',
      avatar: isAdmin ? DEMO_ADMIN.avatar : DEMO_CUSTOMER.avatar,
    };

    const response: LoginResponse = {
      accessToken: 'demo_token_' + Date.now(),
      refreshToken: 'demo_refresh_' + Date.now(),
      user
    };

    this.saveSession(response);
    return of(response);
  }

  loginWithGoogle(credential?: string): Observable<LoginResponse> {
    const user: User = {
      id: 'usr-google-' + Date.now(),
      name: 'Cliente Google',
      email: 'cliente.google@gmail.com',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    };

    const response: LoginResponse = {
      accessToken: 'demo_google_token_' + Date.now(),
      refreshToken: 'demo_google_refresh_' + Date.now(),
      user
    };

    this.saveSession(response);
    return of(response);
  }

  register(userData: RegisterRequest): Observable<any> {
    const user: User = {
      id: 'usr-' + Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'CUSTOMER',
    };

    const response: LoginResponse = {
      accessToken: 'demo_token_' + Date.now(),
      refreshToken: 'demo_refresh_' + Date.now(),
      user
    };

    this.saveSession(response);
    return of({ message: 'Cadastro realizado com sucesso!', user });
  }

  private demoResetCode: string | null = null;

  forgotPassword(email: string): Observable<any> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.demoResetCode = code;
    return of({
      success: true,
      message: `Código de verificação enviado para ${email}.`,
      demoCode: code,
    });
  }

  verifyResetCode(email: string, code: string): Observable<any> {
    const clean = code.replace(/\D/g, '').trim();
    if (clean === '123456' || (this.demoResetCode && clean === this.demoResetCode) || clean.length === 6) {
      return of({ valid: true, message: 'Código verificado com sucesso.' });
    }
    return of({ valid: false, message: 'Código de verificação incorreto.' });
  }

  resetPassword(data: { email: string; code: string; password: string }): Observable<any> {
    return of({
      success: true,
      message: 'Senha redefinida com sucesso! Você já pode entrar com sua nova senha.',
    });
  }

  updateProfile(profileData: { name?: string; phone?: string | null; avatar?: string | null }): Observable<User> {
    const current = this.currentUser();
    const updatedUser: User = {
      ...(current || DEMO_CUSTOMER),
      ...(profileData.name !== undefined ? { name: profileData.name.trim() } : {}),
      ...(profileData.phone !== undefined ? { phone: profileData.phone } : {}),
      ...(profileData.avatar !== undefined ? { avatar: profileData.avatar } : {}),
    };

    this.currentUser.set(updatedUser);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
    return of(updatedUser);
  }

  logout(redirectUrl?: string): void {
    const wasAdmin = this.currentUser()?.role === 'ADMIN';
    this.clearSession();
    if (redirectUrl) {
      this.router.navigate([redirectUrl]);
    } else if (!wasAdmin) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  isAuthenticated(): boolean {
    return this.isAuth();
  }

  getToken(): string | null {
    return this.token();
  }

  private saveSession(response: LoginResponse): void {
    this.token.set(response.accessToken);
    this.currentUser.set(response.user);
    this.isAuth.set(true);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
  }

  private clearSession(): void {
    this.token.set(null);
    this.currentUser.set(null);
    this.isAuth.set(false);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
}
