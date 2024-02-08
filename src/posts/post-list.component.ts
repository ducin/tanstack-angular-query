import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { PostsHTTPService } from '../app/posts/api/posts-http.service';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'posts',
  standalone: true,
  imports: [RouterLink],
  template: `<div>
    <h1>Posts</h1>
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
    <div>
      @if (postsQuery.isFetching()) {
        Background Updating...
      }
    </div>
  </div> `,
})
export class PostListComponent {
  #postsHTTP = inject(PostsHTTPService)

  postsQuery = injectQuery(() => ({
    queryKey: ['posts'],
    queryFn: () => lastValueFrom(this.#postsHTTP.posts$),
  }));

  queryClient = injectQueryClient();
}
