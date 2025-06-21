import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Dumbbell, Heart, Droplets, Plus, Minus, Target, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { DailyGoal } from "@shared/schema";

interface DailyGoalsProps {
  userId: string;
}

export default function DailyGoals({ userId }: DailyGoalsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: goal, isLoading } = useQuery<DailyGoal>({
    queryKey: [`/api/goals/${userId}/${today}`],
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<DailyGoal>) => {
      return apiRequest("PATCH", `/api/goals/${userId}/${today}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/goals/${userId}/${today}`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateGoal = (field: string, increment: number) => {
    if (!goal) return;
    
    const currentValue = (goal as any)[field] as number;
    const newValue = Math.max(0, currentValue + increment);
    
    updateMutation.mutate({ [field]: newValue });
  };

  const getProgress = (current: number, target: number) => {
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
  };

  const isGoalComplete = (current: number, target: number) => {
    return current >= target;
  };

  if (isLoading || !goal) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading daily goals...</div>
      </Card>
    );
  }

  const goals = [
    {
      id: 'meditation',
      title: 'Meditation',
      icon: Brain,
      current: goal.meditationMinutes,
      target: goal.targetMeditationMinutes,
      unit: 'minutes',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      progressColor: 'bg-blue-500'
    },
    {
      id: 'workout',
      title: 'Exercise',
      icon: Dumbbell,
      current: goal.workoutMinutes,
      target: goal.targetWorkoutMinutes,
      unit: 'minutes',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      progressColor: 'bg-green-500'
    },
    {
      id: 'gratitude',
      title: 'Gratitude',
      icon: Heart,
      current: goal.gratitudeEntries,
      target: goal.targetGratitudeEntries,
      unit: 'entries',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      progressColor: 'bg-pink-500'
    },
    {
      id: 'water',
      title: 'Water',
      icon: Droplets,
      current: goal.waterGlasses,
      target: goal.targetWaterGlasses,
      unit: 'glasses',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      progressColor: 'bg-cyan-500'
    }
  ];

  const completedGoals = goals.filter(g => isGoalComplete(g.current, g.target)).length;
  const totalProgress = goals.reduce((acc, g) => acc + getProgress(g.current, g.target), 0) / goals.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Daily Goals</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {completedGoals}/{goals.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">completed</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Overall Progress</span>
            <span className="text-sm font-medium text-gray-800 dark:text-white">{Math.round(totalProgress)}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>

        {completedGoals === goals.length && (
          <div className="flex items-center justify-center space-x-2 py-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Trophy className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800 dark:text-green-200">
              All goals completed! Great job! 🎉
            </span>
          </div>
        )}
      </Card>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goalItem) => {
          const Icon = goalItem.icon;
          const progress = getProgress(goalItem.current, goalItem.target);
          const isComplete = isGoalComplete(goalItem.current, goalItem.target);
          
          return (
            <Card key={goalItem.id} className={`p-6 relative overflow-hidden ${goalItem.bgColor}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${goalItem.bgColor} rounded-full flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${goalItem.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{goalItem.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {goalItem.current} / {goalItem.target} {goalItem.unit}
                    </p>
                  </div>
                </div>
                
                {isComplete && (
                  <Badge className="bg-green-500 text-white">
                    <Trophy className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                )}
              </div>

              <div className="mb-4">
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateGoal(goalItem.id === 'meditation' ? 'meditationMinutes' : 
                    goalItem.id === 'workout' ? 'workoutMinutes' :
                    goalItem.id === 'gratitude' ? 'gratitudeEntries' : 'waterGlasses', -1)}
                  disabled={goalItem.current <= 0 || updateMutation.isPending}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  {goalItem.current}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateGoal(goalItem.id === 'meditation' ? 'meditationMinutes' : 
                    goalItem.id === 'workout' ? 'workoutMinutes' :
                    goalItem.id === 'gratitude' ? 'gratitudeEntries' : 'waterGlasses', 1)}
                  disabled={updateMutation.isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}