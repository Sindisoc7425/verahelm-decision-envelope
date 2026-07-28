# Evidence-producer integration

Decision Envelopes complement evidence producers. Adapters should emit references, not copy raw content.

| Producer class | Public-safe input | Envelope binding |
|---|---|---|
| Evaluation and testing | Immutable report digest; suite identifier; tested subject version | `evidence_refs`, `subject.version` |
| Observability | Digest of a bounded export or incident record | `evidence_refs`, `scope` |
| Runtime security | Finding or policy-result digest | `evidence_refs`, `decision.conditions` |
| Governance and GRC | Customer authority reference; approved scope | `authority`, `scope` |
| Policy and provenance | Policy-result, attestation, or artifact digest | `evidence_refs`, `subject.version` |
| Repository scanning | Scan-result and commit digest | `evidence_refs`, `subject.version` |

Recommended producer mappings include OpenAI Evals, LangSmith, Langfuse, Lakera Guard, IBM watsonx.governance, Open Policy Agent, Cerbos, Sigstore, GitHub code scanning, and Snyk Agent Scan. Their official documentation is linked in [the comparison](COMPARISON.md).

An adapter must:

1. accept only the minimum public-safe fields;
2. normalize an immutable subject version;
3. hash the bounded evidence record locally;
4. avoid embedding evidence, credentials, URLs with secrets, prompts, logs, or personal data;
5. fail closed when required bindings are absent.

Adapter requests must use fictional field examples.

The included [`evidence-digest` adapter](../adapters/README.md) supports local digest references for SARIF, JUnit, OPA, synthetic evaluation reports, artifacts, and attestations. It does not parse, upload, or judge the artifact.

## GitHub change enforcement

Use [`template/verahelm-change-gate.yml`](../template/verahelm-change-gate.yml)
as a required status check in a GitHub ruleset. Verahelm verifies the signed
record; the ruleset enforces whether the pull request may merge. Keep the
workflow definition, trusted key fingerprint, and required-check configuration
outside pull-request control.

GitHub environments and deployment protection rules remain the deployment
enforcement layer. A passing Decision Envelope is evidence for that workflow;
it does not replace required reviewers, environment restrictions, or custom
deployment protection rules.

## Attestations and provenance

An in-toto statement, SLSA provenance file, Sigstore bundle, or GitHub artifact
attestation can remain in its existing system. Verify it with its native tool,
then create a local digest reference:

```bash
node adapters/evidence-digest.mjs attestation provenance.json
```

The adapter hashes bytes only. It does not validate provenance, signatures,
builder identity, policy, or evidence sufficiency.
