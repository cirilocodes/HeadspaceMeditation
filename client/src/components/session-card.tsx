import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Play, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Session } from "@shared/schema";

interface SessionCardProps {
  session: Session;
  onPlay: () => void;
}

export default function SessionCard({ session, onPlay }: SessionCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const queryClient = useQueryClient();

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "text-green bg-green bg-opacity-20";
      case "intermediate":
        return "text-primary-blue bg-primary-blue bg-opacity-20";
      case "advanced":
        return "text-accent-orange bg-accent-orange bg-opacity-20";
      default:
        return "text-light bg-gray-100";
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    favoriteMutation.mutate();
  };

  return (
    <Card className="overflow-hidden card-shadow hover:shadow-lg transition-all hover:transform hover:scale-105 cursor-pointer">
      <img 
        src={session.imageUrl} 
        alt={session.title} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${getLevelColor(session.level)}`}>
            {session.level.charAt(0).toUpperCase() + session.level.slice(1)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className={`${isFavorited ? "text-red-500" : "text-light"} hover:text-red-500 transition-colors`}
            onClick={handleFavoriteClick}
            disabled={favoriteMutation.isPending}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        </div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">{session.title}</h4>
        <p className="text-light text-sm mb-4">{session.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-light">
            <Clock className="h-4 w-4 mr-2" />
            <span>{session.duration === 0 ? "Continuous" : `${session.duration} minutes`}</span>
          </div>
          <Button
            size="icon"
            className="w-10 h-10 bg-primary-blue text-white rounded-full hover:bg-primary-blue-light transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
