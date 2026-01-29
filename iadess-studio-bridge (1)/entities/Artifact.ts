
export type ArtifactCategory =
  | "PAGES"
  | "COMPONENTS"
  | "UI"
  | "ENTITIES"
  | "LAYOUT"
  | "FUNCTIONS"
  | "INDEX"
  | "SRC";

export type ArtifactQuality =
  | "RAW"
  | "REFINED"
  | "MASTERWORK"
  | "PRISMATIC";

export interface Artifact {
  id: string;
  name: string;
  category: ArtifactCategory;
  codeShard: string;
  visualUrl?: string;
  quality: ArtifactQuality;
  createdAt: number;
  integrityScore: number; // 0..1
  intelligenceCost: number; // IQ-T cost to generate
}
