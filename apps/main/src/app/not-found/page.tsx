import Link from 'next/link';
import type { Metadata } from 'next';
import type { Route } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The requested page could not be located.'
};

export default function NotFoundPage() {
  return (
    <div className="proxy-fallback">
      <h1>Page not found</h1>
      <p>
        We couldn&apos;t find the page you&apos;re looking for. Try heading back to the home screen or explore the survey and chat
        experiences from there.
      </p>
      <p className="small-print">
        <Link href={'/' as Route}>Return home</Link> · <Link href={'/survey' as Route}>Survey</Link> ·{' '}
        <Link href={'/chat' as Route}>Chat</Link>
      </p>
    </div>
  );
}
