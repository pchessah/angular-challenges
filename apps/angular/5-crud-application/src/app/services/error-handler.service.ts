import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService implements ErrorHandler {
  handleError(error: unknown): void {
    const timestamp = new Date().toISOString();
    if (error instanceof HttpErrorResponse) {
      console.error(
        `[${timestamp}] HTTP Error:`,
        error.message,
        'Status:',
        error.status,
        error,
      );
      alert(
        'An error occurred while fetching the data. Please try again later.',
      );
    } else if (error instanceof Error) {
      console.error(
        `[${timestamp}] Client-side Error:`,
        error.message,
        error.stack,
      );
      alert(
        'An error occurred while fetching the data. Please try again later.',
      );
    } else {
      console.error(`[${timestamp}] Unknown Error:`, error);
      alert(
        'An error occurred while fetching the data. Please try again later.',
      );
    }
  }
}
