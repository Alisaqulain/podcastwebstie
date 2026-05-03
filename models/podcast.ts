import { ObjectId } from "mongodb";

export interface Podcast {
  _id?: ObjectId;
  title: string;
  description: string;
  youtubeLink: string;
  thumbnail: string;
  createdAt: Date;
}

export type PodcastInput = Omit<Podcast, "_id" | "createdAt"> & {
  createdAt?: Date;
};
