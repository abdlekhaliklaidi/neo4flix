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


 ngOnInit() {

  // if (!isPlatformBrowser(this.platformId)) {
  //   return;
  // }

  const id = Number(
    this.route.snapshot.paramMap.get('id')
  );

  console.log('DETAIL MOVIE ID:', id);

  if (!id || Number.isNaN(id)) {

    this.loading = false;
    this.msg = 'Invalid movie ID.';

    return;
  }

  this.api.movie(id).subscribe({

    next: movie => {

      console.log(
        'MOVIE DETAILS RESPONSE:',
        movie
      );

      this.movie = movie;
      this.loading = false;

      this.cdr.detectChanges();

      console.log(
        'AFTER SETTING MOVIE:',
        this.movie
      );

      console.log(
        'AFTER SETTING LOADING:',
        this.loading
      );
    },

    error: error => {

      console.error(
        'MOVIE DETAILS ERROR:',
        error
      );

      this.loading = false;
      this.movie = null;

      this.cdr.detectChanges();

      if (error.status === 401) {

        this.auth.logout();
        return;
      }

      if (error.status === 404) {

        this.msg = 'Movie not found.';
        return;
      }

      if (error.status === 0) {

        this.msg =
          'Cannot connect to movie-service.';

        return;
      }

      this.msg =
        'Unable to load movie.';
    }

  });
}


rate(score: number): void {

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


  back() {

    this.router.navigate([
      '/movies'
    ]);

  }


  logout() {

    this.auth.logout();

  }

}
