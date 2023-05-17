import BlogPost, { IBlogPost } from "../models/BlogPost";

import { LeanDocument, HydratedDocument } from "mongoose";
import { ITag } from "../models/Tag";

const BLOG_POST_FETCH_LIMIT = 20;

export interface GetAllOptions {
  limit?: number;
}

const getAll = async ({ limit }: GetAllOptions): Promise<LeanDocument<IBlogPost>[]> => {
  return BlogPost.find()
    .sort({ createdAt: "desc" })
    .populate("tags")
    .limit(limit || BLOG_POST_FETCH_LIMIT)
    .lean({ getters: true });
};

const getById = async (blogPostId: string): Promise<LeanDocument<IBlogPost> | null> => {
  return BlogPost
    .findById(blogPostId)
    .populate("tags")
    .lean({ getters: true });
};

interface CreateBlogPostData {
  title: string;
  content: string;
  cover: string;
  tags: HydratedDocument<ITag>[];
}

const createOne = async (data: CreateBlogPostData): Promise<HydratedDocument<IBlogPost>> => {
  return BlogPost.create(data);
};

const updateById = async (
  blogPostId: string,
  data: object
): Promise<HydratedDocument<IBlogPost> | null> => {
  return BlogPost.findByIdAndUpdate(blogPostId, {
    $set: data
  });
};

const deleteOneById = async (blogPostId: string): Promise<HydratedDocument<IBlogPost> | null> => {
  return BlogPost.findByIdAndDelete(blogPostId);
};

export default {
  getAll,
  getById,
  createOne,
  updateById,
  deleteOneById
};
