
export interface User {
  id: string;
  handle: string;
  role: "ARCHITECT" | "OBSERVER" | "SENTINEL";
  integrity: number; // 0..1
  intelligenceTokens: number; // IQ-T balance
  createdAt: number;
}
