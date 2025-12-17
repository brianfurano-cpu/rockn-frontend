'use client';

export default function YouTubeEmbed({ channelId, videoId, playlistId }) {
  // You can use channelId for channel embed, videoId for specific video, or playlistId for playlist
  // Priority: videoId > playlistId > channelId
  // For channel embed, we'll use the channel's uploads playlist (UU + channel ID without UC)
  let embedUrl = null;
  
  if (videoId) {
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (playlistId) {
    embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
  } else if (channelId) {
    // Convert channel ID to uploads playlist ID (replace UC with UU)
    const uploadsPlaylistId = channelId.startsWith('UC') 
      ? 'UU' + channelId.substring(2)
      : 'UU' + channelId;
    embedUrl = `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}`;
  }

  if (!embedUrl) {
    return (
      <div className="w-full max-w-[288px] aspect-video bg-gray-900 border-2 border-gray-700 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 text-sm text-center px-4">
          Configure YouTube channel ID, video ID, or playlist ID
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[288px] aspect-video bg-gray-900 border-2 border-green-500 rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

