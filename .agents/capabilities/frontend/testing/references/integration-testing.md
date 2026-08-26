# Integration Testing with Vitest & React Testing Library

> **When to use**: Testing component rendering, user interactions (clicks, typing, form submits), state integration (Zustand/React Query), and DDD module boundary contracts without launching a real browser.
> **Prerequisites**: Vitest, React Testing Library (`@testing-library/react`), User Event (`@testing-library/user-event`), MSW (Mock Service Worker) or Axios mock adapter.

## Quick Reference

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';

// Render component and simulate click
render(<LoginForm onSuccess={handleSuccess} />);
await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
```

---

## File Placement & Directory Rules

In accordance with repository rules (`.agents/rules/testing.md`):

1. **Module-Specific Integration Tests**: Place in the owning module's `__tests__/integration/` directory:
   - Path: `src/modules/<context>/__tests__/integration/<scenario>.test.tsx`
2. **Cross-Module Integration Tests**: Place in the repository root integration directory:
   - Path: `tests/integration/<flow-name>.test.tsx`

### Placement Structure

```text
src/
└── modules/
    └── auth/
        ├── presentation/
        │   └── components/
        │       └── login-form.tsx
        └── __tests__/
            └── integration/
                └── login-flow.test.tsx      # Module Integration Test
```

---

## Patterns & Implementation Code

### Pattern 1: Component User Interaction & Form Validation

**Use when**: Verifying form submission, input validation, and user feedback messages.

```typescript
// src/modules/auth/presentation/components/login-form.tsx
import React, { useState } from 'react';

export function LoginForm({ onSubmit }: { onSubmit: (data: { email: string }) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Invalid email address');
      return;
    }
    setError('');
    await onSubmit({ email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Sign In</button>
    </form>
  );
}
```

```typescript
// src/modules/auth/__tests__/integration/login-form.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from '../../presentation/components/login-form';

describe('LoginForm Integration', () => {
  it('displays validation error when submitting invalid email', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email address');
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit callback with valid payload when submitted', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(handleSubmit).toHaveBeenCalledWith({ email: 'user@example.com' });
  });
});
```

---

### Pattern 2: Mocking HTTP Boundaries with MSW (Mock Service Worker)

**Use when**: Testing components or hooks that make real HTTP calls to external API endpoints.

```typescript
// src/modules/user/__tests__/integration/user-list.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { UserList } from '../../presentation/components/user-list';

// Define API handlers
const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ]);
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('UserList Component Integration', () => {
  it('fetches and renders users from API', async () => {
    render(<UserList />);

    // Initially loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for API data to render
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  it('renders error state when API returns 500', async () => {
    server.use(
      http.get('/api/users', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to load users/i);
    });
  });
});
```

---

## Best Practices & Anti-Patterns

| Recommended Practice | Anti-Pattern to Avoid |
|---|---|
| Use `userEvent` over `fireEvent` for realistic DOM events | Don't use `fireEvent.change()` for complex inputs |
| Query elements by ARIA role (`getByRole('button', { name })`) | Don't query by implementation details (class names, div containers) |
| Use MSW to intercept requests at HTTP boundary | Don't mock internal service implementations deep inside the component |
| Wrap async assertions in `await waitFor(...)` or `findByText()` | Don't add manual delays like `setTimeout()` |

---

## Runner Execution

To execute integration tests during agent self-testing:

```bash
# Run all integration tests
npx vitest run src/modules/**/__tests__/integration/

# Run a specific integration test file
npx vitest run src/modules/auth/__tests__/integration/login-flow.test.tsx
```
