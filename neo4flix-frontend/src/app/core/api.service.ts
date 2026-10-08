import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

const API = 'http://localhost:8080/api';

export interface Genre {
  // id: number;
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


  // Movies

  // Get all movies
  movies() {
    return this.http.get<Movie[]>(`${API}/movies`);
  }

  // Get one movie by ID
  movie(id: number) {
    return this.http.get<Movie>(`${API}/movies/${id}`);
  }

  // Search movies by title
  searchTitle(title: string) {
    return this.http.get<Movie[]>(
      `${API}/movies/search/title`,
      {
        params: {
          title
        }
      }
    );
  }

  // Search movies by genre
  searchGenre(genre: string) {
    return this.http.get<Movie[]>(
      `${API}/movies/search/genre`,
      {
        params: {
          genre
        }
      }
    );
  }

  // Search movies by year
  searchYear(year: number) {
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
}) {

  return this.http.post<Movie>(
    `${API}/movies`,
    movie
  );
}

  saveMovie(movieId: number) {

  return this.http.post<void>(
    `${API}/saved-movies/${this.auth.userId}/${movieId}`,
    null
  );
}


// Remove saved movie
removeSavedMovie(movieId: number) {

  return this.http.delete<void>(
    `${API}/saved-movies/${this.auth.userId}/${movieId}`
  );
}


savedMovies() {

  return this.http.get<Movie[]>(
    `${API}/saved-movies/${this.auth.userId}`
  );
}


// Check if movie is saved
isMovieSaved(movieId: number) {

  return this.http.get<boolean>(
    `${API}/saved-movies/${this.auth.userId}/${movieId}`
  );
}


  // Rate a movie
  rate(movieId: number, score: number) {

    const params = new HttpParams()
      .set('userId', this.auth.userId!)
      .set('movieId', movieId)
      .set('score', score);

    return this.http.post<Rating>(
      `${API}/ratings`,
      null,
      { params }
    );
  }

  // Get current user's ratings
  myRatings() {

    return this.http.get<Rating[]>(
      `${API}/ratings/user/${this.auth.userId}`
    );
  }

  // Delete a rating
  deleteRating(movieId: number) {

    const params = new HttpParams()
      .set('userId', this.auth.userId!)
      .set('movieId', movieId);

    return this.http.delete<void>(
      `${API}/ratings`,
      { params }
    );
  }

  // Recommendations

  recommendations(
    genre?: string,
    releaseYear?: number,
    limit = 10
  ) {

    let params = new HttpParams()
      .set('limit', limit);

    if (genre) {
      params = params.set('genre', genre);
    }

    if (releaseYear) {
      params = params.set('releaseYear', releaseYear);
    }

    return this.http.get<Recommendation[]>(
      `${API}/recommendations/user/${this.auth.userId}`,
      { params }
    );
  }
}
