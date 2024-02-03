import { provideRouter, Routes } from '@angular/router';

import { PostListComponent } from './posts/post-list.component';
import { PostComponent } from './posts/post.component';

export const routes: Routes = [
  { path: 'posts/:postId', component: PostComponent },
  { path: 'posts', component: PostListComponent },
  { path: '',   redirectTo: '/posts', pathMatch: 'full' }
];

export const appRoutes = provideRouter(routes)
