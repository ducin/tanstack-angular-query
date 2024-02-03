import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Post } from '../../../posts/model/Post';
import { injectAPIURL } from '../../../app.config';

@Injectable({
  providedIn: 'root'
})
export class PostsHTTPService {

  #HTTP = inject(HttpClient)
  #URL = injectAPIURL();

  posts$ = this.#HTTP.get<Array<Post>>(
    `${this.#URL}/posts`
  );
}
