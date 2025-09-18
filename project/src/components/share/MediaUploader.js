import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Image as ImageIcon, X } from "lucide-react";

export default function MediaUploader({ images, setImages }) {
  const fileInputRef = useRef();

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setImages(prev => [...prev, ...imageFiles]);
    e.target.value = '';
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Add Photos</h3>
      
      <Card className="border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Upload photos of your village, traditions, crafts, or any relevant images
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mb-2"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Images
          </Button>
          <p className="text-xs text-gray-500">
            Supported: JPG, PNG, GIF (Max 5MB each)
          </p>
        </CardContent>
      </Card>

      {images.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-3">Selected Images ({images.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}