import BlogPost, { IBlogPost } from "../models/BlogPost";

import { FilterQuery, HydratedDocument } from "mongoose";
import { ITag } from "@app/models/Tag";

export type BlogPostServiceFilter = FilterQuery<IBlogPost>;

const getAll = async (filter: FilterQuery<IBlogPost>): Promise<HydratedDocument<IBlogPost>[]> => {
  return BlogPost.find(filter)
    .sort({ createdAt: "desc" })
    .populate("tags")
    .lean({ getters: true });
};

const getById = async (blogPostId: string): Promise<HydratedDocument<IBlogPost> | null> => {
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

const updateCover = async (
  blogPostId: string,
  cover: string
): Promise<HydratedDocument<IBlogPost> | null> => {
  return BlogPost.findByIdAndUpdate(blogPostId, {
    $set: { cover }
  }, { new: false });
};

const checkIfExists = async (blogPostId: string): Promise<boolean> => {
  if(await BlogPost.exists({ _id: blogPostId })) {
    return true;
  }

  return false;
};

export default {
  getAll,
  getById,
  createOne,
  updateCover,
  checkIfExists
};
