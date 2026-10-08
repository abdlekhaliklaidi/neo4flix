import { Component, OnInit } from '@angular/core';
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

  template: `

    <div class="movies-page">

      <!-- NAVBAR -->

      
      <header class="navbar">

        <div class="logo">
          Neo4flix
        </div>

        <div class="user-section">

          <div class="user-info">

            <strong>
              {{ auth.user()?.username }}
            </strong>

            <span>
              {{ auth.user()?.role }}
            </span>

          </div>

          <button
            class="logout-btn"
            type="button"
            (click)="logout()"
          >
            Logout
          </button>

        </div>

      </header>


      <!-- MAIN -->

      <main class="content">

        <section class="hero">

          <h1>
            Movies
          </h1>

          <p>
            Search, explore and rate your favorite movies.
          </p>

        </section>


        <!-- SEARCH -->

        <section class="search-box">

          <select
            [(ngModel)]="mode"
          >

            <option value="title">
              Title
            </option>

            <option value="genre">
              Genre
            </option>

            <option value="year">
              Year
            </option>

          </select>


          <input
            [(ngModel)]="query"
            placeholder="Search movies..."
            (keyup.enter)="search()"
          />


          <button
            class="search-btn"
            type="button"
            (click)="search()"
          >
            Search
          </button>


          <button
            class="reset-btn"
            type="button"
            (click)="load()"
          >
            Reset
          </button>

        </section>


        <!-- MESSAGE -->

        @if (msg) {

          <div class="message">

            {{ msg }}

          </div>

        }


        <!-- LOADING -->

        @if (loading) {

          <div class="loading">

            Loading movies...

          </div>

        }


        <!-- MOVIES -->

        @if (!loading) {

          <section class="movies-grid">

            @for (
              movie of movies;
              track movie.id
            ) {

              <article class="movie-card">

                <div class="movie-top">

                  <div>

                    <h2>
                      {{ movie.title }}
                    </h2>

                    <span class="year">
                      {{ movie.releaseYear }}
                    </span>

                  </div>

                  <div class="rating">

                    ⭐

                    {{
                      movie.averageRating
                      ?? 'N/A'
                    }}

                  </div>

                </div>


                <!-- GENRES -->

                <div class="genres">

                  @for (
                    genre of movie.genres;
                    track genre.name
                  ) {

                    <span class="genre">
                      {{ genre.name }}
                    </span>

                  }

                </div>


                <!-- DESCRIPTION -->

                <p class="description">

                  {{ movie.description }}

                </p>


                <!-- ACTIONS -->

                <div class="actions">

                  <button
                    type="button"
                    class="details-btn"
                    (click)="details(movie.id)"
                  >
                    View Details
                  </button>

                </div>


                <!-- RATE -->

                <div class="rate-section">

                  <span>
                    Rate this movie
                  </span>

                  <div class="rating-buttons">

                    @for (
                      score of scores;
                      track score
                    ) {

                      <button
                        type="button"
                        (click)="rate(movie, score)"
                      >
                        {{ score }}★
                      </button>

                    }

                  </div>

                </div>

              </article>

            }

          </section>

        }


        <!-- EMPTY -->

        @if (
          !loading &&
          movies.length === 0
        ) {

          <div class="empty">

            <h2>
              No movies found
            </h2>

            <p>
              Try another title, genre or year.
            </p>

          </div>

        }

      </main>

    </div>
  `,

  styles: [`

    * {
      box-sizing: border-box;
    }


    .movies-page {

      min-height: 100vh;

      background:
        radial-gradient(
          circle at top,
          #242424 0,
          #0b0b0b 45%
        );

      color: white;

    }


    /* NAVBAR */

    .navbar {

      height: 70px;

      padding: 0 40px;

      display: flex;

      align-items: center;

      justify-content: space-between;

      background: rgba(18, 18, 18, .96);

      border-bottom:
        1px solid #2b2b2b;

      position: sticky;

      top: 0;

      z-index: 20;

    }


    .logo {

      color: #e50914;

      font-size: 28px;

      font-weight: 900;

    }


    .user-section {

      display: flex;

      align-items: center;

      gap: 20px;

    }


    .user-info {

      display: flex;

      align-items: center;

      gap: 10px;

    }


    .user-info span {

      padding: 4px 8px;

      border-radius: 5px;

      background: #292929;

      color: #aaa;

      font-size: 11px;

      text-transform: uppercase;

    }


    .logout-btn {

      padding: 9px 17px;

      border: 1px solid #444;

      border-radius: 6px;

      background: transparent;

      color: white;

      cursor: pointer;

      font-weight: 600;

    }


    .logout-btn:hover {

      background: #e50914;

      border-color: #e50914;

    }


    /* CONTENT */

    .content {

      max-width: 1250px;

      margin: auto;

      padding: 45px 25px 70px;

    }


    .hero {

      margin-bottom: 35px;

    }


    .hero h1 {

      margin: 0;

      font-size: 38px;

      font-weight: 800;

    }


    .hero p {

      color: #888;

      margin-top: 8px;

    }


    /* SEARCH */

    .search-box {

      display: flex;

      gap: 10px;

      margin-bottom: 30px;

    }


    .search-box select,
    .search-box input {

      height: 45px;

      border:
        1px solid #333;

      border-radius: 6px;

      background: #181818;

      color: white;

      padding: 0 13px;

      font-size: 14px;

    }


    .search-box select {

      width: 130px;

    }


    .search-box input {

      flex: 1;

    }


    .search-box input:focus,
    .search-box select:focus {

      outline: none;

      border-color: #e50914;

    }


    .search-btn,
    .reset-btn {

      height: 45px;

      border: none;

      border-radius: 6px;

      padding: 0 22px;

      font-weight: 700;

      cursor: pointer;

    }


    .search-btn {

      background: #e50914;

      color: white;

    }


    .search-btn:hover {

      background: #f40612;

    }


    .reset-btn {

      background: #333;

      color: white;

    }


    .reset-btn:hover {

      background: #444;

    }


    /* MESSAGE */

    .message {

      padding: 12px 16px;

      margin-bottom: 25px;

      border-radius: 7px;

      background: #241313;

      border:
        1px solid #542020;

      color: #ff7777;

    }


    /* LOADING */

    .loading {

      padding: 60px;

      text-align: center;

      color: #888;

    }


    /* GRID */

    .movies-grid {

      display: grid;

      grid-template-columns:
        repeat(
          auto-fill,
          minmax(290px, 1fr)
        );

      gap: 22px;

    }


    /* CARD */

    .movie-card {

      background:
        linear-gradient(
          145deg,
          #1c1c1c,
          #141414
        );

      border:
        1px solid #2b2b2b;

      border-radius: 12px;

      padding: 22px;

      transition: .2s;

    }


    .movie-card:hover {

      transform: translateY(-4px);

      border-color: #484848;

      box-shadow:
        0 15px 35px
        rgba(0,0,0,.4);

    }


    .movie-top {

      display: flex;

      justify-content: space-between;

      gap: 10px;

    }


    .movie-top h2 {

      margin: 0;

      font-size: 20px;

    }


    .year {

      display: block;

      margin-top: 5px;

      color: #777;

      font-size: 13px;

    }


    .rating {

      color: #f5c518;

      font-weight: 700;

      white-space: nowrap;

    }


    /* GENRES */

    .genres {

      display: flex;

      flex-wrap: wrap;

      gap: 6px;

      margin: 16px 0;

    }


    .genre {

      background: #292929;

      color: #bbb;

      border-radius: 20px;

      padding: 5px 9px;

      font-size: 11px;

    }


    /* DESCRIPTION */

    .description {

      color: #aaa;

      line-height: 1.55;

      font-size: 14px;

      min-height: 65px;

    }


    /* ACTIONS */

    .actions {

      margin-top: 18px;

    }


    .details-btn {

      width: 100%;

      height: 40px;

      border: none;

      border-radius: 6px;

      background: white;

      color: #111;

      font-weight: 700;

      cursor: pointer;

    }


    .details-btn:hover {

      background: #e50914;

      color: white;

    }


    /* RATE */

    .rate-section {

      margin-top: 18px;

      padding-top: 15px;

      border-top:
        1px solid #292929;

    }


    .rate-section > span {

      color: #777;

      font-size: 12px;

    }


    .rating-buttons {

      display: flex;

      gap: 5px;

      margin-top: 10px;

    }


    .rating-buttons button {

      flex: 1;

      border:
        1px solid #333;

      border-radius: 5px;

      background: #222;

      color: #f5c518;

      padding: 7px 0;

      cursor: pointer;

      font-weight: 700;

    }


    .rating-buttons button:hover {

      background: #e50914;

      border-color: #e50914;

      color: white;

    }


    /* EMPTY */

    .empty {

      text-align: center;

      padding: 80px 20px;

      color: #777;

    }


    .empty h2 {

      color: #aaa;

    }


    /* MOBILE */

    @media (max-width: 700px) {

      .navbar {

        padding: 0 18px;

      }

      .user-info {

        display: none;

      }

      .logo {

        font-size: 23px;

      }

      .content {

        padding: 30px 15px;

      }

      .hero h1 {

        font-size: 30px;

      }

      .search-box {

        flex-wrap: wrap;

      }

      .search-box select,
      .search-box input {

        width: 100%;

        flex: none;

      }

      .search-btn,
      .reset-btn {

        flex: 1;

      }

      .movies-grid {

        grid-template-columns: 1fr;

      }

    }

  `]
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
    private router: Router
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

      },

      error: error => {

        this.loading = false;

        this.handleError(error);

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

      },

      error: error => {

        this.loading = false;

        this.handleError(error);

      }

    });

  }


  details(id: number) {

    this.router.navigate([
      '/movies',
      id
    ]);

  }


  rate(
    movie: Movie,
    score: number
  ) {

    this.msg = '';

    this.api
      .rate(movie.id, score)
      .subscribe({

        next: () => {

          this.msg =
            `You rated "${movie.title}" ${score}/5`;

        },

        error: error => {

          if (error.status === 401) {

            this.auth.logout();

            return;

          }

          this.msg =
            typeof error.error === 'string'
              ? error.error
              : 'Unable to rate this movie.';

        }

      });

  }


  logout() {

    this.auth.logout();

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
