# Decision Envelope specification 1.0

Status: public contract. Normative schema: [`schemas/decision-envelope.schema.json`](schemas/decision-envelope.schema.json).

## Purpose

A Decision Envelope carries a signed, bounded authorization record. It references evidence by digest; it does not contain raw evidence.

## Required bindings

- `envelope_id`: object identifier.
- `subject`: exact kind, identifier, and immutable version digest.
- `authority`: customer authority identifier and type.
- `scope`: bounded environment and change.
- `evidence_refs`: typed SHA-256 references.
- `decision`: `pass` or `blocked`, plus explicit conditions.
- `lifecycle`: issuance and expiry, with optional revocation or supersession.
- `issuer`: public issuer and key identifier.
- `signature`: Ed25519 signature over canonical `payload`.

Objects reject undeclared properties. Timestamps are UTC RFC 3339 values. Digests use `sha256:` plus 64 lowercase hexadecimal characters.
Repeated evidence references and repeated conditions are rejected.

For the verification-only GitHub Action, `subject.version` is the SHA-256 digest
of the UTF-8 string `<owner/repository>@<head-revision>`. The template derives
this value from trusted workflow context. The Action fails when either expected
subject binding differs from the signed envelope.

## Canonical form

The signature input is UTF-8 JSON with:

1. object keys sorted by Unicode code-point order;
2. arrays retained in source order;
3. no insignificant whitespace;
4. JSON scalar encoding.

The included verifier is the executable reference for this contract.

## Fail-closed result order

1. malformed input or unknown fields → `invalid`;
2. unsupported algorithm or key mismatch → `invalid`;
3. signature mismatch → `tampered`;
4. future issuance → `invalid`;
5. revocation → `revoked`;
6. supersession → `superseded`;
7. expiry → `expired`;
8. declared block → `blocked`;
9. otherwise → `pass`.

Only `pass` exits successfully. The Action matches the expected subject and
version. Other consumers remain responsible for matching expected authority and
scope and for enforcing every listed condition.
