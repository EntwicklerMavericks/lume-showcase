import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../models/auth.models';

const DEMO_USER: User = {
  id: 'usr-admin-demo',
  name: 'Vendedor Lume',
  email: 'admin@lumestore.com.br',
  role: 'ADMIN',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
};

const TOKEN_KEY = 'lume_showcase_token';
const USER_KEY = 'lume_showcase_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // Modern Angular Signals for reactive state
  public currentUser = signal<User | null>(DEMO_USER);
  public token = signal<string | null>('demo_jwt_token_lume_showcase');
  public isAuth = signal<boolean>(true);

  constructor() {
    this.initializeAuthState();
  }

  /**
   * Initializes state from localStorage if running in browser
   */
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
          // fallback to demo user
        }
      }

      // Por padrão em modo demonstração, já deixa logado como ADMIN para facilitar a apresentação
      this.token.set('demo_jwt_token_lume_showcase');
      this.currentUser.set(DEMO_USER);
      this.isAuth.set(true);
      localStorage.setItem(TOKEN_KEY, 'demo_jwt_token_lume_showcase');
      localStorage.setItem(USER_KEY, JSON.stringify(DEMO_USER));
    }
  }

  /**
   * Login instantâneo sem rede
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const user: User = {
      ...DEMO_USER,
      email: credentials.email || DEMO_USER.email
    };

    const response: LoginResponse = {
      accessToken: 'demo_token_' + Date.now(),
      refreshToken: 'demo_refresh_' + Date.now(),
      user
    };

    this.saveSession(response);
    return of(response);
  }

  /**
   * Registro instantâneo
   */
  register(userData: RegisterRequest): Observable<any> {
    return of({
      message: 'Usuário cadastrado com sucesso!',
      user: {
        id: 'usr-' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'ADMIN'
      }
    });
  }

  /**
   * Recuperação de senha instantânea
   */
  forgotPassword(email: string): Observable<any> {
    return of({ message: `Instruções de recuperação enviadas para ${email}.` });
  }

  /**
   * Clear auth state and redirect to login
   */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /**
   * Checks if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuth();
  }

  /**
   * Retrieves access token
   */
  getToken(): string | null {
    return this.token();
  }

  /**
   * Saves credentials in localStorage and updates signals
   */
  private saveSession(response: LoginResponse): void {
    this.token.set(response.accessToken);
    this.currentUser.set(response.user);
    this.isAuth.set(true);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
  }

  /**
   * Clears state from signals and localStorage
   */
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
