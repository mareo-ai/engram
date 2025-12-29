import type { MemoryRecord, MemoryStore } from "../memory";

export class InMemoryStore implements MemoryStore {
  private records: Map<string, MemoryRecord[]> = new Map();

  async get(userId: string): Promise<MemoryRecord[]> {
    return this.records.get(userId) ?? [];
  }

  async put(userId: string, memories: MemoryRecord[]): Promise<void> {
    this.records.set(userId, memories);
  }

  async upsert(userId: string, memory: MemoryRecord): Promise<void> {
    const existing = await this.get(userId);
    const updated = existing.filter((item) => item.id !== memory.id);
    updated.push(memory);
    this.records.set(userId, updated);
  }
}
