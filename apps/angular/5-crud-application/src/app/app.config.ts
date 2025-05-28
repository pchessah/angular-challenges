import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { ErrorHandlerService } from './services/error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
  ],
};
