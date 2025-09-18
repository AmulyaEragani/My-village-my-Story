import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Play, Pause, Square, Upload, X, Volume2 } from "lucide-react";

export default function VoiceRecorder({ 
  voiceRecording, 
  setVoiceRecording, 
  voiceDescription, 
  setVoiceDescription 
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  
  const mediaRecorderRef = useRef();
  const audioRef = useRef();
  const timerRef = useRef();
  const chunksRef = useRef([]);
  const fileInputRef = useRef();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        
        // Create file from blob
        const file = new File([blob], `voice-recording-${Date.now()}.wav`, { type: 'audio/wav' });
        setVoiceRecording(file);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setVoiceRecording(file);
      const url = URL.createObjectURL(file);
      setAudioURL(url);
      setIsPlaying(false);
      e.target.value = '';
    }
  };

  const removeRecording = () => {
    setVoiceRecording(null);
    setAudioURL(null);
    setIsPlaying(false);
    setRecordingTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Add Voice Recording (Optional)</h3>
      
      <Card className="border-2 border-dashed border-gray-200">
        <CardContent className="p-6">
          {!voiceRecording ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mic className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Record folk songs, proverbs, or oral tales in your local language
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {!isRecording ? (
                  <Button
                    type="button"
                    onClick={startRecording}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm text-red-600">
                        Recording {formatTime(recordingTime)}
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={stopRecording}
                      variant="outline"
                      className="border-red-300 text-red-600"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                )}
                
                <div className="text-gray-400">or</div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Audio
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">
                      {voiceRecording.name || 'Voice Recording'}
                    </p>
                    <p className="text-sm text-green-600">
                      {(voiceRecording.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={playAudio}
                    disabled={!audioURL}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={removeRecording}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {audioURL && (
                <audio
                  ref={audioRef}
                  src={audioURL}
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="hidden"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {voiceRecording && (
        <div className="mt-4">
          <Label htmlFor="voice_description">Describe your recording (optional)</Label>
          <Input
            id="voice_description"
            value={voiceDescription}
            onChange={(e) => setVoiceDescription(e.target.value)}
            placeholder="e.g., Traditional folk song about harvest season"
            className="mt-2"
          />
        </div>
      )}
    </div>
  );
}