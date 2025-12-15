'use client';

import { useState, useMemo } from 'react';

// Direct logo URLs for each source (more reliable than Clearbit)
const SOURCE_LOGOS = {
  'Billboard': 'https://www.billboard.com/wp-content/themes/flavor-flavor-flavor-flavor-flavor/assets/images/favicon.png',
  'Pitchfork': 'https://cdn.pitchfork.com/assets/misc/favicon-32x32.png',
  'Rolling Stone': 'https://www.rollingstone.com/favicon.ico',
  'Music Business Worldwide': 'https://www.musicbusinessworldwide.com/favicon.ico',
  'Variety': 'https://variety.com/wp-content/uploads/2023/12/cropped-favicon-v-32x32.png',
  'NME': 'https://www.nme.com/favicon.ico',
  'Digital Music News': 'https://www.digitalmusicnews.com/favicon.ico',
  'Music Ally': 'https://musically.com/favicon.ico',
  'Hypebot': 'https://www.hypebot.com/favicon.ico',
  'Complex': 'https://www.complex.com/favicon.ico',
  'The FADER': 'https://www.thefader.com/favicon.ico',
  'Stereogum': 'https://www.stereogum.com/favicon.ico',
  'Wired': 'https://www.wired.com/favicon.ico',
  'The Verge': 'https://www.theverge.com/favicon.ico',
  'The Verge AI': 'https://www.theverge.com/favicon.ico',
  'TechCrunch': 'https://techcrunch.com/favicon.ico',
  'TechCrunch AI': 'https://techcrunch.com/favicon.ico',
  'Ars Technica': 'https://arstechnica.com/favicon.ico',
  'Ars Technica AI': 'https://arstechnica.com/favicon.ico',
  'Hollywood Reporter': 'https://www.hollywoodreporter.com/favicon.ico',
  'Hollywood Reporter Music': 'https://www.hollywoodreporter.com/favicon.ico',
  'Consequence': 'https://consequence.net/favicon.ico',
  'Brooklyn Vegan': 'https://www.brooklynvegan.com/favicon.ico',
  'Spin': 'https://www.spin.com/favicon.ico',
  'Resident Advisor': 'https://ra.co/favicon.ico',
  'DJ Mag': 'https://djmag.com/favicon.ico',
  'Mixmag': 'https://mixmag.net/favicon.ico',
};

// Color mapping for fallback letters
const SOURCE_COLORS = {
  'Billboard': '#FF0000',
  'Pitchfork': '#FF0000',
  'Rolling Stone': '#E30613',
  'Music Business Worldwide': '#1E88E5',
  'Variety': '#000000',
  'NME': '#FF0000',
  'Digital Music News': '#0066CC',
  'Wired': '#000000',
  'The Verge': '#FA4B2A',
  'The Verge AI': '#FA4B2A',
  'TechCrunch': '#00A562',
  'TechCrunch AI': '#00A562',
  'Ars Technica': '#FF4400',
  'Ars Technica AI': '#FF4400',
  'Hollywood Reporter': '#000000',
  'Hollywood Reporter Music': '#000000',
};

