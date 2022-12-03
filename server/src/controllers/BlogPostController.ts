import TagService from "../services/TagService";
import pathTransformers from "../utils/pathTransformers";

import BlogPostService, { BlogPostServiceFilter } from "../services/BlogPostService";
import { RequestError } from "../utils/errors";

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

interface CreateOneData {
  title: string;
  content: string;
  imageFile: Express.Multer.File;
  tags: string[];
}

const createOne = async (data: CreateOneData) => {
  const cover = pathTransformers.transformPathToURL(data.imageFile.path);

  const tags = await TagService.getTagsByName(data.tags);

  return BlogPostService.createOne({
    title: data.title,
    content: data.content,
    cover,
    tags
  });
};

export default {
  getAll, getById, createOne
};
