import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';

import { PostsHTTPService } from '../app/posts/api/posts-http.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'posts',
  standalone: true,
  imports: [RouterLink],
  template: `<div>
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
            <p>
              <a
                [routerLink]="['/posts', post.id]"
                [style]="
                  queryClient.getQueryData(['post', post.id])
                    ? {
                        fontWeight: 'bold',
                        color: 'green'
                      }
                    : {}
                "
                >{{ post.title }}</a
              >
            </p>
          }
        </div>
      }
    }
  </div>
`,
})
export class PostListComponent {
  #postsHTTP = inject(PostsHTTPService)

  postsQuery = injectQuery(() => ({
    queryKey: ['posts'],
    queryFn: () => lastValueFrom(this.#postsHTTP.getAllPosts()),
  }));

  deletePostMutation = injectMutation(() => ({
    mutationFn: (todoId: number) =>
      lastValueFrom(this.#postsHTTP.deletePost(todoId)),
  }))

  queryClient = injectQueryClient();
}
