import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Movie } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [FormsModule],

  template: `
    <div class="movies-page">

      <!-- NAVBAR -->
      <header class="navbar">

        <div class="brand">
          <span class="logo">Neo4flix</span>
        </div>

        <div class="user-section">

          <div class="user-info">
            <span class="username">
              {{ auth.user()?.username }}
            </span>

            <span class="role">
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


      <!-- CONTENT -->
      <main class="content">

        <div class="page-title">
          <h1>Movies</h1>
          <p>Discover and rate your favorite movies.</p>
        </div>


        <!-- SEARCH -->
        <div class="toolbar">

          <select [(ngModel)]="mode">
            <option value="title">Title</option>
            <option value="genre">Genre</option>
            <option value="year">Year</option>
          </select>

          <input
            [(ngModel)]="query"
            placeholder="Search..."
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

        </div>


        <!-- MESSAGE -->
        @if (msg) {
          <div class="message">
            {{ msg }}
          </div>
        }


        <!-- MOVIES -->
        <div class="grid">

          @for (m of movies; track m.id) {

            <div class="card">

              <div class="movie-header">

                <h3>
                  {{ m.title }}
                </h3>

                <span class="year">
                  {{ m.releaseYear }}
                </span>

              </div>

              <p class="description">
                {{ m.description }}
              </p>

              <div class="rating">

                <span class="average">
                  ⭐ {{ m.averageRating ?? '-' }}
                </span>

              </div>

              <div class="rate-section">

                <span>Rate this movie:</span>

                <div class="rating-buttons">

                  @for (s of [1,2,3,4,5]; track s) {

                    <button
                      type="button"
                      class="rate-btn"
                      (click)="rate(m, s)"
                    >
                      {{ s }}★
                    </button>

                  }

                </div>

              </div>

            </div>

          }

        </div>


        @if (movies.length === 0) {

          <div class="empty">
            <h2>No movies found</h2>
            <p>Try another search.</p>
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
        linear-gradient(
          rgba(0, 0, 0, .35),
          rgba(0, 0, 0, .65)
        ),
        #0b0b0b;

      color: white;
    }


    /* NAVBAR */

    .navbar {
      height: 70px;
      padding: 0 35px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      background: #141414;
      border-bottom: 1px solid #292929;

      position: sticky;
      top: 0;
      z-index: 10;
    }

    .logo {
      color: #e50914;
      font-size: 27px;
      font-weight: 900;
      letter-spacing: -1px;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .username {
      font-weight: 600;
      color: #fff;
    }

    .role {
      padding: 4px 8px;
      border-radius: 5px;

      background: #333;
      color: #bbb;

      font-size: 11px;
      font-weight: 700;
    }


    /* LOGOUT */

    .logout-btn {
      border: 1px solid #444;
      border-radius: 6px;

      background: transparent;
      color: #ddd;

      padding: 9px 16px;

      font-size: 14px;
      font-weight: 600;

      cursor: pointer;

      transition: .2s;
    }

    .logout-btn:hover {
      background: #e50914;
      border-color: #e50914;
      color: white;
    }


    /* CONTENT */

    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 25px 60px;
    }

    .page-title {
      margin-bottom: 30px;
    }

    .page-title h1 {
      margin: 0 0 8px;

      font-size: 34px;
      font-weight: 800;
    }

    .page-title p {
      margin: 0;

      color: #888;
      font-size: 14px;
    }


    /* SEARCH */

    .toolbar {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
    }

    .toolbar select,
    .toolbar input {
      height: 44px;

      border: 1px solid #333;
      border-radius: 6px;

      background: #181818;
      color: white;

      padding: 0 13px;

      font-size: 14px;
    }

    .toolbar select {
      width: 120px;
    }

    .toolbar input {
      flex: 1;
      min-width: 150px;
    }

    .toolbar input:focus,
    .toolbar select:focus {
      outline: none;
      border-color: #e50914;
    }

    .search-btn,
    .reset-btn {
      height: 44px;

      border: none;
      border-radius: 6px;

      padding: 0 20px;

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

      border-radius: 6px;

      background: rgba(46, 204, 113, .1);
      border: 1px solid rgba(46, 204, 113, .25);

      color: #6ee7a0;
      font-size: 14px;
    }


    /* MOVIES GRID */

    .grid {
      display: grid;

      grid-template-columns:
        repeat(auto-fill, minmax(280px, 1fr));

      gap: 20px;
    }


    /* CARD */

    .card {
      padding: 22px;

      background: #181818;

      border: 1px solid #292929;
      border-radius: 10px;

      transition:
        transform .2s,
        border-color .2s,
        box-shadow .2s;
    }

    .card:hover {
      transform: translateY(-3px);

      border-color: #444;

      box-shadow:
        0 10px 30px rgba(0, 0, 0, .35);
    }

    .movie-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      gap: 10px;
    }

    .movie-header h3 {
      margin: 0;

      font-size: 19px;
      line-height: 1.3;
    }

    .year {
      color: #888;
      font-size: 13px;
      white-space: nowrap;
    }

    .description {
      min-height: 55px;

      color: #aaa;

      font-size: 14px;
      line-height: 1.5;

      margin: 15px 0;
    }

    .rating {
      margin-bottom: 20px;
    }

    .average {
      color: #f5c518;
      font-weight: 700;
    }


    /* RATE */

    .rate-section {
      border-top: 1px solid #292929;

      padding-top: 15px;

      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .rate-section > span {
      color: #777;
      font-size: 12px;
    }

    .rating-buttons {
      display: flex;
      gap: 6px;
    }

    .rate-btn {
      flex: 1;

      border: 1px solid #333;
      border-radius: 5px;

      background: #222;
      color: #f5c518;

      padding: 7px 4px;

      cursor: pointer;

      font-size: 12px;
      font-weight: 700;

      transition: .2s;
    }

    .rate-btn:hover {
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
      margin-bottom: 8px;
    }


    /* MOBILE */

    @media (max-width: 650px) {

      .navbar {
        padding: 0 18px;
      }

      .logo {
        font-size: 22px;
      }

      .user-info {
        display: none;
      }

      .content {
        padding: 25px 15px;
      }

      .toolbar {
        flex-wrap: wrap;
      }

      .toolbar select {
        width: 100%;
      }

      .toolbar input {
        width: 100%;
        flex: none;
      }

      .search-btn,
      .reset-btn {
        flex: 1;
      }

      .grid {
        grid-template-columns: 1fr;
      }
    }

  `]
})
export class MoviesComponent implements OnInit {

  movies: Movie[] = [];

  mode = 'title';
  query = '';
  msg = '';

  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {

    this.query = '';

    this.api.movies().subscribe({
      next: movies => {
        this.movies = movies;
      },

      error: e => {
        this.msg =
          typeof e.error === 'string'
            ? e.error
            : 'Unable to load movies.';
      }
    });
  }

  search() {

    if (!this.query.trim()) {
      this.load();
      return;
    }

    const req =
      this.mode === 'title'
        ? this.api.searchTitle(this.query)
        : this.mode === 'genre'
          ? this.api.searchGenre(this.query)
          : this.api.searchYear(+this.query);

    req.subscribe({
      next: movies => {
        this.movies = movies;
      },

      error: e => {
        this.msg =
          typeof e.error === 'string'
            ? e.error
            : 'Search failed.';
      }
    });
  }

  rate(m: Movie, score: number) {

    this.api.rate(m.id, score).subscribe({

      next: () => {
        this.msg =
          `You rated "${m.title}" ${score}/5`;
      },

      error: e => {

        this.msg =
          typeof e.error === 'string'
            ? e.error
            : 'Error while rating movie.';
      }

    });
  }

  logout() {

    this.auth.logout();

  }

}