import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  username = '';
  email = '';
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
  const email = this.email.trim();
  const password = this.password;

  
  if (!username || !email || !password) {

    this.error = 'All fields are required.';
    return;
  }

  // Username validation
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;

  if (!usernameRegex.test(username)) {

    this.error =
      'Username can only contain letters, numbers, _ and - .';

    return;
  }

  // Password validation
  if (password.length < 8) {

    this.error =
      'Password must contain at least 8 characters.';

    return;
  }

  // Email validation
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {

    this.error =
      'Please enter a valid email address.';

    return;
  }

  this.loading = true;

  this.auth.register(username, email, password).subscribe({

    next: () => {

      this.loading = false;

      this.cdr.detectChanges();

      this.router.navigate(['/login']);

    },

    error: (e) => {

      this.loading = false;

      console.error(
        'REGISTER HTTP ERROR:',
        e
      );

      if (e.status === 400) {

        const backendMessage =
          typeof e.error === 'string'
            ? e.error
            : e.error?.message;

        if (backendMessage) {

          this.error = backendMessage;

        } else {

          this.error = 'Invalid registration data.';
        }

      }

      else if (e.status === 409) {

       this.error = typeof e.error === 'string'
      ? e.error
      : 'Email or username is already registered.';
      }

      else if (e.status === 0) {

        this.error = 'Cannot connect to the server.';

      }

      else {

        this.error = 'Registration failed. Please try again.';
      }

      this.cdr.detectChanges();
    }

  });
}
}