import { Provider, inject } from '@angular/core';
import { InjectionToken } from '@angular/core';

const API_URL = new InjectionToken<string>('api.url');
export const injectAPIURL = () => inject(API_URL);

export const APIURLProvider: Provider = { provide: API_URL, useValue: 'https://jsonplaceholder.typicode.com' }
