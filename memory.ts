export type MemoryType = "profile" | "project" | "goal" | "preference" | "temp";

export type MemoryRecord = {
  id: string;
  type: MemoryType;
  content: string;
  rationale?: string;
  confidence?: number;
  createdAt: string;
  updatedAt: string;
};

export type MemoryStore = {
  get: (userId: string) => Promise<MemoryRecord[]>;
  put: (userId: string, memories: MemoryRecord[]) => Promise<void>;
  upsert: (userId: string, memory: MemoryRecord) => Promise<void>;
};
