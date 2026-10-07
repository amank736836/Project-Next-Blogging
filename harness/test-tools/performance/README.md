# Performance testing tools

**There is no performance harness in this project.** No k6, Artillery, Lighthouse or
autocannon configuration exists, and none was added. What follows is what *was* measured,
and the cheapest way to extend it.

## What was measured

The smoke script records `durationMs` for each of its 20 requests. That is the only timing
data in this harness. From `RUN-2026-10-07-001`: median **6 ms**, min **4 ms**, max **39 ms**
(the max is the cold first hit of `GET /`; the same route warm was 5 ms).

Full table and caveats: [../../test-scenarios/performance.md](../../test-scenarios/performance.md).

## Why those numbers are not TTFB

Loopback, same host, no TLS. Served from Next's prerender cache (`x-nextjs-cache: HIT`).
No database work — every API call short-circuited on a refused connection. One request at a
time. A cold sandbox, not a Vercel region.

They say the application *starts and answers*. Nothing more.

## Extending without a new framework

The smoke script is 20 checks in dependency-free Node. A concurrency probe can reuse the
same primitives:

```bash
for i in $(seq 1 50); do
  curl -s -o /dev/null -w '%{time_total}\n' http://127.0.0.1:3000/api/posts
done | sort -n | awk '{a[NR]=$1} END {print "p50", a[int(NR*0.5)], "p95", a[int(NR*0.95)]}'
```

Still a floor, not a benchmark. Label it as such wherever it is recorded.

## What real measurement would need

| Need | Why |
| --- | --- |
| A MongoDB with representative data | There is no `limit` on `GET /api/posts`, so response time is a function of collection size |
| A browser | LCP, CLS, main-thread time, dropped frames under GSAP |
| A real Clerk tenant | Auth round-trip cost, currently invisible |
| A real Cloudinary account | Upload latency, and the 8 MB buffering path |
| A deployed region over TLS | Any TTFB figure that means anything |

Until then, every performance scenario stays `NOT_EXECUTED` — including the "98 ms median
TTFB" claim on the app's own `/features` page, which nothing in this repository substantiates.
