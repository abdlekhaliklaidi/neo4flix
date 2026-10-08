import { Component, OnInit, ChangeDetectorRef, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  ApiService,
  Movie
} from '../../core/api.service';

import {
  AuthService
} from '../../core/auth.service';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent
  implements OnInit {

  movies: Movie[] = [];
  mode = 'title';
  query = '';
  msg = '';
  loading = false;
  scores = [1, 2, 3, 4, 5];

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {

    this.load();

  }


  load() {

    this.loading = true;

    this.msg = '';

    this.query = '';

    this.api.movies().subscribe({

      next: movies => {

        this.movies = movies;

        this.loading = false;

        this.cdr.detectChanges();

      console.log('MOVIES:', this.movies);
      console.log('LOADING:', this.loading);

      },

      error: error => {

        this.loading = false;

        this.handleError(error);


        this.cdr.detectChanges();

      }

    });

  }


  search() {

    const value =
      this.query.trim();

    if (!value) {

      this.load();

      return;

    }


    this.loading = true;

    this.msg = '';

    this.cdr.detectChanges();


    let request;


    if (this.mode === 'title') {

      request =
        this.api.searchTitle(value);

    } else if (this.mode === 'genre') {

      request =
        this.api.searchGenre(value);

    } else {

      const year =
        Number(value);

      if (Number.isNaN(year)) {

        this.loading = false;

        this.msg =
          'Please enter a valid year.';

        return;

      }

      request =
        this.api.searchYear(year);

    }


    request.subscribe({

      next: movies => {

        this.movies = movies;

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: error => {

        this.loading = false;

        this.handleError(error);

        this.cdr.detectChanges();

      }

    });

  }


  details(id: number) {

    this.router.navigate([
      '/movies',
      id
    ]);

  }


  rate(movie: Movie, score: number): void {

  this.msg = 'You rated "' + movie.title + '" successfully.';
  setTimeout(() => {

        this.msg = '';

        this.cdr.detectChanges();

      }, 2000);

  this.api.rate(movie.id, score).subscribe({

    next: () => {

      this.cdr.detectChanges();

      this.msg =
        `✅ You rated "${movie.title}" ${score}/5 successfully.`;

    },

    error: error => {

      if (error.status === 401) {

        this.auth.logout();
        return;

      }
      this.cdr.detectChanges();

      this.msg =
        typeof error.error === 'string'
          ? error.error
          : '❌ Unable to save your rating.';

    }

  });

}


  logout() {

    this.auth.logout();

  }
  
  goToRatings(): void {

  this.router.navigate(['/ratings']);

}

  private handleError(error: any) {

    if (error.status === 401) {

      this.auth.logout();

      return;

    }

    if (error.status === 0) {

      this.msg =
        'Cannot connect to movie server.';

      return;

    }

    this.msg =
      'Unable to load movies.';

  }

}
