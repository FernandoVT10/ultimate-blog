import Head from "next/head";

import styles from "@styles/Home.module.scss";

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

type Skill = {
  name: string;
  description?: string;
  subskills?: Skill[];
}

const skills: Skill[] = [
  {
    name: "Javascript",
    description: "It's my main language right now.",
    subskills: [
      { name: "Typescript" },
      { name: "React JS" },
      { name: "Next JS" },
      { name: "Express JS" }
    ]
  },
  {
    name: "Linux",
    description: "I have been using Ubuntu as my main OS since 2 years ago."
  },
  {
    name: "Git",
    description: "I know how to use it at a really good level."
  },
  {
    name: "Docker",
    description: "Learning how to use it for production."
  },
  { name: "HTML5" },
  { name: "CSS3" },
  {
    name: "Python",
    description: "I have used it for Artifical Intelligence."
  },
  {
    name: "PHP",
    description: "I know how to use it at an intermediate level",
    subskills: [
      { name: "Laravel" }
    ]
  },
  {
    name: "C#",
    description: "This language is amazing, but I don't have that much experience in it."
  }
];

export default function Home() {
  const getSkills = (skills: Skill[]) => {
    return skills.map((skill, index) => {
      return (
        <li className={styles.skillItem} key={index}>
          <span className={styles.name}>{skill.name}</span>
          { skill.description }

          { skill.subskills?.length &&
            <ul className={styles.subSkillList}>
              { getSkills(skill.subskills) }
            </ul>
          }
        </li>
      );
    });
  };

  return (
    <>
      <Head>
        <title>Home - FVT</title>
      </Head>

      <main className={styles.home}>
        <div className={styles.aboutMe}>
          <h2 className={styles.subtitle}>About Me</h2>

          <p className={styles.text}>
            {aboutMe}
          </p>
        </div>

        <div>
          <div className={styles.skills}>
            <h2 className={styles.subtitle}>Skills</h2>

            <ul className={styles.skillList}>
              { getSkills(skills) }
            </ul>
          </div>

          <div className={styles.socialMedia}>
            <h2 className={styles.subtitle}>Some Social Media</h2>
          </div>
        </div>
      </main>
    </>
  );
}
