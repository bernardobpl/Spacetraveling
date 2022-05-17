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

  const post = await prismic.getByUID('posts', String(slug));

  return {
    props: {
      post,
    },
  };
};

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  const timeToRead = `${Math.ceil(
    post.data.content.reduce((totalWords, { heading, body }) => {
      const headingWords = heading.split(' ').length;
      const bodyWords = RichText.asText(body).split(' ').length;
      return totalWords + headingWords + bodyWords;
    }, 0) / 200
  )} min`;

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
            <span>
              {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </span>
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
