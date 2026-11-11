import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Resets scroll on route change; leaves in-page #anchors alone. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
