import { setCache as setWikiCache, searchReq, pageExtractsReq } from './client';

export const wikipedia = {
  setCache: cache => setWikiCache(cache),

  search: text => searchReq(text, 'query', 'search'),

  getPageIntro: pageId => pageExtractsReq(pageId, { exintro: true }, 'query', 'pages', pageId, 'extract'),
};
