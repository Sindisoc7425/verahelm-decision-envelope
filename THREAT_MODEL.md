# Public verifier threat model

## Protected properties

- exact subject and version binding;
- integrity of signed fields;
- fail-closed handling of malformed, blocked, expired, revoked, superseded, or tampered objects;
- absence of network and subprocess execution;
- exclusion of raw evidence and private implementation material.

## In scope

Field injection, unknown properties, signature substitution, payload modification, future issuance, stale authorization, ambiguous subject versions, malicious local files, and accidental repository disclosure.

## Out of scope

Compromised signing keys, dishonest authorities, false source evidence, endpoint compromise, host compromise, and enforcement of signed conditions by downstream systems.

The verifier parses one bounded JSON document and one Ed25519 public key. It does not dereference evidence or execute supplied content.
