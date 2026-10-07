#!/usr/bin/env bash
# Run the whole harness. Exits non-zero if any stage fails.
#
# Usage:
#   bash harness/automation/scripts/run-all.sh
#
# Stages 1-3 need no environment. Stage 4 needs a running server; it is skipped
# (not failed) when nothing is listening on HARNESS_BASE_URL.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT"

RUN_ID="${HARNESS_RUN_ID:-RUN-$(date +%Y-%m-%d)-$(date +%H%M%S)}"
BASE_URL="${HARNESS_BASE_URL:-http://127.0.0.1:3000}"
export HARNESS_RUN_ID="$RUN_ID" HARNESS_BASE_URL="$BASE_URL"

fail=0
stage() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }
ok()    { printf '    \033[32mPASS\033[0m %s\n' "$1"; }
bad()   { printf '    \033[31mFAIL\033[0m %s\n' "$1"; fail=$((fail+1)); }

echo "Run ID : $RUN_ID"
echo "Repo   : $ROOT"

stage "1/4 Lint"
if npm run lint --silent; then ok "eslint clean"; else bad "eslint reported problems"; fi

stage "2/4 Unit + integration (Vitest)"
if npm test --silent; then ok "vitest suite green"; else bad "vitest suite failed"; fi

stage "3/4 Coverage"
if npm run test:coverage --silent >/dev/null 2>&1; then
  ok "coverage written to harness/test-results/latest/coverage/"
  node -e '
    const c=require("./harness/test-results/latest/coverage/coverage-summary.json").total;
    console.log("    lines "+c.lines.pct+"%  functions "+c.functions.pct+"%  branches "+c.branches.pct+"%");
    console.log("    (src/components/motion/** and src/components/demo/** are excluded)");
  '
else
  bad "coverage run failed"
fi

stage "4/4 Live smoke"
if curl -sf -o /dev/null --max-time 3 "$BASE_URL/"; then
  if node harness/automation/scripts/api-smoke.mjs; then
    ok "smoke suite green"
  else
    bad "smoke reported failing checks (exit code = number of failures)"
  fi
else
  printf '    \033[33mSKIP\033[0m nothing listening on %s\n' "$BASE_URL"
  cat <<'HINT'
    Start a server first:
      npm run build   # needs MONGO_URI and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      MONGO_URI="mongodb://127.0.0.1:27017/harness_smoke?serverSelectionTimeoutMS=1500" \
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<placeholder>" \
      CLERK_SECRET_KEY="<placeholder>" \
        npx next start -H 0.0.0.0 -p 3000
HINT
fi

printf '\n\033[1m%s\033[0m\n' "Run $RUN_ID finished with $fail failing stage(s)."
exit "$fail"
