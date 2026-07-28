# Verification template

Copy `verifier/`, the public schema, and your trusted public key into a repository. Store a Decision Envelope at a fixed path and run the verifier in required checks.

Pin any external Action reference to a reviewed full commit SHA. Never use a floating branch or tag for an authorization gate.

The template verifies signed state only. It does not generate evidence, issue authorizations, or enforce listed conditions.
