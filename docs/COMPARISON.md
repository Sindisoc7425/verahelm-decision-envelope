# Toolchain comparison

Reviewed 2026-07-27 against the linked official sources. This is a category map, not a product ranking. Deployment options and retention terms vary; buyers should verify current vendor terms.

## Evaluation and testing

| System | Primary job | Required data | Storage model | Output | Authorization semantics | Lifecycle | Portability and verification |
|---|---|---|---|---|---|---|---|
| [OpenAI Evals](https://github.com/openai/evals) | Define and run model evaluations | Test samples, model outputs, graders | Operator-selected evaluation environment and artifacts | Evaluation results | Produces evidence; does not define customer authorization | Evaluation-run lifecycle | Results can be exported; authorization verification is outside the project |
| [LangSmith evaluation](https://docs.langchain.com/langsmith/evaluation) | Evaluate application behavior through datasets, runs, and evaluators | Examples, application outputs, evaluator inputs | LangSmith project/dataset records under the selected deployment | Scores, feedback, experiment comparisons | Produces evidence; authorization remains external | Dataset and experiment lifecycle | Export and API interfaces; no Decision Envelope contract claimed |

## Observability

| System | Primary job | Required data | Storage model | Output | Authorization semantics | Lifecycle | Portability and verification |
|---|---|---|---|---|---|---|---|
| [Langfuse observability](https://langfuse.com/docs/observability/overview) | Capture and inspect traces, spans, generations, and metrics | Runtime telemetry | Managed or self-hosted project telemetry | Trace and metric records | Observes behavior; authorization remains external | Trace/project retention lifecycle | APIs and exports; external policy decides change authority |

## Runtime security

| System | Primary job | Required data | Storage model | Output | Authorization semantics | Lifecycle | Portability and verification |
|---|---|---|---|---|---|---|---|
| [Lakera Guard](https://docs.lakera.ai/guard) | Detect and classify runtime prompt and content risks | Runtime request content selected by the caller | Vendor-service handling governed by current service settings and terms | Detection result and category | Runtime allow/block signal; customer change authority remains external | Request and policy lifecycle | API result; portable authorization object is not the documented primary job |

## Runtime authorization

| System | Primary job | Required data | Storage model | Output | Authorization semantics | Lifecycle | Portability and verification |
|---|---|---|---|---|---|---|---|
| [Cerbos](https://www.cerbos.dev/product) | Evaluate application authorization policy | Principal, resource, action, context, and policy | Self-hosted policy decision point or Cerbos Hub | Allow/deny policy decision | Runtime access authorization | Policy, principal, and resource lifecycle | Portable open-source decision point; evidence-bound AI change authorization remains complementary |

## Governance and GRC

| System | Primary job | Required data | Storage model | Output | Authorization semantics | Lifecycle | Portability and verification |
|---|---|---|---|---|---|---|---|
| [IBM watsonx.governance](https://www.ibm.com/products/watsonx-governance) | Govern AI risk, facts, controls, and workflows | Model, use-case, risk, and governance records | Governance inventory under the chosen IBM deployment | Factsheets, assessments, workflows, reports | Workflow and governance controls inside the platform | Governed asset/use-case lifecycle | Platform reports and integrations; Decision Envelope verification is complementary |

## Policy and provenance

| System | Primary job | Required data | Storage model | Output | Authorization semantics | Lifecycle | Portability and verification |
|---|---|---|---|---|---|---|---|
| [Open Policy Agent](https://www.openpolicyagent.org/docs/latest/) | Evaluate policy over structured input | JSON input, policy, and data | Embedded/server memory plus operator-managed bundles and data | Policy decision | Expresses policy decisions; authority and evidence binding are caller-defined | Policy/bundle lifecycle | Portable policy engine and decision API; signature/lifecycle envelope is complementary |
| [Sigstore](https://docs.sigstore.dev/) | Sign and verify software artifacts and record signing events | Artifact digest and signing identity | Signed artifacts plus transparency-log records | Signature, certificate, inclusion evidence | Establishes artifact provenance; does not decide customer change scope | Certificate/log/artifact lifecycle | Strong portable verification primitives that can serve as referenced evidence |

## Repository scanners

| System | Primary job | Required data | Storage model | Output | Authorization semantics | Lifecycle | Portability and verification |
|---|---|---|---|---|---|---|---|
| [GitHub code scanning](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning) | Find repository vulnerabilities and coding errors | Repository code and analysis configuration | Repository alerts and uploaded analysis results in GitHub | Alerts and SARIF-backed findings | Produces findings; merge/deployment authority is configured separately | Commit, branch, and alert lifecycle | SARIF is portable evidence; signed bounded authorization remains external |
| [Snyk Agent Scan](https://github.com/snyk/agent-scan) | Discover and scan agent, MCP-server, and skill components | Local agent configuration and selected components; some scans can execute configured MCP commands with consent | Local scan plus Snyk service handling documented by the project | Experimental CLI findings and enterprise risk views | Produces security evidence; pull-request change authority remains external | Component and finding lifecycle | Findings can be hashed as evidence; Decision Envelope lifecycle is complementary |

## Public pricing references

Checked against official pages on 2026-07-27. Prices and packaging can change; procurement should recheck the linked source.

| System | Public pricing evidence |
|---|---|
| OpenAI Evals | Open-source project; no hosted authorization product price is defined by the repository. |
| [LangSmith](https://www.langchain.com/pricing) | Developer currently starts at $0 per seat per month, then usage-based charges; paid team and enterprise packaging varies. |
| [Langfuse](https://langfuse.com/pricing) | Public self-service tiers currently include Free, $29/month, and $199/month before usage or enterprise terms. |
| [Lakera](https://platform.lakera.ai/pricing) | Public pricing page; applicable plan and usage price must be confirmed there. |
| [IBM watsonx.governance](https://www.ibm.com/products/watsonx-governance/pricing) | Configuration-dependent IBM pricing; no single comparable flat authorization-envelope price. |
| Open Policy Agent | Open-source policy engine; hosting and operations are buyer-managed or vendor-specific. |
| [Cerbos](https://www.cerbos.dev/pricing) | Open-source tier is free; Cerbos Hub currently lists $0/month and paid service from $25/month. |
| Sigstore | Open-source signing and transparency infrastructure; managed-service costs are provider-specific. |
| [GitHub code security](https://docs.github.com/en/billing/concepts/product-billing/github-advanced-security) | Public-repository and paid private-repository packaging depends on the GitHub plan and metered products. |
| Snyk Agent Scan | Apache-2.0 CLI; enterprise service pricing is account-specific. |
| Verahelm | Developer $49/month for 60 units; Professional $149/month for 300 units. Hard daily and monthly caps; no automatic overage. |

## Verahelm boundary

Verahelm does not replace these systems or assert that their evidence is correct. It accepts bounded references to customer-selected evidence and binds:

- an exact subject and immutable version;
- customer authority and scope;
- declared conditions;
- issuance and expiry;
- revocation or supersession state;
- a verifiable signature.

The structural distinction is the output contract: a portable Decision Envelope for a bounded authorization decision, rather than another raw-content warehouse. The public verifier demonstrates contract and lifecycle handling only; it reveals no private analysis or scoring implementation.
