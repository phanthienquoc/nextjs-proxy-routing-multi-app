import Link from 'next/link';
import type { Route } from 'next';
import RecentResponses from './components/RecentResponses';

export default async function HomePage() {
  return (
    <section>
      <p>
        This is the host Next.js application. Requests to <code>/survey</code> and <code>/chat</code> will be proxied to the dedicated
        Survey (Next.js) and Chat (Vue) micro frontends.
      </p>
      <div className="cards" style={{ marginTop: '2rem' }}>
        <article className="card">
          <h2>Survey experience</h2>
          <p>
            Built with Next.js, statically generated with background re-validation and powered by the shared API layer.
          </p>
          <Link href={'/survey' as Route} className="button" role="button">
            Go to survey
          </Link>
        </article>
        <article className="card">
          <h2>Chat experience</h2>
          <p>Built with Vue 3 + Vite using TypeScript. Served through the proxy under <code>/chat</code>.</p>
          <Link href={'/chat' as Route} className="button button--secondary" role="button">
            Open chat
          </Link>
        </article>
      </div>
      <section>
        <h2 className="section-title">Latest survey responses</h2>
        <RecentResponses />
      </section>
    </section>
  );
}
