# FEAT-011 · Test cases — index

| Sheet | Cases |
| --- | --- |
| [../../test-cases/post-api/negative.md](../../test-cases/post-api/negative.md) | TC-NEG-001…005, SMK-20 |
| Live smoke | SMK-12 (404 routing) |

There is **no case for `app/error.js` or `app/not-found.js`**. Both are client components
and both are testable with Testing Library:

```jsx
// sketch — not yet written
render(<ErrorBoundary error={new Error('x'.repeat(500))} reset={spy} />);
expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
expect(screen.getByText(/x{10,}/).textContent).toHaveLength(320);
```

`NotFound` needs only `next/link` and the motion components mocked.
