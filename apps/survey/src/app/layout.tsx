import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Survey',
  description: 'Lightweight survey micro frontend rendered through the main host application.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
