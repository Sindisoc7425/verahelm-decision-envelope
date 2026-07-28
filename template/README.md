# Verification template

Copy `verifier/`, the public schema, and your trusted public key into a repository. Store a Decision Envelope at a fixed path and run the verifier in required checks.

Set the repository Actions variable `VERAHELM_PUBLIC_KEY_SHA256` to `sha256:`
followed by the SHA-256 fingerprint of the exact trusted key file. Repository
variables are configuration, not pull-request content. Protect changes to the
workflow and required-check settings.

Pin any external Action reference to a reviewed full commit SHA. Never use a floating branch or tag for an authorization gate.

The template uses `pull_request_target` so the workflow definition remains on
the trusted base branch, then checks out the proposed revision without
credentials. It reads signed data but executes no pull-request code. Do not add
steps that execute scripts, installers, builds, or other content from the
proposed revision.

The template verifies signed state only. It does not generate evidence, issue authorizations, or enforce listed conditions.
