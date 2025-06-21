import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipBack, SkipForward, Heart, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
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
  const queryClient = useQueryClient();

  // Simulate audio progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => Math.min(prev + 1, duration));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const progressMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/progress", {
        userId: 1,
        sessionId: session.id,
        completed: currentTime >= duration,
        completedAt: currentTime >= duration ? new Date().toISOString() : null,
        timeSpent: currentTime
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress", 1] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats", 1] });
    }
  });

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        return apiRequest("DELETE", `/api/favorites/1/${session.id}`);
      } else {
        return apiRequest("POST", "/api/favorites", {
          userId: 1,
          sessionId: session.id
        });
      }
    },
    onSuccess: () => {
      setIsFavorited(!isFavorited);
      queryClient.invalidateQueries({ queryKey: ["/api/favorites", 1] });
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
    setCurrentTime(Math.max(0, currentTime - 15));
  };

  const handleSkipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 15));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 mb-16 md:mb-0">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-4">
          {/* Session Info */}
          <div className="flex items-center space-x-3 flex-1">
            <img 
              src={session.imageUrl} 
              alt={session.title}
              className="w-12 h-12 rounded-lg object-cover" 
            />
            <div>
              <h4 className="font-medium text-gray-800">{session.title}</h4>
              <p className="text-sm text-light">Guided Meditation</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
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
              className="w-12 h-12 bg-primary-blue text-white rounded-full hover:bg-primary-blue-light"
              onClick={onPlayPause}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
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
              <span>{formatTime(currentTime)}</span>
              <Progress value={progressPercentage} className="flex-1" />
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center space-x-2">
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
  );
}
