import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],

  template: `
    <div class="auth-page">

      <div class="auth-box">

        <h1>Neo4flix</h1>

        <p class="subtitle">
          Sign in to continue watching
        </p>

        <form (ngSubmit)="submit()">

          <input
            [(ngModel)]="username"
            name="username"
            type="text"
            placeholder="Username"
            autocomplete="username"
            required
          />

          <input
            [(ngModel)]="password"
            name="password"
            type="password"
            placeholder="Password"
            autocomplete="current-password"
            required
          />

          <button
            type="submit"
            [disabled]="loading"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

        </form>

        @if (error) {
          <p class="error">
            {{ error }}
          </p>
        }

        <p class="register-text">
          Don't have an account?
          <a routerLink="/register">Create account</a>
        </p>

      </div>

    </div>
  `,

  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background:
        linear-gradient(
          rgba(0, 0, 0, .75),
          rgba(0, 0, 0, .9)
        ),
        #0b0b0b;
      padding: 20px;
      box-sizing: border-box;
    }

    .auth-box {
      width: 360px;
      max-width: 100%;
      padding: 40px;
      background: #181818;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, .6);
      text-align: center;
    }

    h1 {
      color: #e50914;
      margin: 0 0 8px;
      font-size: 36px;
      font-weight: 800;
    }

    .subtitle {
      color: #aaa;
      margin: 0 0 30px;
      font-size: 14px;
    }

    input {
      width: 100%;
      box-sizing: border-box;
      padding: 14px;
      margin-bottom: 15px;
      border: 1px solid #333;
      border-radius: 6px;
      background: #333;
      color: white;
      font-size: 15px;
    }

    input::placeholder {
      color: #999;
    }

    input:focus {
      outline: none;
      border-color: #e50914;
      box-shadow: 0 0 0 1px #e50914;
    }

    button {
      width: 100%;
      padding: 14px;
      margin-top: 5px;
      border: none;
      border-radius: 6px;
      background: #e50914;
      color: white;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: background .2s;
    }

    button:hover:not(:disabled) {
      background: #f40612;
    }

    button:disabled {
      background: #6b080d;
      cursor: not-allowed;
    }

    .error {
      color: #ff6b6b;
      background: rgba(255, 107, 107, .08);
      border-radius: 6px;
      padding: 10px;
      margin: 15px 0 0;
      font-size: 14px;
    }

    .register-text {
      color: #999;
      margin-top: 25px;
      font-size: 14px;
    }

    a {
      color: white;
      text-decoration: none;
      font-weight: 600;
    }

    a:hover {
      color: #e50914;
    }
  `]
})
export class LoginComponent {

  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  submit() {

    this.error = '';

    if (!this.username.trim() || !this.password) {
      this.error = 'Username and password are required.';
      return;
    }

    this.loading = true;

    this.auth.login(
      this.username.trim(),
      this.password
    ).subscribe({

      next: () => {
        this.loading = false;
        this.router.navigate(['/movies']);
      },

      error: e => {
        this.loading = false;

        if (e.status === 401) {
          this.error = 'Invalid username or password.';
        } else if (e.status === 0) {
          this.error = 'Cannot connect to the server.';
        } else {
          this.error = 'Login failed. Please try again.';
        }
      }

    });
  }
}
