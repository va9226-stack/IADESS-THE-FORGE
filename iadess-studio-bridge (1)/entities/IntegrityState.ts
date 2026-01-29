
export interface IntegrityState {
  integrity: number;   // 0..1
  drift: number;       // accumulated instability
  lastAuditAt: number;
}
