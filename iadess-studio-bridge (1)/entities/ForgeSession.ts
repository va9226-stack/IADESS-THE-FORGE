
import { Artifact } from "./Artifact";

export type ForgeHeatState = "COLD" | "HEATED" | "MOLTEN" | "QUENCHED";

export interface ForgeSession {
  sessionId: string;
  activeCategories: string[];
  heat: number;          // 0..100
  infinityEnabled: boolean;
  state: ForgeHeatState;
  artifacts: Artifact[];
  startedAt: number;
}
