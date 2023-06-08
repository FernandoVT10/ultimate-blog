export type Tag = {
  _id: string;
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

export type Comment = {
  _id: string;
  authorName: string;
  content: string;
  parentModel: "BlogPost" | "Comment";
  parentId: string;
  level: number;
  createdAt: string;
  updatedAt: string;
}
