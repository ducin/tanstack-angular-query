import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Post } from '../model/Post';
import { injectAPIURL } from '../../api-token';

@Injectable({
  providedIn: 'root'
})
export class PostsHTTPService {

  #HTTP = inject(HttpClient)
  #URL = injectAPIURL();

  getAllPosts = () => {
    return this.#HTTP.get<Post[]>(`${this.#URL}/posts`);
  };

  getPost = (postId: number) => {
    return this.#HTTP.get<Post>(`${this.#URL}/posts/${postId}`);
  };

  deletePost = (postId: number) => {
    return this.#HTTP.delete<void>(`${this.#URL}/posts/${postId}`);
  };
}
