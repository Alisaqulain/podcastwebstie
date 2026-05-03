import { ObjectId } from "mongodb";

export interface Testimonial {
  _id?: ObjectId;
  name: string;
  image: string;
  message: string;
}

export type TestimonialInput = Omit<Testimonial, "_id">;
