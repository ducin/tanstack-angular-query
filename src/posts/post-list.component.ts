import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';

import { PostsHTTPService } from './api/posts-http.service';
import { injectUsersQuery, injectUsersVM } from '../users/api/userQueries';
import type { User } from '../users/model/User';
import type { Post } from './model/Post';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'posts',
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
    .blog-post h2 {
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
    .delete-button {
        background-color: #dc3545;
        color: #fff;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    .delete-button:hover {
        background-color: #c82333;
    }  
`,
  template: `
<div>
  <h1>Posts</h1>
  <div>
    @if (postsQuery.isFetching()) {
      Background Updating...
    }
  </div>
  @switch (postsQuery.status()) {
    @case ('pending') {
      Loading...
    }
    @case ('error') {
      Error: {{ postsQuery.error()?.message }}
    }
    @default {
      <div class="todo-container">
        @for (post of postsQuery.data(); track post.id) {
          <!-- <p>
            <a
              [routerLink]="['/posts', post.id]"
              [style]="postStyles(post.id)"
            ></a>
            by {{ getAuthorNameByPostId(post.id) }}
            <button (click)="deletePostMutation.mutate(post.id)">☠️</button>
          </p> -->
          <div class="blog-post">
              <a
                [routerLink]="['/posts', post.id]"
                [style]="postStyles(post.id)"
              ><h2>{{ post.title }}</h2></a>
              <p class="author">by {{ usersVM.getAuthorNameByPostId(post) }}</p>
              <button class="delete-button" (click)="deletePostMutation.mutate(post.id)">Delete</button>
          </div>
        }
      </div>
    }
  }
</div>
`,
})
export class PostListComponent {
  #postsHTTP = inject(PostsHTTPService)
  #queryClient = injectQueryClient();

  postStyles(postId: number) {
    const styles = this.#queryClient.getQueryData(['posts', postId])
      ? {
          fontWeight: 'bold',
          color: 'green'
        }
      : {}
    return styles;
  }

  postsQuery = injectQuery(() => ({
    queryKey: ['posts'],
    staleTime: 1000 * 60 * 5,
    queryFn: () => lastValueFrom(this.#postsHTTP.getAllPosts()),
  }));

  deletePostMutation = injectMutation(() => ({
    mutationFn: (todoId: number) =>
      lastValueFrom(this.#postsHTTP.deletePost(todoId)),
      onSuccess: () => {
        this.#queryClient.invalidateQueries({ queryKey: ['posts'] })
      }
  }));

  usersVM = injectUsersVM();

  // usersQuery = injectUsersQuery()

  // usersMap = computed(() => {
  //   const users = this.usersQuery.data();
  //   return users ? users.reduce((acc, user) => {
  //     acc[user.id] = user;
  //     return acc;
  //   }, {} as Record<number, User>) : {};
  // })

  // getAuthorNameByPostId(postId: Post['id']){
  //   const posts = this.postsQuery.data();
  //   const usersMap = this.usersMap();
  //   if(posts && usersMap){
  //     const post = posts.find(post => post.id === postId);
  //     return post ? usersMap[post.userId].name : undefined;
  //   }
  //   return;
  // }
}
