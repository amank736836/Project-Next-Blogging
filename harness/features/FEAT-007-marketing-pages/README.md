# FEAT-007 · Marketing & legal pages

```text
Feature:        The four public, non-authenticated content pages.
Purpose:        Explain the product, state the price, and publish the legal terms.
User:           Anyone.
Entry Point:    /features · /pricing · /privacy · /terms
Dependencies:   PageHeader, LegalLayout, landing components, motion helpers.
                No database, no Clerk state, no API.
Inputs:         /pricing has a billing-period toggle (monthly / yearly) and an FAQ
                accordion. /privacy and /terms take a SECTIONS array and render a sticky
                index that tracks scroll via IntersectionObserver.
Outputs:        Static, prerendered HTML.
Business Rules: None.
Expected Behavior:
                - All four render for a signed-out visitor.
                - /pricing recomputes displayed prices when the billing toggle changes
                  (Free 0/0, Pro 12/9, Studio 49/39 per month).
                - /privacy and /terms highlight the section currently in view.
Error Handling: The global error boundary (FEAT-011).
Permissions:    Public.
Related APIs:   None.
Related Database Tables: None.
Related UI:     app/{features,pricing,privacy,terms}/page.js,
                components/ui/{PageHeader,LegalLayout}.jsx, components/landing/*
Existing Tests: SMK-03, SMK-04, SMK-06, SMK-07 (live, HTTP 200 each).
Missing Tests:  No component-level tests. The pricing toggle arithmetic, the FAQ
                accordion state, and the legal index's IntersectionObserver tracking are
                all unverified. Line coverage: 0% for all four pages.
Known Issues:   BUG-014 (no security headers on these responses).
Status:         IMPLEMENTED — UNTESTED beyond "the route answers 200".
```

## Marketing claims that have never been measured

`app/features/page.js` asserts `98 ms` median TTFB and `under 4 minutes` to first post.
Neither has ever been measured by anyone, and nothing in this harness reports them as
verified. See [../../requirements/non-functional-requirements.md](../../requirements/non-functional-requirements.md)
§Performance targets and [../../test-scenarios/performance.md](../../test-scenarios/performance.md).

`/pricing` also describes capabilities that do not exist in the code — "Custom slugs &
redirects", "Reading-time + word metrics" as a Pro feature, "Newsletter dispatch hooks",
"Up to 10 writers", "Shared editorial queue", "Annual invoice & SSO". There is no billing,
no plan model, no team concept and no feature gating anywhere in the repository.
`UNKNOWN / REQUIRES VALIDATION`: whether this page is intended as aspirational copy.
