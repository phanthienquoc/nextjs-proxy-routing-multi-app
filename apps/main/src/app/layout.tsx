import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Micro Frontends Portal',
  description: 'Host application providing routing and APIs for survey and chat micro frontends.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="header-content">
            <div>
              <h1 className="heading">Micro Frontends Portal</h1>
              <p className="subheading">
                Next.js host app with proxy routing to Survey and Chat experiences.
              </p>
            </div>
            <nav className="nav-links">
              <a href="/">Home</a>
              <a href="/survey">Survey</a>
              <a href="/chat">Chat</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
