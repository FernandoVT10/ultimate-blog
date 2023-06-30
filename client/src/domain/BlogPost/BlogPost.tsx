import { useState } from "react";
import { useAuthProvider } from "@providers/AuthProvider";
import { CommentWithRepliesCount } from "./Comments/Comments";

import Cover from "./Cover";
import Title from "./Title";
import Content from "./Content";
import Tags from "./Tags";
import DeleteButton from "./DeleteButton";
import BlogPostCards from "@components/BlogPostCards";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import BlogDate from "@components/BlogDate";

import type {
  BlogPost as BlogPostType,
  Comment
} from "@customTypes/collections";

import styles from "./BlogPost.module.scss";

interface BlogPostProps {
  blogPost: BlogPostType;
  recentBlogPosts: BlogPostType[];
  comments: Comment[];
}

function BlogPost({ blogPost, recentBlogPosts, comments: initialComments }: BlogPostProps) {
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

      {recentBlogPosts.length > 0 && (
        <section className={styles.recentBlogPosts}>
          <h2>Other Posts</h2>
          <BlogPostCards blogPosts={recentBlogPosts}/>
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
