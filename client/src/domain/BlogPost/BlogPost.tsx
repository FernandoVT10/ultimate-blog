import { useState } from "react";
import { useAuthProvider } from "@providers/AuthProvider";
import { CommentWithRepliesCount } from "./Comments/Comments";

import Cover from "./Cover";
import Title from "./Title";
import Content from "./Content";
import Tags from "./Tags";
import DeleteButton from "./DeleteButton";
import CommentForm from "./CommentForm";
import BlogDate from "@components/BlogDate";

import dynamic from "next/dynamic";

import type {
  BlogPost as BlogPostType,
  Comment
} from "@customTypes/collections";

import styles from "./BlogPost.module.scss";

// this solves weird "Text content does not match server-rendered HTML" error
// that only happens on the server
const Comments = dynamic(() => import("./Comments"), { ssr: false });

interface BlogPostProps {
  blogPost: BlogPostType;
  comments: Comment[];
}

function BlogPost({ blogPost, comments: initialComments }: BlogPostProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const authStatus = useAuthProvider();

  const isAdmin = authStatus.isLogged;

  const handleOnCommentCreation = (createdComment: Comment) => {
    setComments([createdComment, ...comments]);
  };

  return (
    <main className={styles.container}>
      <div className={styles.coverContainer}>
        <Cover
          cover={blogPost.cover}
          blogPostId={blogPost._id}
          isAdmin={isAdmin}
        />

        <div className={styles.date}>
          <BlogDate createdAt={blogPost.createdAt}/>
        </div>
      </div>

      <section className={styles.contentContainer}>
        <Title
          title={blogPost.title}
          isAdmin={isAdmin}
          blogPostId={blogPost._id}
        />

        <Content
          blogPostId={blogPost._id}
          content={blogPost.content}
          isAdmin={isAdmin}
        />

        <Tags
          tags={blogPost.tags}
          isAdmin={isAdmin}
          blogPostId={blogPost._id}
        />
      </section>

      {isAdmin && (
        <section className={styles.dangerZone}>
          <h2 className={styles.subtitle}>Danger Zone</h2>

          <DeleteButton blogPostId={blogPost._id}/>
        </section>
      )}

      <section className={styles.comments}>
        <h2 className={styles.subtitle}>{"Comments"}</h2>

        <CommentForm
          parentModel="BlogPost"
          parentId={blogPost._id}
          onCommentCreation={handleOnCommentCreation}
        />

        <Comments
          comments={comments as CommentWithRepliesCount[]}
          displayComments
        />
      </section>
    </main>
  );
}

export default BlogPost;
