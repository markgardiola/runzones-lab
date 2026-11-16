import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * On route change: scroll to the #anchor if the URL has one (React Router does not do this by
 * itself), otherwise to the top of the page.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
