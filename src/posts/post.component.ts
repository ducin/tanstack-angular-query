import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { PostsHTTPService } from './api/posts-http.service';
import { CommentsHTTPService } from './api/comments-http.service';
import type { Post } from './model/Post';
import type { Comment } from './model/Comment';
import { injectUsersVM } from '../users/api/userQueries';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'post',
  standalone: true,
  imports: [RouterLink],
  styles: `
    .blog-post {
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 5px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .blog-post h1 {
        margin-top: 0;
        margin-bottom: 10px;
    }
    .blog-post p {
        margin: 0;
        color: #495057;
    }
    .blog-post .author {
        font-style: italic;
        color: #868e96;
        margin: 4px 0;
    }
  `,
  template: `
    <div>
      <div>
        <a [routerLink]="['/posts']"> Back </a>
      </div>
      @if (postQuery.status() === 'pending') {
        Loading...
      } @else if (postQuery.status() === 'error') {
        Error: {{ postQuery.error()?.message }}
      }
      @if (postQuery.data(); as post) {
        <div class="blog-post">
          <h1>{{ post.title }}</h1>
          <p class="author">Written by: {{ usersVM.getAuthorNameByPostId(post) }}</p>
          <p>{{ post.body }}</p>
        </div>
        @if (postQuery.isFetching()) {
          Background Updating...
        }
      }
    </div>
  `,
})
export class PostComponent {
  postId = input<number>();

  #postsHTTP = inject(PostsHTTPService);
  #commentsHTTP = inject(CommentsHTTPService);

  postQuery = injectQuery(() => ({
    enabled: Number(this.postId()) > 0,
    staleTime: 1000 * 60 * 5,
    queryKey: ['posts', this.postId()],
    queryFn: async (): Promise<Post> => {
      return lastValueFrom(this.#postsHTTP.getPost(this.postId()!));
    },
  }));

  commentsQuery = injectQuery(() => ({
    enabled: Number(this.postId()) > 0,
    queryKey: ['comments', this.postId()],
    queryFn: async (): Promise<Comment[]> => {
      return lastValueFrom(this.#commentsHTTP.getAllPostComments(this.postId()!));
    },
  }));

  queryClient = injectQueryClient();

  usersVM = injectUsersVM()
}
