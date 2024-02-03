import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { fromEvent, lastValueFrom, map, switchMap, takeUntil } from 'rxjs';

import { Post } from './model/Post';
import { PostsHTTPService } from '../app/posts/api/posts-http.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'post',
  standalone: true,
  template: `
    <div>
      <div>
        <a (click)="setPostId.emit(-1)" href="#"> Back </a>
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
  @Output() setPostId = new EventEmitter<number>();

  #postsHTTP = inject(PostsHTTPService);
  #route = inject(ActivatedRoute);
  #routeParams = toSignal(this.#route.paramMap, { requireSync: true });
  #postId = computed(() => +this.#routeParams().get('postId')!);

  // TODO: REDESIGN - dumping observable (routing/toSignal) into a signal and then sending HTTP via rxjs and accessing the ID through a signal
  postQuery = injectQuery(() => ({
    enabled: this.#postId() > 0,
    queryKey: ['post', this.#postId()],
    queryFn: async (context): Promise<Post> => {
      // Cancels the request when component is destroyed before the request finishes
      const abort$ = fromEvent(context.signal, 'abort');
      return lastValueFrom(this.#postsHTTP.getPost$(this.#postId()).pipe(
        takeUntil(abort$)
      ));
    },
  }));

  queryClient = injectQueryClient();
}
