import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { injectAPIURL } from '../../api-token';
import type { Comment } from '../model/Comment';
import type { Post } from '../model/Post';

@Injectable({
  providedIn: 'root'
})
export class CommentsHTTPService {

  #HTTP = inject(HttpClient)
  #URL = injectAPIURL();

  getAllPostComments = (postId: Post['id']) => {
    // return this.#HTTP.get<Comment[]>(`${this.#URL}/comments?postid=${postId}`);
    return this.#HTTP.get<Comment[]>(`${this.#URL}/posts/${postId}/comments`);
  };
}
