# Project Query and Mutation Patterns

Read this reference only after the task-local architecture decisions in `SKILL.md` are approved.
These patterns describe responsibilities and TanStack Query mechanics; they do not approve file
paths, query-key naming, retry/freshness defaults, dependency wiring, or a global factory convention.

## Preserve the DDD seam

Use this direction:

```text
presentation query binding ──► application operation/port ◄── infrastructure implementation
```

- Domain owns invariants and must not import TanStack Query, React, Axios, or browser APIs.
- Application owns framework-free inputs, outputs, errors, use cases, and ports.
- Infrastructure implements approved application ports and maps transport data/errors.
- Presentation binds an already composed application operation to `useQuery` or `useMutation`.
- Delivery owns route composition; shared UI/templates do not own business keys or query behavior.

Do not import an infrastructure implementation directly from presentation. Because the repository has
not approved a general composition/wiring convention, inspect the owning context and stop for
approval rather than inventing a facade, service locator, singleton repository, or constructor path.

## Design a query contract

Record before implementation:

1. Owning context and application read operation.
2. Typed input, result, expected errors, and cancellation support.
3. Complete resource identity, including tenant/user/locale/filter/pagination inputs where relevant.
4. Query key and whether any prefix matching is intentionally supported.
5. Enabled/skip conditions.
6. Freshness, retry, refetch, and garbage-collection behavior only where approved defaults are
   insufficient.
7. Pending, error, empty, permission, offline, and cancellation behavior.
8. Direct consumers and cache-sharing expectations.

The visual handling of these states must follow `.agents/rules/frontend/async-states.md`; the query
skill does not approve spinners, skeletons, error cards, retries, or empty-state copy.

## Use typed query options conditionally

TanStack Query v5 `queryOptions` can colocate a key and query function with type inference. Consider
it when at least two approved consumers need the same contract, especially client `useQuery` and
server `prefetchQuery`.

Illustrative responsibility shape:

```ts
import { queryOptions } from '@tanstack/react-query';

type LoadResource = (input: { resourceId: string; signal?: AbortSignal }) => Promise<ResourceDto>;

export function resourceQueryOptions(loadResource: LoadResource, resourceId: string) {
  return queryOptions({
    queryKey: ['approved-context', 'resource', resourceId] as const,
    queryFn: ({ signal }) => loadResource({ resourceId, signal }),
  });
}
```

`ResourceDto`, key segments, function location, and dependency composition are placeholders. Do not
create this abstraction for one consumer or place it in application/domain merely to share it; it
imports TanStack Query and therefore belongs at a framework-aware edge approved by the owning
context.

## Bind a client query

Keep the Client Component or presentation hook narrow. Receive or import only an approved composed
application-facing operation. Do not fetch through a new ad hoc transport from the component.

Validate:

- key changes refetch the correct identity;
- disabled queries do not execute;
- abort signals reach an operation that supports cancellation;
- data/error types remain explicit;
- remount and navigation match approved freshness behavior; and
- no second copy of server state is maintained in local state, Context, or a store.

Creating a project-authored hook still requires the approval described by
`.agents/rules/frontend/react-state-runtime.md`.

## Design a mutation contract

Record before implementation:

1. Owning application command/use case and typed input/result/error.
2. Authorization, validation, duplicate-submit, cancellation, concurrency, and retry assumptions.
3. Exact cached resources that become stale or can be updated from an authoritative response.
4. Whether invalidation, direct cache update, or no cache action is correct.
5. Whether mutation completion waits for invalidation/refetch.
6. Whether optimistic UI is justified and how rollback/reconciliation handles overlap.

Use `useQueryClient` inside the approved presentation binding for cache operations. Never instantiate
a browser `QueryClient` per component.

## Invalidate or update deliberately

- Invalidate the narrowest approved key/prefix representing stale data.
- Use exact matching when a prefix would affect unrelated resources.
- Use `setQueryData` only when the mutation result is authoritative for the complete cached shape.
- Await invalidation only when the approved UI/command contract requires fresh data before success.
- Do not use global refetch, broad removal, or cache clearing to compensate for an incorrect key model.

## Gate optimistic updates

Use an optimistic update only after approving its UX value and concurrency semantics. Define query
cancellation, snapshot, optimistic write, rollback, authoritative reconciliation, and overlapping
mutation behavior. Validate at least one failure and overlapping-action scenario; happy-path success
is insufficient.

## DDD File Placement Guidelines

Query bindings and mutation hooks belong exclusively to the **Presentation layer** of an approved bounded context. They must wrap Application-layer ports/use-cases and never import Infrastructure adapters directly.

