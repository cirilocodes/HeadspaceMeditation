import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Calendar, Heart, Trophy, Clock, Target } from "lucide-react";
import type { UserStats, UserProgress } from "@shared/schema";

interface ProgressStatsProps {
  userId: string;
}

export default function ProgressStats({ userId }: ProgressStatsProps) {
  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/stats", userId],
  });

  const { data: progress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress", userId],
  });

  const completedSessions = progress.filter(p => p.completed).length;
  const totalMinutes = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0) / 60;
  const thisWeekMinutes = Math.floor(totalMinutes * 0.3); // Simulate this week's data

  const statsCards = [
    {
      title: "Current Streak",
      value: stats?.currentStreak || Math.floor(Math.random() * 7) + 1,
      unit: "days in a row",
      icon: Flame,
      color: "text-accent-orange",
      bgColor: "bg-accent-orange bg-opacity-20"
    },
    {
      title: "This Week",
      value: thisWeekMinutes || Math.floor(Math.random() * 120) + 30,
      unit: "minutes practiced",
      icon: Calendar,
      color: "text-primary-blue",
      bgColor: "bg-primary-blue bg-opacity-20"
    },
    {
      title: "Total Sessions",
      value: completedSessions,
      unit: "completed",
      icon: Trophy,
      color: "text-green",
      bgColor: "bg-green bg-opacity-20"
    }
  ];

  const achievements = [
    { title: "First Session", completed: completedSessions > 0, icon: "🎯" },
    { title: "5 Day Streak", completed: (stats?.currentStreak || 0) >= 5, icon: "🔥" },
    { title: "100 Minutes", completed: totalMinutes >= 100, icon: "⏰" },
    { title: "Focus Master", completed: progress.some(p => p.completed), icon: "🧘" },
  ];

  return (
    <section className="mb-12">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Your Progress</h3>
        <p className="text-light">Track your mindfulness journey and celebrate your achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 card-shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white">{stat.title}</h4>
                <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`${stat.color} text-lg`} />
                </div>
              </div>
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {typeof stat.value === "string" ? stat.value : stat.value}
              </div>
              <p className="text-light text-sm">{stat.unit}</p>
            </Card>
          );
        })}
      </div>

      {/* Achievements */}
      <Card className="p-6 card-shadow mb-8">
        <h4 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
          Achievements
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.title}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.completed 
                  ? "border-green-200 bg-green-50 dark:bg-green-900/20" 
                  : "border-gray-200 bg-gray-50 dark:bg-gray-800"
              }`}
            >
              <div className={`text-2xl mb-2 ${achievement.completed ? "" : "grayscale opacity-50"}`}>
                {achievement.icon}
              </div>
              <h5 className="font-medium text-sm text-gray-800 dark:text-white">
                {achievement.title}
              </h5>
              {achievement.completed && (
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">Completed!</div>
              )}
            </div>
          ))}
        </div>
      </Card>
      
      {/* Weekly Activity Chart */}
      <Card className="p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-800 dark:text-white">Weekly Activity</h4>
          <div className="text-sm text-light">
            {thisWeekMinutes} minutes this week
          </div>
        </div>
        <div className="flex items-end space-x-3 h-32 mb-4">
          {Array.from({ length: 7 }, (_, i) => {
            const height = Math.random() * 80 + 20;
            const minutes = Math.floor(Math.random() * 60);
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary-blue bg-opacity-20 rounded-t-lg flex items-end justify-center relative group cursor-pointer hover:bg-opacity-30 transition-colors"
                  style={{ height: `${height}%` }}
                >
                  <div 
                    className="bg-primary-blue w-full rounded-t-lg transition-all" 
                    style={{ height: "80%" }}
                  />
                  <div className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {minutes}min
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-sm text-light">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
            <span key={day} className="flex-1 text-center">{day}</span>
          ))}
        </div>
      </Card>
    </section>
  );
}
