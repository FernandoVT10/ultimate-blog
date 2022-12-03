import BlogPost, { IBlogPost } from "../models/BlogPost";
import { FilterQuery, HydratedDocument } from "mongoose";
import { ITag } from "@app/models/Tag";

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

interface CreateOneData {
  title: string;
  content: string;
  cover: string;
  tags: HydratedDocument<ITag>[];
}

const createOne = async (data: CreateOneData): Promise<HydratedDocument<IBlogPost>> => {
  return BlogPost.create(data);
};

export default {
  getAll, getById, createOne
};
