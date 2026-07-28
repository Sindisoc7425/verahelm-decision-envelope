// SPDX-License-Identifier: Apache-2.0
import { createHash } from "node:crypto";
import { lstat, open, realpath } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { verifyEnvelope } from "../verifier/verify.mjs";

async function repositoryFile(workspace, input, fallback, maximum) {
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
    const bytes = await file.readFile();
    return {
      text: bytes.toString("utf8"),
      digest: `sha256:${createHash("sha256").update(bytes).digest("hex")}`
    };
  } finally {
    await file.close();
  }
}

export async function verifyAction(env = process.env) {
  const workspace = await realpath(env.GITHUB_WORKSPACE || process.cwd());
  const input = (name) => env[`INPUT_${name.toUpperCase()}`] ??
    env[`INPUT_${name.replaceAll("-", "_").toUpperCase()}`] ?? "";
  const subjectId = input("subject-id");
  const subjectVersion = input("subject-version");
  const expectedKeyDigest = input("public-key-sha256");
  if (!subjectId || subjectId.length > 160 || !/^sha256:[a-f0-9]{64}$/.test(subjectVersion)) {
    throw new Error("subject_binding_required");
  }
  if (!/^sha256:[a-f0-9]{64}$/.test(expectedKeyDigest)) {
    throw new Error("public_key_fingerprint_required");
  }
  const [documentFile, publicKeyFile, statusFile] = await Promise.all([
    repositoryFile(workspace, input("envelope"), "decision-envelope.json", 131072),
    repositoryFile(workspace, input("public-key"), "decision-envelope-public-key.pem", 16384),
    input("status") ? repositoryFile(workspace, input("status"), null, 131072) : null
  ]);
  if (publicKeyFile.digest !== expectedKeyDigest) {
    throw new Error("public_key_fingerprint_mismatch");
  }
  return verifyEnvelope(
    JSON.parse(documentFile.text),
    publicKeyFile.text,
    input("at") ? new Date(input("at")) : new Date(),
    statusFile ? JSON.parse(statusFile.text) : null,
    { subjectId, subjectVersion }
  );
}

async function run() {
  const result = await verifyAction();
  process.stdout.write(`status=${result.status}\n`);
  if (!result.valid) {
    process.stderr.write(`Decision Envelope verification failed: ${result.status}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch(() => {
    process.stderr.write("Decision Envelope verification failed: invalid input\n");
    process.exitCode = 1;
  });
}
