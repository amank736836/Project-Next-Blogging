# FEAT-004 · Test cases — index

| Sheet | Cases |
| --- | --- |
| [../../test-cases/post-api/positive.md](../../test-cases/post-api/positive.md) | TC-API-006, TC-API-007 |
| [../../test-cases/post-api/negative.md](../../test-cases/post-api/negative.md) | TC-SEC-004 |
| [../../test-cases/archive-ui/positive.md](../../test-cases/archive-ui/positive.md) | TC-UI-013…016 (the card that links here, same ownership logic) |
| [../../test-cases/archive-ui/negative.md](../../test-cases/archive-ui/negative.md) | TC-SEC-009, TC-SEC-010 |

There is **no case sheet for the page component yet** — see
[known-issues.md](known-issues.md). Adding one means mocking `@/services/config`,
`@clerk/nextjs`, `next/image`, `next/navigation`, `@/components/ui/ScrollProgress` and
`html-react-parser` can stay real.
