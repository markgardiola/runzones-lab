import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const WAIT_FOR_ANCHOR_MS = 5000;

/**
 * On route change: scroll to the #anchor if the URL has one (React Router does not do this by itself),
 * otherwise to the top of the page. Pages are loaded on demand, so the anchor may not exist yet when the
 * route changes; wait for it to appear instead of giving up.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const id = hash ? decodeURIComponent(hash.slice(1)) : '';
    if (!id) {
      window.scrollTo(0, 0);
      return;
    }
    const scrollToAnchor = (): boolean => {
      const el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView();
      return true;
    };
    if (scrollToAnchor()) return;

    const observer = new MutationObserver(() => {
      if (scrollToAnchor()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const giveUp = window.setTimeout(() => {
      observer.disconnect();
      window.scrollTo(0, 0);
    }, WAIT_FOR_ANCHOR_MS);
    return () => {
      observer.disconnect();
      window.clearTimeout(giveUp);
    };
  }, [pathname, hash]);
  return null;
}
