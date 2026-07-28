import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { verifyAction } from "../action/index.mjs";
import { validateEnvelope, verifyEnvelope } from "../verifier/verify.mjs";

const root = new URL("../", import.meta.url);
const publicKey = await readFile(new URL("fixtures/fixture-public-key.pem", root), "utf8");
const publicJwk = await readFile(new URL("fixtures/fixture-public-key.json", root), "utf8");
const at = new Date("2026-07-27T12:00:00Z");

async function fixture(name) {
  return JSON.parse(await readFile(new URL(`fixtures/${name}.json`, root), "utf8"));
}

for (const [name, expected] of Object.entries({
  pass: "pass",
  blocked: "blocked",
  expired: "expired",
  tampered: "tampered"
})) {
  const result = await verifyEnvelope(await fixture(name), publicKey, at);
  assert.equal(result.status, expected, name);
  assert.equal(result.valid, expected === "pass", name);
}

const unknown = await fixture("pass");
unknown.payload.private_hint = "must be rejected";
assert.equal((await verifyEnvelope(unknown, publicKey, at)).status, "invalid");

const invalidDate = await fixture("pass");
invalidDate.payload.lifecycle.issued_at = "2026-02-30T00:00:00Z";
assert(validateEnvelope(invalidDate).includes("lifecycle"));

const duplicateEvidence = await fixture("pass");
duplicateEvidence.payload.evidence_refs.push(duplicateEvidence.payload.evidence_refs[0]);
assert(validateEnvelope(duplicateEvidence).includes("evidence_refs"));

const duplicateCondition = await fixture("pass");
duplicateCondition.payload.decision.conditions.push(duplicateCondition.payload.decision.conditions[0]);
assert(validateEnvelope(duplicateCondition).includes("decision"));

const future = await fixture("pass");
future.payload.lifecycle.issued_at = "2098-01-01T00:00:00Z";
assert.equal((await verifyEnvelope(future, publicKey, at)).status, "tampered");

assert.equal((await verifyEnvelope(await fixture("pass"), "not a key", at)).status, "invalid");
assert.equal((await verifyEnvelope(await fixture("pass"), publicJwk, at)).status, "pass");
assert.equal((await verifyEnvelope(
  await fixture("pass"), publicKey, at, null,
  { subjectId: "synthetic-pr-agent", subjectVersion: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
)).status, "pass");
assert.equal((await verifyEnvelope(
  await fixture("pass"), publicKey, at, null,
  { subjectId: "different-subject", subjectVersion: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
)).status, "invalid");
assert.equal((await verifyEnvelope(
  await fixture("pass"), publicKey, at, await fixture("revoked-status")
)).status, "revoked");
assert.equal((await verifyEnvelope(
  await fixture("pass"), publicKey, at, await fixture("superseded-status")
)).status, "superseded");
const tamperedStatus = await fixture("revoked-status");
tamperedStatus.payload.state = "active";
assert.equal((await verifyEnvelope(await fixture("pass"), publicKey, at, tamperedStatus)).status, "tampered");

const invalidRevocation = await fixture("pass");
invalidRevocation.payload.lifecycle.revoked_at = "2025-01-01T00:00:00Z";
assert(validateEnvelope(invalidRevocation).includes("lifecycle_order"));

const selfSupersession = await fixture("pass");
selfSupersession.payload.lifecycle.superseded_by = selfSupersession.payload.envelope_id;
assert(validateEnvelope(selfSupersession).includes("lifecycle_relation"));

const statusUrlMismatch = await fixture("pass");
statusUrlMismatch.status_url = "/v1/decision-envelopes/de_synthetic_99/status";
assert(validateEnvelope(statusUrlMismatch).includes("status_url"));

const workspace = new URL("../", import.meta.url).pathname;
const keyDigest = `sha256:${createHash("sha256").update(publicKey).digest("hex")}`;
const actionEnvironment = {
  GITHUB_WORKSPACE: workspace,
  INPUT_ENVELOPE: "fixtures/pass.json",
  "INPUT_PUBLIC-KEY": "fixtures/fixture-public-key.pem",
  "INPUT_PUBLIC-KEY-SHA256": keyDigest,
  INPUT_AT: "2026-07-27T12:00:00Z",
  "INPUT_SUBJECT-ID": "synthetic-pr-agent",
  "INPUT_SUBJECT-VERSION": "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
};
assert.equal((await verifyAction(actionEnvironment)).status, "pass");
await assert.rejects(
  verifyAction({ ...actionEnvironment, "INPUT_PUBLIC-KEY-SHA256": `sha256:${"0".repeat(64)}` }),
  /public_key_fingerprint_mismatch/
);
await assert.rejects(
  verifyAction({ ...actionEnvironment, "INPUT_PUBLIC-KEY-SHA256": "" }),
  /public_key_fingerprint_required/
);

process.stdout.write("conformance=pass cases=22 network=none dependencies=none\n");
