/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import BlogPostCards from "@components/BlogPostCards";

import { CodeIcon, FileDirectoryOpenFillIcon, GlobeIcon } from "@primer/octicons-react";

import type { BlogPost } from "@customTypes/collections";

import styles from "./Home.module.scss";
import MainScreen from "./MainScreen/MainScreen";


const technologies: string[] = [
  "React", "Node.js", "Typescript", "HTML/CSS", "Next.js", "GraphQL", "Sql/Nosql",
  "Linux Servers"
];

export default function Home({ blogPosts }: { blogPosts: BlogPost[] }) {
  return (
    <>
      <MainScreen/>

      <main className={styles.home}>
        <section className={styles.skills}>
          <div className={styles.card}>
            <CodeIcon size={40} className={styles.icon}/>

            <h3 className={styles.cardTitle}>Technologies</h3>

            <p className={styles.details}>
              {"I know how to use "}
              {technologies.map((technology, index) => {
                return (
                  <>
                    { index !== 0 ? "," : ""}
                    <span key={index}> {technology}</span>
                  </>
                );
              })}
              {", and more."}
            </p>
          </div>

          <div className={styles.card}>
            <GlobeIcon size={40} className={styles.icon}/>

            <h3 className={styles.cardTitle}>Languages</h3>

            <p className={styles.details}>
              <span>Spanish</span> is my native language, and I have a <span>B1</span> level of <span>English</span>.
            </p>
          </div>

          <div className={styles.card}>
            <FileDirectoryOpenFillIcon size={40} className={styles.icon}/>

            <h3 className={styles.cardTitle}>Projects</h3>

            <p className={styles.details}>
              {"This website is one of the best project I have made so far.\n"}
              {"Check out all my projects on\n"}
              <Link href="https://github.com/FernandoVT10">
                <span>Github</span>
              </Link>.
            </p>
          </div>
        </section>

        { blogPosts.length > 0 &&
          <section className={`${styles.section} ${styles.noFlex}`}>
            <h2 className={styles.subtitle}>{"Posts from my blog"}</h2>

            <BlogPostCards blogPosts={blogPosts}/>
          </section>
        }
      </main>
    </>
  );
}
