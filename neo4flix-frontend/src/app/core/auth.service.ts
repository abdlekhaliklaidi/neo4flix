import {
  Injectable,
  signal,
  computed,
  inject,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface AuthResponse {
  token: string;
  userId: number | null;
  username: string;
  role: string;
}

export interface RegisterResponse {
  token: string;
  userId: number | null;
  username: string;
  role: string;
}

const API = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private platformId = inject(PLATFORM_ID);

  private _user = signal<AuthResponse | null>(
    this.loadUser()
  );

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

  if (!this.isBrowser()) {
    return null;
  }

  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  if (!token || !userJson) {
    return null;
  }

  try {

    const user = JSON.parse(userJson);

    const storedUserId =
      localStorage.getItem('userId');

    if (storedUserId) {

      const id = Number(storedUserId);

      if (!Number.isNaN(id)) {
        user.userId = id;
      }
    }

    user.token = token;

    return user;

  } catch {

    localStorage.removeItem('user');

    return null;
  }
}

  login(username: string, password: string) {

    const body = {
      username: username.trim(),
      password
    };

    console.log('LOGIN BODY:', body);

    return this.http
      .post<AuthResponse>(
        `${API}/auth/login`,
        body
      )
      .pipe(
        tap(response => {
          console.log('LOGIN RESPONSE:', response);

          this.save(response);
        })
      );
  }

  register(
    username: string,
    email: string,
    password: string
  ) {

    const body = {
      username: username.trim(),
      email: email.trim(),
      password
    };

    console.log('REGISTER BODY:', body);

    /*
     * Important:
     * Registration does NOT save the JWT.
     * User must login after creating the account.
     */

    return this.http.post<RegisterResponse>(
      `${API}/auth/register`,
      body
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

    if (response.userId != null) {

      localStorage.setItem(
        'userId',
        response.userId.toString()
      );

    } else {

      localStorage.removeItem('userId');
    }

    this._user.set(response);
  }

  logout() {

    console.log('LOGOUT');

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

  if (!this.isBrowser()) {
    return null;
  }

  return localStorage.getItem('token');
}


get userId(): number | null {

  if (!this.isBrowser()) {
    return null;
  }

  const value = localStorage.getItem('userId');

  if (!value) {
    return null;
  }

  const id = Number(value);

  return Number.isNaN(id)
    ? null
    : id;
}


get username(): string | null {

  if (!this.isBrowser()) {
    return null;
  }

  return localStorage.getItem('username');
}


get role(): string | null {

  if (!this.isBrowser()) {
    return null;
  }

  return localStorage.getItem('role');
}

}