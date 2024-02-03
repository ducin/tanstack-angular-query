import { ApplicationConfig, inject } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAngularQuery } from '@tanstack/angular-query-experimental';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { InjectionToken } from '@angular/core';

const API_URL = new InjectionToken<string>('api.url');
export const injectAPIURL = () => inject(API_URL);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_URL, useValue: 'https://jsonplaceholder.typicode.com' },
    provideHttpClient(withFetch()),
    provideAngularQuery(
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
          },
        },
      })
    ),
  ]
};
