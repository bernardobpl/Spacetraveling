import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function getNextPagePosts(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { next_page } = req.query;

  try {
    if (!next_page) {
      throw new Error('Missing next_page URL.');
    }

    const response = await fetch(
      `${decodeURIComponent(String(next_page))}&access_token=${
        process.env.PRISMIC_ACCESS_TOKEN
      }`
    );

    const data = await response.json();

    const newPosts = data.results.map(post => ({
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
    }));

    res.json({
      posts: newPosts,
      next_page: data.next_page,
    });
  } catch (e) {
    res.status(400).send({
      error: `Prismic Pagination: Failed to get next page. ${e.message}`,
    });
  }
}
