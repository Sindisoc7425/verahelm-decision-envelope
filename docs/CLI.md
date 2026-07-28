# CLI contract

The CLI has five commands:

| Command | Network | Purpose |
|---|---:|---|
| `demo` | No | Exercise pass, blocked, expired, and tampered fixtures. |
| `validate FILE` | No | Validate the public Decision Envelope contract. |
| `verify ENVELOPE --key KEY [--status STATUS] [--at TIME] [--subject-id ID --subject-version DIGEST]` | No | Verify schema, Ed25519 signature, optional expected-subject binding, lifecycle, and declared decision. |
| `explain FILE` | No | Print declared public envelope fields without evaluating them. |
| `fingerprint PUBLIC_KEY` | No | Compute the bounded key-file SHA-256 value used by the GitHub Action trust configuration. |

All commands run locally without network or subprocess access. The CLI does not generate evidence, call the hosted decision service, or contain or approximate Verahelm's private evaluation logic.

Verifier exit codes:

| Code | Meaning |
|---:|---|
| 0 | Valid pass |
| 2 | Valid blocked decision |
| 3 | Expired |
| 4 | Signed revoked status |
| 5 | Signed superseded status |
| 6 | Signature or signed-status tampering |
| 64 | Input, schema, key, or command error |

An exit code of zero means only that the public verification contract passed. It is not a safety, compliance, certification, or deployment finding.
