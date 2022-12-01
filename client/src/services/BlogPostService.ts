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
