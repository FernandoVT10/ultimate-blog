import BlogPost, { IBlogPost } from "../models/BlogPost";

import { FilterQuery, HydratedDocument } from "mongoose";
import { ITag } from "@app/models/Tag";

export type BlogPostServiceFilter = FilterQuery<IBlogPost>;

const getAll = async (
  filter: FilterQuery<IBlogPost>,
  limit?: number
): Promise<HydratedDocument<IBlogPost>[]> => {
  let query = BlogPost.find(filter)
    .sort({ createdAt: "desc" })
    .populate("tags");

  if(limit) {
    query = query.limit(limit);
  }

  return query.lean({ getters: true });
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

const updateById = async (
  blogPostId: string,
  data: object
): Promise<HydratedDocument<IBlogPost> | null> => {
  return BlogPost.findByIdAndUpdate(blogPostId, {
    $set: data
  });
};

const updateTitle = (blogPostId: string, title: string) => {
  return updateById(
    blogPostId,
    { title }
  );
};

const updateContent = (blogPostId: string, content: string) => {
  return updateById(
    blogPostId,
    { content }
  );
};

const updateCover = async (blogPostId: string, cover: string) => {
  return BlogPost.findByIdAndUpdate(blogPostId, {
    $set: { cover }
  }, { new: false });
};

const updateTags = async (
  blogPostId: string,
  tags: HydratedDocument<ITag>[]
): Promise<HydratedDocument<IBlogPost> | null> => {
  return BlogPost.findByIdAndUpdate(blogPostId, {
    tags
  });
};

const checkIfExists = async (blogPostId: string): Promise<boolean> => {
  if(await BlogPost.exists({ _id: blogPostId })) {
    return true;
  }

  return false;
};

const deletePost = async (blogPostId: string): Promise<HydratedDocument<IBlogPost> | null> => {
  return BlogPost.findByIdAndDelete(blogPostId);
};

export default {
  getAll,
  getById,
  createOne,
  updateContent,
  updateTitle,
  updateCover,
  updateTags,
  checkIfExists,
  deletePost
};
