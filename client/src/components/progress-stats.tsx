import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Flame, Calendar, Heart } from "lucide-react";
import type { UserStats } from "@shared/schema";

interface ProgressStatsProps {
  userId: number;
}

export default function ProgressStats({ userId }: ProgressStatsProps) {
  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/stats", userId],
  });

  const statsCards = [
    {
      title: "Current Streak",
      value: stats?.currentStreak || 0,
      unit: "days in a row",
      icon: Flame,
      color: "text-accent-orange",
      bgColor: "bg-accent-orange bg-opacity-20"
    },
    {
      title: "This Week",
      value: stats?.weeklyMinutes || 0,
      unit: "minutes practiced",
      icon: Calendar,
      color: "text-primary-blue",
      bgColor: "bg-primary-blue bg-opacity-20"
    },
    {
      title: "Favorite",
      value: stats?.favoriteCategory || "Meditation",
      unit: "most practiced",
      icon: Heart,
      color: "text-green",
      bgColor: "bg-green bg-opacity-20"
    }
  ];

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Progress</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">{stat.title}</h4>
                <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${stat.color} text-sm`} />
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
      
      {/* Weekly Activity Chart Placeholder */}
      <Card className="mt-8 p-6 card-shadow">
        <h4 className="font-semibold text-gray-800 mb-4">Weekly Activity</h4>
        <div className="flex items-end space-x-2 h-32 justify-center">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className="bg-primary-blue bg-opacity-20 rounded-t-sm flex-1 flex items-end justify-center"
              style={{ height: `${Math.random() * 80 + 20}%` }}
            >
              <div className="bg-primary-blue w-full rounded-t-sm" style={{ height: "80%" }}></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-light">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </Card>
    </section>
  );
}
