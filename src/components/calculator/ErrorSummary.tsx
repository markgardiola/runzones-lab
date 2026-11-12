import type { ValidationIssue } from '../../types';

export default function ErrorSummary({ errors }: { errors: ValidationIssue[] }) {
  if (errors.length === 0) return null;
  return (
    <div role="alert" className="mt-4 border border-accent p-3 text-sm">
      <p className="font-semibold text-accent">Please fix the following:</p>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        {errors.map((e) => (
          <li key={e.code + e.field}>{e.message}</li>
        ))}
      </ul>
    </div>
  );
}
