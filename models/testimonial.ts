import { ObjectId } from "mongodb";

export interface Testimonial {
  _id?: ObjectId;
  name: string;
  image: string;
  message: string;
  /** Optional 1–5 display rating */
  rating?: number;
}

export type TestimonialInput = Omit<Testimonial, "_id"> & {
  rating?: number | null;
};
