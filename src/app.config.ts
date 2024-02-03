import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { provideAngularQuery } from '@tanstack/angular-query-experimental';
import { QueryClient } from '@tanstack/angular-query-experimental';

import { appRoutes } from './app.routing';
import { APIURLProvider } from './api-token';

export const appConfig: ApplicationConfig = {
  providers: [
    APIURLProvider,
    appRoutes,
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
