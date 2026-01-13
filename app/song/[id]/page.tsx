'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
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

  const lyricVerses = useMemo(() => parseLyrics(song?.lyrics), [song?.lyrics, parseLyrics]);

  const copyLyrics = useCallback(async () => {
    if (!song?.lyrics) return;
    try {
      await navigator.clipboard.writeText(song.lyrics);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('copy failed', e);
    }
  }, [song?.lyrics]);

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
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
            className="btn btn-primary bg-gradient-to-r from-purple-500 to-pink-500 border-0"
          >
            Back to Songs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Fixed Image */}
      <div className="hidden lg:flex lg:w-1/2 relative fixed left-0 top-0 h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/80 to-pink-800/80 z-10"></div>
        {song.imageUrl ? (
          <Image
            src={song.imageUrl}
            alt={`${song.title} sheet music`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500"></div>
        )}
        <div className="relative z-20 flex flex-col items-center justify-end h-full text-white p-12 pb-16">
          <h1 className="text-4xl font-bold text-center mb-2">{song.title}</h1>
          {song.artist && <p className="text-white/70 text-lg">{song.artist}</p>}
        </div>
      </div>

      {/* Right Side - Song Details */}
      <div className="w-full lg:w-1/2 lg:ml-[50%] min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Mobile Header */}
        <div className="lg:hidden relative h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/80 to-pink-800/80 z-10"></div>
          {song.imageUrl && (
            <Image
              src={song.imageUrl}
              alt={`${song.title} sheet music`}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-white p-6 text-center">
            <h1 className="text-3xl font-bold mb-2">{song.title}</h1>
            {song.artist && <p className="text-white/70">{song.artist}</p>}
          </div>
        </div>

        <main className="container mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="btn btn-ghost btn-sm mb-6 -ml-2 text-gray-600 hover:text-purple-600"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Description */}
          {song.description && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100">
              <p className="text-gray-600 leading-relaxed">{song.description}</p>
            </div>
          )}

          {/* YouTube Video */}
          {song.youtubeId && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100">
              <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Video
              </h2>
              <div className="aspect-video rounded-xl overflow-hidden shadow-md bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${song.youtubeId}`}
                  title={`${song.title} video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Cheat Sheet */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100">
            <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Cheat Sheet
            </h2>
            {song.imageUrl && (
              <div className="relative w-full rounded-xl overflow-hidden shadow-md bg-gray-100 border mb-4">
                <Image
                  src={song.imageUrl}
                  alt={`${song.title} sheet music`}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain"
                />
              </div>
            )}
            {song.pdfUrl && (
              <a
                className="btn btn-primary w-full bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:opacity-90"
                href={song.pdfUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Download PDF cheat sheet for ${song.title}`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download PDF Cheat Sheet
              </a>
            )}
          </div>

          {/* Lyrics */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h2 className="font-bold text-xl flex items-center gap-2">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Lyrics
              </h2>
              <button
                className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline border-purple-200 text-purple-600 hover:bg-purple-500 hover:text-white hover:border-purple-500'}`}
                onClick={copyLyrics}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    Copy All
                  </>
                )}
              </button>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed bg-gray-50 p-1 mb-4 inline-flex">
              <button
                className={`tab ${activeTab === 'lyrics' ? 'tab-active bg-white shadow-sm' : 'hover:bg-white/50'}`}
                onClick={() => setActiveTab('lyrics')}
              >
                Full Lyrics
              </button>
              <button
                className={`tab ${activeTab === 'chords' ? 'tab-active bg-white shadow-sm' : 'hover:bg-white/50'}`}
                onClick={() => setActiveTab('chords')}
              >
                By Verses
              </button>
            </div>

            {activeTab === 'lyrics' ? (
              <div className="bg-gray-50 rounded-xl p-5 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans leading-relaxed text-gray-700 text-sm">
                  {song.lyrics}
                </pre>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {lyricVerses.map((verse, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-purple-600 text-sm">{verse.label}</span>
                      <button
                        className="btn btn-xs btn-ghost text-gray-500 hover:text-purple-600"
                        onClick={() => copyVerse(verse.content)}
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                        Copy
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
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                More Songs You Might Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendedSongs.map((recSong) => (
                  <button
                    key={recSong.id}
                    className="card bg-white hover:shadow-lg transition-all duration-300 cursor-pointer text-left transform hover:-translate-y-1"
                    onClick={() => handleSongClick(recSong.id)}
                  >
                    <figure className="relative h-28 overflow-hidden rounded-t-xl">
                      {recSong.imageUrl ? (
                        <Image
                          src={recSong.imageUrl}
                          alt={`${recSong.title} cover`}
                          width={200}
                          height={140}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <h5 className="font-semibold text-white text-sm line-clamp-1">{recSong.title}</h5>
                      </div>
                    </figure>
                    <div className="card-body p-3">
                      {recSong.artist && (
                        <p className="text-xs text-gray-500 line-clamp-1">{recSong.artist}</p>
                      )}
                    </div>
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

