'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import songsData from '../../../data/songs.json';

type Song = {
  id: string;
  title: string;
  artist?: string;
  description?: string;
  imageUrl?: string;
  pdfUrl?: string;
  youtubeId?: string;
  lyrics?: string;
};

// Fisher-Yates shuffle for random selection
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function SongDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'lyrics' | 'chords'>('lyrics');

  const song = useMemo(() => {
    return (songsData as Song[]).find((s) => s.id === params.id);
  }, [params.id]);

  // Parse lyrics into verses
  const parseLyrics = useCallback((lyrics?: string) => {
    if (!lyrics) return [];
    return lyrics.split(/\n\n+/).map((verse, index) => ({
      label: verse.split('\n')[0] || `Verse ${index + 1}`,
      content: verse,
    }));
  }, []);

  // Get recommended songs (random songs excluding current)
  const recommendedSongs = useMemo(() => {
    if (!song || !songsData.length) return [];
    const others = (songsData as Song[]).filter((s) => s.id !== song.id);
    return shuffleArray(others).slice(0, 3);
  }, [song]);

  const lyricVerses = useMemo(() => parseLyrics(song?.lyrics), [song, parseLyrics]);

  const copyLyrics = useCallback(async () => {
    if (!song?.lyrics) return;
    try {
      await navigator.clipboard.writeText(song.lyrics);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('copy failed', e);
    }
  }, [song]);

  const copyVerse = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (e) {
      console.error('copy failed', e);
    }
  }, []);

  const handleSongClick = useCallback((songId: string) => {
    router.push(`/song/${songId}`);
  }, [router]);

  if (!song) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Song Not Found</h2>
          <p className="text-gray-500 mb-6">The song you are looking for does not exist.</p>
          <button
            onClick={() => router.push('/')}
            className="btn btn-primary bg-linear-to-r from-purple-500 to-pink-500 border-0"
          >
            Back to Songs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Fixed Sidebar */}
      <div className="hidden lg:flex lg:w-80 fixed left-0 top-0 h-screen flex-col bg-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0">
          {song.imageUrl ? (
            <Image
              src={song.imageUrl}
              alt={`${song.title} sheet music`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-purple-400 to-pink-500"></div>
          )}
          <div className="absolute inset-0 bg-slate-900/75"></div>
        </div>
        
        {/* Top Navigation */}
        <div className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/10">
          <button
            onClick={() => router.back()}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="text-white hover:bg-white/10 p-2 rounded-lg transition-all" aria-label="Search">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="relative z-20 flex flex-col h-full overflow-y-auto">
          {/* Song Info */}
          <div className="px-6 py-12 text-center flex-1 flex flex-col justify-center">
            <h1 className="text-3xl font-light text-white mb-2 tracking-wide line-clamp-4">{song.title}</h1>
            {song.artist && <p className="text-white/70 text-sm font-medium">{song.artist}</p>}
          </div>

          {/* Song Meta */}
          <div className="px-6 py-8 border-t border-white/10 space-y-3 text-sm">
            {song.artist && (
              <div className="flex justify-between items-center">
                <span className="text-white/60">Artist</span>
                <span className="text-white font-medium">{song.artist}</span>
              </div>
            )}
            {song.youtubeId && (
              <div className="flex justify-between items-center">
                <span className="text-white/60">Video</span>
                <span className="text-red-400 text-xs">● Live</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Song Details */}
      <div className="w-full lg:w-[calc(100%-320px)] lg:ml-80 bg-white overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-all text-gray-600"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900 flex-1 ml-4 line-clamp-1">{song.title}</h1>
            <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all" aria-label="Menu">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          {song.imageUrl && (
            <div className="relative h-40 overflow-hidden">
              <Image
                src={song.imageUrl}
                alt={`${song.title} sheet music`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
            </div>
          )}
        </div>

        <main className="container mx-auto max-w-3xl px-4 lg:px-12 py-8 lg:py-12">
          {/* Description */}
          {song.description && (
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed text-lg">{song.description}</p>
            </div>
          )}

          {/* YouTube Video */}
          {song.youtubeId && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Video
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${song.youtubeId}`}
                  title={`${song.title} video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}

          {/* Cheat Sheet */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Chords & Lyrics Sheet
            </h2>
            {song.imageUrl ? (
              <div className="relative w-full rounded-lg overflow-hidden shadow-lg bg-gray-100 border mb-4">
                <Image
                  src={song.imageUrl}
                  alt={`${song.title} sheet music`}
                  width={1000}
                  height={700}
                  className="w-full h-auto object-contain"
                />
              </div>
            ) : null}
            
            {song.pdfUrl && (
              <a
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
                href={song.pdfUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Download PDF cheat sheet for ${song.title}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download PDF
              </a>
            )}
          </div>

          {/* Lyrics */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Lyrics
              </h2>
              <button
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={copyLyrics}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    Copy All
                  </>
                )}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                className={`pb-3 px-4 font-medium transition-all ${
                  activeTab === 'lyrics'
                    ? 'text-gray-900 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('lyrics')}
              >
                Full Lyrics
              </button>
              <button
                className={`pb-3 px-4 font-medium transition-all ${
                  activeTab === 'chords'
                    ? 'text-gray-900 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('chords')}
              >
                By Verses
              </button>
            </div>

            {activeTab === 'lyrics' ? (
              <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto border border-gray-200">
                <pre className="whitespace-pre-wrap font-sans leading-relaxed text-gray-700 text-sm">
                  {song.lyrics}
                </pre>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {lyricVerses.map((verse, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-purple-600 text-sm">{verse.label}</span>
                      <button
                        className="text-gray-500 hover:text-purple-600 p-1 rounded transition-all"
                        onClick={() => copyVerse(verse.content)}
                        title="Copy verse"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans leading-relaxed text-gray-700 text-sm">
                      {verse.content}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Songs */}
          {recommendedSongs.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                More Songs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {recommendedSongs.map((recSong) => (
                  <button
                    key={recSong.id}
                    className="group text-left hover:shadow-lg transition-all duration-300"
                    onClick={() => handleSongClick(recSong.id)}
                  >
                    <div className="relative h-32 overflow-hidden rounded-lg mb-3 bg-gray-100">
                      {recSong.imageUrl ? (
                        <Image
                          src={recSong.imageUrl}
                          alt={`${recSong.title} cover`}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-purple-400 to-pink-500"></div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">{recSong.title}</h3>
                    {recSong.artist && (
                      <p className="text-xs text-gray-600 line-clamp-1 mt-1">{recSong.artist}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom spacing */}
          <div className="h-8"></div>
        </main>
      </div>
    </div>
  );
}

