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
      image: null, // Using custom CSS graphic
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
      title: 'CapCut - Free Video Editor',
      description: 'Professional video editing made easy. Create stunning videos for your content.',
      link: '#', // TODO: Add CapCut affiliate link
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
              // Custom InVideo ad graphic - professional design
              <div className="w-full h-28 bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a855f7] rounded mb-2 flex flex-col items-center justify-center text-white relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
                  <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.2),transparent_50%)]"></div>
                </div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center w-full px-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-2xl font-black drop-shadow-lg">🎬</div>
                    <div className="text-base font-black tracking-tight">InVideo</div>
                    <div className="text-[10px] font-bold bg-white/30 px-1.5 py-0.5 rounded">AI</div>
                  </div>
                  <div className="text-[9px] font-semibold opacity-95 tracking-wider text-center">
                    CREATE VIDEOS FROM TEXT
                  </div>
                  <div className="absolute bottom-1 right-2 text-[8px] font-bold opacity-80">
                    INSTANT
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-white/30 rounded-full"></div>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white/20 rounded-full"></div>
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
            ) : ad.id === 3 ? (
              // Custom CapCut graphic
              <div className="w-full h-28 bg-gradient-to-br from-[#ff6b6b] via-[#ee5a6f] to-[#ff4757] rounded mb-2 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-pink-600/20"></div>
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%)',
                  backgroundSize: '15px 15px'
                }}></div>
                <div className="relative z-10 flex flex-col items-center w-full px-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-2xl font-black drop-shadow-lg">✂️</div>
                    <div className="text-base font-black tracking-tight">CapCut</div>
                  </div>
                  <div className="text-[9px] font-semibold opacity-95 tracking-wider text-center">
                    FREE VIDEO EDITOR
                  </div>
                  <div className="absolute bottom-1 right-2 text-[8px] font-bold bg-white/20 px-1.5 py-0.5 rounded">
                    PRO
                  </div>
                </div>
                <div className="absolute top-1 left-1 w-2 h-2 bg-white/30 rounded-full"></div>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white/20 rounded-full"></div>
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

