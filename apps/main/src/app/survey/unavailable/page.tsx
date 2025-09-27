import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';

export const metadata: Metadata = {
  title: 'Survey Experience',
  description: 'Survey micro frontend is currently unavailable.'
};

const surveyOrigin = process.env.NEXT_PUBLIC_SURVEY_ORIGIN ?? 'not configured';
const surveyProxyEnabled = process.env.SURVEY_PROXY_ENABLED !== 'false';

export default function SurveyUnavailablePage() {
  return (
    <div className="proxy-fallback">
      <h1>Survey micro frontend unavailable</h1>
      <p>
        The Survey application cannot be reached. Start it locally with <code>npm run dev:survey</code>, or ensure the Docker
        service named <code>survey</code> is running, then refresh this page to view the proxied experience.
      </p>
      <p className="small-print">
        Proxy enabled: <code>{String(surveyProxyEnabled)}</code> · Target origin: <code>{surveyOrigin}</code>
      </p>
      <p className="small-print">
        Looking for the chat experience instead? <Link href={'/chat' as Route}>Go to chat</Link>.
      </p>
    </div>
  );
}
