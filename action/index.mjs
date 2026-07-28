// SPDX-License-Identifier: Apache-2.0
import { lstat, open, realpath } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { verifyEnvelope } from "../verifier/verify.mjs";

const workspace = await realpath(process.env.GITHUB_WORKSPACE || process.cwd());

async function repositoryFile(input, fallback, maximum) {
  const requested = input || fallback;
  if (!requested || isAbsolute(requested)) throw new Error("repository_relative_path_required");
  const resolved = resolve(workspace, requested);
  if ((await lstat(resolved)).isSymbolicLink()) throw new Error("symlink_rejected");
  const canonical = await realpath(resolved);
  const relation = relative(workspace, canonical);
  if (!relation || relation.startsWith("..") || isAbsolute(relation)) throw new Error("path_outside_workspace");
  const metadata = await lstat(canonical);
  if (!metadata.isFile() || metadata.size < 1 || metadata.size > maximum) throw new Error("invalid_file");
  const file = await open(canonical, "r");
  try {
    return await file.readFile("utf8");
  } finally {
    await file.close();
  }
}

async function run() {
  const subjectId = process.env.INPUT_SUBJECT_ID || "";
  const subjectVersion = process.env.INPUT_SUBJECT_VERSION || "";
  if (!subjectId || subjectId.length > 160 || !/^sha256:[a-f0-9]{64}$/.test(subjectVersion)) {
    throw new Error("subject_binding_required");
  }
  const [documentText, publicKey, statusText] = await Promise.all([
    repositoryFile(process.env.INPUT_ENVELOPE, "decision-envelope.json", 131072),
    repositoryFile(process.env.INPUT_PUBLIC_KEY, "decision-envelope-public-key.pem", 16384),
    process.env.INPUT_STATUS ? repositoryFile(process.env.INPUT_STATUS, null, 131072) : null
  ]);
  const result = await verifyEnvelope(
    JSON.parse(documentText),
    publicKey,
    process.env.INPUT_AT ? new Date(process.env.INPUT_AT) : new Date(),
    statusText ? JSON.parse(statusText) : null,
    { subjectId, subjectVersion }
  );
  process.stdout.write(`status=${result.status}\n`);
  if (!result.valid) {
    process.stderr.write(`Decision Envelope verification failed: ${result.status}\n`);
    process.exitCode = 1;
  }
}

run().catch(() => {
  process.stderr.write("Decision Envelope verification failed: invalid input\n");
  process.exitCode = 1;
});
