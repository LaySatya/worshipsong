import Image from "next/image";
import SongList from "./components/SongList";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Fixed Image */}
      <div className="hidden lg:flex lg:w-1/2 relative fixed left-0 top-0 h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/80 to-pink-800/80 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1507838153414-b4b713384ebd?w=1200&h=1600&fit=crop"
          alt="Worship background"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white p-12 text-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-4">Worship Songs</h1>
          <p className="text-xl text-white/80 max-w-md leading-relaxed">
            Discover, learn, and worship with our collection of beautiful worship songs. Find lyrics, chords, and videos all in one place.
          </p>
          <div className="flex gap-4 mt-8">
            <div className="flex items-center gap-2 text-white/70">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>12+ Songs</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Lyrics & Chords</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Video Tutorials</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Song List */}
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <main className="container mx-auto px-6 py-12">
          {/* Mobile Header - Visible only on small screens */}
          <div className="lg:hidden mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Worship Songs
            </h1>
          </div>
          
          <SongList />
        </main>
      </div>
    </div>
  );
}

