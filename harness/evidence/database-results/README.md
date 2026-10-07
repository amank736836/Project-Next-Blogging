# Database results

Empty. There is no MongoDB in this environment, so no query was ever executed against a real
database. Every database assertion in this harness is either schema-level (the real Mongoose
schema, compiled in-process) or backed by the in-memory persistence fake — see
[../../test-tools/database/README.md](../../test-tools/database/README.md) for exactly what
that substitution does and does not prove.

When a MongoDB instance is available, the manual procedure in
[../../test-scenarios/database.md](../../test-scenarios/database.md) produces the artefacts
that belong here. Name them `<RUN-ID>-<scenario>.json`.
