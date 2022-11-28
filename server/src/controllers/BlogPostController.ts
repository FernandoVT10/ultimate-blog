import TagService from "../services/TagService";
import BlogPostService, { BlogPostServiceFilter } from "../services/BlogPostService";

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

export default {
  getAll
};
