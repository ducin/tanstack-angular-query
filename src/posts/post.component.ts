import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, RouterLink } from '@angular/router';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { fromEvent, lastValueFrom, map, switchMap, takeUntil } from 'rxjs';

import { Post } from './model/Post';
import { PostsHTTPService } from '../app/posts/api/posts-http.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'post',
  standalone: true,
  imports: [RouterLink],
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
        <h1>{{ post.title }}</h1>
        <div>
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
  postId = input<number>(0);

  #postsHTTP = inject(PostsHTTPService);
  e = effect(() => console.log('postId', this.postId()))
  // #route = inject(ActivatedRoute);
  // #routeParams = toSignal(this.#route.paramMap, { requireSync: true });
  // #postId = computed(() => +this.#routeParams().get('postId')!);

  // TODO: REDESIGN - dumping observable (routing/toSignal) into a signal and then sending HTTP via rxjs and accessing the ID through a signal
  postQuery = injectQuery(() => ({
    enabled: this.postId()! > 0,
    queryKey: ['posts', this.postId()],
    queryFn: async (): Promise<Post> => {
      return lastValueFrom(this.#postsHTTP.getPost$(this.postId()!));
    },
  }));

  queryClient = injectQueryClient();
}
