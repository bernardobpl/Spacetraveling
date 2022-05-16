import * as prismic from '@prismicio/client';
import { HttpRequestLike } from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';
import sm from '../../sm.json';

export interface PrismicConfig {
  req?: HttpRequestLike;
}

export function getPrismicClient(config: PrismicConfig): prismic.Client {
  const client = prismic.createClient(sm.apiEndpoint, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  enableAutoPreviews({
    client,
    req: config.req,
  });

  return client;
}
