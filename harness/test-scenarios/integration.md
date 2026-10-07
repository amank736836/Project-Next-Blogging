# Integration scenarios

Where two systems meet. Most of these need real services, which is why so many are manual —
and why they are written down rather than quietly dropped.

## Frontend → backend

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-INT-01 | The composer calls `/api/upload` then `/api/posts` in order, with the returned URL. | AUTOMATED | TC-UI-032 (against a mocked service — proves the *call sequence and payload*) |
| SCN-INT-02 | `PostService` builds the query string correctly for every `getPosts` combination. | NOT_EXECUTED — `src/services/config.js` is at 0% coverage | — |
| SCN-INT-03 | A failed list fetch renders the empty shelf. | NOT_EXECUTED — page at 0% coverage | — |

## Backend → database

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-INT-04 | The route handlers reach Mongoose with the expected query. | AUTOMATED — via the spy on the real model's statics | TC-API-001…011 |
| SCN-INT-05 | A real unique-index violation (E11000) is turned into a sensible HTTP status. | BLOCKED — no MongoDB. The fake raises `ValidationError`, not `E11000` | — |
| SCN-INT-06 | A real MongoDB query with a compound filter behaves like the fake's shallow equality. | BLOCKED — no MongoDB | — |
| SCN-INT-07 | The cached connection is reused across warm invocations. | NOT_EXECUTED — `src/lib/db.js` at 0% coverage | — |

## Backend → external services

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-INT-08 | A real upload lands in the Cloudinary `blog_posts` folder and the `secure_url` is servable. | BLOCKED — no Cloudinary account | — |
| SCN-INT-09 | A Cloudinary outage surfaces as a 500 without crashing the process. | AUTOMATED — against a mocked provider | TC-NEG-005 |
| SCN-INT-10 | An image whose `secure_url` is not on `res.cloudinary.com` fails to render through `next/image`. | NOT_EXECUTED | — |

## Authentication → everything

| SCN ID | Scenario | Status | Case |
| --- | --- | --- | --- |
| SCN-INT-11 | Sign in, create a post, sign out — the post survives and its `userId` matches. | BLOCKED — needs a Clerk tenant and a database | — |

**4 of 11 automated.** This is the weakest layer, and the reason is environmental rather
than effort: there is no MongoDB, no Cloudinary account and no Clerk tenant available, and
their download/API hosts are not reachable from this environment.
