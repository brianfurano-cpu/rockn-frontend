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
      image: null,
    },
    {
      id: 2,
      title: 'Affiliate Ad 2',
      description: 'Streaming Services',
      link: '#',
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
            {ad.image ? (
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

