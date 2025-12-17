'use client';

export default function AffiliateAds() {
  // Placeholder for affiliate ads
  // You can replace these with actual affiliate ad components or scripts
  const adPlaceholders = [
    {
      id: 1,
      title: 'InVideo AI - Create Videos Instantly',
      description: 'Generate AI-powered videos for your music & AI content. No camera needed!',
      link: 'https://invideo.sjv.io/kO5RKv',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop&auto=format',
    },
    {
      id: 2,
      title: 'Railway - Deploy in Seconds',
      description: 'Simplify your infrastructure. Deploy apps, databases, and services effortlessly.',
      link: 'https://railway.com?referralCode=GWsfrT',
      image: null,
    },
    {
      id: 3,
      title: 'Affiliate Ad 3',
      description: 'AI Music Software',
      link: '#',
      image: null,
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="bg-green-600 text-black py-2 px-3 rounded-lg text-center">
        <h3 className="text-sm font-black uppercase tracking-wider">SPONSORED</h3>
      </div>
      
      {/* Vertical column of ads */}
      <div className="flex flex-col gap-4">
        {adPlaceholders.map((ad) => (
          <a
            key={ad.id}
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block bg-gray-900 border-2 border-gray-700 hover:border-green-500 rounded-lg p-3 transition-all group"
          >
            {ad.id === 1 ? (
              // Custom InVideo graphic
              <div className="w-full h-28 bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a855f7] rounded mb-2 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="text-3xl font-black mb-1 drop-shadow-lg">🎬</div>
                  <div className="text-sm font-black tracking-tight mb-0.5">InVideo AI</div>
                  <div className="text-[10px] font-semibold opacity-95 tracking-wide">CREATE VIDEOS INSTANTLY</div>
                </div>
                <div className="absolute top-1 right-1 text-[8px] font-bold bg-white/20 px-1.5 py-0.5 rounded">AI</div>
              </div>
            ) : ad.id === 2 ? (
              // Custom Railway graphic
              <div className="w-full h-28 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] rounded mb-2 flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-600/30">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="text-3xl font-black mb-1 drop-shadow-lg">🚂</div>
                  <div className="text-sm font-black tracking-tight mb-0.5">Railway</div>
                  <div className="text-[10px] font-semibold opacity-95 tracking-wide">DEPLOY IN SECONDS</div>
                </div>
                <div className="absolute top-1 right-1 text-[8px] font-bold bg-blue-500/30 px-1.5 py-0.5 rounded border border-blue-400/30">CLOUD</div>
              </div>
            ) : ad.image ? (
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-28 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-full h-28 bg-gray-800 rounded mb-2 flex items-center justify-center">
                <span className="text-gray-600 text-xs">Ad Image</span>
              </div>
            )}
            <h4 className="text-white font-bold text-xs group-hover:text-green-400 transition-colors mb-1 line-clamp-2">
              {ad.title}
            </h4>
            <p className="text-gray-500 text-xs line-clamp-2">{ad.description}</p>
          </a>
        ))}
      </div>

      {/* Add more ad slots as needed */}
      <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-3 text-center">
        <p className="text-gray-500 text-xs mb-1">Ad Space Available</p>
        <p className="text-green-500 text-xs font-bold">Contact for Advertising</p>
      </div>
    </div>
  );
}

