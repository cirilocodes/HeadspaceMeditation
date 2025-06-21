import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Dumbbell, Heart } from "lucide-react";
import type { Workout } from "@shared/schema";

interface WorkoutCardProps {
  workout: Workout;
  onPlay: () => void;
}

export default function WorkoutCard({ workout, onPlay }: WorkoutCardProps) {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "yoga":
        return Heart;
      case "strength":
        return Dumbbell;
      case "cardio":
        return Clock;
      default:
        return Dumbbell;
    }
  };

  const CategoryIcon = getCategoryIcon(workout.category);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
      <div className="relative">
        <img 
          src={workout.imageUrl} 
          alt={workout.title}
          className="w-full h-48 object-cover"
        />
        <Button
          onClick={onPlay}
          size="icon"
          className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full"
        >
          <Play className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs font-medium px-2 py-1 ${getLevelStyle(workout.level)}`}>
              {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
            </Badge>
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
              <CategoryIcon className="h-3 w-3 mr-1" />
              {workout.category}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Clock className="h-4 w-4 mr-1" />
            {workout.duration}m
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white line-clamp-1">
          {workout.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {workout.description}
        </p>

        {workout.equipment && workout.equipment.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">EQUIPMENT NEEDED</h4>
            <div className="flex flex-wrap gap-1">
              {workout.equipment.map((item, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={onPlay} 
          className="w-full bg-primary-blue hover:bg-primary-blue-light text-white font-medium rounded-full"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Workout
        </Button>
      </div>
    </Card>
  );
}