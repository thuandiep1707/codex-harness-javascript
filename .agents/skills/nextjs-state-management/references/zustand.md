# Zustand in Next.js

Best practices for using Zustand, a lightweight and flexible state management library, following community standards (e.g., [TKDodo's Recommendations](https://tkdodo.eu/blog/working-with-zustand)).

## **Priority: P1 (STANDARD)**

Focus on performance through atomic subscriptions and clean state/action separation.

## Core Rules

1.  **Atomic Selectors**: Always select only the piece of state you need to avoid unnecessary re-renders.
2.  **Separate Actions from State**: Group functions that update state into a separate `actions` object within the store.
3.  **Only Export Custom Hooks**: Hide the base store hook and only export specific hooks for state and actions.
4.  **Actions as Events**: Model actions as "events" (`cart/itemAdded`) rather than simple "setters" (`cart/setCount`), keeping logic in the store.

## Implementation Example

```tsx
// src/store/useUserStore.ts
import { create } from 'zustand';

interface UserState {
  name: string;
  age: number;
  actions: {
    setName: (name: string) => void;
    incrementAge: () => void;
  };
}

// ⬇️ Private base hook
const useUserBase = create<UserState>((set) => ({
  name: '',
  age: 0,
  actions: {
    setName: (name) => set({ name }),
    incrementAge: () => set((state) => ({ age: state.age + 1 })),
  },
}));

// 💡 Export specific custom hooks
export const useUserName = () => useUserBase((state) => state.name);
export const useUserAge = () => useUserBase((state) => state.age);
export const useUserActions = () => useUserBase((state) => state.actions);
```

## Next.js Integration (App Router)

To handle hydration safely and avoid "Text content did not match" errors:

```tsx
// src/hooks/useHasHydrated.ts
import { useState, useEffect } from 'react';

export function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);
  return hasHydrated;
}
```

Usage in components:

```tsx
'use client';
import { useUserName } from '@/store/useUserStore';
import { useHasHydrated } from '@/hooks/useHasHydrated';

export function ProfileHeader() {
  const name = useUserName();
  const hydrated = useHasHydrated();

  // Show nothing or a skeleton until client hydration is complete
  if (!hydrated) return null;
  return <h1>Welcome, {name}</h1>;
}
```

## Next.js Integration (App Router Per-Request Store Hydration)

If you need to initialize a Zustand store with server data (from Server Components / TanStack Query prefetch), use a **Context Provider** with `createStore` and `useRef` to ensure a fresh store instance per request:

### 1. Store Factory & Context Provider

```tsx
// src/store/store-provider.tsx
'use client';

import { createContext, useContext, useRef, ReactNode } from 'react';
import { createStore, useStore } from 'zustand';

export const createMyStore = (initState: any) => {
  return createStore((set) => ({
    ...initState,
  }));
};

const StoreContext = createContext<ReturnType<typeof createMyStore> | null>(null);

export const StoreProvider = ({ children, initialState }: { children: ReactNode; initialState: any }) => {
  const storeRef = useRef<ReturnType<typeof createMyStore>>(null);
  if (!storeRef.current) {
    storeRef.current = createMyStore(initialState);
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export const useAppStore = (selector: any) => {
  const store = useContext(StoreContext);
  if (!store) throw new Error('Missing StoreProvider in tree');
  return useStore(store, selector);
};
```

### 2. Usage in Server Component (RSC)

```tsx
// app/dashboard/page.tsx
import { StoreProvider } from '@/store/store-provider';

export default async function DashboardPage() {
  const initialData = await fetchServerData();

  return (
    <StoreProvider initialState={initialData}>
      <ClientDashboard />
    </StoreProvider>
  );
}
```

## Anti-Patterns

- **Massive Hooks**: Avoid `const { name, age, actions } = useUserStore()`. This subscribes the component to EVERY change in the store.
- **Direct State Mutation**: Never mutate state outside of the `set` function.
- **Static Stores for SSR**: Do not use a single static store if you need to initialize it with dynamic server data. Use the custom hook/context pattern if you must sync server data into Zustand.
- **Logic in Components**: Don't calculate the new state in the component. Call `actions.doSomething()` and let the store handle the math.
