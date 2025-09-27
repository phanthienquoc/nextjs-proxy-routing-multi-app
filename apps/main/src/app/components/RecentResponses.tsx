import Link from 'next/link';
import type { Route } from 'next';

async function loadResponses() {
  const base = process.env.NEXT_PUBLIC_INTERNAL_API_BASE ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${base}/api/responses`, {
      next: { revalidate: 30 },
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      console.warn('[main] Failed to fetch recent responses from host API.');
      return [];
    }

    const data = (await res.json()) as {
      responses?: Array<{ id: number; email: string; created_at: string; answers: unknown }>;
    };

    return data.responses ?? [];
  } catch (error) {
    console.warn('[main] Unable to reach host API for recent responses – returning empty list.', error);
    return [];
  }
}

export default async function RecentResponses() {
  const responses = await loadResponses();

  if (responses.length === 0) {
    return (
      <div className="empty-state">
        No survey responses yet. Share the <Link href={'/survey' as Route}>survey</Link> to collect feedback.
      </div>
    );
  }

  return (
    <div className="responses">
      {responses.map((response) => (
        <article key={response.id}>
          <header>
            <span>{response.email}</span>
            <time suppressHydrationWarning>{new Date(response.created_at).toLocaleString()}</time>
          </header>
          <pre>{JSON.stringify(response.answers, null, 2)}</pre>
        </article>
      ))}
    </div>
  );
}
