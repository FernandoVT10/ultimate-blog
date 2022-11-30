import BlogPost, { IBlogPost } from "../models/BlogPost";
import { FilterQuery, HydratedDocument } from "mongoose";

export type BlogPostServiceFilter = FilterQuery<IBlogPost>;

const getAll = async (filter: FilterQuery<IBlogPost>): Promise<HydratedDocument<IBlogPost>[]> => {
  return BlogPost.find(filter)
    .sort({ createdAt: "desc" })
    .populate("tags")
    .lean();
};

const getById = async (blogPostId: string): Promise<HydratedDocument<IBlogPost> | null> => {
  return BlogPost.findById(blogPostId).populate("tags");
};

export default {
  getAll, getById
};
