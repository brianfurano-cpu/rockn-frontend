import { Pool } from 'pg';
import ArticlesFeed from './components/ArticlesFeed';
import YouTubeEmbed from './components/YouTubeEmbed';
import AffiliateAds from './components/AffiliateAds';

// Default YouTube video ID fallback
const DEFAULT_YOUTUBE_VIDEO_ID = 'NW7uhUEy6Hs';

// Create a singleton connection pool for better performance and reliability
let pool = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection cannot be established
    });
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  return pool;
}

async function getArticles() {
  const dbPool = getPool();
  
  try {
    const result = await dbPool.query(
      `SELECT 
        id, title, url, source, ai_summary, relevance_score, pub_date, category, image_url, thumbs_up, thumbs_down,
        -- Calculate boost score for music + AI articles
        CASE 
          WHEN (
            LOWER(title || ' ' || COALESCE(ai_summary, '')) ~ '(music|song|artist|album|record|label|streaming|spotify|apple music|pandora|tidal|soundcloud|band|musician|producer|dj|festival|concert|tour|vinyl|cd|playlist|genre|hip hop|rap|rock|pop|jazz|electronic|edm|indie|alternative)'
            AND LOWER(title || ' ' || COALESCE(ai_summary, '')) ~ '(artificial intelligence|ai|machine learning|ml|neural network|deep learning|gpt|chatgpt|llm|generative ai|ai-generated|algorithm|automation|robotic|computer vision|nlp|natural language)'
          ) THEN 1000
          ELSE 0
        END as music_ai_boost
       FROM articles 
       ORDER BY 
         music_ai_boost DESC,
         relevance_score DESC,
         pub_date DESC 
       LIMIT 1000`
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    // Return empty array on error to prevent site crash
    return [];
  }
  // Note: We don't close the pool here - it's reused across requests for better performance
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
            <div className="flex-1">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
                ROCKN
              </h1>
              <p className="text-green-500 text-base md:text-lg font-bold tracking-widest mt-2">
                AI-POWERED MUSIC INDUSTRY INTELLIGENCE
              </p>
            </div>
            <div className="flex items-end gap-4">
              {/* YouTube Video Embed */}
              <div className="hidden lg:block">
                <YouTubeEmbed 
                  channelId={process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || null}
                  videoId={process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || DEFAULT_YOUTUBE_VIDEO_ID}
                  playlistId={process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID || null}
                />
              </div>
              <div className="text-left md:text-right">
                <p className="text-gray-500 text-xs">TOTAL INDEXED</p>
                <p className="text-white text-3xl font-black">{articles.length}</p>
                <p className="text-gray-500 text-xs">ARTICLES</p>
              </div>
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

      {/* YouTube Video Embed - Mobile */}
      <div className="lg:hidden bg-black border-b border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <YouTubeEmbed 
            channelId={process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || null}
            videoId={process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || DEFAULT_YOUTUBE_VIDEO_ID}
            playlistId={process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID || null}
          />
        </div>
      </div>

      {/* MAIN CONTENT WITH SIDEBAR */}
      <div className="w-full">
        <div className="flex flex-col lg:flex-row">
          {/* MAIN CONTENT - 75% width, left side */}
          <div className="flex-1 lg:w-3/4 lg:pr-6">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <ArticlesFeed articles={articles} />
            </div>
          </div>
          
          {/* AFFILIATE ADS SIDEBAR - 25% width, far right, fixed position */}
          <aside className="w-full lg:w-1/4 lg:flex-shrink-0 lg:border-l-2 lg:border-gray-800 bg-black">
            <div className="sticky top-4 p-4 lg:p-6">
              <AffiliateAds />
            </div>
          </aside>
        </div>
      </div>

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
