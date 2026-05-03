import { ObjectId } from "mongodb";

export interface Blog {
  _id?: ObjectId;
  title: string;
  content: string;
  coverImage: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  createdAt: Date;
}

export type BlogInput = Omit<Blog, "_id" | "createdAt"> & {
  createdAt?: Date;
};
