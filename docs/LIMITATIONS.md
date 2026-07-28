# Limitations

- Verification proves contract conformance and signature validity, not the truth or sufficiency of referenced evidence.
- `pass` is a bounded declared authorization state. It is not a safety, compliance, certification, or deployment claim.
- Offline verification can observe revocation or supersession only when those fields are present in the supplied signed object. Consumers needing fresher status must obtain a newer trusted object outside this verifier.
- Conditions are returned as signed data; the consuming system must enforce them.
- Key distribution, rotation, trust anchors, and customer authority validation are deployment responsibilities.
- The public canonicalization profile is intentionally narrow and may change only under the versioning policy.
- The fixtures are fictional and provide no information about production behavior.
