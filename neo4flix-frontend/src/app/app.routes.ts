import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  { 
    path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
},

  { 
    path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) 
},

  { 
    path: 'movies', canActivate: [authGuard], loadComponent: () => import('./pages/movies/movies.component').then(m => m.MoviesComponent) 
},
  
  { 
    path: '', pathMatch: 'full', redirectTo: 'movies' 
},
  { 
    path: '**', redirectTo: 'movies' 
}
];

// { 
//     // path: 'recommendations', canActivate: [authGuard], loadComponent: () => import('./pages/recommendations/recommendations.component').then(m => m.RecommendationsComponent) 
// },
//   { 
//     // path: 'my-ratings', canActivate: [authGuard], loadComponent: () => import('./pages/ratings/ratings.component').then(m => m.MyRatingsComponent) 
// },