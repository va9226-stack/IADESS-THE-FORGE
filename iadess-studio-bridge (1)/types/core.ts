
export type ForgeMode =
  | "CORE_SUBSTRATE"
  | "DATA_RESONANCE"
  | "AUTH_VOID"
  | "LOGIC_JOINERY";

export interface Artifact {
  id: string;
  name: string;
  mode: ForgeMode;
  codeShard: string;
  integrityScore: number;
  intelligenceCost: number;
  visualUrl?: string;
  status: string;
  createdAt: Date;
  expansionHistory?: string[];
}
