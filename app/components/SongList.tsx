'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SongCard from './SongCard';
import songsData from '../../data/songs.json';

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

const ITEMS_PER_PAGE = 9;

export default function SongList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const navigateToDetail = (song: Song) => {
    router.push(`/song/${song.id}`);
  };

  // Filter songs based on search query
  const filteredSongs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return songsData as Song[];
    return (songsData as Song[]).filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        (song.artist && song.artist.toLowerCase().includes(query)) ||
        (song.description && song.description.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE);
  const paginatedSongs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSongs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSongs, currentPage]);

  // Reset to page 1 when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Worship Songs
        </h1>
        <p className="text-gray-500 mb-6">Discover and learn your favorite worship songs</p>
        
        {/* Modern Search Box */}
        <div className="relative group">
          <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search songs, artists, or lyrics..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-700 placeholder-gray-400 shadow-lg"
              aria-label="Search songs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {searchQuery && (
          <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Found {filteredSongs.length} song{filteredSongs.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
        )}
      </div>

      {/* Songs Grid */}
      {paginatedSongs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 flex-1">
            {paginatedSongs.map((s: Song) => (
              <SongCard key={s.id} song={s} onOpen={navigateToDetail} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-gray-100">
              <button
                className="btn btn-sm btn-outline hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`btn btn-sm w-10 ${
                      currentPage === page
                        ? 'bg-purple-500 text-white border-purple-500'
                        : 'btn-outline'
                    }`}
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-sm btn-outline hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg mb-4">No songs found matching "{searchQuery}"</p>
          <button
            className="btn btn-primary bg-linear-to-r from-purple-500 to-pink-500 border-0 hover:opacity-90"
            onClick={() => setSearchQuery('')}
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}

