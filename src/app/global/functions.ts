const generatedIds: Set<string> = new Set();

export function generateUniqueId(): string {
  let newId: string;
  do {
    newId = Math.random().toString(36).substring(2, 15);
  } while (generatedIds.has(newId));

  generatedIds.add(newId);
  return newId;
}