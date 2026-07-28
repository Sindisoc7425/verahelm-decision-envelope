# Synthetic failing-then-passing pull request

This demonstration models one exact AI-agent change. Every identifier, digest, and result is fictional.

1. The first check uses [`fixtures/blocked.json`](../fixtures/blocked.json). Verification exits nonzero and the pull request remains blocked.
2. A separately prebuilt fictional envelope represents a later verification state for the fixed subject.
3. The second check uses [`fixtures/pass.json`](../fixtures/pass.json). Offline signature, subject, lifecycle, and declared-status checks pass.
4. A later change, expiry, signed revocation, or signed supersession returns nonzero again.

Run the same transition locally:

```bash
node cli/verahelm.mjs verify fixtures/blocked.json --key fixtures/fixture-public-key.pem
node cli/verahelm.mjs verify fixtures/pass.json --key fixtures/fixture-public-key.pem
```

The first command exits `2`; the second exits `0`. The fixtures are not engine-generated and do not approximate Verahelm decision logic. This proves verifier behavior only; it does not prove that the fictional change is safe, compliant, or approved for deployment.
