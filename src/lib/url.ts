// Every internal link goes through here, so the site works both under /swathi-portfolio/ on
// GitHub Pages and at the root of a custom domain later.
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** url('/work/kattam/') → '/swathi-portfolio/work/kattam/' */
export const url = (path = '/') => `${base}${path.startsWith('/') ? path : `/${path}`}`;
