import './globals.css';

export const metadata = {
  title: 'ROCKN - AI-Powered Music Industry News',
  description: 'AI-curated music industry news aggregator. Real-time updates from Billboard, Pitchfork, Rolling Stone, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="impact-site-verification" content="009ba780-7814-49e1-ae95-eb7e9098d3d6" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
