'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';

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

interface SongModalProps {
  song: Song | null;
  open: boolean;
  onClose: () => void;
  allSongs?: Song[];
  onSongSelect?: (song: Song) => void;
}

// Fisher-Yates shuffle for random selection
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function SongModal({ song, open, onClose, allSongs = [], onSongSelect }: SongModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'lyrics' | 'chords'>('lyrics');

  // Reset state when song changes
  useEffect(() => {
    if (open) {
      setActiveTab('lyrics');
    }
  }, [open]);

  // Parse lyrics into verses
  const parseLyrics = useCallback((lyrics?: string) => {
    if (!lyrics) return [];
    return lyrics.split(/\n\n+/).map((verse, index) => ({
      label: verse.split('\n')[0] || `Verse ${index + 1}`,
      content: verse,
    }));
  }, []);

  // Get recommended songs (random songs excluding current) - using useMemo for stability
  const recommendedSongs = useMemo(() => {
    if (!song || !allSongs.length) return [];
    const others = allSongs.filter((s) => s.id !== song.id);
    // Take first 3 after shuffling
    return shuffleArray(others).slice(0, 3);
  }, [song, allSongs]);

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

  const handleSongClick = useCallback((recSong: Song) => {
    if (onSongSelect) {
      onSongSelect(recSong);
    }
  }, [onSongSelect]);

  if (!song) return null;

  return (
    <div className={open ? 'modal modal-open' : 'modal'}>
      <div className="modal-box w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-base-100 z-10 pb-4 border-b mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-2xl">{song.title}</h3>
              {song.artist && <p className="text-sm text-gray-500">{song.artist}</p>}
            </div>
            <button 
              className="btn btn-sm btn-circle btn-ghost" 
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {song.description && (
            <p className="text-gray-600 mt-2 text-sm">{song.description}</p>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pr-2">
          {/* YouTube Video Section */}
          {song.youtubeId && (
            <div className="mb-8">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Video
              </h4>
              <div className="aspect-video rounded-lg overflow-hidden shadow-md bg-black">
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

          {/* Cheat Sheet / Sheet Music Section */}
          {song.imageUrl && (
            <div className="mb-8">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Cheat Sheet
              </h4>
              <div className="relative w-full rounded-lg overflow-hidden shadow-md bg-gray-100 border">
                <Image
                  src={song.imageUrl}
                  alt={`${song.title} sheet music`}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain"
                />
              </div>
              {song.pdfUrl && (
                <a
                  className="btn btn-primary mt-3 w-full"
                  href={song.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Download PDF cheat sheet for ${song.title}`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download PDF Cheat Sheet
                </a>
              )}
            </div>
          )}

          {/* Lyrics Section with Tabs */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="tabs tabs-boxed">
                <button
                  className={`tab ${activeTab === 'lyrics' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('lyrics')}
                >
                  Lyrics
                </button>
                <button
                  className={`tab ${activeTab === 'chords' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('chords')}
                >
                  Verses (Copy)
                </button>
              </div>
              <button
                className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline'}`}
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

            {activeTab === 'lyrics' ? (
              <div className="bg-base-200 rounded-lg p-4 max-h-80 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans leading-relaxed text-sm">
                  {song.lyrics}
                </pre>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {lyricVerses.map((verse, index) => (
                  <div key={index} className="bg-base-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm">{verse.label}</span>
                      <button
                        className="btn btn-xs btn-ghost"
                        onClick={() => copyVerse(verse.content)}
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans leading-relaxed text-sm">
                      {verse.content}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Songs Section */}
          {recommendedSongs.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                More Songs You Might Like
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendedSongs.map((recSong) => (
                  <button
                    key={recSong.id}
                    className="card bg-base-200 hover:bg-base-300 transition cursor-pointer text-left"
                    onClick={() => handleSongClick(recSong)}
                  >
                    <div className="card-body p-4">
                      {recSong.imageUrl && (
                        <Image
                          src={recSong.imageUrl}
                          alt={`${recSong.title} cover`}
                          width={200}
                          height={120}
                          className="rounded mb-2 object-cover h-24 w-full"
                        />
                      )}
                      <h5 className="font-semibold text-sm line-clamp-1">{recSong.title}</h5>
                      {recSong.artist && (
                        <p className="text-xs text-gray-500 line-clamp-1">{recSong.artist}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-base-100 pt-4 border-t mt-4">
          <button className="btn btn-primary w-full" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      
      {/* Backdrop click to close */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

