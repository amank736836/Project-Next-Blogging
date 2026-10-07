# Performance scenarios

**Nothing in this file has been load-tested.** There is no performance harness, no k6 or
Artillery configuration, and no browser to measure paint metrics with. What *is* recorded
below is real, but it is loopback timing from the smoke run — and the caveats matter more
than the numbers.

## What was actually measured

Source: [../test-results/latest/smoke-result.json](../test-results/latest/smoke-result.json),
`RUN-2026-10-07-001`, 20 sequential requests to `http://127.0.0.1:3000` from the same
machine.

| Route | First hit | Warm hit |
| --- | --- | --- |
| `GET /` | 39 ms (`SMK-01`) | 5 ms (`SMK-19`) |
| `GET /demo` | 7 ms | — |
| `GET /features` | 8 ms | — |
| `GET /pricing` | 6 ms | — |
| `GET /contact` | 7 ms | — |
| `GET /privacy` | 6 ms | — |
| `GET /terms` | 7 ms | — |
| `GET /login` | 9 ms | — |
| `GET /signup` | 6 ms | — |
| `GET /all-posts` | 6 ms | — |
| `GET /add-post` | 5 ms | — |
| unknown route (404) | 6 ms | — |
| `GET /api/posts` (DB down) | 7 ms | 4 ms |

Median **6 ms**, min **4 ms**, max **39 ms**.

### Why these numbers must not be quoted as TTFB

1. **Loopback.** Client and server on the same host; no network, no TLS.
2. **Served from Next's prerender cache.** `GET /` returned `x-nextjs-cache: HIT` and
   `x-nextjs-prerender: 1` — these are static payloads, not rendered responses.
3. **No database work.** Every API call short-circuited on a refused MongoDB connection,
   so no query time is included at all.
4. **One request at a time.** No concurrency, so nothing here says anything about
   throughput.
5. **A cold sandbox**, not a Vercel region.

The project's own `/features` page advertises *"98 ms median TTFB"*
(`src/app/features/page.js:47`). That figure has never been measured by anyone as far as
this repository shows. `UNKNOWN / REQUIRES VALIDATION`.

## Scenarios that need real measurement

| SCN ID | Scenario | Metric to capture | Status |
| --- | --- | --- | --- |
| SCN-PERF-01 | The archive with 500 posts. | Fetch time, first paint, scroll frame time | NOT_EXECUTED — blocked: no MongoDB |
| SCN-PERF-02 | The prerendered marketing pages, in a real region over TLS. | TTFB, LCP, CLS | NOT_EXECUTED |
| SCN-PERF-03 | A long archive with tilt + parallax + ambient active. | Main-thread time, dropped frames | NOT_EXECUTED — blocked: no browser |
| SCN-PERF-04 | `GET /api/posts` with no `limit`. | Response size and time vs collection size | NOT_EXECUTED — blocked: no MongoDB |
| SCN-PERF-05 | The article hero as the LCP element. | LCP, image decode time | NOT_EXECUTED — blocked: no browser |
| SCN-PERF-06 | An 8 MB upload inside a serverless function. | Duration, peak memory | NOT_EXECUTED — blocked: no Cloudinary |
| SCN-PERF-07 | 50 concurrent readers on one article. | p95 latency, error rate | NOT_EXECUTED |
| SCN-PERF-08 | 20 concurrent writers creating posts. | p95 latency, duplicate-slug rate | NOT_EXECUTED |
| SCN-PERF-09 | Cold-start latency of an API route after idle. | Time to first byte after 5 min idle | NOT_EXECUTED |
| SCN-PERF-10 | Mongoose connection reuse across warm invocations. | Connect count over 100 requests | NOT_EXECUTED |
| SCN-PERF-11 | Bundle weight shipped to a first-time visitor. | JS bytes, request count | NOT_EXECUTED |

**0 of 11 executed.**

## Structural risks that measurement will probably confirm

These are read from the code, not measured:

* **`GET /api/posts` has no limit, projection or pagination**
  (`src/app/api/posts/route.js:20`). Response size grows linearly with the collection.
* **Home and shelf both fetch and then filter client-side**, so the whole result set is
  shipped to the browser to be searched in memory.
* **Uploads are buffered whole into memory** (`Buffer.from(await file.arrayBuffer())`)
  before being streamed to Cloudinary.
* **GSAP, TinyMCE and Clerk all ship to the client.** `npm run build` reports no bundle
  analysis; `NOT_EXECUTED`.
* **`firebase` and `firebase-admin` are installed but never imported**
  ([BUG-018](../bugs/open/BUG-018-unused-dependencies.md)). They are server-only packages,
  so they should not reach the client bundle — but they inflate install time and the
  dependency surface for nothing.

## A minimal, dependency-free way to start

The harness already ships a sequential HTTP runner. For a rough concurrency probe without
adding a framework:

```bash
# 50 sequential warm requests to the archive
for i in $(seq 1 50); do
  curl -s -o /dev/null -w '%{time_total}\n' http://127.0.0.1:3000/api/posts
done | sort -n | awk '{a[NR]=$1} END {print "p50", a[int(NR*0.5)], "p95", a[int(NR*0.95)]}'
```

That is a floor, not a benchmark — it measures the same warm, database-less path as the
smoke run. Record whatever it produces in
[../test-results/](../test-results/README.md) with the caveats attached.
