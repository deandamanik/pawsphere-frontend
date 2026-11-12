import { API_URL } from './api';

const images = import.meta.glob('../assets/product/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

// Old API records and saved carts still contain source-directory URLs.
export function resolveProductImage(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  const source = value.trim().replace(/\\/g, '/');
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(source, 'https://asset.invalid/').pathname);
  } catch {
    return '';
  }
  if (/^\/?src\/assets\/product\//i.test(pathname)) {
    const filename = pathname.split('/').pop().toLowerCase();
    return Object.entries(images).find(([key]) => key.split('/').pop().toLowerCase() === filename)?.[1] || '';
  }
  if (/^(https?:|data:image\/|blob:)/i.test(source)) return source;
  if (source.startsWith(import.meta.env.BASE_URL + 'assets/')) return source;
  try {
    const backend = new URL(API_URL, window.location.origin);
    return new URL(source.replace(/^\/+/, ''), backend.origin + '/').href;
  } catch {
    return '';
  }
}
