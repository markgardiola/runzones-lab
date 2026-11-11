import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function NotFound() {
  useDocumentMeta('Page not found');
  return (
    <div className="container-page py-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-4xl font-medium">Page not found</h1>
      <p className="mt-4 text-muted">That page doesn&rsquo;t exist.</p>
      <Link to="/" className="btn btn-primary mt-8">Back to home</Link>
    </div>
  );
}
