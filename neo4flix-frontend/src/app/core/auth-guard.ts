import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

function isTokenValid(token: string | null): boolean {

  if (!token) {
    return false;
  }

  try {
    const parts = token.split('.');

    if (parts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(
      atob(parts[1])
    );

    if (!payload.exp) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);

    return payload.exp > now;

  } catch {
    return false;
  }
}

function clearAuth(): void {

  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
}

export const authGuard: CanActivateFn = () => {

  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = localStorage.getItem('token');

  if (isTokenValid(token)) {
    return true;
  }

  clearAuth();

  return router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {

  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = localStorage.getItem('token');

  if (isTokenValid(token)) {
    return router.createUrlTree(['/movies']);
  }

  if (token) {
    clearAuth();
  }

  return true;
};
