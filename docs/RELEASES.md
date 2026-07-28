# Release procedure

Releases use semantic versioning.

1. Run `npm test` in a clean directory without `.git`.
2. Confirm every file appears in `PUBLIC_RELEASE_MANIFEST.md`.
3. Generate and review SHA-256 checksums and the SPDX SBOM.
4. Create an annotated tag from the reviewed full commit SHA.
5. Sign the tag and checksum file with the organization-controlled release key.
6. Publish immutable references and attestations only after signature verification.

Consumers should pin the Action to the full 40-character commit SHA:

```yaml
- uses: Verahelm/verahelm-decision-envelope@dc25784c400c0140aa175d6a5e80a6f973c59c9c
```

The complete subject-binding and verification workflow is in
[`template/verahelm-change-gate.yml`](../template/verahelm-change-gate.yml).
