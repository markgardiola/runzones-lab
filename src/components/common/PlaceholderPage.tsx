import type { ReactNode } from 'react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';

interface Props {
  title: string;
  eyebrow: string;
  description: string;
  phase: string;
  children?: ReactNode;
}

/** Page shell used until each page's phase is built. */
export default function PlaceholderPage({ title, eyebrow, description, phase, children }: Props) {
  useDocumentMeta(title, description);
  return (
    <div className="container-page py-16 sm:py-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-medium sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">{description}</p>
      <p className="mt-8 inline-block border border-line px-4 py-3 text-sm text-muted">
        This section is under construction and is scheduled for {phase}.
      </p>
      {children ? <div className="mt-16">{children}</div> : null}
    </div>
  );
}
