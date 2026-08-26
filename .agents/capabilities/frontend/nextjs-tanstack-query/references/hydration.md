# Next.js App Router Prefetch and Hydration

Read this reference only when the approved task explicitly includes server prefetch, dehydration, and
client hydration. Ordinary Server Component fetching or client-only queries do not require this
pattern.

The current browser provider lives at `src/components/providers/query-provider/index.tsx` and is
composed by `src/app/layout.tsx`. Its current defaults are evidence, not approval to change or
standardize them.

## Decide whether hydration is warranted

Record:

- why prefetched cache state improves the route's user experience, latency, or request waterfall;
- why direct Server Component rendering or a client-only query is insufficient;
- the owning context, approved read operation, and client consumer;
- the exact shared key/options contract;
- freshness and immediate-refetch behavior after hydration;
- authentication, tenant/user/locale/permission identity;
- serializability and sensitive-data exposure;
- prefetch failure and approved route/component state behavior; and
- browser/build scenarios for duplicate requests, navigation, and isolation.

Stop at `tanstack-query-architecture-approval-required` if any required decision remains deferred.

## Keep client lifetimes separate

Use distinct responsibilities:

1. **Browser provider client:** the existing client owned by `QueryProvider`, reused by the browser
   application.
2. **Server prefetch client:** a request-scoped `QueryClient` created for one server prefetch boundary
   and discarded after dehydration.

Never create a module-level server QueryClient shared across requests. Never create another global
browser provider for one feature. Multiple local HydrationBoundary instances may be appropriate when
they match independent route/screen boundaries; they do not require multiple browser providers.

## Share only an approved query contract

When server prefetch and client consumption must agree, use the same approved key and compatible query
function/options contract. A typed `queryOptions` factory may reduce drift, but it must remain at a
framework-aware edge and receive an approved application-facing operation; it must not force
TanStack Query into application/domain or make presentation import infrastructure directly.

Do not invent a project-wide query-options directory, key factory, or dependency wiring convention.

## Compose a local prefetch boundary

At responsibility level, an approved Server Component may:

1. Create a new server QueryClient for that request/boundary.
2. Prefetch the approved query options.
3. Dehydrate only the intended cache state.
4. Wrap the client presentation subtree in `HydrationBoundary`.

Keep the route thin. Prefer an owning server composition component when prefetch orchestration would
otherwise make the route own feature behavior. Read installed Next.js 16 documentation before
choosing page, layout, parallel-route, or nested Server Component placement.

Parallelize only independent prefetches. Inspect sequential awaits across nested Server Components
for request waterfalls. Do not move every prefetch to a root layout merely to share a QueryClient;
that can broaden data ownership and serialized cache scope.

## Do not use Server Actions as query functions

Do not pass a Next.js Server Action as a client-refetchable `queryFn`. Client queries may refetch in
parallel and repeatedly, while Server Action execution/serialization semantics are not a compatible
general read transport. Use an approved client-callable API/RPC/infrastructure seam instead.

A Server Action may be considered for a mutation only when its command, authorization, serialization,
error, concurrency, and cache-effect contracts are explicitly approved. Its existence does not decide
whether to invalidate, update, or optimistically change the Query cache.

## Protect serialization and data ownership

- Do not dehydrate credentials, tokens, private error details, server-only objects, or data the client
  is unauthorized to receive.
- Include complete safe resource identity in keys; never rely on cache separation alone as an
  authorization boundary.
- Verify custom values are serializable under the chosen Next.js/TanStack path.
- Decide how prefetch failures interact with existing route/error boundaries; do not invent fallback
  UI or convert an error into empty data.
- Set freshness behavior deliberately to avoid unintended immediate refetch after hydration.
- Treat server and client rendering of the same data as one ownership/revalidation decision; avoid
  rendering a stale Server Component copy beside independently revalidated client cache data.

## Server Prefetch & Hydration Code Blueprint

### Step 1: Request-Scoped `QueryClient` Creator Pattern

Use React `cache()` to create a `QueryClient` that lives strictly for the duration of a single server request. This guarantees cross-request isolation.

```ts
// src/lib/react-query/get-query-client.ts
import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';
import { cache } from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Prevent immediate refetch on client hydration
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = cache(() => {
  if (isServer) {
    // Server: Always create a new request-scoped QueryClient
    return makeQueryClient();
  } else {
    // Browser: Create once if not existing
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
});
```

---

