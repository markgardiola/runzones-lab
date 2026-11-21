import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import PortraitFigure, { initials } from './PortraitFigure';

describe('initials', () => {
  it('uses first and last name', () => {
    expect(initials('Hirofumi Tanaka')).toBe('HT');
    expect(initials('Martti Karvonen')).toBe('MK');
    expect(initials('William L. Haskell')).toBe('WH');
    expect(initials('Joe Friel')).toBe('JF');
    expect(initials('Cher')).toBe('C');
  });
});

describe('PortraitFigure', () => {
  it('without a portrait: monogram placeholder, no image, and an honest caption', () => {
    const html = renderToStaticMarkup(createElement(PortraitFigure, { name: 'Joe Friel' }));
    expect(html.includes('data-portrait="placeholder"')).toBe(true);
    expect(html.includes('<img')).toBe(false);
    expect(html.includes('JF')).toBe(true);
    expect(html.includes('Portrait not yet available')).toBe(true);
  });

  it('with a portrait: lazy image, alt text, credit, licence and a safe source link', () => {
    const html = renderToStaticMarkup(
      createElement(PortraitFigure, {
        name: 'Joe Friel',
        portrait: {
          src: '/images/people/friel.jpg',
          alt: 'Portrait of Joe Friel',
          credit: 'Photo: A. Photographer',
          rights: 'cleared',
          license: 'CC BY-SA 4.0',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:Example.jpg',
          width: 400,
          height: 500,
        },
      }),
    );
    expect(html.includes('<img')).toBe(true);
    expect(html.includes('src="/images/people/friel.jpg"')).toBe(true);
    expect(html.includes('alt="Portrait of Joe Friel"')).toBe(true);
    expect(html.includes('loading="lazy"')).toBe(true);
    expect(html.includes('Photo: A. Photographer')).toBe(true);
    expect(html.includes('CC BY-SA 4.0')).toBe(true);
    expect(html.includes('rel="noopener noreferrer"')).toBe(true);
    expect(html.includes('Portrait not yet available')).toBe(false);
  });

  it('an image whose rights are not verified says so on the page and still credits its source', () => {
    const html = renderToStaticMarkup(
      createElement(PortraitFigure, {
        name: 'Joe Friel',
        portrait: {
          src: '/images/people/friel.jpg',
          alt: 'Portrait of Joe Friel',
          credit: 'Image from example.com',
          rights: 'unverified',
          sourceUrl: 'https://example.com/friel',
        },
      }),
    );
    expect(html.includes('Licence not verified')).toBe(true);
    expect(html.includes('Image from example.com')).toBe(true);
    expect(html.includes('href="https://example.com/friel"')).toBe(true);
  });
});
