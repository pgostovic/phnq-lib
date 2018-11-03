import { setCache as setWikiCache, searchReq, pageExtractsReq } from './client';

export const setCache = cache => setWikiCache(cache);

export const search = text => searchReq(text, 'query', 'search');

export const getPageIntro = pageId => pageExtractsReq(pageId, { exintro: true }, 'query', 'pages', pageId, 'extract');
