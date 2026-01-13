import Image from "next/image";
import SongList from "./components/SongList";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full bg-slate-100">
      {/* Left Side - Fixed Sidebar */}
      <div className="hidden lg:flex lg:w-80 fixed left-0 top-0 h-screen flex-col bg-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1507838153414-b4b713384ebd?w=800&h=1200&fit=crop"
            alt="Worship background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/75"></div>
        </div>
        
        {/* Top Navigation */}
        <div className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/10">
          <button className="text-white hover:bg-white/10 p-2 rounded-lg transition-all" aria-label="Menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
          {/* Title */}
          <div className="px-6 py-12 text-center flex-1">
            <h1 className="text-4xl font-light text-white mb-8 tracking-wide">Worship&apos;s Life</h1>
            
            {/* Profile Section */}
            <div className="mt-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-purple-400 to-pink-400 border-4 border-white/20 flex items-center justify-center overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-white text-sm font-medium">OSamuel</p>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="px-6 py-8 border-t border-white/10">
            <div className="flex justify-around items-center">
              <button className="text-white/60 hover:text-white p-3 hover:bg-white/10 rounded-lg transition-all" aria-label="Edit">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <button className="text-white/60 hover:text-white p-3 hover:bg-white/10 rounded-lg transition-all" aria-label="Collections">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>
              <button className="text-white/60 hover:text-white p-3 hover:bg-white/10 rounded-lg transition-all" aria-label="Notifications">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button className="text-white/60 hover:text-white p-3 hover:bg-white/10 rounded-lg transition-all" aria-label="Settings">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Song List */}
      <div className="w-full lg:w-[calc(100%-320px)] lg:ml-80 bg-white overflow-y-auto">
        <main className="min-h-screen">
          {/* Mobile Header - Visible only on small screens */}
          <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100">
            <div className="px-6 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all" aria-label="Menu">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-lg font-semibold text-gray-900">Worship Songs</h1>
              </div>
              <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all" aria-label="Search">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="container mx-auto px-4 lg:px-12 py-8">
            <SongList />
          </div>
        </main>
      </div>
    </div>
  );
}