```text
src/modules/<context>/
├── application/
│   ├── ports/                     # Framework-free TypeScript interfaces (e.g. UserApiPort)
│   └── use-cases/                 # Framework-free application logic/functions
└── presentation/
    ├── queries/                   # Typed queryOptions factories & read hooks
    │   ├── user-keys.ts           # Query key factory for the context/entity
    │   └── get-users.query.ts     # queryOptions & useUsersQuery hook
    ├── mutations/                 # Typed useMutation hooks & cache management
    │   └── create-user.mutation.ts # useCreateUserMutation hook
    └── components/                # UI components consuming presentation query hooks
```

---

## Code Recipes & Blueprints

### Recipe 1: Query Key Factory & `queryOptions` (List & Detail)

Use typed key factories to guarantee consistency across queries, invalidations, and prefetching.

```ts
// src/modules/user/presentation/queries/user-query-options.ts
import { queryOptions } from '@tanstack/react-query';
import type { GetUsersParams, UserDto } from '../../application/ports/user-api.port';
import { getUsersUseCase, getUserByIdUseCase } from '../../application/use-cases';

// 1. Key Factory Pattern
export const userKeys = {
  all: ['user'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: GetUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// 2. Query Options for Paginated / Filtered List
export function usersListQueryOptions(params: GetUsersParams) {
  return queryOptions({
    queryKey: userKeys.list(params),
    queryFn: ({ signal }) => getUsersUseCase({ ...params, signal }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// 3. Query Options for Single Detail
export function userDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: ({ signal }) => getUserByIdUseCase({ id, signal }),
    enabled: Boolean(id),
  });
}
```

---

### Recipe 2: Client Query Hook Binding

Wrap `queryOptions` in a custom hook inside presentation to expose a clean interface to UI components.

```ts
// src/modules/user/presentation/queries/use-users-query.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import type { GetUsersParams } from '../../application/ports/user-api.port';
import { usersListQueryOptions } from './user-query-options';

export function useUsersQuery(params: GetUsersParams) {
  return useQuery(usersListQueryOptions(params));
}
```

---

### Recipe 3: Mutation with Query Invalidation

Use `useMutation` to execute writes and invalidate affected query key prefixes on success.

```ts
// src/modules/user/presentation/mutations/use-create-user-mutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateUserPayload, UserDto } from '../../application/ports/user-api.port';
import { createUserUseCase } from '../../application/use-cases';
import { userKeys } from '../queries/user-query-options';

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUserUseCase(payload),
    onSuccess: (_newUser: UserDto) => {
      // Invalidate all user list queries so UI refetches fresh data
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
```

---

### Recipe 4: Optimistic Update with Rollback

Use optimistic updates only when immediate visual feedback is required and concurrency is managed.

```ts
// src/modules/user/presentation/mutations/use-update-user-mutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateUserPayload, UserDto } from '../../application/ports/user-api.port';
import { updateUserUseCase } from '../../application/use-cases';
import { userKeys } from '../queries/user-query-options';

export function useUpdateUserMutation(userId: string) {
  const queryClient = useQueryClient();
  const detailKey = userKeys.detail(userId);

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUserUseCase({ id: userId, ...payload }),
    
    // 1. Cancel ongoing refetches so they don't overwrite optimistic result
    onMutate: async (newPayload) => {
      await queryClient.cancelQueries({ queryKey: detailKey });

      // 2. Snapshot current cache state for rollback
      const previousUser = queryClient.getQueryData<UserDto>(detailKey);

      // 3. Optimistically update the query data
      if (previousUser) {
        queryClient.setQueryData<UserDto>(detailKey, {
          ...previousUser,
          ...newPayload,
        });
      }

      // Return context containing snapshot
      return { previousUser };
    },

    // 4. Rollback to snapshot on failure
    onError: (_err, _newPayload, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(detailKey, context.previousUser);
      }
    },

    // 5. Always revalidate cache after error or success to guarantee synchronization
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: detailKey });
    },
  });
}
```

---

### Recipe 5: POST Create -> Direct Cache Insert

Prepend newly created item directly to the list cache to eliminate extra HTTP requests.

```ts
// src/modules/user/presentation/mutations/use-create-user-direct-insert.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateUserPayload, UserDto, PaginatedResult } from '../../application/ports/user-api.port';
import { createUserUseCase } from '../../application/use-cases';
import { userKeys } from '../queries/user-query-options';

export function useCreateUserDirectInsertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUserUseCase(payload),
    onSuccess: (newUser: UserDto) => {
      // Direct cache insertion into default list query
      queryClient.setQueriesData<PaginatedResult<UserDto>>(
        { queryKey: userKeys.lists() },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: [newUser, ...oldData.items],
            total: oldData.total + 1,
          };
        }
      );
    },
  });
}
```

