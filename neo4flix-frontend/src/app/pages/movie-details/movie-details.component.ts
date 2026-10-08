import { Component, OnInit, Inject, PLATFORM_ID,  ChangeDetectorRef, } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import {ActivatedRoute, Router, RouterLink} from '@angular/router';

import {ApiService,Movie} from '../../core/api.service';

import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-movie-details',
  standalone: true,

  imports: [RouterLink],

  template: `

    <div class="details-page">

      <header class="navbar">

        <button
          class="back-btn"
          type="button"
          (click)="back()"
        >
          ← Back
        </button>

        <button
          class="logo"
          type="button"
          routerLink="/movies"
        >
          Neo4flix
        </button>

        <button
          class="logout-btn"
          type="button"
          (click)="logout()"
        >
          Logout
        </button>

      </header>

      @if (loading) {

        <div class="loading">
          Loading movie...
        </div>

      }


      @if (!loading && movie) {

        <main class="movie-details">

          <div class="poster-placeholder">

            <span>
              🎬
            </span>

          </div>


          <div class="info">

            <h1>
              {{ movie.title }}
            </h1>

            <div class="meta">

              <span>
                {{ movie.releaseYear }}
              </span>

              <span>
                ⭐
                {{ movie.averageRating ?? 'N/A' }}
              </span>

            </div>


            <div class="genres">

              @for (
                genre of movie.genres;
                track genre.name
              ) {

                <span>
                  {{ genre.name }}
                </span>

              }

            </div>


            <p class="description">
              {{ movie.description }}
            </p>


            <div class="rating-box">

              <h3>
                Rate this movie
              </h3>

              <div class="rating-buttons">

                @for (
                  score of scores;
                  track score
                ) {

                  <button
                    type="button"
                    (click)="rate(score)"
                  >
                    {{ score }}★
                  </button>

                }

              </div>

            </div>


            @if (msg) {

              <div class="message">
                {{ msg }}
              </div>

            }

          </div>

        </main>

      }
      
      @if (!loading && msg && !movie) {

  <div class="error-message">

    {{ msg }}

  </div>

}

      @if (!loading && !movie) {

        <div class="empty">

          <h2>
            Movie not found
          </h2>

          <button
            type="button"
            (click)="back()"
          >
            Back to movies
          </button>

        </div>

      }

    </div>
  `,

  styles: [`

    * {
      box-sizing: border-box;
    }


    .details-page {

      min-height: 100vh;

      background:
        radial-gradient(
          circle at top,
          #242424,
          #080808 60%
        );

      color: white;

    }


    .navbar {

      height: 70px;

      padding: 0 30px;

      display: flex;

      align-items: center;

      justify-content: space-between;

      background: #141414;

      border-bottom: 1px solid #292929;

    }


    .logo {

      color: #e50914;

      font-size: 26px;

      font-weight: 900;

    }


    .back-btn,
    .logout-btn {

      padding: 9px 15px;

      border-radius: 6px;

      cursor: pointer;

      font-weight: 600;

    }

    
    .back-btn {

      border: 1px solid #444;

      background: transparent;

      color: white;

    }

    .logout-btn {

      border: 1px solid #e50914;

      background: #e50914;

      color: white;

    }


    .movie-details {

      max-width: 1000px;

      margin: auto;

      padding: 80px 25px;

      display: grid;

      grid-template-columns:
        300px 1fr;

      gap: 50px;

      align-items: start;

    }


    .poster-placeholder {

      height: 420px;

      border-radius: 12px;

      background:
        linear-gradient(
          145deg,
          #292929,
          #151515
        );

      display: flex;

      align-items: center;

      justify-content: center;

      font-size: 80px;

      border: 1px solid #333;

    }


    .info h1 {

      font-size: 42px;

      margin: 0 0 15px;

    }


    .meta {

      display: flex;

      gap: 20px;

      color: #aaa;

      margin-bottom: 20px;

    }


    .meta span:last-child {

      color: #f5c518;

      font-weight: 700;

    }


    .genres {

      display: flex;

      flex-wrap: wrap;

      gap: 7px;

      margin-bottom: 25px;

    }


    .genres span {

      background: #292929;

      color: #ccc;

      padding: 6px 10px;

      border-radius: 20px;

      font-size: 12px;

    }


    .description {

      color: #aaa;

      line-height: 1.7;

      font-size: 16px;

    }


    .rating-box {

      margin-top: 35px;

      padding-top: 25px;

      border-top: 1px solid #292929;

    }


    .rating-buttons {

      display: flex;

      gap: 8px;

    }


    .rating-buttons button {

      border: 1px solid #444;

      border-radius: 6px;

      background: #202020;

      color: #f5c518;

      padding: 10px 16px;

      cursor: pointer;

      font-weight: 700;

    }


    .rating-buttons button:hover {

      background: #e50914;

      border-color: #e50914;

      color: white;

    }

    .error-message {

  max-width: 700px;

  margin: 100px auto;

  padding: 20px;

  text-align: center;

  border-radius: 10px;

  background: #241313;

  border: 1px solid #542020;

  color: #ff7777;

    }

    .message {
  margin-top: 20px;
  padding: 13px 16px;
  border-radius: 8px;
  background: #10281c;
  border: 1px solid #1f6b43;
  color: #6ee7a0;
  font-weight: 600;
}


    .loading,
    .empty {

      text-align: center;

      padding: 100px 20px;

      color: #888;

    }


    .empty button {

      margin-top: 20px;

      padding: 10px 18px;

      border: none;

      border-radius: 6px;

      background: #e50914;

      color: white;

      cursor: pointer;

    }


    @media (max-width: 700px) {

      .movie-details {

        grid-template-columns: 1fr;

        padding: 40px 20px;

      }

      .poster-placeholder {

        height: 280px;

      }

      .info h1 {

        font-size: 32px;

      }

    }

  `]
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
