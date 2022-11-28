import BlogPost, { IBlogPost } from "@app/models/BlogPost";
import { FilterQuery, HydratedDocument } from "mongoose";

export type BlogPostServiceFilter = FilterQuery<IBlogPost>;

const getAll = async (filter: FilterQuery<IBlogPost>): Promise<HydratedDocument<IBlogPost>[]> => {
  return BlogPost.find(filter)
    .sort({ createdAt: "desc" })
    .populate("tags")
    .lean();
};

export default {
  getAll
};
