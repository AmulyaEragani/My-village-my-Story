import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, Mic, Image as ImageIcon } from "lucide-react";

export default function StatsSection({ stories }) {
  const stats = [
    {
      icon: Users,
      label: "Stories Shared",
      value: stories.length,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: MapPin,
      label: "Villages Featured",
      value: new Set(stories.map(s => s.village_name).filter(Boolean)).size,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Mic,
      label: "Voice Recordings",
      value: stories.filter(s => s.voice_recording_url).length,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: ImageIcon,
      label: "Photos Uploaded",
      value: stories.reduce((total, s) => total + (s.images ? s.images.length : 0), 0),
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="text-center">
          <CardContent className="p-6">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}