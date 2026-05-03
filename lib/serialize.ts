import { ObjectId } from "mongodb";

export function serializeDocument<T extends { _id?: ObjectId | unknown }>(
  doc: T | null
): (Omit<T, "_id"> & { id?: string }) | null {
  if (!doc) return null;
  const { _id, ...rest } = doc as T & { _id?: ObjectId };
  const id = _id instanceof ObjectId ? _id.toString() : undefined;
  return { ...rest, id } as Omit<T, "_id"> & { id?: string };
}

export function serializeDocuments<T extends { _id?: ObjectId | unknown }>(
  docs: T[]
): (Omit<T, "_id"> & { id?: string })[] {
  return docs.map((d) => serializeDocument(d)!).filter(Boolean);
}
