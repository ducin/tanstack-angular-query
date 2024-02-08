import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { injectAPIURL } from '../../api-token';
import type { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class UsersHTTPService {

  #HTTP = inject(HttpClient)
  #URL = injectAPIURL();

  getAllUsers = () => {
    return this.#HTTP.get<User[]>(`${this.#URL}/users`);
  };
}
