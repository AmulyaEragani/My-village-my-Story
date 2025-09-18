
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, BookOpen, Plus, MapPin, Mic } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;700&display=swap');
          
          :root {
            --village-primary: #D97706;
            --village-secondary: #92400E;
            --village-accent: #059669;
            --village-warm: #FEF3C7;
            --village-earth: #78350F;
          }
          
          .pattern-overlay {
            background-image: 
              radial-gradient(circle at 25% 25%, #FEF3C7 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, #FDE68A 2px, transparent 2px);
            background-size: 60px 60px;
            opacity: 0.1;
          }
          
          .cultural-border {
            border-image: linear-gradient(45deg, #D97706, #059669, #DC2626) 1;
          }

          .telugu-font {
            font-family: 'Noto Sans Telugu', sans-serif;
          }
        `}
      </style>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-orange-800">My Village, My Story</h1>
                <p className="text-sm text-orange-600 hidden sm:block telugu-font">నా గ్రామం, నా కథ</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to={createPageUrl("Home")} 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === createPageUrl("Home") 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link 
                to={createPageUrl("Stories")} 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === createPageUrl("Stories") 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Browse Stories</span>
              </Link>
              <Link 
                to={createPageUrl("Share")} 
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Share Your Story</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <div className="pattern-overlay absolute inset-0 pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-orange-200 px-4 py-3">
        <div className="flex justify-around">
          <Link 
            to={createPageUrl("Home")} 
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
              location.pathname === createPageUrl("Home") 
                ? 'text-orange-600' 
                : 'text-gray-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link 
            to={createPageUrl("Stories")} 
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
              location.pathname === createPageUrl("Stories") 
                ? 'text-orange-600' 
                : 'text-gray-500'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Stories</span>
          </Link>
          <Link 
            to={createPageUrl("Share")} 
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-orange-600"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs">Share</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
