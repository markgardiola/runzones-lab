import { useState } from 'react';
import type { PortraitInfo } from '../../types';
import { initials } from '../../utils/initials';

interface Props {
  name: string;
  portrait?: PortraitInfo;
  /** Smaller version for cards (Home). */
  compact?: boolean;
}

/**
 * A portrait with its credit, or a neutral monogram placeholder. If the image file cannot be loaded
 * (wrong path, missing from the deployment) the page falls back to the placeholder instead of showing
 * a broken image, and the browser console says exactly which file failed.
 */
export default function PortraitFigure({ name, portrait, compact = false }: Props) {
  const [failed, setFailed] = useState(false);
  const width = compact ? 'w-24' : 'w-40';

  if (!portrait || failed) {
    return (
      <figure data-portrait={failed ? 'failed' : 'placeholder'} className={width}>
        <div
          aria-hidden="true"
          className={`flex aspect-[4/5] w-full items-center justify-center border border-line bg-line/40 font-display text-muted ${compact ? 'text-2xl' : 'text-4xl'}`}
        >
          {initials(name)}
        </div>
        {compact ? null : (
          <figcaption className="mt-2 text-xs leading-snug text-muted">
            {failed
              ? 'Portrait unavailable.'
              : 'Portrait not yet available. Only images with a clear licence or permission are shown.'}
          </figcaption>
        )}
      </figure>
    );
  }

  // Credit and licence, skipping any empty part so there are no stray separators
  const rights = portrait.rights === 'cleared' ? portrait.license : 'Licence not verified';
  const credit = [portrait.credit, rights].filter(Boolean).join(' · ');

  return (
    <figure data-portrait="image" className={width}>
      <img
        src={portrait.src}
        alt={portrait.alt}
        width={portrait.width}
        height={portrait.height}
        loading="lazy"
        decoding="async"
        onError={() => {
          console.warn(
            `Portrait for ${name} could not be loaded from "${portrait.src}". Check that the file exists in public/ with exactly this name (capitals matter on the live site) and that it is committed to Git.`,
          );
          setFailed(true);
        }}
        className="h-auto w-full border border-line"
      />
      <figcaption className={`mt-2 leading-snug text-muted ${compact ? 'text-[11px]' : 'text-xs'}`}>
        {credit ? `${credit} · ` : ''}
        <a href={portrait.sourceUrl} target="_blank" rel="noopener noreferrer" className="link-underline">
          Image source
        </a>
      </figcaption>
    </figure>
  );
}
