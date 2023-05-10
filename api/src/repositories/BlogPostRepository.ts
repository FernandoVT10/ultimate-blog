import BlogPost, { IBlogPost } from "../models/BlogPost";

import { LeanDocument, HydratedDocument } from "mongoose";
import { ITag } from "../models/Tag";

// import TagService from "./TagService";

const BLOG_POST_FETCH_LIMIT = 20;

// export type BlogPostServiceFilter = FilterQuery<IBlogPost & { _id: string }>;

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
//
// const updateById = async (
//   blogPostId: string,
//   data: object
// ): Promise<HydratedDocument<IBlogPost> | null> => {
//   return BlogPost.findByIdAndUpdate(blogPostId, {
//     $set: data
//   });
// };
//
// const updateTitle = (blogPostId: string, title: string) => {
//   return updateById(
//     blogPostId,
//     { title }
//   );
// };
//
// const updateContent = (blogPostId: string, content: string) => {
//   return updateById(
//     blogPostId,
//     { content }
//   );
// };
//
// const updateCover = async (blogPostId: string, cover: string) => {
//   return BlogPost.findByIdAndUpdate(blogPostId, {
//     $set: { cover }
//   }, { new: false });
// };
//
// const updateTags = async (
//   blogPostId: string,
//   tags: ITag["name"][]
// ): Promise<HydratedDocument<IBlogPost> | null> => {
//   const tagsDocs = await TagService.getTagsByName(tags);
//
//   return BlogPost.findByIdAndUpdate(blogPostId, {
//     tags: tagsDocs
//   });
// };
//
// const checkIfExists = async (blogPostId: string): Promise<boolean> => {
//   if(await BlogPost.exists({ _id: blogPostId })) {
//     return true;
//   }
//
//   return false;
// };
//
// const deletePost = async (blogPostId: string): Promise<HydratedDocument<IBlogPost> | null> => {
//   return BlogPost.findByIdAndDelete(blogPostId);
// };

export default {
  getAll,
  getById,
  createOne,
  // updateContent,
  // updateTitle,
  // updateCover,
  // updateTags,
  // checkIfExists,
  // deletePost
};