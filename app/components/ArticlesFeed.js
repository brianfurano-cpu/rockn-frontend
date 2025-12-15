'use client';

import { useState, useMemo } from 'react';

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
  'Complext': 'complex.com',
  'The FADER': 'thefader.com',
  'Stereogum': 'stereogum.com'
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
  'Ars Technica': 'arstechnica.com',
  'Hollywood Reporter': 'hollywoodreporter.com',
  'Consequence': 'consequence.net',
  'Brooklyn Vegan': 'brooklynvegan.com',
};
};

export default function ArticlesFeed({ articles }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterSource, setFilterSource] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [minScore, setMinScore] = useState(0);

  // Get unique sources and categories
  const sources = useMemo(() => {
    const uniqueSources = [...new Set(articles.map(a => a.source).filter(Boolean))];
    return uniqueSources.sort();
  }, [articles]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(articles.map(a => a.category).filter(Boolean))];
    return uniqueCategories.sort();
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

      // Category filter
      if (filterCategory !== 'all' && article.category !== filterCategory) return false;

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
        case 'source':
          return (a.source || '').localeCompare(b.source || '');
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

    return result;
  }, [articles, searchTerm, sortBy, filterSource, filterCategory, minScore]);

  // Vote handler
  const handleVote = async (e, articleId, type) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    try {
      // Optimistic UI update could go here, but for now we'll just fire and forget
      // or show a toast if we had one.
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, voteType: type }),
      });

      if (!res.ok) throw new Error('Vote failed');

      // Visual feedback
      const btn = e.currentTarget;
      btn.classList.add('text-green-400', 'scale-125');
      setTimeout(() => btn.classList.remove('scale-125'), 200);

    } catch (err) {
      console.error('Failed to vote:', err);
      // Fallback for local dev/mock mode
      console.log(`Voted ${type} on article ${articleId}`);
    }
  };

  // Top stories (score >= 80)
  const topStories = useMemo(() => {
    return articles
      .filter(a => a.relevance_score >= 80)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 3);
  }, [articles]);

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('date');
    setFilterSource('all');
    setFilterCategory('all');
    setMinScore(0);
  };

  const hasActiveFilters = searchTerm || sortBy !== 'date' || filterSource !== 'all' || filterCategory !== 'all' || minScore > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* TOP STORIES */}
      {topStories.length > 0 && !hasActiveFilters && (
        <section className="mb-12">
          <h2 className="text-green-700 text-sm font-black tracking-widest mb-6 flex items-center gap-2">
            <span className="text-xl">⭐</span> TOP RATED STORIES
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {topStories.map((article, idx) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-gradient-to-br from-gray-900 to-black border-2 border-green-700 hover:border-white transition-all duration-200 rounded-lg overflow-hidden h-full flex flex-col"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-black bg-green-700 text-white px-3 py-1 rounded">
                      #{idx + 1} TOP
                    </span>
                    <span className="text-sm font-mono text-green-400 font-bold">
                      {article.relevance_score}
                    </span>
                  </div>
                  <h3 className="text-lg font-black leading-tight mb-3 group-hover:text-green-500 transition-colors line-clamp-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {article.ai_summary}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="uppercase font-bold">{article.source}</span>
                    <span>{new Date(article.pub_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* SEARCH & FILTERS */}
      <section className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border-2 border-gray-700 focus:border-green-700 text-white px-4 py-3 text-lg outline-none transition-colors rounded-lg"
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
        <div className="flex flex-wrap gap-3">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-900 border-2 border-gray-700 text-white px-4 py-2 outline-none focus:border-green-700 cursor-pointer rounded-lg"
          >
            <option value="date">📅 Sort by Date</option>
            <option value="score">⭐ Sort by Score</option>
            <option value="source">📰 Sort by Source</option>
            <option value="title">🔤 Sort by Title</option>
          </select>

          {/* Source Filter */}
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="bg-gray-900 border-2 border-gray-700 text-white px-4 py-2 outline-none focus:border-green-700 cursor-pointer rounded-lg"
          >
            <option value="all">📰 All Sources</option>
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-900 border-2 border-gray-700 text-white px-4 py-2 outline-none focus:border-green-700 cursor-pointer rounded-lg"
            >
              <option value="all">🏷️ All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}

          {/* Min Score Filter */}
          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="bg-gray-900 border-2 border-gray-700 text-white px-4 py-2 outline-none focus:border-green-700 cursor-pointer rounded-lg"
          >
            <option value={0}>⭐ Any Score</option>
            <option value={50}>⭐ 50+ Score</option>
            <option value={60}>⭐ 60+ Score</option>
            <option value={70}>⭐ 70+ Score</option>
            <option value={80}>⭐ 80+ Score</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="bg-green-700 hover:bg-green-600 text-white font-bold px-4 py-2 transition-colors rounded-lg"
            >
              ✕ Clear Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <p className="text-gray-500 text-sm">
          Showing <span className="text-white font-bold">{filteredArticles.length}</span> of {articles.length} articles
        </p>
      </section>

      {/* ARTICLES LIST */}
      <section>
        <h2 className="text-green-700 text-sm font-black tracking-widest mb-6">
          ▌{hasActiveFilters ? 'FILTERED RESULTS' : 'ALL STORIES'}
        </h2>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No articles found</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-green-700 hover:text-green-500 underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredArticles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row gap-4 p-4 border-l-4 border-gray-800 hover:border-green-700 hover:bg-gray-900/50 transition-all rounded-r-lg"
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-800 rounded-lg overflow-hidden relative">
                  {(article.image_url || SOURCE_DOMAINS[article.source]) ? (
                    <img
                      src={article.image_url || `https://logo.clearbit.com/${SOURCE_DOMAINS[article.source]}`}
                      alt={article.title}
                      className={`w-full h-full ${article.image_url ? 'object-cover' : 'object-contain p-4 bg-black'} group-hover:scale-110 transition-transform duration-500`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full absolute top-0 left-0 hidden items-center justify-center text-gray-700 text-3xl bg-gray-900" style={{ display: (article.image_url || SOURCE_DOMAINS[article.source]) ? 'none' : 'flex' }}>
                    🎸
                  </div>
                </div>

                {/* Score & Vote */}
                <div className="flex-shrink-0 flex flex-row sm:flex-col items-center justify-between sm:justify-start gap-2 sm:w-16 text-center">
                  <div>
                    <span className={`text-2xl font-black ${article.relevance_score >= 80 ? 'text-green-400' :
                      article.relevance_score >= 70 ? 'text-yellow-400' :
                        article.relevance_score >= 60 ? 'text-orange-400' : 'text-gray-500'
                      }`}>
                      {article.relevance_score || '—'}
                    </span>
                    <p className="text-xs text-gray-600 uppercase">Score</p>
                  </div>

                  {/* Vote Buttons */}
                  <div className="flex sm:flex-col gap-2 mt-2">
                    <button
                      onClick={(e) => handleVote(e, article.id, 'up')}
                      className="p-1 text-gray-600 hover:text-green-500 hover:bg-green-900/30 rounded transition-all"
                      title="More like this"
                    >
                      👍
                    </button>
                    <button
                      onClick={(e) => handleVote(e, article.id, 'down')}
                      className="p-1 text-gray-600 hover:text-red-500 hover:bg-red-900/30 rounded transition-all"
                      title="Less like this"
                    >
                      👎
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-lg group-hover:text-green-500 transition-colors">
                      {article.title}
                    </h3>
                    <span className={`md:hidden flex-shrink-0 text-sm font-bold px-2 py-1 rounded ${article.relevance_score >= 80 ? 'bg-green-400 text-black' :
                      article.relevance_score >= 70 ? 'bg-yellow-400 text-black' :
                        'bg-gray-700 text-white'
                      }`}>
                      {article.relevance_score || '—'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {article.ai_summary}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                    <span className="uppercase font-bold text-gray-400">{article.source}</span>
                    <span>{new Date(article.pub_date).toLocaleDateString()}</span>
                    {article.category && (
                      <span className="text-green-400 bg-green-900/30 px-2 py-0.5 rounded">{article.category}</span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center text-gray-600 group-hover:text-green-500 transition-colors">
                  <span className="text-2xl">→</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
