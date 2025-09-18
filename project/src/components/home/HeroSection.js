
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Mic, Image as ImageIcon } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-orange-600 via-yellow-500 to-green-600 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="text-6xl mb-4 block">🌾</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              My Village, My Story
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-2 telugu-font">
              నా గ్రామం, నా కథ
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-orange-100 mb-8 leading-relaxed">
            Every village holds treasures of culture, tradition, and untold stories waiting to be heard.
            Share your village's festivals, food, legends, memories, and daily life with the world.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to={createPageUrl("Share")}>
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3">
                <Plus className="w-5 h-5 mr-2" />
                Share Your Story
              </Button>
            </Link>
            <Link to={createPageUrl("Stories")}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3">
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Stories
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Share Stories</h3>
              <p className="text-sm text-orange-100">
                Write about festivals, traditions, memories, and daily village life
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Record Voices</h3>
              <p className="text-sm text-orange-100">
                Capture folk songs, proverbs, and oral tales in your local language
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Upload Photos</h3>
              <p className="text-sm text-orange-100">
                Showcase village landscapes, crafts, and cultural traditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
