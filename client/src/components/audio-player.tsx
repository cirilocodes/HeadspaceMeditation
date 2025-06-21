import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Heart, X, Volume2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Session } from "@shared/schema";

interface AudioPlayerProps {
  session: Session;
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
}

export default function AudioPlayer({
  session,
  isPlaying,
  onPlayPause,
  onClose
}: AudioPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(session.duration * 60); // Convert to seconds
  const [isFavorited, setIsFavorited] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || session.duration * 60);
    const handleLoad = () => setIsLoading(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleError = () => {
      setIsLoading(false);
      toast({
        title: "Audio Error",
        description: "Failed to load audio. Using simulated playback.",
        variant: "destructive"
      });
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('canplay', handleLoad);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('error', handleError);

    // Set initial volume
    audio.volume = volume / 100;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('canplay', handleLoad);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('error', handleError);
    };
  }, [session, volume, toast]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // Fallback to simulated audio if real audio fails
        toast({
          title: "Audio Playback",
          description: "Using simulated audio playback",
          variant: "default"
        });
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, toast]);

  // Simulate audio progress as fallback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration && (!audioRef.current || audioRef.current.error)) {
      interval = setInterval(() => {
        setCurrentTime(prev => Math.min(prev + 1, duration));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const progressMutation = useMutation({
    mutationFn: async () => {
      // Get current user
      const userResponse = await fetch("/api/auth/user");
      if (!userResponse.ok) throw new Error("Not authenticated");
      const user = await userResponse.json();
      
      return apiRequest("POST", "/api/progress", {
        userId: user.id,
        sessionId: session.id,
        completed: currentTime >= duration,
        completedAt: currentTime >= duration ? new Date().toISOString() : null,
        timeSpent: currentTime
      });
    },
    onSuccess: async () => {
      const userResponse = await fetch("/api/auth/user");
      if (userResponse.ok) {
        const user = await userResponse.json();
        queryClient.invalidateQueries({ queryKey: ["/api/progress", user.id] });
        queryClient.invalidateQueries({ queryKey: ["/api/stats", user.id] });
      }
    }
  });

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      // Get current user
      const userResponse = await fetch("/api/auth/user");
      if (!userResponse.ok) throw new Error("Not authenticated");
      const user = await userResponse.json();
      
      if (isFavorited) {
        return apiRequest("DELETE", `/api/favorites/${user.id}/${session.id}`);
      } else {
        return apiRequest("POST", "/api/favorites", {
          userId: user.id,
          sessionId: session.id
        });
      }
    },
    onSuccess: () => {
      setIsFavorited(!isFavorited);
      queryClient.invalidateQueries({ queryKey: ["/api/favorites", "current"] });
    }
  });

  // Update progress when session ends
  useEffect(() => {
    if (currentTime >= duration) {
      progressMutation.mutate();
    }
  }, [currentTime, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSkipBack = () => {
    const newTime = Math.max(0, currentTime - 15);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTime + 15);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={session.audioUrl}
        preload="metadata"
      />
      
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 z-50 mb-16 md:mb-0 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
            {/* Session Info */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <img 
                src={session.imageUrl} 
                alt={session.title}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0" 
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-800 dark:text-white truncate">{session.title}</h4>
                <p className="text-sm text-light capitalize truncate">
                  {session.type.replace('_', ' ')} • {session.category}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-light hover:text-primary-blue"
                onClick={handleSkipBack}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="w-12 h-12 bg-primary-blue text-white rounded-full hover:bg-primary-blue-light transition-all transform hover:scale-105"
                onClick={onPlayPause}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-light hover:text-primary-blue"
                onClick={handleSkipForward}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress */}
            <div className="flex-1 max-w-md">
              <div className="flex items-center space-x-3 text-sm text-light">
                <span className="min-w-[40px] text-right">{formatTime(Math.floor(currentTime))}</span>
                <div className="flex-1">
                  <Slider
                    value={[progressPercentage]}
                    onValueChange={handleProgressChange}
                    max={100}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <span className="min-w-[40px]">{formatTime(Math.floor(duration))}</span>
              </div>
            </div>

            {/* Volume & Additional Controls */}
            <div className="flex items-center space-x-2">
              <div className="hidden md:flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-light" />
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-16"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={`${isFavorited ? "text-red-500" : "text-light"} hover:text-red-500`}
                onClick={() => favoriteMutation.mutate()}
                disabled={favoriteMutation.isPending}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-light hover:text-primary-blue"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
