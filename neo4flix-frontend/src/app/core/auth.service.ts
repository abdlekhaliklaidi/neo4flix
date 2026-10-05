import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
  role: string;
}

const API = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private platformId = inject(PLATFORM_ID);

  private _user = signal<AuthResponse | null>(this.loadUser());

  user = this._user.asReadonly();

  isLoggedIn = computed(() => !!this._user());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private loadUser(): AuthResponse | null {

    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  }

  login(username: string, password: string) {

    return this.http
      .post<AuthResponse>(
        `${API}/auth/login`,
        {
          username,
          password
        }
      )
      .pipe(
        tap(response => {
          this.save(response);
        })
      );
  }

  register(
    username: string,
    email: string,
    password: string
  ) {

    return this.http
      .post<AuthResponse>(
        `${API}/auth/register`,
        {
          username,
          email,
          password
        }
      )
      .pipe(
        tap(response => {
          this.save(response);
        })
      );
  }

  private save(response: AuthResponse) {

    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(
      'user',
      JSON.stringify(response)
    );

    localStorage.setItem(
      'token',
      response.token
    );

    localStorage.setItem(
      'username',
      response.username
    );

    localStorage.setItem(
      'role',
      response.role
    );

    localStorage.setItem(
      'userId',
    response.userId.toString()
    );


    this._user.set(response);
  }

  logout() {

    if (this.isBrowser()) {

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
    }

    this._user.set(null);

    this.router.navigate(['/login']);
  }

  get token(): string | null {
    return this._user()?.token ?? null;
  }

  get userId(): number | null {
  return this._user()?.userId ?? null;
  }

}
