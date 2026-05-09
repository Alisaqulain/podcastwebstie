import { ObjectId } from "mongodb";

export interface Podcast {
  _id?: ObjectId;
  title: string;
  description: string;
  youtubeLink: string;
  thumbnail: string;
  /** VPS-hosted mute preview clip (e.g. `/uploads/podcasts/previews/..._30s.mp4`). */
  localPreviewUrl?: string;
  createdAt: Date;
}

export type PodcastInput = Omit<Podcast, "_id" | "createdAt"> & {
  createdAt?: Date;
};
