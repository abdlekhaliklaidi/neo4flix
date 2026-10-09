import { Routes } from '@angular/router';
import {
  authGuard,
  guestGuard
} from './core/auth-guard';

export const routes: Routes = [

  {
    path: 'login',

    canActivate: [
      guestGuard
    ],

    loadComponent: () =>
      import(
        './pages/login/login.component'
      ).then(
        m => m.LoginComponent
      )
  },

  {
    path: 'register',

    canActivate: [
      guestGuard
    ],

    loadComponent: () =>
      import(
        './pages/register/register.component'
      ).then(
        m => m.RegisterComponent
      )
  },

  {
    path: 'movies',

    canActivate: [
      authGuard
    ],

    loadComponent: () =>
      import(
        './pages/movies/movies.component'
      ).then(
        m => m.MoviesComponent
      )
  },

  {
    path: 'movies/:id',

    canActivate: [
      authGuard
    ],

    loadComponent: () =>
      import(
        './pages/movie-details/movie-details.component'
      ).then(
        m => m.MovieDetailsComponent
      )
  },

  {
  path: 'saved-movies',

  canActivate: [
    authGuard
  ],

  loadComponent: () =>
    import(
      './pages/saved-movies/saved-movies.component'
    ).then(
      m => m.SavedMoviesComponent
    )
},

  {
    path: 'ratings',

    canActivate: [
      authGuard
    ],

    loadComponent: () =>
      import(
        './pages/ratings/ratings.component'
      ).then(
        m => m.Ratings
      )
  },

   {
    path: 'recommendations',

    canActivate: [
      authGuard
    ],

    loadComponent: () =>
      import(
        './pages/recommendations/recommendations'
      ).then(
        m => m.Recommendations
      )
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'movies'
  },

  {
    path: '**',
    redirectTo: 'movies'
  }
];