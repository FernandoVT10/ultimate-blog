import axios from "@config/axios";

type Tag = {
  name: string;
}

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
  const res = await axios.get("/blogposts");

  if(res.status === 200) {
    return res.data;
  }

  return [];
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
