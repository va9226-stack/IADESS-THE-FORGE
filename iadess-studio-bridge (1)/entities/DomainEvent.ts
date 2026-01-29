
export interface DomainEvent<T = any> {
  id: string;
  type: string;
  payload: T;
  occurredAt: number;
}
