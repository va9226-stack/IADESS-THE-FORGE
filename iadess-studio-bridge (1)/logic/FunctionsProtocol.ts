
import { Result, ok, err } from "../core/Result";
import { consumeTokens, getTokenLevel } from "../intelligence/intelligenceRuntime";
import { ForgeProtocol } from "../types/ForgeProtocol";

export type ForgeEvent =
  | { type: "FORGE_STARTED"; protocol: string }
  | { type: "FORGE_COMPLETED"; payload: { code: string; integrity: number } }
  | { type: "FORGE_FAILED"; error: string };

const listeners = new Set<(e: ForgeEvent) => void>();

export function onForgeEvent(cb: (e: ForgeEvent) => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function emit(event: ForgeEvent) {
  listeners.forEach((l) => l(event));
}

function calculateIntegrity(protocol: ForgeProtocol, input: string): number {
  const base = 0.7;
  // Complexity heuristic: longer inputs require more structural alignment
  const complexityFactor = Math.min(0.25, input.length / 5000);
  const categoryBonus = protocol.category === "HIGH_FIDELITY" ? 0.05 : 0;
  return parseFloat(Math.min(1, base + complexityFactor + categoryBonus).toFixed(4));
}

function generateCode(protocol: ForgeProtocol, input: string, integrity: number): string {
  const header = `// [IADESS_FORGE]::${protocol.category}\n// [INTEGRITY]::${(integrity * 100).toFixed(1)}%\n// [TIMESTAMP]::${new Date().toISOString()}`;
  return `${header}\n\n${input.trim()}`;
}

export function requireIntelligence(min: number): Result<void> {
  const level = getTokenLevel();
  return level >= min ? ok(undefined) : err("SUBSTRATE_STARVATION");
}

export async function forgeArtifact(protocol: ForgeProtocol, input: string): Promise<Result<{ code: string; integrity: number }>> {
  emit({ type: "FORGE_STARTED", protocol: protocol.category });
  
  // Consume base tokens for kinetic initialization
  consumeTokens(input.length * 0.012);

  try {
    const intelligenceCheck = requireIntelligence(protocol.minIntelligence || 0);
    // Fix: Using explicit check to assist TypeScript in narrowing the result type (replaces !intelligenceCheck.ok)
    if (intelligenceCheck.ok === false) throw new Error(intelligenceCheck.error);

    const integrity = calculateIntegrity(protocol, input);
    const code = generateCode(protocol, input, integrity);
    
    const payload = { code, integrity };
    emit({ type: "FORGE_COMPLETED", payload });
    
    return ok(payload);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "FORGE_EXECUTION_FAILURE";
    emit({ type: "FORGE_FAILED", error: errorMsg });
    return err(errorMsg);
  }
}

export async function forgeViaBridge(payload: { protocol: ForgeProtocol; input: string }) {
  return forgeArtifact(payload.protocol, payload.input);
}
