import type { ReactNode } from 'react';

interface Props {
  id?: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
}

export default function SectionHeading({ id, eyebrow, title, children }: Props) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-3xl font-medium sm:text-4xl">{title}</h2>
      {children ? <p className="mt-4 leading-relaxed text-muted">{children}</p> : null}
    </div>
  );
}
