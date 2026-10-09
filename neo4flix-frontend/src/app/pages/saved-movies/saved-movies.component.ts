import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService, Movie} from '../../core/api.service';

import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-saved-movies',
  standalone: true,
  imports: [],
  templateUrl: './saved-movies.component.html',
  styleUrl: './saved-movies.component.css'
})

export class SavedMoviesComponent
  implements OnInit {

  movies: Movie[] = [];

  loading = false;

  msg = '';

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

    this.api.savedMovies().subscribe({

      next: movies => {

        this.movies = movies;

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: error => {

        this.loading = false;

        if (error.status === 401) {

          this.auth.logout();

          return;
        }

        this.msg =
          'Unable to load saved movies.';

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

  remove(movie: Movie) {

    this.api.removeSavedMovie(movie.id)
      .subscribe({

        next: () => {

          this.movies =
            this.movies.filter(
              m => m.id !== movie.id
            );

          this.msg = `"${movie.title}" removed from saved movies.`;
          setTimeout(() => {

        this.msg = '';

        this.cdr.detectChanges();

      }, 2000);

          this.cdr.detectChanges();

        },

        error: () => {

          this.msg =
            'Unable to remove movie.';
        }

      });

  }

  goMovies() {

    this.router.navigate(['/movies']);

  }

  logout() {

    this.auth.logout();

  }

}