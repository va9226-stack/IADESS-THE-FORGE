
export enum ViewType {
  OVERVIEW = 'OVERVIEW',
  FIRESTORE = 'FIRESTORE',
  AUTH = 'AUTH',
  FUNCTIONS = 'FUNCTIONS',
  BRIDGE = 'BRIDGE',
  ARCHITECTURE = 'ARCHITECTURE',
  FORGE = 'FORGE',
  SETTINGS = 'SETTINGS',
  TEST = 'TEST'
}

export type PersonalityType = 'IADESS' | 'KORE';

export type OmegaKind = 'ARTIFACT' | 'VERDICT_PACKET' | 'OMEGA_BOUND';

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
