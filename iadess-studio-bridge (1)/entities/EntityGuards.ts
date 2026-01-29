
import { Artifact } from "./Artifact";

export function assertValidIntegrity(value: number) {
  if (value < 0 || value > 1) {
    throw new Error("Integrity must be between 0 and 1.");
  }
}

export function assertSufficientTokens(balance: number, cost: number) {
  if (balance < cost) {
    throw new Error("SUBSTRATE_STARVATION: Insufficient IQ-T.");
  }
}

export function assertArtifactIntegrity(artifact: Artifact) {
  if (artifact.integrityScore < 0.3) {
    throw new Error("ARTIFACT_UNSTABLE: Integrity too low.");
  }
}
