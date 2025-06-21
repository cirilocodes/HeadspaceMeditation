import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Play, Clock, Star, Waves } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Session, UserFavorite } from "@shared/schema";

interface SessionCardProps {
  session: Session;
  onPlay: () => void;
}

export default function SessionCard({ session, onPlay }: SessionCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check if session is favorited
  const { data: favorites = [] } = useQuery<UserFavorite[]>({
    queryKey: ["/api/favorites", "current"],
    queryFn: async () => {
      // We'll get the current user ID from the auth context
      const userResponse = await fetch("/api/auth/user");
      if (!userResponse.ok) return [];
      const user = await userResponse.json();
      const favResponse = await fetch(`/api/favorites/${user.id}`);
      return favResponse.ok ? await favResponse.json() : [];
    }
  });

  useEffect(() => {
    setIsFavorited(favorites.some(fav => fav.sessionId === session.id));
  }, [favorites, session.id]);

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
      queryClient.invalidateQueries({ queryKey: ["/api/favorites", "current"] });
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: `${session.title} ${isFavorited ? "removed from" : "added to"} your favorites`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
    }
  });

  const getLevelVariant = (level: string) => {
    switch (level) {
      case "beginner":
        return "default";
      case "intermediate":
        return "secondary";
      case "advanced":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getLevelStyle = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
      case "intermediate":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
      case "advanced":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    favoriteMutation.mutate();
  };

  return (
    <Card className="overflow-hidden card-shadow hover:shadow-lg transition-all hover:transform hover:scale-[1.02] cursor-pointer group">
      <div className="relative">
        <img 
          src={session.imageUrl} 
          alt={session.title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Button
          size="icon"
          className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 text-primary-blue rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
        >
          <Play className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs font-medium px-2 py-1 ${getLevelStyle(session.level)}`}>
              {session.level.charAt(0).toUpperCase() + session.level.slice(1)}
            </Badge>
            {session.type === "sleep_story" && (
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                <Star className="h-3 w-3 mr-1" />
                Story
              </Badge>
            )}
            {session.type === "sleep_sound" && (
              <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800">
                <Waves className="h-3 w-3 mr-1" />
                Sound
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`${isFavorited ? "text-red-500" : "text-light"} hover:text-red-500 transition-colors`}
            onClick={handleFavoriteClick}
            disabled={favoriteMutation.isPending}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""} ${favoriteMutation.isPending ? "animate-pulse" : ""}`} />
          </Button>
        </div>
        
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">{session.title}</h4>
        <p className="text-light text-sm mb-4 line-clamp-2">{session.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-light">
            <Clock className="h-4 w-4 mr-2" />
            <span>{session.duration === 0 ? "Continuous" : `${session.duration} min`}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-light">
            <span className="capitalize">{session.category}</span>
            <span>•</span>
            <span className="capitalize">{session.type.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
