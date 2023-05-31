import BlogPostModel, { BlogPost } from "../models/BlogPost";

import { HydratedDocument } from "mongoose";
import { Tag } from "../models/Tag";

const BLOG_POST_FETCH_LIMIT = 20;

export interface GetAllOptions {
  limit?: number;
}

const getAll = async ({ limit }: GetAllOptions): Promise<BlogPost[]> => {
  return BlogPostModel.find()
    .sort({ createdAt: "desc" })
    .populate("tags")
    .limit(limit || BLOG_POST_FETCH_LIMIT)
    .lean({ getters: true });
};

const getById = async (blogPostId: string): Promise<BlogPost | null> => {
  return BlogPostModel
    .findById(blogPostId)
    .populate("tags")
    .lean({ getters: true });
};

interface CreateBlogPostData {
  title: string;
  content: string;
  cover: string;
  tags: Tag[];
}

const createOne = async (data: CreateBlogPostData): Promise<BlogPost> => {
  return BlogPostModel.create(data);
};

const updateById = async (
  blogPostId: string,
  data: object
): Promise<HydratedDocument<BlogPost> | null> => {
  return BlogPostModel.findByIdAndUpdate(blogPostId, {
    $set: data
  });
};

const deleteOneById = async (blogPostId: string): Promise<HydratedDocument<BlogPost> | null> => {
  return BlogPostModel.findByIdAndDelete(blogPostId);
};

export default {
  getAll,
  getById,
  createOne,
  updateById,
  deleteOneById
};
