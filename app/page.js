import { Pool } from 'pg';
import ArticlesFeed from './components/ArticlesFeed';

async function getArticles() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query(
      `SELECT id, title, url, source, ai_summary, relevance_score, pub_date, category, image_url 
       FROM articles 
       ORDER BY pub_date DESC 
       LIMIT 200`
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    return MOCK_ARTICLES;
  } finally {
    await pool.end();
  }
}

// Mock data for local testing/preview
const MOCK_ARTICLES = [
  {
    id: 1,
    title: "AI Music Generators Face Legal Headwinds in New Copyright Class Action",
    url: "#",
    source: "Billboard",
    ai_summary: "Major record labels have filed a collective lawsuit against leading AI music generation platforms, citing massive copyright infringement of their catalog data used for training models without license.",
    relevance_score: 95,
    pub_date: new Date().toISOString(),
    category: "Legal",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Spotify Announces New 'Super-Premium' Tier with Lossless Audio",
    url: "#",
    source: "Music Business Worldwide",
    ai_summary: "After years of speculation, Spotify is rolling out its high-fidelity tier, priced at $19.99, which also includes advanced AI-powered playlist generation tools and audiobook hours.",
    relevance_score: 88,
    pub_date: new Date(Date.now() - 3600000).toISOString(),
    category: "Streaming",
    image_url: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "The Rise of 'Hyper-Local' Touring: How Indie Artists are Rethinking Live Strategies",
    url: "#",
    source: "Pitchfork",
    ai_summary: "Rising travel costs and visa issues are forcing independent artists to focus on regional micro-tours, building dense fanbases in smaller geographic areas effectively.",
    relevance_score: 72,
    pub_date: new Date(Date.now() - 7200000).toISOString(),
    category: "Touring",
    image_url: "https://images.unsplash.com/photo-1459749411177-d04bf3067a28?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Universal Music Group Partners with YouTube for AI Voice Incubator",
    url: "#",
    source: "Rolling Stone",
    ai_summary: "A new initiative will allow select artists to license their voice models for creator use, attempting to monetize the AI cover wave rather than unauthorized mimicking.",
    relevance_score: 82,
    pub_date: new Date(Date.now() - 10800000).toISOString(),
    category: "Tech",
    image_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "Vinyl Sales Outpace CDs for the Second Consecutive Year",
    url: "#",
    source: "Variety",
    ai_summary: "Physical media resurgence continues as vinyl records show strong growth, particularly among Gen Z listeners discovering the format for the first time.",
    relevance_score: 65,
    pub_date: new Date(Date.now() - 86400000).toISOString(),
    category: "Charts",
    image_url: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=800"
  }
];

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="border-b-8 border-green-700 bg-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">
                ROCKN
              </h1>
              <p className="text-green-700 text-lg md:text-xl font-bold tracking-widest mt-2">
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
      <div className="bg-green-700 text-white py-3 overflow-x-auto">
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
      <footer className="border-t-8 border-green-700 bg-black py-12">
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
