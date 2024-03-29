import BlogPostRepository, { GetAllOptions } from "../repositories/BlogPostRepository";
import { RequestError } from "../utils/errors";

import BlogPostCover from "../utils/BlogPostCover";
import TagRepository from "../repositories/TagRepository";

const getAll = async ({ limit }: GetAllOptions) => {
  return BlogPostRepository.getAll({ limit });
};

const getById = async (blogPostId: string) => {
  const blogPost = await BlogPostRepository.getById(blogPostId);

  if(!blogPost) {
    throw new RequestError(404);
  }

  return blogPost;
};

interface CreateBlogPostData {
  title: string;
  content: string;
  imageFile: Express.Multer.File;
  tags: string[];
}

const createOne = async (data: CreateBlogPostData) => {
  const cover = new BlogPostCover();

  try {
    await cover.saveBuffer(data.imageFile.buffer);

    const tags = await TagRepository.getTagsByName(data.tags);

    const createdBlogPost = await BlogPostRepository.createOne({
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

const updateTitle = (blogPostId: string, title: string) => {
  return BlogPostRepository.updateById(
    blogPostId,
    { title }
  );
};


const updateContent = (blogPostId: string, content: string) => {
  return BlogPostRepository.updateById(
    blogPostId,
    { content }
  );
};

const updateCover = async (blogPostId: string, coverFile: Express.Multer.File) => {
  const newCover = new BlogPostCover();

  try {
    await newCover.saveBuffer(coverFile.buffer);

    const oldBlogPost = await BlogPostRepository.updateById(
      blogPostId, { cover: newCover.getName() }
    );

    if(!oldBlogPost) {
      throw new RequestError(500, "An error happened trying to update the Blog Post");
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
  const tagDocuments = await TagRepository.getTagsByName(tags);

  return BlogPostRepository.updateById(blogPostId, {
    tags: tagDocuments
  });
};

const deleteOneById = async (blogPostId: string) => {
  const deletedPost = await BlogPostRepository.deleteOneById(blogPostId);

  // this is not necessary since it's supposed to be a validation middleware
  // to check that the post exists, but if for some reason the middleware is
  // forgotten we avoid a crash with this
  if(!deletedPost) {
    throw new RequestError(500, "There was an error trying to find the post to be deleted");
  }

  const coverName = deletedPost.get("cover", null, { getters: false });
  const cover = new BlogPostCover(coverName);

  await cover.delete();

  return deletedPost;
};

export default {
  getAll,
  getById,
  createOne,
  updateTitle,
  updateContent,
  updateCover,
  updateTags,
  deleteOneById
};
