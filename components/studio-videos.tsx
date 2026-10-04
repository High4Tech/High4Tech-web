'use client';
import { Play } from '@/components/icons';
import { useState } from 'react';
import { youtubeID, type StudioVideo } from '@/lib/resource-platforms';
function Video({ video }: { video: StudioVideo }) {
  const [playing, setPlaying] = useState(false), id = youtubeID(video.url);
  if (!id) return null;
  return <figure className="studio-video"><div className="studio-video-frame">{playing ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} title={video.title || 'Studio video'} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/> : <button className="studio-video-poster" onClick={() => setPlaying(true)}><span><Play size={27}/></span><strong>{video.title || 'Watch the walkthrough'}</strong><small>Play on YouTube</small></button>}</div>{video.title && <figcaption>{video.title}</figcaption>}</figure>;
}
export function StudioVideos({ videos }: { videos?: StudioVideo[] }) { return videos?.length ? <section className="studio-videos" aria-label="Videos">{videos.map((video, i) => <Video key={`${video.url}-${i}`} video={video}/>)}</section> : null; }
