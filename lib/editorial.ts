import type { StudioContent } from './studio-content';

export type StudioArticle = StudioContent['articles'][number];
export function recentArticles(articles: StudioArticle[]) {
  return [...articles].sort((a, b) => (Date.parse(b.publishedAt || '') || 0) - (Date.parse(a.publishedAt || '') || 0));
}
export function articleMedia(article: StudioArticle, banner = false) {
  const original = `/editorial/${article.artwork === 'orbit' ? 'motion' : article.artwork === 'grid' ? 'process' : 'design'}${banner ? '-wide' : ''}.svg`;
  return (banner ? article.bannerImage : article.cardImage) || article.image || original;
}
export function articleDate(article: StudioArticle) {
  const date = Date.parse(article.publishedAt || '');
  return date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : 'Studio perspective';
}
