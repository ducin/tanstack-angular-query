import { computed, inject } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { injectQuery } from "@tanstack/angular-query-experimental";

import { UsersHTTPService } from "./users-http.service";
import type { User } from "../model/User";
import { Post } from "../../posts/model/Post";

export const usersKeys = {
  all: ['users'] as const,
  list: () => [...usersKeys.all] as const,
  detail: (id: User['id']) => [...usersKeys.all, id] as const,
}

export function injectUsersQuery(){
  const usersHTTP = inject(UsersHTTPService);
  return injectQuery(() => ({
    queryKey: usersKeys.list(),
    queryFn: () => lastValueFrom(usersHTTP.getAllUsers()),
  }));  
}

export function injectUsersVM(){
  const usersHTTP = inject(UsersHTTPService);

  const usersQuery = injectQuery(() => ({
    queryKey: usersKeys.list(),
    queryFn: () => lastValueFrom(usersHTTP.getAllUsers()),
  }));

  const usersIdMap = computed(() => {
    const users = usersQuery.data();
    return users ? users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as Record<number, User>) : {};
  })

  function getAuthorNameByPostId(post: Post){
    const usersMap = usersIdMap();
    return usersMap[post.userId].name;
  }

  return {
    usersQuery,
    getAuthorNameByPostId,
  }
}
