import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';

const API = 'http://localhost:8080/api';

export interface Genre {
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  releaseYear: number;
  description: string;
  averageRating: number;
  genres?: Genre[];
}

export interface Recommendation {
  movieId: number;
  title: string;
  releaseYear: number;
  description: string;
  averageRating: number;
  score: number;
  reason: string;
}

export interface Rating {
  userId: number;
  movieId: number;
  title?: string;
  score: number;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

 
  private getAuthenticatedUserId(): string {

    const token =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('token')
        : null;

    const userId = this.auth.userId;

    if (
      !token ||
      !userId ||
      String(userId).trim() === '' ||
      String(userId) === 'null' ||
      String(userId) === 'undefined'
    ) {
      throw new Error(
        'You must log in to perform this action.'
      );
    }

    return String(userId);
  }

  // ==================== MOVIES ====================

  movies(): Observable<Movie[]> {

    return this.http.get<Movie[]>(
      `${API}/movies`
    );
  }

  movie(id: number): Observable<Movie> {

    return this.http.get<Movie>(
      `${API}/movies/${id}`
    );
  }

  
  searchTitle(title: string): Observable<Movie[]> {

    return this.http.get<Movie[]>(
      `${API}/movies/search/title`,
      {
        params: {
          title
        }
      }
    );
  }

  
  searchGenre(genre: string): Observable<Movie[]> {

    return this.http.get<Movie[]>(
      `${API}/movies/search/genre`,
      {
        params: {
          genre
        }
      }
    );
  }

  
  searchYear(year: number): Observable<Movie[]> {

    return this.http.get<Movie[]>(
      `${API}/movies/search/year`,
      {
        params: {
          year
        }
      }
    );
  }


  createMovie(movie: {
    title: string;
    releaseYear: number;
    description: string;
    genres?: Genre[];
  }): Observable<Movie> {

    this.getAuthenticatedUserId();

    return this.http.post<Movie>(
      `${API}/movies`,
      movie
    );
  }

  updateMovie(
    movieId: number,
    movie: {
      title: string;
      releaseYear: number;
      description: string;
      genres?: Genre[];
    }
  ): Observable<Movie> {

    this.getAuthenticatedUserId();

    return this.http.put<Movie>(
      `${API}/movies/${movieId}`,
      movie
    );
  }

  
  deleteMovie(movieId: number): Observable<void> {

    this.getAuthenticatedUserId();

    return this.http.delete<void>(
      `${API}/movies/${movieId}`
    );
  }

  // ==================== SAVED MOVIES / WATCHLIST ====================

  saveMovie(movieId: number): Observable<void> {

    const userId = this.getAuthenticatedUserId();

    return this.http.post<void>(
      `${API}/saved-movies/${userId}/${movieId}`,
      null
    );
  }

  removeSavedMovie(movieId: number): Observable<void> {

    const userId = this.getAuthenticatedUserId();

    return this.http.delete<void>(
      `${API}/saved-movies/${userId}/${movieId}`
    );
  }


  savedMovies(): Observable<Movie[]> {

    const userId = this.getAuthenticatedUserId();

    return this.http.get<Movie[]>(
      `${API}/saved-movies/${userId}`
    );
  }


  isMovieSaved(movieId: number): Observable<boolean> {

    const userId = this.getAuthenticatedUserId();

    return this.http.get<boolean>(
      `${API}/saved-movies/${userId}/${movieId}`
    );
  }

  // ==================== RATINGS ====================

  rate(
    movieId: number,
    score: number
  ): Observable<Rating> {

    const userId = this.getAuthenticatedUserId();

    if (
      !Number.isFinite(movieId) ||
      movieId <= 0
    ) {
      throw new Error('Invalid movie ID.');
    }

    if (
      !Number.isFinite(score) ||
      score < 1 ||
      score > 5
    ) {
      throw new Error(
        'Rating must be between 1 and 5.'
      );
    }

    const params = new HttpParams()
      .set('userId', userId)
      .set('movieId', movieId)
      .set('score', score);

    return this.http.post<Rating>(
      `${API}/ratings`,
      null,
      {
        params
      }
    );
  }

 
  myRatings(): Observable<Rating[]> {

    const userId = this.getAuthenticatedUserId();

    return this.http.get<Rating[]>(
      `${API}/ratings/user/${userId}`
    );
  }

  deleteRating(movieId: number): Observable<void> {

    const userId = this.getAuthenticatedUserId();

    const params = new HttpParams()
      .set('userId', userId)
      .set('movieId', movieId);

    return this.http.delete<void>(
      `${API}/ratings`,
      {
        params
      }
    );
  }

  // ==================== RECOMMENDATIONS ====================

  recommendations(
    genre?: string,
    releaseYear?: number,
    limit = 10
  ): Observable<Recommendation[]> {

    const userId = this.getAuthenticatedUserId();

    let params = new HttpParams()
      .set('limit', limit);

    if (genre) {
      params = params.set('genre', genre);
    }

    if (releaseYear) {
      params = params.set(
        'releaseYear',
        releaseYear
      );
    }

    return this.http.get<Recommendation[]>(
      `${API}/recommendations/user/${userId}`,
      {
        params
      }
    );
  }
}