export default function ArticlesFeed({ articles: initialArticles }) {
  const [articles, setArticles] = useState(initialArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterSource, setFilterSource] = useState('all');
  const [minScore, setMinScore] = useState(0);
  const [votingId, setVotingId] = useState(null);
  const [failedLogos, setFailedLogos] = useState({});

  // Get unique sources
  const sources = useMemo(() => {
    const uniqueSources = [...new Set(articles.map(a => a.source).filter(Boolean))];
    return uniqueSources.sort();
  }, [articles]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let result = articles.filter(article => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesTitle = article.title?.toLowerCase().includes(search);
        const matchesSummary = article.ai_summary?.toLowerCase().includes(search);
        const matchesSource = article.source?.toLowerCase().includes(search);
        if (!matchesTitle && !matchesSummary && !matchesSource) return false;
      }
      if (filterSource !== 'all' && article.source !== filterSource) return false;
      if (article.relevance_score < minScore) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.pub_date) - new Date(a.pub_date);
        case 'score':
          return (b.relevance_score || 0) - (a.relevance_score || 0);
        case 'popular':
          return ((b.thumbs_up || 0) - (b.thumbs_down || 0)) - ((a.thumbs_up || 0) - (a.thumbs_down || 0));
        default:
          return 0;
      }
    });

    return result;
  }, [articles, searchTerm, sortBy, filterSource, minScore]);

  // Handle voting
  const handleVote = async (articleId, voteType) => {
    setVotingId(articleId);
    
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, voteType }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setArticles(prev => prev.map(article => 
          article.id === articleId 
            ? { ...article, thumbs_up: data.thumbs_up, thumbs_down: data.thumbs_down }
            : article
        ));
      }
    } catch (error) {
      console.error('Vote error:', error);
    } finally {
      setVotingId(null);
    }
  };

  const handleLogoError = (source) => {
    setFailedLogos(prev => ({ ...prev, [source]: true }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('date');
    setFilterSource('all');
    setMinScore(0);
  };

  const hasActiveFilters = searchTerm || sortBy !== 'date' || filterSource !== 'all' || minScore > 0;

  // Get logo for source
  const getSourceLogo = (source) => {
    if (failedLogos[source]) return null;
    return SOURCE_LOGOS[source] || null;
  };

  const getSourceColor = (source) => {
    return SOURCE_COLORS[source] || '#22c55e';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* SEARCH & FILTERS */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border-2 border-gray-700 focus:border-green-500 text-white px-4 py-3 outline-none transition-colors rounded-lg"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-900 border-2 border-gray-700 text-white px-3 py-2 text-sm outline-none focus:border-green-500 cursor-pointer rounded-lg"
          >
            <option value="date">📅 Sort by Date</option>
            <option value="score">⭐ Sort by Score</option>
            <option value="popular">👍 Sort by Popular</option>
          </select>

          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="bg-gray-900 border-2 border-gray-700 text-white px-3 py-2 text-sm outline-none focus:border-green-500 cursor-pointer rounded-lg"
          >
            <option value="all">📰 All Sources</option>
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>

          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="bg-gray-900 border-2 border-gray-700 text-white px-3 py-2 text-sm outline-none focus:border-green-500 cursor-pointer rounded-lg"
          >
            <option value={0}>⭐ Any Score</option>
            <option value={50}>⭐ 50+</option>
            <option value={60}>⭐ 60+</option>
            <option value={70}>⭐ 70+</option>
            <option value={80}>⭐ 80+</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="bg-green-600 hover:bg-green-700 text-black font-bold px-3 py-2 text-sm transition-colors rounded-lg"
            >
              ✕ Clear
            </button>
          )}
        </div>

        <p className="text-gray-500 text-sm">
          Showing <span className="text-white font-bold">{filteredArticles.length}</span> of {articles.length} articles
        </p>
      </div>

      {/* ARTICLES LIST */}
      <div className="space-y-3">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No articles found</p>
            <button onClick={clearFilters} className="mt-4 text-green-500 hover:text-green-400 underline">
              Clear filters
            </button>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const logoUrl = getSourceLogo(article.source);
            const sourceColor = getSourceColor(article.source);
            
            return (
              <div
                key={article.id}
                className="flex gap-3 p-3 bg-gray-900/50 border border-gray-800 hover:border-green-500/50 rounded-lg transition-all"
              >
                {/* Logo */}
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: logoUrl ? '#1f2937' : sourceColor }}
                >
                  {logoUrl ? (
                    <img 
                      src={logoUrl}
                      alt={article.source}
                      className="w-8 h-8 object-contain"
                      onError={() => handleLogoError(article.source)}
                    />
                  ) : (
                    <span className="text-white text-xl font-bold">
                      {article.source?.charAt(0) || '?'}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <h3 className="font-bold text-white group-hover:text-green-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </a>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {article.ai_summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400 font-medium">{article.source}</span>
                    <span className="text-xs text-gray-600">
                      {new Date(article.pub_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Score & Voting */}
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div className={`text-lg font-black px-2 py-1 rounded ${
                    article.relevance_score >= 80 ? 'text-green-400' : 
                    article.relevance_score >= 60 ? 'text-yellow-400' : 'text-gray-500'
                  }`}>
                    {article.relevance_score || '—'}
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleVote(article.id, 'up')}
                      disabled={votingId === article.id}
                      className={`p-1.5 rounded transition-all ${
                        votingId === article.id 
                          ? 'opacity-50 cursor-wait' 
                          : 'hover:bg-green-500/20 active:scale-95'
                      }`}
                      title="Thumbs up"
                    >
                      <span className="text-lg">👍</span>
                      <span className="text-xs text-gray-500 block">{article.thumbs_up || 0}</span>
                    </button>
                    <button
                      onClick={() => handleVote(article.id, 'down')}
                      disabled={votingId === article.id}
                      className={`p-1.5 rounded transition-all ${
                        votingId === article.id 
                          ? 'opacity-50 cursor-wait' 
                          : 'hover:bg-red-500/20 active:scale-95'
                      }`}
                      title="Thumbs down"
                    >
                      <span className="text-lg">👎</span>
                      <span className="text-xs text-gray-500 block">{article.thumbs_down || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
