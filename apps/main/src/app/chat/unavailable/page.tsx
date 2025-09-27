import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';

export const metadata: Metadata = {
  title: 'Chat Experience',
  description: 'Chat micro frontend is currently unavailable.'
};

const chatOrigin = process.env.NEXT_PUBLIC_CHAT_ORIGIN ?? 'not configured';
const chatProxyEnabled = process.env.CHAT_PROXY_ENABLED !== 'false';

export default function ChatUnavailablePage() {
  return (
    <div className="proxy-fallback">
      <h1>Chat micro frontend unavailable</h1>
      <p>
        The Chat application is not responding. Start it locally with <code>npm run dev:chat</code>, or ensure the Docker service
        named <code>chat</code> is running, then refresh this page to view the proxied experience.
      </p>
      <p className="small-print">
        Proxy enabled: <code>{String(chatProxyEnabled)}</code> · Target origin: <code>{chatOrigin}</code>
      </p>
      <p className="small-print">
        Want to try the survey instead? <Link href={'/survey' as Route}>Go to survey</Link>.
      </p>
    </div>
  );
}
