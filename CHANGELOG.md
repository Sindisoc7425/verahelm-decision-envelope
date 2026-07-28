# Changelog

## 0.4.0 — 2026-07-28

- Added an offline verification quickstart and pull-request workflow.
- Separated API, schema, verifier-kit, Action, and public-code version streams.
- Added lifecycle verification for expiry, revocation, and supersession.
- Defined the public-code license and private implementation boundary.
- Bound the pull-request trust key to an independently configured SHA-256 fingerprint.
- Expanded the first-party-sourced category comparison and documented where Verahelm is narrower.

## 0.3.0 — 2026-07-28

Initial public release candidate:

- Offline Decision Envelope validation and verification.
- Signed revocation and supersession verification, JWK support, and documented exit codes.
- Minimal-permission verification-only Action and fictional lifecycle fixtures.
- Digest-only local evidence adapters.
- Exact plan limits and operation-unit policy.
- Default-deny allowlist, checksums, and disclosure gates.
