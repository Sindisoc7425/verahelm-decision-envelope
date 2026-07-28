import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
process.stdout.write("conformance=pass cases=16 network=none dependencies=none\n");
