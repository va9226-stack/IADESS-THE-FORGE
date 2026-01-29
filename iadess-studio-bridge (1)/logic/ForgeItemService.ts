
import { ForgeMode, Artifact } from "../types/core";
import { consumeTokens, rewardTokens, getTokens } from "../intelligence/intelligenceRuntime";
import { refractArtifact, synthesizeArtifactVisual } from "../services/geminiService";
import { Result, ok, err } from "../core/Result";

export class ForgeItemService {
  static calculateCost(mode: ForgeMode, intent: string): number {
    const base = intent.length * 0.1;
    const modeMultiplier = {
      CORE_SUBSTRATE: 1,
      DATA_RESONANCE: 1.2,
      AUTH_VOID: 1.5,
      LOGIC_JOINERY: 1.8
    }[mode];
    return Math.ceil((base || 10) * modeMultiplier);
  }

  static async strike(
    mode: ForgeMode, 
    intent: string, 
    heat: number, 
    currentCode?: string
  ): Promise<Result<{ code: string; cost: number; integrity: number }>> {
    const cost = this.calculateCost(mode, intent);

    if (!consumeTokens(cost)) {
      return err("SUBSTRATE_STARVATION: Depleted IQ-T.");
    }

    const heatIntegrity = heat >= 60 && heat <= 95 ? 0.95 : 0.6;
    const directive = currentCode 
      ? `REFINEMENT_STRIKE [HEAT: ${heat}°C]: Iteratively improve this code shard. Current: ${currentCode}`
      : `INITIAL_STRIKE [HEAT: ${heat}°C]: Generate the base logic substrate for ${intent}`;
    
    try {
      const result = await refractArtifact(directive, mode, heatIntegrity);
      if (result.codeShard) {
        if (heatIntegrity > 0.85) rewardTokens(5);
        return ok({ code: result.codeShard, cost, integrity: heatIntegrity });
      }
      return err("Logic evaporation.");
    } catch (e) {
      return err("Structural collapse during strike.");
    }
  }

  static async transmute(code: string, mode: ForgeMode): Promise<Result<string>> {
    const cost = 50; // High cost for transmutation
    if (!consumeTokens(cost)) return err("IQ-T_INSUFFICIENT_FOR_TRANSMUTATION");

    const directive = `OMEGA_TRANSMUTATION: Elevate this logic into a god-tier OMEGA-grade shard: ${code}`;
    try {
      const result = await refractArtifact(directive, mode, 1.2);
      return result.codeShard ? ok(result.codeShard) : err("Transmutation fail.");
    } catch (e) {
      return err("Transmutation relay fracture.");
    }
  }

  static async synthesizeVisual(name: string, integrity: number): Promise<string | null> {
    return await synthesizeArtifactVisual(name, integrity);
  }
}
