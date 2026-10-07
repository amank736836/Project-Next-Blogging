/**
 * In-memory persistence for the real Mongoose `Post` model.
 *
 * Why this exists
 * ---------------
 * The harness must exercise the real route handlers in `src/app/api/**`
 * without a MongoDB instance — none is reachable from CI or from this sandbox.
 *
 * Design decision (learned the hard way — see harness/bugs/... notes):
 * we do NOT `vi.mock('@/models/Post')`. Mocking that specifier would also
 * intercept this module's own import of the schema and deadlock module
 * resolution. Instead we `vi.spyOn` the *statics* of the genuine model object
 * that the route handlers already hold a reference to. Consequences:
 *
 *   Faithful   : schema validation (required / enum / type) runs through the
 *                real `src/models/Post.js` via `new Post(doc).validateSync()`
 *                timestamps, _id, and findOneAndUpdate({ new: true }) semantics
 *                the route module sees exactly the object it imported
 *   NOT faithful: query language (shallow equality only), unique index
 *                (raised as ValidationError, not E11000), transactions,
 *                projections, sorting, pagination, wire-level behaviour.
 *
 * Anything needing true database behaviour belongs in the manual scenarios in
 * harness/test-scenarios/database.md, not here.
 */
import mongoose from 'mongoose';
import { vi } from 'vitest';

export class HarnessValidationError extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Replaces the data-access statics of `Model` with array-backed stand-ins.
 * @returns a store handle exposing _seed/_all/_count/_reset for assertions.
 */
export function installFakePersistence(Model, seed = []) {
  const docs = [];

  const clone = (doc) => ({ ...doc });
  const matches = (doc, query = {}) =>
    Object.entries(query).every(([key, value]) => String(doc[key]) === String(value));

  const validateAgainstRealSchema = (candidate) => {
    const error = new Model(candidate).validateSync();
    if (error) throw new HarnessValidationError(error.message, error.errors);
  };

  const store = {
    _seed(list) {
      docs.length = 0;
      for (const item of list) docs.push({ ...item });
      return store;
    },
    _all: () => docs.map(clone),
    _count: () => docs.length,
    _reset() {
      docs.length = 0;
    },
  };

  vi.spyOn(Model, 'find').mockImplementation(async (query = {}) =>
    docs.filter((d) => matches(d, query)).map(clone)
  );

  vi.spyOn(Model, 'findOne').mockImplementation(async (query = {}) => {
    const hit = docs.find((d) => matches(d, query));
    return hit ? clone(hit) : null;
  });

  vi.spyOn(Model, 'create').mockImplementation(async (payload) => {
    validateAgainstRealSchema(payload);
    if (payload.slug && docs.some((d) => d.slug === payload.slug)) {
      throw new HarnessValidationError(`Post validation failed: slug (duplicate: ${payload.slug})`, {
        slug: { message: 'Path `slug` must be unique.' },
      });
    }
    const now = new Date().toISOString();
    const doc = {
      _id: new mongoose.Types.ObjectId().toString(),
      status: 'active',
      ...payload,
      createdAt: now,
      updatedAt: now,
    };
    docs.push(doc);
    return clone(doc);
  });

  vi.spyOn(Model, 'findOneAndUpdate').mockImplementation(
    async (query = {}, payload = {}, options = {}) => {
      const index = docs.findIndex((d) => matches(d, query));
      if (index === -1) return null;
      const previous = clone(docs[index]);
      // The real route calls this WITHOUT runValidators — deliberately kept
      // unfaithful-to-ideal, faithful-to-code. That gap is BUG-004.
      const next = { ...docs[index], ...payload, updatedAt: new Date().toISOString() };
      docs[index] = next;
      return options.new === false ? previous : clone(next);
    }
  );

  vi.spyOn(Model, 'findOneAndDelete').mockImplementation(async (query = {}) => {
    const index = docs.findIndex((d) => matches(d, query));
    if (index === -1) return null;
    const [removed] = docs.splice(index, 1);
    return clone(removed);
  });

  store._seed(seed);
  return store;
}

export default installFakePersistence;
