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

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const res = await axios.get("/blogposts");

    if(res.status === 200) {
      return res.data;
    }

    return []; 
  } catch {
    return [];
  }
}

export async function getPostById(blogPostId: string): Promise<BlogPost | null> {
  try {
    const res = await axios.get(`/blogposts/${blogPostId}`);

    if(res.status === 200) {
      return res.data;
    } 

    return null;
  } catch {
    return null;
  }
}

// TODO: I should be handling the errors way better

export async function updateCover(blogPostId: string, cover: File): Promise<{ error: string | null }> {
  const formData = new FormData();
  formData.append("cover", cover);

  try {
    const res = await axios.put(
      `/blogposts/${blogPostId}/updateCover`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      }
    );

    if(res.status !== 204 && res.data.message) {
      return { error: res.data.message };
    }

    return {
      error: null
    };
  } catch {
    return {
      error: "There was an error trying to upload the cover"
    };
  }
}

// TODO: really repetitive code down here, need fix

export async function updateTitle(
  blogPostId: string,
  title: BlogPost["title"]
): Promise<boolean> {
  try {
    const res = await axios.put(
      `/blogposts/${blogPostId}/updateTitle`,
      { title },
      { withCredentials: true }
    );

    if(res.status === 204) return true;

    return false;
  } catch {
    return false;
  }
}

export async function updateContent(
  blogPostId: string,
  content: BlogPost["content"]
): Promise<boolean> {
  try {
    const res = await axios.put(
      `/blogposts/${blogPostId}/updateContent`,
      { content },
      { withCredentials: true }
    );

    if(res.status === 204) return true;

    return false;
  } catch {
    return false;
  }
}


export async function updateTags(
  blogPostId: string,
  tags: string[]
): Promise<boolean> {
  try {
    const res = await axios.put(
      `/blogposts/${blogPostId}/updateTags`,
      { tags },
      { withCredentials: true }
    );

    if(res.status === 204) return true;

    return false;
  } catch {
    return false;
  }
}

export async function deleteBlogPost(blogPostId: BlogPost["_id"]): Promise<boolean> {
  try {
    const res = await axios.delete(`/blogposts/${blogPostId}`, {
      withCredentials: true
    });

    return res.status === 200;
  } catch {
    return false;
  }
}
