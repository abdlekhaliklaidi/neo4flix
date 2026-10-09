import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  ApiService,
  Recommendation
} from '../../core/api.service';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './recommendations.html',
  styleUrl: './recommendations.css'
})
export class Recommendations implements OnInit {

  recommendations: Recommendation[] = [];

  genre = '';
  releaseYear: number | null = null;
  limit = 10;

  loading = false;
  msg = '';

  readonly currentYear = new Date().getFullYear();

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {

    this.loading = true;
    this.msg = '';

    const year = this.releaseYear;

    this.api.recommendations(
      this.genre.trim() || undefined,
      year && year > 0 ? year : undefined,
      this.limit
    ).subscribe({

      next: (recommendations) => {

        this.recommendations = recommendations;

        this.loading = false;

        if (recommendations.length === 0) {
          this.msg =
            'No recommendations found. Rate some movies to discover your next favorite.';
        }

        this.cdr.detectChanges();
      },

      error: (error) => {

        this.loading = false;

        if (error.status === 401) {
          this.auth.logout();
          return;
        }

        this.msg =
          'Unable to load recommendations. Please try again.';

        console.error(
          'Recommendations error:',
          error
        );

        this.cdr.detectChanges();
      }

    });
  }

  search(): void {

    if (
      this.releaseYear !== null &&
      (
        !Number.isInteger(Number(this.releaseYear)) ||
        Number(this.releaseYear) < 1888 ||
        Number(this.releaseYear) > this.currentYear + 10
      )
    ) {

      this.msg = 'Please enter a valid release year.';

      return;
    }

    this.loadRecommendations();
  }

  resetFilters(): void {

    this.genre = '';
    this.releaseYear = null;
    this.limit = 10;

    this.loadRecommendations();
  }

  viewMovie(movieId: number): void {

    this.router.navigate([
      '/movies',
      movieId
    ]);
  }

  goToMovies(): void {

    this.router.navigate([
      '/movies'
    ]);
  }

  logout(): void {

    this.auth.logout();
  }

}