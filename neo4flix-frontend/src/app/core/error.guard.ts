import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree
} from '@angular/router';

import { ErrorStateService } from './error-state.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorGuard implements CanActivate {

  constructor(
    private router: Router,
    private errorState: ErrorStateService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean | UrlTree {

    const code = Number(
      route.paramMap.get('code')
    );

    const validErrorCodes = [
      400,
      401,
      403,
      404,
      500
    ];

    if (
      validErrorCodes.includes(code) &&
      this.errorState.canAccessErrorPage(code)
    ) {
      return true;
    }

    return this.router.createUrlTree(['/movies']);
  }
}