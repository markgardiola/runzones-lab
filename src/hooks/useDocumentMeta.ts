import { useEffect } from 'react';
import { SITE } from '../config/site';

/** Sets a unique <title> and meta description per page (SPA, no SSR). */
export function useDocumentMeta(title: string, description: string = SITE.description): void {
  useEffect(() => {
    document.title = title === SITE.name ? `${SITE.name} · ${SITE.tagline}` : `${title} · ${SITE.name}`;
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = description;
  }, [title, description]);
}
