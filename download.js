export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    const response = await fetch('https://www.tikwm.com/api/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ url, count: 12, cursor: 0, web: 1, hd: 1 })
    });
    
    const data = await response.json();
    
    if (data.code !== 0 || !data.data) {
      throw new Error(data.msg || 'Failed');
    }
    
    const video = data.data;
    
    res.status(200).json({
      success: true,
      data: {
        title: video.title || 'TikTok Video',
        author: video.author?.unique_id ? '@' + video.author.unique_id : '@user',
        cover: video.cover,
        duration: video.duration || 0,
        playCount: video.play_count || 0,
        diggCount: video.digg_count || 0,
        shareCount: video.share_count || 0,
        urls: {
          hd: video.hdplay || video.play,
          sd: video.play
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
