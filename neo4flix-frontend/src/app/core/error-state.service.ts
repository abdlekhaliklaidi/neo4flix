import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorStateService {

  private errorCode: number | null = null;

  setError(code: number): void {
    this.errorCode = code;
  }

  canAccessErrorPage(code: number): boolean {
    return this.errorCode === code;
  }

  clearError(): void {
    this.errorCode = null;
  }
}