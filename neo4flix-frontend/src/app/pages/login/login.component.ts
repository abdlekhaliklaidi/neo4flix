import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username = '';
  password = '';

  error = '';

  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  submit() {

    this.error = '';

    const username = this.username.trim();
    const password = this.password;

    // Empty fields
    if (!username && !password) {

      this.error = 'Username and password are required.';

      return;
    }

    if (!username) {

      this.error = 'Username is required.';

      return;
    }

    if (!password) {

      this.error = 'Password is required.';

      return;
    }

    this.loading = true;

    this.auth.login(
      username,
      password
    ).subscribe({

      next: () => {

        this.loading = false;

        this.cdr.detectChanges();

        this.router.navigate(['/movies']);

      },

      error: (e) => {

        this.loading = false;

        console.error(
          'LOGIN HTTP ERROR:',
          e
        );

        // Wrong username/password
        if (e.status === 401) {

          this.error = 'Invalid username or password.';
        }

        // Server is not reachable
        else if (e.status === 0) {

          this.error = 'Cannot connect to the server.';
        }

        // Bad request
        else if (e.status === 400) {

          this.error = typeof e.error === 'string'
              ? e.error
              : 'Invalid login data.';
        }

        // Server error
        else if (e.status >= 500) {

          this.error = 'Server error. Please try again later.';
        }

        else {

          this.error = 'Login failed. Please try again.';
        }

        this.cdr.detectChanges();
      }

    });
  }

  continueAsGuest(): void {
     this.router.navigate(['/movies']);
  }

}