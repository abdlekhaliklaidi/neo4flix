import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

const API = 'http://localhost:8080/api';

export interface Movie { 
    id: number; 
    title: string; 
    releaseYear: number; 
    description: string; 
    averageRating: number; 
    genres?: any[]; 

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

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  // Movies
  movies() { return this.http.get<Movie[]>(`${API}/movies`); }
  searchTitle(title: string) { 

    return this.http.get<Movie[]>(`${API}/movies/search/title`, { params: { title } }); 
}

  searchGenre(genre: string) { 

    return this.http.get<Movie[]>(`${API}/movies/search/genre`, { params: { genre } }); 
}

  searchYear(year: number) { 

    return this.http.get<Movie[]>(`${API}/movies/search/year`, { params: { year } }); 
}

  // Ratings
  rate(movieId: number, score: number) {
    const params = new HttpParams().set('userId', this.auth.userId!).set('movieId', movieId).set('score', score);
    return this.http.post<Rating>(`${API}/ratings`, null, { params });
  }

  myRatings() { return this.http.get<Rating[]>(`${API}/ratings/user/${this.auth.userId}`); }
  deleteRating(movieId: number) {

    const params = new HttpParams().set('userId', this.auth.userId!).set('movieId', movieId);
    return this.http.delete<void>(`${API}/ratings`, { params });
  }

  // Recommendations
  recommendations(genre?: string, releaseYear?: number, limit = 10) {
    
    let params = new HttpParams().set('limit', limit);
    if (genre) params = params.set('genre', genre);
    if (releaseYear) params = params.set('releaseYear', releaseYear);
    return this.http.get<Recommendation[]>(`${API}/recommendations/user/${this.auth.userId}`, { params });
  }
}