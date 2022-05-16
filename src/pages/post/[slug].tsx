import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import React from 'react';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  timeToRead: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', { fetch: ['uid'] });

  return {
    paths: posts.results.map(post => ({ params: { slug: post.uid } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const { slug } = params;

  const response = await prismic.getByUID('posts', String(slug));

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd MMM yyyy',
      { locale: ptBR }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(section => {
        return {
          heading: section.heading,
          body: section.body.map(el => ({ text: el.text })),
        };
      }),
    },
  };

  const timeToRead = `${Math.round(
    post.data.content.reduce((time, { body }) => {
      const words = RichText.asText(body).split(' ').length;
      const timeForParagraph = words / 200;
      return time + timeForParagraph;
    }, 0)
  )} min`;
  // console.log(JSON.stringify(post.data.content, null, 2));

  return {
    props: {
      post,
      timeToRead,
    },
  };
};

export default function Post({ post, timeToRead }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }
  return (
    <>
      <Head>
        <title>{post.data.title} | SpaceTraveling</title>
      </Head>

      <main className={styles.container}>
        <Header />

        <div className={styles.banner}>
          <img src={post.data.banner.url} alt="banner" />
        </div>

        <div className={commonStyles.content}>
          <h1>{post.data.title}</h1>
          <div className={commonStyles.postInfo}>
            <FiCalendar />
            <span>{post.first_publication_date}</span>
            <FiUser />
            <span>{post.data.author}</span>
            <FiClock />
            <span>{timeToRead}</span>
          </div>
          <div className={styles.postContent}>
            {post.data.content.map(({ heading, body }, sectionIndex) => (
              <React.Fragment key={`${heading}-${sectionIndex}`}>
                <h2>{heading}</h2>
                {body.map(({ text }) => (
                  <p key={text}>{text}</p>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
