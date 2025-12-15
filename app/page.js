import { Pool } from 'pg';
import ArticlesFeed from './components/ArticlesFeed';

async function getArticles() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    const result = await pool.query(
      `SELECT id, title, url, source, ai_summary, relevance_score, pub_date, category, image_url, thumbs_up, thumbs_down
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

export const revalidate = 300; // Revalidate every 5 minutes

export default async function Home() {
  const articles = await getArticles();
  
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="border-b-4 border-green-500 bg-black">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
                ROCKN
              </h1>
              <p className="text-green-500 text-base md:text-lg font-bold tracking-widest mt-2">
                AI-POWERED MUSIC INDUSTRY INTELLIGENCE
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-gray-500 text-xs">TOTAL INDEXED</p>
              <p className="text-white text-3xl font-black">{articles.length}</p>
              <p className="text-gray-500 text-xs">ARTICLES</p>
            </div>
          </div>
        </div>
      </header>

      {/* STATS BAR */}
      <div className="bg-green-600 text-black py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 text-xs font-black uppercase tracking-wider whitespace-nowrap">
          <span>◆ LIVE DATA</span>
          <span>◆ AI-SCORED</span>
          <span>◆ 19 SOURCES</span>
          <span>◆ UPDATED EVERY 3 HOURS</span>
        </div>
      </div>

      {/* INTERACTIVE FEED */}
      <ArticlesFeed articles={articles} />

      {/* FOOTER */}
      <footer className="border-t-4 border-green-500 bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-2xl font-black tracking-tighter mb-2">ROCKN</p>
          <p className="text-gray-500 text-xs">
            POWERED BY CLAUDE AI • BUILT BY BRIAN • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  );
}
