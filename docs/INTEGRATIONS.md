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

The included [`evidence-digest` adapter](../adapters/README.md) supports local digest references for SARIF, JUnit, OPA, and synthetic evaluation reports. It does not parse, upload, or judge the artifact.
