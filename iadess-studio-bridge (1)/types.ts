
export enum ViewType {
  OVERVIEW = 'OVERVIEW',
  MATERIAL = 'FIRESTORE',
  COLLABORATORS = 'AUTH',
  JOURNEY = 'FUNCTIONS',
  BRIDGE = 'BRIDGE',
  BLUEPRINTS = 'ARCHITECTURE',
  FORGE = 'FORGE',
  WORKBENCH = 'SETTINGS',
  TEST = 'TEST'
}

export type PersonalityType = 'IADESS' | 'KORE';

export type OmegaKind = 'ARTIFACT' | 'VERDICT_PACKET' | 'OMEGA_BOUND';

export interface ForgeTask {
  id: string;
  realm: string;
  intent: string;
  progress: number;
  status: 'HONING' | 'COMPLETED' | 'FAILED';
  artifact?: OmegaArtifact;
  error?: string;
}

export interface OmegaArtifact {
  id: string;
  name: string;
  kind: OmegaKind;
  origin: string;
  intent: string;
  codeShard?: string;
  imageUrl?: string;
  expansionHistory?: string[];
  tags: string[];
  status: string;
  createdAt: Date;
}

export interface IntelligenceToken {
  amount: number;
  grade: 'ALPHA' | 'BETA' | 'OMEGA';
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
  grounding?: { title: string; uri: string }[];
}

export interface ProjectConfig {
  projectId: string;
  apiKey: string;
  authDomain: string;
  bridgeStatus: 'connected' | 'disconnected' | 'error' | 'simulating';
  isLive: boolean;
}
