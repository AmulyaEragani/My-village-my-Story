
import React, { useState } from "react";
import { Story } from "@/entities/Story";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Mic, MicOff, Image as ImageIcon, Plus, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import StoryTypeSelector from "../components/share/StoryTypeSelector";
import MediaUploader from "../components/share/MediaUploader";
import VoiceRecorder from "../components/share/VoiceRecorder";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function Share() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    story_type: "",
    village_name: "",
    state: "",
    language: "Telugu", // Changed default language to Telugu
    author_name: "",
    author_age: "",
    voice_description: "",
    tags: []
  });
  const [images, setImages] = useState([]);
  const [voiceRecording, setVoiceRecording] = useState(null);
  const [newTag, setNewTag] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload images
      let imageUrls = [];
      for (const image of images) {
        const { file_url } = await UploadFile({ file: image });
        imageUrls.push(file_url);
      }

      // Upload voice recording if exists
      let voiceUrl = "";
      if (voiceRecording) {
        const { file_url } = await UploadFile({ file: voiceRecording });
        voiceUrl = file_url;
      }

      // Create story
      await Story.create({
        ...formData,
        author_age: formData.author_age ? parseInt(formData.author_age) : null,
        images: imageUrls,
        voice_recording_url: voiceUrl
      });

      navigate(createPageUrl("Stories"));
    } catch (error) {
      console.error("Error creating story:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Share Your Village Story</h1> {/* Changed mb-2 to mb-1 */}
        <p className="text-gray-600 telugu-font">మీ గ్రామ కథను పంచుకోండి</p> {/* Added Telugu translation */}
        <p className="text-gray-600 mt-2">Help preserve the rich culture and traditions of your village for future generations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Story Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              What type of story are you sharing?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StoryTypeSelector 
              selectedType={formData.story_type}
              onSelect={(type) => handleInputChange('story_type', type)}
            />
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Tell us about your story
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Story Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Diwali Celebrations in Our Village"
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                 <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Telugu">Telugu</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Kannada">Kannada</SelectItem>
                      <SelectItem value="Malayalam">Malayalam</SelectItem>
                      <SelectItem value="Bengali">Bengali</SelectItem>
                      <SelectItem value="Marathi">Marathi</SelectItem>
                      <SelectItem value="Gujarati">Gujarati</SelectItem>
                      <SelectItem value="Punjabi">Punjabi</SelectItem>
                      <SelectItem value="Odia">Odia</SelectItem>
                      <SelectItem value="Assamese">Assamese</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="content">Your Story</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Share your story in detail. Include traditions, customs, memories, or any special aspects of village life..."
                className="mt-2 h-32"
                rows={6}
              />
            </div>

            {/* Tags */}
            <div>
              <Label>Tags (optional)</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tags like 'harvest', 'festival', 'tradition'"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location and Author */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Location and author details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="village_name">Village Name *</Label>
                <Input
                  id="village_name"
                  value={formData.village_name}
                  onChange={(e) => handleInputChange('village_name', e.target.value)}
                  placeholder="Name of your village"
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="author_name">Your Name *</Label>
                <Input
                  id="author_name"
                  value={formData.author_name}
                  onChange={(e) => handleInputChange('author_name', e.target.value)}
                  placeholder="Your full name"
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="author_age">Your Age (optional)</Label>
                <Input
                  id="author_age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.author_age}
                  onChange={(e) => handleInputChange('author_age', e.target.value)}
                  placeholder="Your age"
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              Add photos and voice recordings (optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MediaUploader images={images} setImages={setImages} />
            <VoiceRecorder 
              voiceRecording={voiceRecording}
              setVoiceRecording={setVoiceRecording}
              voiceDescription={formData.voice_description}
              setVoiceDescription={(desc) => handleInputChange('voice_description', desc)}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(createPageUrl("Home"))}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !formData.title || !formData.village_name || !formData.state || !formData.author_name}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sharing Story...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Share My Story
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
