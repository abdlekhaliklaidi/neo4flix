import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ApiService, Rating } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ratings.component.html',
  styleUrl: './ratings.component.css'
})
export class Ratings implements OnInit {

  ratings: Rating[] = [];

  loading = true;
  msg = '';

  deletingMovieId: number | null = null;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRatings();
  }

  
  loadRatings(): void {

    this.loading = true;
    this.msg = '';

    this.api.myRatings().subscribe({

      next: (ratings: any[]) => {

        console.log('MY RATINGS:', ratings);

        // this.ratings = ratings ?? [];
        this.ratings = ratings
          .map(item => item.rating)
          .filter(rating => rating != null);

        console.log('FORMATTED RATINGS:', this.ratings);
        this.loading = false;
      },

      error: (error) => {

        console.error('RATINGS ERROR:', error);

        this.loading = false;

        if (error.status === 401) {
          this.auth.logout();
          return;
        }

        this.msg = 'Unable to load your ratings.';
      }

    });
  }

  
  deleteRating(movieId: number): void {

    const confirmed = window.confirm(
      'Are you sure you want to delete this rating?'
    );

    if (!confirmed) {
      return;
    }

    this.deletingMovieId = movieId;
    this.msg = '';

    this.api.deleteRating(movieId).subscribe({

      next: () => {

        this.ratings = this.ratings.filter(
          rating => rating.movieId !== movieId
        );

        this.deletingMovieId = null;

        this.msg = 'Rating deleted successfully.';
      },

      error: (error) => {

        console.error('DELETE RATING ERROR:', error);

        this.deletingMovieId = null;

        if (error.status === 401) {
          this.auth.logout();
          return;
        }

        this.msg = 'Unable to delete rating.';
      }

    });
  }


  back(): void {
    this.router.navigate(['/movies']);
  }
}