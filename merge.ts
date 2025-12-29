import type { MemoryCandidate } from "./extractor";
import type { MemoryRecord, MemoryType } from "./memory";

export type MergeOptions = {
  maxMemories?: number;
  now?: Date;
};

const DEFAULT_MAX_MEMORIES = 200;

export function mergeMemories(
  existing: MemoryRecord[],
  candidates: MemoryCandidate[],
  options: MergeOptions = {}
): MemoryRecord[] {
  const now = options.now ?? new Date();
  const maxMemories = options.maxMemories ?? DEFAULT_MAX_MEMORIES;
  const normalizedExisting = [...existing];

  for (const candidate of candidates) {
    const matchIndex = normalizedExisting.findIndex((memory) =>
      isSameMemory(memory, candidate)
    );

    const current = normalizedExisting[matchIndex];
    if (current) {
      const shouldReplace =
        (candidate.confidence ?? 0) >= (current.confidence ?? 0);

      if (shouldReplace) {
        normalizedExisting[matchIndex] = {
          ...current,
          content: candidate.content,
          rationale: candidate.rationale,
          confidence: candidate.confidence,
          updatedAt: now.toISOString(),
        };
      } else {
        normalizedExisting[matchIndex] = {
          ...current,
          updatedAt: now.toISOString(),
        };
      }
    } else {
      normalizedExisting.push(createRecord(candidate, now));
    }
  }

  return enforceCapacity(normalizedExisting, maxMemories);
}

function isSameMemory(
  record: MemoryRecord,
  candidate: MemoryCandidate
): boolean {
  return record.type === candidate.type && record.content === candidate.content;
}

function createRecord(candidate: MemoryCandidate, now: Date): MemoryRecord {
  return {
    id: buildId(candidate.type, candidate.content),
    type: candidate.type,
    content: candidate.content,
    rationale: candidate.rationale,
    confidence: candidate.confidence,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

function buildId(type: MemoryType, content: string): string {
  return `${type}:${hashString(content)}`;
}

function hashString(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16);
}

function enforceCapacity(
  memories: MemoryRecord[],
  maxMemories: number
): MemoryRecord[] {
  if (memories.length <= maxMemories) {
    return memories;
  }

  const sorted = [...memories].sort((a, b) => {
    const timeA = new Date(a.updatedAt).getTime();
    const timeB = new Date(b.updatedAt).getTime();
    return timeB - timeA;
  });

  return sorted.slice(0, maxMemories);
}
