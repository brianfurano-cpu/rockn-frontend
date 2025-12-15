import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata = {
  title: 'ROCKN - AI-Powered Music Industry News',
  description: 'AI-curated music industry news aggregator. Real-time updates from Billboard, Pitchfork, Rolling Stone, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.className} antialiased`}>{children}</body>
    </html>
  );
}