---

### Recipe 6: DELETE Detail -> Cache Eviction & Navigate Back

Evict deleted item from cache using `removeQueries` and navigate back using `router.back()`.

```ts
// src/modules/user/presentation/mutations/use-delete-user-mutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { deleteUserUseCase } from '../../application/use-cases';
import { userKeys } from '../queries/user-query-options';

export function useDeleteUserMutation(userId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => deleteUserUseCase({ id: userId }),
    onSuccess: () => {
      // 1. Evict detail query cache
      queryClient.removeQueries({ queryKey: userKeys.detail(userId) });

      // 2. Invalidate lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // 3. Navigate back to previous page
      router.back();
    },
  });
}
```

---

### Recipe 7: PATCH/PUT Update -> Dual Invalidation

Invalidate both detail and list queries after a successful update.

```ts
// src/modules/user/presentation/mutations/use-update-user-dual-invalidate.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateUserPayload } from '../../application/ports/user-api.port';
import { updateUserUseCase } from '../../application/use-cases';
import { userKeys } from '../queries/user-query-options';

export function useUpdateUserDualInvalidateMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUserUseCase({ id: userId, ...payload }),
    onSuccess: () => {
      // Invalidate both specific detail and list views
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
```

---

### Recipe 8: Context-Wide / Global Revalidation

Invalidate all query key variations under `userKeys.all` when a major context event occurs.

```ts
// src/modules/user/presentation/mutations/use-reset-user-context-mutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetUserContextUseCase } from '../../application/use-cases';
import { userKeys } from '../queries/user-query-options';

export function useResetUserContextMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resetUserContextUseCase(),
    onSuccess: () => {
      // Invalidate ALL queries prefixed with 'user'
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
```

---

### Recipe 9: Infinite List Query (`useInfiniteQuery`)

Implement infinite scroll or "Load More" pagination with `useInfiniteQuery`.

```ts
// src/modules/user/presentation/queries/use-users-infinite-query.ts
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getUsersUseCase } from '../../application/use-cases';
import { userKeys } from './user-query-options';

export function useUsersInfiniteQuery(search: string) {
  return useInfiniteQuery({
    queryKey: [...userKeys.lists(), 'infinite', search] as const,
    queryFn: ({ pageParam = 1, signal }) =>
      getUsersUseCase({ page: pageParam, search, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
  });
}
```

---

### Recipe 10: Debounced / Search Query

Maintain previous data during search/filter typing using `placeholderData`.

```ts
// src/modules/user/presentation/queries/use-user-search-query.ts
'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { usersListQueryOptions } from './user-query-options';

export function useUserSearchQuery(searchQuery: string, page: number) {
  return useQuery({
    ...usersListQueryOptions({ search: searchQuery, page }),
    placeholderData: keepPreviousData, // Keeps previous list visible while fetching new search results
  });
}
```

---

### Recipe 11: Client Route Prefetch

Prefetch query data on mouse hover or link focus on client before user navigates.

```tsx
// src/modules/user/presentation/components/user-card.tsx
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { userDetailQueryOptions } from '../queries/user-query-options';

export function UserCard({ userId, name }: { userId: string; name: string }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    // Prefetch detail data into cache on hover
    queryClient.prefetchQuery(userDetailQueryOptions(userId));
  };

  return (
    <div onMouseEnter={handleMouseEnter} className="p-4 border rounded">
      <h3>{name}</h3>
    </div>
  );
}
```

---

### Recipe 12: Manual Refresh / Refetch

Execute manual refetch or reset query state from a UI button click.

```tsx
// src/modules/user/presentation/components/refresh-button.tsx
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { userKeys } from '../queries/user-query-options';

export function RefreshUserListButton() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.refetchQueries({ queryKey: userKeys.lists() });
  };

  return <button onClick={handleRefresh}>Refresh List</button>;
}
```

---

### Recipe 13: Error Boundary Integration (`throwOnError`)

Delegate query errors to Next.js `error.tsx` boundary.

```ts
// src/modules/user/presentation/queries/use-critical-user-query.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { userDetailQueryOptions } from './user-query-options';

export function useCriticalUserQuery(id: string) {
  return useQuery({
    ...userDetailQueryOptions(id),
    throwOnError: true, // Forwards error to nearest React / Next.js ErrorBoundary
  });
}
```

---

## Obey configured static checks

`eslint.config.mjs` already loads `@tanstack/eslint-plugin-query`'s `flat/recommended` rules. Run
targeted lint after changing query code and resolve exhaustive-dependency, stable-client,
unstable-dependency, property-order, and other configured findings at their cause. Do not disable the
plugin in feature code.


