import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Movie } from '../../core/api.service';

@Component({
  selector: 'app-movies', standalone: true, imports: [FormsModule],
  template: `
    <div class="toolbar">
      <select [(ngModel)]="mode">
        <option value="title">Title</option><option value="genre">Genre</option><option value="year">Year</option>
      </select>
      <input [(ngModel)]="query" placeholder="Search..." (keyup.enter)="search()" />
      <button (click)="search()">Search</button>
      <button (click)="load()">Reset</button>
    </div>
    <div class="grid">
      @for (m of movies; track m.id) {
        <div class="card">
          <h3>{{ m.title }} <small>({{ m.releaseYear }})</small></h3>
          <p>{{ m.description }}</p>
          <p>⭐ {{ m.averageRating ?? '-' }}</p>
          <div>
            @for (s of [1,2,3,4,5]; track s) { <button (click)="rate(m, s)">{{ s }}★</button> }
          </div>
        </div>
      }
    </div>
    @if (msg) { <p>{{ msg }}</p> }`
})

export class MoviesComponent implements OnInit {

  movies: Movie[] = []; mode = 'title'; query = ''; msg = '';
  constructor(private api: ApiService) {}

  ngOnInit() { 

    this.load(); 
  }
  load() { 

    this.query = ''; this.api.movies().subscribe(m => this.movies = m); 
  }

  search() {
    if (!this.query.trim()) return this.load();
    const req = this.mode === 'title' ? this.api.searchTitle(this.query)
              : this.mode === 'genre' ? this.api.searchGenre(this.query)
              : this.api.searchYear(+this.query);
    req.subscribe(m => this.movies = m);
  }
  
  rate(m: Movie, score: number) {
    this.api.rate(m.id, score).subscribe({
      next: () => this.msg = `You rated "${m.title}" ${score}/5`,
      error: e => this.msg = typeof e.error === 'string' ? e.error : 'Error'
    });
  }
}