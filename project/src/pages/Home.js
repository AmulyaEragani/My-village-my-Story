
import React, { useState, useEffect } from "react";
import { Story } from "@/entities/Story";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, BookOpen, Mic, Image as ImageIcon, Plus, Star, Clock } from "lucide-react";
import { format } from "date-fns";

import HeroSection from "../components/home/HeroSection";
import StoryCard from "../components/home/StoryCard";
import StatsSection from "../components/home/StatsSection";
import FeaturedVillages from "../components/home/FeaturedVillages";

export default function Home() {
  const [recentStories, setRecentStories] = useState([]);
  const [featuredStories, setFeaturedStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const stories = await Story.list("-created_date", 10);
      setRecentStories(stories.slice(0, 6));
      setFeaturedStories(stories.slice(0, 3));
    } catch (error) {
      console.error("Error loading stories:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="pb-20 md:pb-8">
      <HeroSection />
      
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <StatsSection stories={recentStories} />

        {/* Featured Stories */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">Featured Stories</h2>
              <p className="text-gray-600 telugu-font">విశిష్ట కథలు</p>
            </div>
            <Link to={createPageUrl("Stories")}>
              <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                <BookOpen className="w-4 h-4 mr-2" />
                View All Stories
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredStories.map((story, index) => (
                <StoryCard key={story.id} story={story} featured={true} />
              ))}
            </div>
          )}
        </section>

        {/* Recent Stories */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">Recent Stories</h2>
              <p className="text-gray-600 telugu-font">ఇటీవలి కథలు</p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </section>

        <FeaturedVillages stories={recentStories} />

        {/* Call to Action */}
        <section className="text-center py-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl text-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-2">Share Your Village's Story</h2>
            <p className="text-xl mb-6 telugu-font">మీ గ్రామ కథను పంచుకోండి</p>
            <p className="text-lg mb-8 text-orange-100">
              Every village has unique traditions, festivals, and memories worth preserving. 
              Add your voice to this growing collection of Indian rural heritage.
            </p>
            <Link to={createPageUrl("Share")}>
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
                <Plus className="w-5 h-5 mr-2" />
                Start Sharing Today
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
