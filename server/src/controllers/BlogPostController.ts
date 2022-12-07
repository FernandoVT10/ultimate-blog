import TagService from "../services/TagService";

import BlogPostService, { BlogPostServiceFilter } from "../services/BlogPostService";
import { RequestError } from "../utils/errors";

import BlogPostCover from "../lib/BlogPostCover";

interface GetAllOptions {
  tags: string[] | undefined;
}

const getAll = async (options: GetAllOptions) => {
  const filter: BlogPostServiceFilter = {};

  if(options.tags) {
    const tags = await TagService.getTagsByName(options.tags);

    if(tags.length) {
      filter.tags = {
        $all: tags
      };
    } else {
      return [];
    }
  }

  return BlogPostService.getAll(filter);
};

const getById = async (blogPostId: string) => {
  const blogPost = await BlogPostService.getById(blogPostId);

  if(!blogPost) {
    throw new RequestError(404, "BlogPost not found");
  }

  return blogPost;
};

interface BlogPostCommonData {
  title: string;
  content: string;
  imageFile: Express.Multer.File;
  tags: string[];
}

const createOne = async (data: BlogPostCommonData) => {
  const cover = new BlogPostCover();

  try {
    await cover.saveBuffer(data.imageFile.buffer);

    const tags = await TagService.getTagsByName(data.tags);

    const createdBlogPost = await BlogPostService.createOne({
      title: data.title,
      content: data.content,
      cover: cover.getName(),
      tags
    }); 

    return createdBlogPost;
  } catch (error) {
    await cover.delete();

    throw error;
  }
};

const updateCover = async (blogPostId: string, coverFile: Express.Multer.File) => {
  const newCover = new BlogPostCover();

  try {
    await newCover.saveBuffer(coverFile.buffer);

    const oldBlogPost = await BlogPostService.updateCover(
      blogPostId, newCover.getName()
    );

    if(!oldBlogPost) {
      throw new RequestError(500, "An error happen trying to update the Blog Post");
    }

    const oldCover = new BlogPostCover(
      oldBlogPost.get("cover", null, { getters: false })
    );

    await oldCover.delete();
  } catch(error) {
    await newCover.delete();

    throw error;
  }
};

const updateTags = async (blogPostId: string, tags: string[]) => {
  const tagDocs = await TagService.getTagsByName(tags);

  await BlogPostService.updateTags(blogPostId, tagDocs);
};

export default {
  getAll,
  getById,
  createOne,
  updateCover,
  updateTags
};
