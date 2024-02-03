import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Post } from '../../../posts/model/Post';
import { injectAPIURL } from '../../../api-token';

@Injectable({
  providedIn: 'root'
})
export class PostsHTTPService {

  #HTTP = inject(HttpClient)
  #URL = injectAPIURL();

  posts$ = this.#HTTP.get<Post[]>(
    `${this.#URL}/posts`
  );

  getPost$ = (postId: number) => {
    return this.#HTTP.get<Post>(
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
  };
}
