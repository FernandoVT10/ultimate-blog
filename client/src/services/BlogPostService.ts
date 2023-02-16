import axios from "@config/axios";

import { Tag } from "./TagService";

export type BlogPost = {
  _id: string;
  title: string;
  content: string;
  cover: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export async function getAllPosts(limit?: number, excludePost?: string): Promise<BlogPost[]> {
  try {
    const res = await axios.get("/blogposts", {
      params: {
        limit, excludePost
      }
    });
    return res.data;
  } catch {
    return [];
  }
}

export async function getPostById(blogPostId: string): Promise<BlogPost | null> {
  try {
    const res = await axios.get(`/blogposts/${blogPostId}`);
    return res.data;
  } catch {
    return null;
  }
}

interface CreatePostData {
  title: string;
  content: string;
  cover: File;
  tags: string[];
}

export async function createPost({ title, content, cover, tags }: CreatePostData): Promise<BlogPost> {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("cover", cover);

  tags.forEach(tag => formData.append("tags", tag));

  const res = await axios.post("/blogposts/", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    withCredentials: true
  });

  return res.data;
}

export async function updateCover(blogPostId: string, cover: File): Promise<{ error: string | null }> {
  const formData = new FormData();
  formData.append("cover", cover);

  try {
    await axios.put(
      `/blogposts/${blogPostId}/updateCover`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      }
    );

    return {
      error: null
    };
  } catch {
    return {
      error: "There was an error trying to upload the cover"
    };
  }
}

export async function updateTitle(
  blogPostId: string,
  title: BlogPost["title"]
): Promise<boolean> {
  try {
    await axios.put(
      `/blogposts/${blogPostId}/updateTitle`,
      { title },
      { withCredentials: true }
    );

    return true;
  } catch {
    return false;
  }
}

export async function updateContent(
  blogPostId: string,
  content: BlogPost["content"]
): Promise<boolean> {
  try {
    await axios.put(
      `/blogposts/${blogPostId}/updateContent`,
      { content },
      { withCredentials: true }
    );

    return true;
  } catch {
    return false;
  }
}


export async function updateTags(
  blogPostId: string,
  tags: string[]
): Promise<boolean> {
  try {
    await axios.put(
      `/blogposts/${blogPostId}/updateTags`,
      { tags },
      { withCredentials: true }
    );

    return true;
  } catch {
    return false;
  }
}

export async function deleteBlogPost(blogPostId: BlogPost["_id"]): Promise<boolean> {
  try {
    await axios.delete(`/blogposts/${blogPostId}`, {
      withCredentials: true
    });

    return true;
  } catch {
    return false;
  }
}