### Step 2: Server Component Prefetch Route

Prefetch data on the server in a Server Component route/layout, dehydrate the state, and pass it to `HydrationBoundary`.

```tsx
// src/app/(routes)/users/page.tsx (Server Component)
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { usersListQueryOptions } from '@/modules/user/presentation/queries/user-query-options';
import { UserListView } from '@/modules/user/presentation/components/user-list-view';

interface UsersPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const { page = '1', search = '' } = await searchParams;
  const queryClient = getQueryClient();

  const queryParams = { page: Number(page), search };

  // 1. Prefetch query options on the server
  await queryClient.prefetchQuery(usersListQueryOptions(queryParams));

  // 2. Dehydrate server cache state
  const dehydratedState = dehydrate(queryClient);

  // 3. Render HydrationBoundary around Client Component
  return (
    <HydrationBoundary state={dehydratedState}>
      <UserListView queryParams={queryParams} />
    </HydrationBoundary>
  );
}
```

---

### Step 3: Client Component Consumption

The Client Component consumes `useQuery` with the **exact same** `queryOptions` used for prefetching. It receives prefetched data instantly without duplicate network requests.

```tsx
// src/modules/user/presentation/components/user-list-view.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import type { GetUsersParams } from '../../application/ports/user-api.port';
import { usersListQueryOptions } from '../queries/user-query-options';

interface UserListViewProps {
  queryParams: GetUsersParams;
}

export function UserListView({ queryParams }: UserListViewProps) {
  // Consumes dehydrated cache automatically on first render
  const { data, isLoading, isError, error } = useQuery(usersListQueryOptions(queryParams));

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {data?.items.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Recipe B1: Parallel Multi-Query Server Prefetch (`Promise.all`)

Prefetch multiple independent queries concurrently on the server to avoid request waterfalls.

```tsx
// src/app/(routes)/dashboard/page.tsx (Server Component)
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { userDetailQueryOptions } from '@/modules/user/presentation/queries/user-query-options';
import { analyticsQueryOptions } from '@/modules/analytics/presentation/queries/analytics-query-options';
import { DashboardView } from '@/modules/dashboard/presentation/components/dashboard-view';

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  // 1. Parallelize independent query prefetches
  await Promise.all([
    queryClient.prefetchQuery(userDetailQueryOptions('me')),
    queryClient.prefetchQuery(analyticsQueryOptions({ period: '30d' })),
  ]);

  // 2. Dehydrate combined cache
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <DashboardView />
    </HydrationBoundary>
  );
}
```

---

### Recipe B2: SSR Dynamic `searchParams` Hydration

Prefetch filtered / paginated list based on Next.js 16 async `searchParams`.

```tsx
// src/app/(routes)/products/page.tsx (Server Component)
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { productListQueryOptions } from '@/modules/product/presentation/queries/product-query-options';
import { ProductListView } from '@/modules/product/presentation/components/product-list-view';

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; page?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const queryClient = getQueryClient();

  const filterParams = {
    category: resolvedParams.category ?? 'all',
    page: Number(resolvedParams.page ?? '1'),
    sort: resolvedParams.sort ?? 'newest',
  };

  // Prefetch with dynamic key based on searchParams
  await queryClient.prefetchQuery(productListQueryOptions(filterParams));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView filterParams={filterParams} />
    </HydrationBoundary>
  );
}
```

---

### Recipe B3: Auth Bootstrap Server Hydration

Prefetch authenticated user profile on server layout to hydrate session state instantly on client mount.

```tsx
// src/app/(routes)/app/layout.tsx (Server Component Layout)
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { userMeQueryOptions } from '@/modules/auth/presentation/queries/auth-query-options';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  // Prefetch current user session profile
  await queryClient.prefetchQuery(userMeQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
```


## Validate the boundary

Verify:

- server rendering and production build;
- first client mount and hydration console/runtime errors;
- query-key/options parity between prefetch and client use;
- immediate refetch and duplicate network requests;
- cross-request user/tenant isolation;
- serialized cache content and error redaction;
- navigation, remount, and freshness behavior;
- prefetch failure and approved state handling;
- independent-query parallelism and request waterfalls; and
- lint, typecheck, direct consumers, and only the test layer approved by the Decision Gate.

Do not adopt experimental TanStack streaming packages or pending-query dehydration as part of an
ordinary hydration task; treat either as a dependency/runtime architecture change requiring a new
approved plan and current official documentation.

