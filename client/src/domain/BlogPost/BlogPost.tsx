import { useAuthProvider } from "@providers/AuthProvider";

import Cover from "./Cover";
import Title from "./Title";
import Content from "./Content";
import Tags from "./Tags";
import DeleteButton from "./DeleteButton";
import BlogDate from "@components/BlogDate";
import CommentSection from "./CommentSection";

import type {
  BlogPost as BlogPostType,
  Comment
} from "@customTypes/collections";

import styles from "./BlogPost.module.scss";

interface BlogPostProps {
  blogPost: BlogPostType;
  comments: Comment[];
}

function BlogPost({ blogPost, comments }: BlogPostProps) {
  const authStatus = useAuthProvider();

  const isAdmin = authStatus.isLogged;

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

        <CommentSection blogPostId={blogPost._id} comments={comments}/>
      </section>
    </main>
  );
}

export default BlogPost;
