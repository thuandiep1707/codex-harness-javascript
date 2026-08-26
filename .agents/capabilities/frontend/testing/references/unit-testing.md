# Unit Testing with Vitest

> **When to use**: Testing pure functions, domain entities, domain services, utility modules, or custom React hooks in isolation without rendering full component trees or starting browser instances.
> **Prerequisites**: Vitest runner (`npx vitest run`), React Testing Library for custom hooks.

## Quick Reference

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Pure function test
expect(calculateTotal([10, 20])).toBe(30);

// Async function / promise assertion
await expect(fetchUserData('123')).resolves.toEqual({ id: '123' });

// Custom hook test
const { result } = renderHook(() => useCounter(0));
act(() => { result.current.increment(); });
expect(result.current.count).toBe(1);
```

---

## File Placement & Naming Rules

In accordance with repository rules (`.agents/rules/testing.md`):

1. **Colocation Principle**: Unit tests MUST be placed right next to the implementation file inside `src/`.
2. **File Naming**:
   - Logic / Service / Utility: `<name>.test.ts`
   - React Hook / Component Helper: `<name>.test.tsx`

### Placement Examples

```text
src/
├── lib/
│   └── utils/
│       ├── format-currency.ts
│       └── format-currency.test.ts      # Colocated Utility Test
└── modules/
    └── <context>/
        ├── domain/
        │   └── services/
        │       ├── calculate-discount.ts
        │       └── calculate-discount.test.ts  # Colocated Domain Service Test
        └── presentation/
            └── hooks/
                ├── use-toggle.ts
                └── use-toggle.test.ts          # Colocated Hook Test
```

---

## Patterns & Implementation Code

### Pattern 1: Pure Functions & Domain Logic

**Use when**: Testing business rules, math calculations, data transformations, string formatting, or validation functions.

```typescript
// src/modules/order/domain/services/calculate-discount.ts
export interface DiscountInput {
  subtotal: number;
  promoCode?: string;
}

export function calculateDiscount({ subtotal, promoCode }: DiscountInput): number {
  if (subtotal <= 0) return 0;
  if (promoCode === 'SAVE20') return subtotal * 0.2;
  if (promoCode === 'SAVE10') return subtotal * 0.1;
  return 0;
}
```

```typescript
// src/modules/order/domain/services/calculate-discount.test.ts
import { describe, it, expect } from 'vitest';
import { calculateDiscount } from './calculate-discount';

describe('calculateDiscount', () => {
  it('returns 0 discount for subtotal <= 0', () => {
    expect(calculateDiscount({ subtotal: 0, promoCode: 'SAVE20' })).toBe(0);
    expect(calculateDiscount({ subtotal: -50, promoCode: 'SAVE20' })).toBe(0);
  });

  it('calculates 20% discount for SAVE20 code', () => {
    const discount = calculateDiscount({ subtotal: 100, promoCode: 'SAVE20' });
    expect(discount).toBe(20);
  });

  it('calculates 10% discount for SAVE10 code', () => {
    const discount = calculateDiscount({ subtotal: 150, promoCode: 'SAVE10' });
    expect(discount).toBe(15);
  });

  it('returns 0 for unknown promo code', () => {
    const discount = calculateDiscount({ subtotal: 100, promoCode: 'INVALID' });
    expect(discount).toBe(0);
  });
});
```

---

### Pattern 2: Custom React Hooks

**Use when**: Testing client-side stateful hooks, form state logic, toggles, or data calculation hooks without attaching them to full UI components.

```typescript
// src/modules/shared/presentation/hooks/use-counter.ts
import { useState, useCallback } from 'react';

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = useCallback(() => setCount((prev) => prev + 1), []);
  const decrement = useCallback(() => setCount((prev) => prev - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
}
```

```typescript
// src/modules/shared/presentation/hooks/use-counter.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './use-counter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it('increments counter when increment() is called', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('resets counter to initial value', () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(10);
  });
});
```

---

### Pattern 3: Mocking External Seams Cleanly

**Use when**: A domain service or utility depends on an external module (e.g. `logger`, `crypto`, `date`), but you want to test the service logic deterministically.

```typescript
// src/lib/logger/logger.ts
export const logger = {
  error: (msg: string) => console.error(msg),
};
```

```typescript
// src/modules/user/domain/services/user-validator.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateUserEmail } from './user-validator';
import { logger } from '@/lib/logger/logger';

// Mock logger module
vi.mock('@/lib/logger/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('validateUserEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs error and returns false for invalid email format', () => {
    const isValid = validateUserEmail('invalid-email-string');
    expect(isValid).toBe(false);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid email format'));
  });
});
```

---

## Golden Rules for Unit Testing

1. **Test Behavior, Not Private Implementation**: Assert on output return values or state changes, not private helper functions.
2. **Keep Tests Deterministic & Instant**: Unit tests should execute in under 10ms per file. Never perform real network requests or arbitrary timeouts.
3. **Colocate Test Files**: Never place unit tests in a separate top-level `tests/unit/` folder — keep them next to source code in `src/`.
4. **Isolate State Between Tests**: Use `beforeEach(() => { vi.clearAllMocks(); })` to prevent leaks between test cases.

---

## Runner Execution

To execute unit tests during agent self-testing:

```bash
# Run all unit tests
npx vitest run

# Run a specific unit test file
npx vitest run src/modules/order/domain/services/calculate-discount.test.ts

# Watch mode during local development
npx vitest
```
