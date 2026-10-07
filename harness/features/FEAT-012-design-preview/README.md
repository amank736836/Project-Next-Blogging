# FEAT-012 · Design preview (`/demo`)

```text
Feature:        A fixture-driven page that renders the whole interface kit with no
                database, no Cloudinary and no account.
Purpose:        Let a developer or designer review components in both themes before
                wiring them up. The project's own README recommends exactly this.
User:           Developers and testers.
Entry Point:    /demo (src/app/demo/page.js)
Dependencies:   src/components/demo/fixtures.js (DEMO_POSTS, DEMO_AUTHOR_ID, withAuthor);
                local images in public/demo/*.jpg; almost every presentational component.
Inputs:         None.
Outputs:        A long page of sections: archive grid, article layout, interface kit.
Business Rules: None.
Expected Behavior:
                - Renders without MONGO_URI, CLOUDINARY_* or a Clerk session.
                - Excluded from search indexing: metadata.robots = { index: false,
                  follow: false }.
                - Not linked from the site navigation.
Error Handling: The global boundary.
Permissions:    Public — it is not gated. Anyone who knows the URL can load it.
Related APIs:   None.
Related Database Tables: None.
Related UI:     app/demo/page.js, components/demo/{DemoPreview,fixtures}.js,
                public/demo/{dunes,fog-lake,rain-window}.jpg.
Existing Tests: SMK-02 — GET /demo answers 200 on a server whose MONGO_URI points at a
                database that is not running. That is precisely the property this route
                exists to provide, and it is verified.
Missing Tests:  No assertion that robots is noindex (verified by reading the source).
                No rendering test for DemoPreview.
                No test that the fixtures stay in sync with the real Post shape.
Known Issues:   None.
Status:         IMPLEMENTED — verified for the property that matters (no database needed).
```

## Why this route is useful to the harness

`/demo` is the only place in the application where UI can be reviewed with **zero external
dependencies**. That makes it the natural target for:

* manual visual checks in both themes;
* any future screenshot or visual-regression automation;
* proving that the static half of the site is independent of MongoDB and Clerk data.

`SMK-02` ran against a server whose `MONGO_URI` pointed at `127.0.0.1:27017` with nothing
listening, and `/demo` still returned `200`.

## Fixture / model drift risk

`fixtures.js` hand-writes objects that mirror `Post`. It includes `slug`, `title`,
`featuredImage`, `status`, `createdAt` and `content` — but **not** `userId` (added by the
`withAuthor` helper) and **not** `updatedAt`. If the schema gains a field the fixtures will
silently diverge. A cheap guard would be a test that runs the real schema over every
fixture:

```js
for (const p of DEMO_POSTS.map(withAuthor)) expect(new Post(p).validateSync()).toBeFalsy();
```

Not yet written — see [test-scenarios.md](test-scenarios.md) `SCN-DEMO-04`.
