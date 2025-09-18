import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";

export default function FeaturedVillages({ stories }) {
  const getVillageStats = () => {
    const villageMap = {};
    stories.forEach(story => {
      const key = `${story.village_name}, ${story.state}`;
      if (!villageMap[key]) {
        villageMap[key] = {
          village: story.village_name,
          state: story.state,
          stories: [],
          authors: new Set()
        };
      }
      villageMap[key].stories.push(story);
      villageMap[key].authors.add(story.author_name);
    });

    return Object.values(villageMap)
      .map(village => ({
        ...village,
        authorCount: village.authors.size,
        storyCount: village.stories.length
      }))
      .sort((a, b) => b.storyCount - a.storyCount)
      .slice(0, 6);
  };

  const featuredVillages = getVillageStats();

  if (featuredVillages.length === 0) return null;

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Villages</h2>
        <p className="text-gray-600">Villages with rich storytelling communities</p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredVillages.map((village, index) => (
          <Card key={`${village.village}-${village.state}`} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg mb-1">{village.village}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{village.state}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  #{index + 1}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {village.storyCount}
                  </div>
                  <div className="text-gray-600">Stories</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {village.authorCount}
                  </div>
                  <div className="text-gray-600">Contributors</div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Recent story types:</p>
                <div className="flex flex-wrap gap-1">
                  {[...new Set(village.stories.map(s => s.story_type).filter(Boolean))]
                    .slice(0, 3)
                    .map(type => (
                      <Badge key={type} variant="outline" className="text-xs px-2 py-0">
                        {type.replace('_', ' ')}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}