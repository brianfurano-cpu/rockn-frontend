'use client';

import { useState, useMemo } from 'react';

// Source domain mapping for logos
const SOURCE_DOMAINS = {
  'Billboard': 'billboard.com',
  'Pitchfork': 'pitchfork.com',
  'Rolling Stone': 'rollingstone.com',
  'Music Business Worldwide': 'musicbusinessworldwide.com',
  'Variety': 'variety.com',
  'NME': 'nme.com',
  'Digital Music News': 'digitalmusicnews.com',
  'Music Ally': 'musically.com',
  'Hypebot': 'hypebot.com',
  'Complex': 'complex.com',
  'The FADER': 'thefader.com',
  'Stereogum': 'stereogum.com',
  'Wired': 'wired.com',
  'The Verge AI': 'theverge.com',
  'The Verge': 'theverge.com',
  'TechCrunch': 'techcrunch.com',
  'TechCrunch AI': 'techcrunch.com',
  'Ars Technica': 'arstechnica.com',
  'Ars Technica AI': 'arstechnica.com',
  'Hollywood Reporter': 'hollywoodreporter.com',
  'Hollywood Reporter Music': 'hollywoodreporter.com',
  'Consequence': 'consequence.net',
  'Brooklyn Vegan': 'brooklynvegan.com',
  'Spin': 'spin.com',
  'Resident Advisor': 'residentadvisor.net',
  'EDM.com': 'edm.com',
  'Your EDM': 'youredm.com',
  'Dancing Astronaut': 'dancingastronaut.com',
  'DJ Mag': 'djmag.com',
  'Mixmag': 'mixmag.net',
};

// Get logo URL for a source
function getLogoUrl(source) {
  const domain = SOURCE_DOMAINS[source];
  if (domain) {
    return `https://logo.clearbit.com/${domain}`;
  }
  // Fallback: try to guess domain from source name
  const guessedDomain = source.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  return `https://logo.clearbit.com/${guessedDomain}`;
}

export default function ArticlesFeed({ articles: initialArticles }) {
  const [articles, setArticles] = useState(initialArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterSource, setFilterSource] = useState('all');
  const [minScore, setMinScore] = useState(0);
  const [votingId, setVotingId] = useState(null);

  // Get unique sources
  const sources = useMemo(() => {
    const uniqueSources = [...new Set(articles.map(a => a.source).filter(Boolean))];
    return uniqueSources.sort();
  }, [articles]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let result = articles.filter(article => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesTitle = article.title?.toLowerCase().includes(search);
        const matchesSummary = article.ai_summary?.toLowerCase().includes(search);
        const matchesSource = article.source?.toLowerCase().includes(search);
        if (!matchesTitle && !matchesSummary && !matchesSource) return false;
      }
      
      // Source filter
      if (filterSource !== 'all' && article.source !== filterSource) return false;
      
      // Score filter
      if (article.relevance_score < minScore) return false;
      
      return true;
    });

    // Sort
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
        // Update local state
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

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('date');
    setFilterSource('all');
    setMinScore(0);
  };

  const hasActiveFilters = searchTerm || sortBy !== 'date' || filterSource !== 'all' || minScore > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* SEARCH & FILTERS */}
      <div className="mb-6 space-y-3">
        {/* Search Bar */}
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

        {/* Filter Controls */}
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

        {/* Results Count */}
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
          filteredArticles.map((article) => (
            <div
              key={article.id}
              className="flex gap-3 p-3 bg-gray-900/50 border border-gray-800 hover:border-green-500/50 rounded-lg transition-all"
            >
              {/* Logo */}
              <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src={article.image_url || getLogoUrl(article.source)}
                  alt={article.source}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center text-green-500 text-lg font-bold">
                  {article.source?.charAt(0) || '?'}
                </div>
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
                {/* Score */}
                <div className={`text-lg font-black px-2 py-1 rounded ${
                  article.relevance_score >= 80 ? 'text-green-400' : 
                  article.relevance_score >= 60 ? 'text-yellow-400' : 'text-gray-500'
                }`}>
                  {article.relevance_score || '—'}
                </div>

                {/* Thumbs */}
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
          ))
        )}
      </div>
    </div>
  );
}
