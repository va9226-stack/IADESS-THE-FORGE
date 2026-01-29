
export type InventoryItemType =
  | "MATERIAL"
  | "BLUEPRINT"
  | "SHARD"
  | "TOKEN";

export interface InventoryItem {
  id: string;
  type: InventoryItemType;
  name: string;
  quantity: number;
  metadata?: Record<string, any>;
}
