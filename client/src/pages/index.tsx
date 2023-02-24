/* eslint-disable @next/next/no-img-element */

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Header from "@components/Header";
import BlogPostCards from "@components/BlogPostCards";

import { GetServerSideProps } from "next";
import { BlogPost, getAllPosts } from "@services/BlogPostService";

import styles from "@styles/pages/Home.module.scss";

const aboutMe = `\
Hi, I'm Fernando Vaca Tamayo a Javascript full stack developer.
I like video games, anime, music, and trying to find the best way to write the cleanest and best code.

If I don't know how to do something I try to find the best way to do it searching
all over the internet and even reading github projects created by smarter people than me,
so I can write something that I like, sometimes I even need to set a timer and choose
the idea or solution I had thought even if it's not the best.

I have a lot of things that I need to learn for example docker, kubernetes, and other complicated stuff,
and even, my English is not the best, I can speak and listen most of it, but sometimes
(and depending of the accent) I can't understand what someone is saying or, I can't speak as fluent
when trying to explain something a little bit complicated.

In the end I feel incredibly happy when I read or write a super originized and clean code,
and I think that this happens to other developers that love code too.
`;

const icons: string[] = [
  "/images/icons/typescript.png",
  "/images/icons/linux.png",
  "/images/icons/react.png",
  "/images/icons/git.png",
  "/images/icons/html5.png",
  "/images/icons/css3.png",
  "/images/icons/python.png",
  "/images/icons/nodejs.png",
  "/images/icons/graphql.png",
];

const POSTS_FETCH_LIMIT = 6;

export const getServerSideProps: GetServerSideProps = async () => {
  const blogPosts = await getAllPosts(POSTS_FETCH_LIMIT);

  return {
    props: { blogPosts }
  };
};

export default function Home({ blogPosts }: { blogPosts: BlogPost[] }) {
  return (
    <>
      <Head>
        <title>Home - FVT</title>
      </Head>

      <Header height={350}>
        <div className={styles.githubDetails}>
          <img
            className={styles.avatar}
            src="https://avatars.githubusercontent.com/u/31832473?v=4"
            alt="Github Avatar"
          />

          <h1 className={styles.fullName}>Fernando Vaca Tamayo</h1>

          <p className={styles.username}>
            @FernandoVT10
          </p>
        </div>
      </Header>

      <main className={styles.home}>
        <section className={`wrapper ${styles.section}`}>
          <div className={styles.imageContainer}>
            <Image
              src="/images/section-1-bg.jpg"
              alt="Header Image"
              className={styles.image}
              fill
              />
          </div>

          <div className={styles.sectionContent}>
            <h2 className={styles.subtitle}>About Me</h2>

            <p className={styles.text}>
              { aboutMe }
            </p>
          </div>
        </section>

        <section className={`wrapper ${styles.section} ${styles.reversed}`}>
          <div className={styles.imageContainer}>
            <Image
              src="/images/section-2-bg.jpg"
              alt="Header Image"
              className={styles.image}
              fill
              />
          </div>

          <div className={styles.sectionContent}>
            <h2 className={styles.subtitle}>Technologies and Languages</h2>

            <p className={styles.text}>
              These are some of the technologies, languages, frameworks, etc, that I know how to use.
            </p>

            <div className={styles.icons} style={{textAlign: "center"}}>
              {icons.map((icon, index) => {
                return (
                  <Image
                    src={icon}
                    className={styles.icon}
                    width={40}
                    height={40}
                    alt="Language Icon"
                    key={index}
                  />
                );
              })}

            </div>

            <h2 className={styles.subtitle} id="contact-me">Contact Me</h2>

            <p className={styles.text}>
              You can contact me through {(
                <Link
                  className={styles.link}
                  href="https://twitter.com/FernandoVT10"
                >
                  Twitter
                </Link>
              )}.
            </p>
          </div>
        </section>

        { blogPosts.length > 0 &&
          <section className={`wrapper ${styles.section} ${styles.blogPostCards}`}>
            <h2 className={styles.subtitle}>Recent Blog Posts</h2>

            <BlogPostCards blogPosts={blogPosts}/>
          </section>
        }
      </main>
    </>
  );
}
