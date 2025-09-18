
import React, { useState, useEffect } from "react";
import { Story } from "@/entities/Story";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Calendar, User, Mic, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";

import StoryCard from "../components/home/StoryCard";
import StoryFilters from "../components/stories/StoryFilters";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    story_type: "all",
    state: "all",
    has_voice: "all",
    has_images: "all"
  });

  useEffect(() => {
    const loadStories = async () => {
      try {
        const data = await Story.list("-created_date", 50);
        setStories(data);
      } catch (error) {
        console.error("Error loading stories:", error);
      }
      setIsLoading(false);
    };

    loadStories();
  }, []); // Empty dependency array as loadStories is now defined inside and only called once

  useEffect(() => {
    // Filter stories logic moved directly into useEffect
    let filtered = stories;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(story =>
        story.title?.toLowerCase().includes(query) ||
        story.content?.toLowerCase().includes(query) ||
        story.village_name?.toLowerCase().includes(query) ||
        story.author_name?.toLowerCase().includes(query) ||
        story.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Story type filter
    if (filters.story_type !== "all") {
      filtered = filtered.filter(story => story.story_type === filters.story_type);
    }

    // State filter
    if (filters.state !== "all") {
      filtered = filtered.filter(story => story.state === filters.state);
    }

    // Voice filter
    if (filters.has_voice !== "all") {
      const hasVoice = filters.has_voice === "true";
      filtered = filtered.filter(story => !!story.voice_recording_url === hasVoice);
    }

    // Images filter
    if (filters.has_images !== "all") {
      const hasImages = filters.has_images === "true";
      filtered = filtered.filter(story => !!(story.images && story.images.length > 0) === hasImages);
    }

    setFilteredStories(filtered);
  }, [stories, searchQuery, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Village Stories</h1>
        <p className="text-gray-600">Explore the rich tapestry of Indian village life and culture</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-80">
          <div className="sticky top-24 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search stories, villages, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <StoryFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              stories={stories}
            />

            {/* Stats */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
              <h3 className="font-semibold text-gray-900 mb-3">Collection Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Stories</span>
                  <span className="font-semibold">{stories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">With Voice</span>
                  <span className="font-semibold">{stories.filter(s => s.voice_recording_url).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">With Photos</span>
                  <span className="font-semibold">{stories.filter(s => s.images && s.images.length > 0).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Villages</span>
                  <span className="font-semibold">{new Set(stories.map(s => s.village_name)).size}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredStories.length} Stories Found
              </h2>
              {(searchQuery || Object.values(filters).some(f => f !== "all")) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({
                      story_type: "all",
                      state: "all",
                      has_voice: "all",
                      has_images: "all"
                    });
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => (
                <StoryCard key={story.id} story={story} showDetails={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
