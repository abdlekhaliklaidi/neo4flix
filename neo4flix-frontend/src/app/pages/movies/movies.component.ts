import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {ApiService, Movie} from '../../core/api.service';
import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent implements OnInit {

  movies: Movie[] = [];

  mode = 'title';
  query = '';
  msg = '';
  loading = false;

  scores = [1, 2, 3, 4, 5];

  savedMovieIds = new Set<number>();

  showAddMovie = false;

  newMovie = {
    title: '',
    releaseYear: new Date().getFullYear(),
    description: '',
    genres: [] as { name: string }[]
  };

  constructor(
    private api: ApiService,
    public auth: AuthService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadSavedMovies();
  }

  load(): void {

    this.loading = true;
    this.msg = '';
    this.query = '';

    this.api.movies().subscribe({

      next: (movies) => {

        this.movies = movies;
        this.loading = false;

        console.log('MOVIES:', this.movies);

        this.cdr.detectChanges();
      },

      error: (error) => {

        this.loading = false;

        this.handleError(error);

        this.cdr.detectChanges();
      }

    });
  }

  loadSavedMovies(): void {

    this.api.savedMovies().subscribe({

      next: (movies) => {

        this.savedMovieIds = new Set(
          movies.map(movie => movie.id)
        );

        this.cdr.detectChanges();
      },

      error: (error) => {

        if (error.status === 401) {
          this.auth.logout();
        }

      }

    });
  }

  saveMovie(movie: Movie): void {

    if (this.savedMovieIds.has(movie.id)) {

      this.api.removeSavedMovie(movie.id).subscribe({

        next: () => {

          this.savedMovieIds.delete(movie.id);

          this.msg = `"${movie.title}" removed from your saved movies.`;
        setTimeout(() => {

        this.msg = '';

        this.cdr.detectChanges();

      }, 2000);

          this.cdr.detectChanges();
        },

        error: (error) => {

          if (error.status === 401) {
            this.auth.logout();
            return;
          }

          this.msg = 'Unable to remove this movie.';
        setTimeout(() => {

        this.msg = '';

        this.cdr.detectChanges();

      }, 2000);

          this.cdr.detectChanges();
        }

      });

      return;
    }

    this.api.saveMovie(movie.id).subscribe({

      next: () => {

        this.savedMovieIds.add(movie.id);

        this.msg = `✅ "${movie.title}" saved successfully.`;
        setTimeout(() => {

        this.msg = '';

        this.cdr.detectChanges();

      }, 2000);

        this.cdr.detectChanges();
      },

      error: (error) => {

        if (error.status === 401) {
          this.auth.logout();
          return;
        }

        this.msg = typeof error.error === 'string'
            ? error.error
            : 'Unable to save this movie.';

        this.cdr.detectChanges();
      }

    });
  }

  search(): void {

    const value = this.query.trim();

    if (!value) {
      this.load();
      return;
    }

    this.loading = true;
    this.msg = '';

    let request;

    if (this.mode === 'title') {

      request = this.api.searchTitle(value);

    } else if (this.mode === 'genre') {

      request = this.api.searchGenre(value);

    } else {

      const year = Number(value);

      if (Number.isNaN(year)) {

        this.loading = false;

        this.msg =
          'Please enter a valid year.';

        this.cdr.detectChanges();

        return;
      }

      request = this.api.searchYear(year);
    }

    request.subscribe({

      next: (movies) => {

        this.movies = movies;
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        this.loading = false;

        this.handleError(error);

        this.cdr.detectChanges();
      }

    });
  }


  details(id: number): void {

    this.router.navigate([
      '/movies',
      id
    ]);
  }

  rate(movie: Movie, score: number): void {

    this.msg = `Saving your rating for "${movie.title}"`;
     setTimeout(() => {

        this.msg = '';

        this.cdr.detectChanges();

      }, 2000);

    this.cdr.detectChanges();

    this.api.rate(movie.id, score).subscribe({

      next: () => {

        this.msg = `✅ You rated "${movie.title}" ${score}/5 successfully.`;
         setTimeout(() => {

        this.msg = '';

        this.cdr.detectChanges();

      }, 2000);

        this.cdr.detectChanges();

        setTimeout(() => {

          this.msg = '';

          this.cdr.detectChanges();

        }, 2500);
      },

      error: (error) => {

        if (error.status === 401) {

          this.auth.logout();

          return;
        }

        this.msg =
          typeof error.error === 'string'
            ? error.error
            : '❌ Unable to save your rating.';

        this.cdr.detectChanges();
      }

    });
  }

  createMovie(): void {

    const title =
      this.newMovie.title.trim();

    const description =
      this.newMovie.description.trim();

    const releaseYear =
      Number(this.newMovie.releaseYear);

    if (!title) {

      this.msg =
        'Please enter a movie title.';

      return;
    }

    if (!releaseYear || releaseYear < 1888) {

      this.msg =
        'Please enter a valid release year.';

      return;
    }

    if (!description) {

      this.msg =
        'Please enter a movie description.';

      return;
    }

    this.loading = true;
    this.msg = '';

    const movieData = {
      title,
      releaseYear,
      description,
      genres: this.newMovie.genres
    };

    this.api.createMovie(movieData).subscribe({

      next: (movie) => {

        this.movies = [
          movie,
          ...this.movies
        ];

        this.loading = false;

        this.msg =
          `✅ "${movie.title}" added successfully.`;

        this.showAddMovie = false;

        this.resetNewMovie();

        this.cdr.detectChanges();
      },

      error: (error) => {

        this.loading = false;

        if (error.status === 401) {

          this.auth.logout();

          return;
        }

        this.msg =
          typeof error.error === 'string'
            ? error.error
            : '❌ Unable to create this movie.';

        this.cdr.detectChanges();
      }

    });
  }

  resetNewMovie(): void {

    this.newMovie = {
      title: '',
      releaseYear: new Date().getFullYear(),
      description: '',
      genres: []
    };
  }

  goToRatings(): void {

    this.router.navigate([
      '/ratings'
    ]);
  }

  goToSavedMovies(): void {

    this.router.navigate([
      '/saved-movies'
    ]);
  }


  logout(): void {

    this.auth.logout();
  }


  private handleError(error: any): void {

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