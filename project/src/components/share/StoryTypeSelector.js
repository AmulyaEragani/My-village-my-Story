import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  UtensilsCrossed, 
  BookOpen, 
  Heart, 
  Sun,
  Palette,
  Mic,
  Quote,
  Star
} from "lucide-react";

const STORY_TYPES = [
  { id: "festival", label: "Festival", icon: Calendar, description: "Celebrations and religious events" },
  { id: "tradition", label: "Tradition", icon: Users, description: "Customs and cultural practices" },
  { id: "food", label: "Food", icon: UtensilsCrossed, description: "Local cuisine and recipes" },
  { id: "legend", label: "Legend", icon: Star, description: "Folk tales and myths" },
  { id: "memory", label: "Memory", icon: Heart, description: "Personal experiences and memories" },
  { id: "daily_life", label: "Daily Life", icon: Sun, description: "Everyday village activities" },
  { id: "craft", label: "Craft", icon: Palette, description: "Traditional arts and crafts" },
  { id: "song", label: "Song", icon: Mic, description: "Folk songs and music" },
  { id: "proverb", label: "Proverb", icon: Quote, description: "Wise sayings and proverbs" },
  { id: "folk_tale", label: "Folk Tale", icon: BookOpen, description: "Traditional stories" }
];

export default function StoryTypeSelector({ selectedType, onSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {STORY_TYPES.map((type) => (
        <Card
          key={type.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedType === type.id
              ? 'ring-2 ring-orange-500 bg-orange-50 border-orange-200'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelect(type.id)}
        >
          <CardContent className="p-4 text-center">
            <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
              selectedType === type.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}>
              <type.icon className="w-6 h-6" />
            </div>
            <h3 className="font-medium text-sm mb-1">{type.label}</h3>
            <p className="text-xs text-gray-500">{type.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}