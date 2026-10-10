import { Component, OnInit, Inject, PLATFORM_ID,  ChangeDetectorRef, } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import {ActivatedRoute, Router, RouterLink} from '@angular/router';

import {ApiService,Movie} from '../../core/api.service';

import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-movie-details',
  standalone: true,

  imports: [RouterLink],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})

export class MovieDetailsComponent implements OnInit {

  movie: Movie | null = null;
  loading = true;
  msg = '';
  scores = [1, 2, 3, 4, 5];

  constructor(
  private route: ActivatedRoute,
  private router: Router,
  private api: ApiService,
  private auth: AuthService,
  private cdr: ChangeDetectorRef,
  @Inject(PLATFORM_ID) private platformId: Object
  ) {}


 ngOnInit(): void {

  const idParam = this.route.snapshot.paramMap.get('id');

  // Invalid ID format -> 400
  if (!idParam || !/^[1-9]\d*$/.test(idParam)) {

    this.router.navigate(['/error/400'], {
      replaceUrl: true
    });

    return;
  }

  const id = Number(idParam);

  this.loading = true;

  this.api.movie(id).subscribe({

    next: movie => {

      this.loading = false;

      if (!movie || movie.id == null) {

        this.router.navigate(['/error/404'], {
          replaceUrl: true
        });

        return;
      }

      this.movie = movie;

      this.cdr.detectChanges();
    },

    error: error => {

      this.loading = false;
      this.movie = null;

      this.cdr.detectChanges();

      if (error.status === 401) {
        this.auth.logout();
        return;
      }

      if (error.status === 400) {
        this.router.navigate(['/error/400']);
        return;
      }

      if (error.status === 403) {
        this.router.navigate(['/error/403']);
        return;
      }

      if (error.status === 404) {
        this.router.navigate(['/error/404']);
        return;
      }

      if (error.status >= 500) {
        this.router.navigate(['/error/500']);
        return;
      }

      if (error.status === 0) {
        this.msg =
          'Cannot connect to movie-service.';
        return;
      }

      this.msg = 'Unable to load movie.';
    }

  });
}

isLoggedIn(): boolean {
  if (typeof localStorage === 'undefined') {
    return false;
  }

  const token = localStorage.getItem('token');
  const userId = this.auth.userId;

  return !!(
    token &&
    userId &&
    String(userId) !== 'null' &&
    String(userId) !== 'undefined'
  );
}

rate(score: number): void {

  if (!this.isLoggedIn()) {
    this.msg = 'Please log in to rate movies.';
    this.cdr.detectChanges();

    this.router.navigate(['/login']);
    return;
  }

  if (!this.movie) {
    return;
  }

  const movieTitle = this.movie.title;

  this.msg = 'You rated "' + this.movie.title + '" successfully.';
  setTimeout(() => {

        this.msg = '';

        this.cdr.detectChanges();

      }, 2000);

  this.api.rate(this.movie.id, score).subscribe({

    next: () => {
      this.cdr.detectChanges();
      this.msg =
        `✅ You rated "${movieTitle}" ${score}/5 successfully.`;

    },

    error: error => {

  this.loading = false;
  this.movie = null;

  this.cdr.detectChanges();

  if (error.status === 400) {
    this.router.navigate(['/error/400']);
    return;
  }

  if (error.status === 403) {
    this.router.navigate(['/error/403']);
    return;
  }

  if (error.status === 404) {
    this.router.navigate(['/error/404']);
    return;
  }

  if (error.status >= 500) {
    this.router.navigate(['/error/500']);
    return;
  }

  if (error.status === 0) {
    this.msg = 'Cannot connect to movie-service.';
    return;
  }

  this.msg = 'Unable to load movie.';
}


  });

}


  back() {

    this.router.navigate([
      '/movies'
    ]);

  }


  logout() {

    this.auth.logout();

  }

}
