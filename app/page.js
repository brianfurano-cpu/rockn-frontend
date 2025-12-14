import { Pool } from 'pg';
import ArticlesFeed from './components/ArticlesFeed';

async function getArticles() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    const result = await pool.query(
      `SELECT id, title, url, source, ai_summary, relevance_score, pub_date, category 
       FROM articles 
       ORDER BY pub_date DESC 
       LIMIT 200`
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    return [];
  } finally {
    await pool.end();
  }
}

export default async function Home() {
  const articles = await getArticles();
  
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="border-b-8 border-red-600 bg-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">
                ROCKN
              </h1>
              <p className="text-red-600 text-lg md:text-xl font-bold tracking-widest mt-2">
                AI-POWERED MUSIC INDUSTRY INTELLIGENCE
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-gray-500 text-sm">TOTAL INDEXED</p>
              <p className="text-white text-4xl font-black">{articles.length}</p>
              <p className="text-gray-500 text-sm">ARTICLES</p>
            </div>
          </div>
        </div>
      </header>

      {/* STATS BAR */}
      <div className="bg-red-600 text-black py-3 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 text-xs md:text-sm font-black uppercase tracking-wider whitespace-nowrap">
          <span>◆ LIVE DATA</span>
          <span>◆ AI-SCORED</span>
          <span>◆ 19 SOURCES</span>
          <span>◆ UPDATED EVERY 6 HOURS</span>
        </div>
      </div>

      {/* INTERACTIVE FEED */}
      <ArticlesFeed articles={articles} />

      {/* FOOTER */}
      <footer className="border-t-8 border-red-600 bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-4xl font-black tracking-tighter mb-4">ROCKN</p>
          <p className="text-gray-500 text-sm">
            POWERED BY CLAUDE AI • BUILT BY BRIAN • {new Date().getFullYear()}
          </p>
          <p className="text-gray-700 text-xs mt-4">
            Aggregating from Billboard, Pitchfork, Rolling Stone, Music Business Worldwide, and more.
          </p>
        </div>
      </footer>
    </main>
  );
}
