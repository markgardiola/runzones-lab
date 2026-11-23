import type { PortraitInfo } from '../../types';
import { initials } from '../../utils/initials';

interface Props {
  name: string;
  portrait?: PortraitInfo;
}

/** A licensed portrait with its credit, or a neutral monogram placeholder. */
export default function PortraitFigure({ name, portrait }: Props) {
  if (!portrait) {
    return (
      <figure data-portrait="placeholder" className="w-40">
        <div
          aria-hidden="true"
          className="flex aspect-[4/5] w-full items-center justify-center border border-line bg-line/40 font-display text-4xl text-muted"
        >
          {initials(name)}
        </div>
        <figcaption className="mt-2 text-xs leading-snug text-muted">
          Portrait not yet available. Only images with a clear licence or permission are shown.
        </figcaption>
      </figure>
    );
  }
  return (
    <figure data-portrait="image" className="w-40">
      <img
        src={portrait.src}
        alt={portrait.alt}
        width={portrait.width}
        height={portrait.height}
        loading="lazy"
        decoding="async"
        className="h-auto w-full border border-line"
      />
      <figcaption className="mt-2 text-xs leading-snug text-muted">
        {portrait.credit} · {portrait.rights === 'cleared' ? portrait.license : 'Licence not verified'} ·{' '}
        <a href={portrait.sourceUrl} target="_blank" rel="noopener noreferrer" className="link-underline">
          Image sourceURL
        </a>
      </figcaption>
    </figure>
  );
}
