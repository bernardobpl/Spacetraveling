import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        { locale: ptBR }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    results: posts,
    next_page: postsResponse.next_page,
  };

  return {
    props: {
      postsPagination,
    },
    revalidate: 60 * 30, // 30 min
  };
};

export default function Home({
  postsPagination: { results, next_page },
}: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(results);
  const [nextPage, setNextPage] = useState(next_page);

  async function handleGetNextPage(): Promise<void> {
    try {
      const response = await fetch(
        `/api/posts-next-page?next_page=${encodeURIComponent(nextPage)}`
      );
      const data = await response.json();
      setPosts(v => [...v, ...(data.posts as Post[])]);
      setNextPage(data.next_page);
    } catch {}
  }
  return (
    <>
      <Head>
        <title>Posts | SpaceTraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={commonStyles.content}>
          <img src="/logo.svg" alt="logo" />
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a className={styles.post}>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>

                <div className={commonStyles.postInfo}>
                  <FiCalendar />
                  <span>{post.first_publication_date}</span>
                  <FiUser />
                  <span>{post.data.author}</span>
                </div>
              </a>
            </Link>
          ))}

          {nextPage && (
            <button type="button" onClick={handleGetNextPage}>
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}
