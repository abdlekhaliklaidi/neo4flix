import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  template: `
    <div class="error-page">

      <h1>{{ errorCode }}</h1>

      <h2>{{ title }}</h2>

      <p>{{ message }}</p>

      <button (click)="goToMovies()">
        Back to Movies
      </button>

    </div>
  `,
  styles: [`
    .error-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: #0b0b0b;
      color: white;
      text-align: center;
      font-family: Arial, sans-serif;
    }

    h1 {
      margin: 0;
      color: #e50914;
      font-size: 100px;
      font-weight: 900;
    }

    h2 {
      margin: 10px 0;
      font-size: 28px;
    }

    p {
      max-width: 500px;
      color: #999;
      line-height: 1.7;
    }

    button {
      margin-top: 20px;
      padding: 12px 22px;
      border: none;
      border-radius: 6px;
      background: #e50914;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }

    button:hover {
      background: #f40612;
    }
  `]
})
export class ErrorComponent {

  errorCode = 404;
  title = 'Page Not Found';
  message = 'The page you are looking for does not exist.';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const code = Number(
      this.route.snapshot.paramMap.get('code')
    );

    switch (code) {

      case 400:
        this.errorCode = 400;
        this.title = 'Bad Request';
        this.message =
          'The request contains invalid information.';
        break;

      case 401:
        this.errorCode = 401;
        this.title = 'Unauthorized';
        this.message =
          'You need to sign in to access this resource.';
        break;

      case 403:
        this.errorCode = 403;
        this.title = 'Forbidden';
        this.message =
          'You do not have permission to access this resource.';
        break;

      case 404:
        this.errorCode = 404;
        this.title = 'Page Not Found';
        this.message =
          'The page or movie you are looking for does not exist.';
        break;

      case 500:
        this.errorCode = 500;
        this.title = 'Internal Server Error';
        this.message =
          'Something went wrong on our server. Please try again later.';
        break;

      default:
        this.errorCode = 500;
        this.title = 'Unexpected Error';
        this.message =
          'An unexpected error occurred.';
    }
  }

  goToMovies(): void {
    this.router.navigate(['/movies']);
  }
}