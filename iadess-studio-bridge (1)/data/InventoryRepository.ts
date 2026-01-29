
import { OmegaArtifact } from '../types';

export class InventoryRepository {
  private static STORAGE_KEY = 'iadess_artifacts';

  static getAll(): OmegaArtifact[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static save(artifact: OmegaArtifact): void {
    const all = this.getAll();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([artifact, ...all]));
  }

  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
