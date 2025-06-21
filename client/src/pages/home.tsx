import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import SessionCard from "@/components/session-card";
import AudioPlayer from "@/components/audio-player";
import ProgressStats from "@/components/progress-stats";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Brain, Heart, Moon, BookOpen, Waves, CloudRain, Star, Search, UserCircle } from "lucide-react";
import type { Session } from "@shared/schema";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"meditate" | "sleep" | "progress">("meditate");
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: sessions = [] } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  const { data: meditationSessions = [] } = useQuery<Session[]>({
    queryKey: ["/api/sessions", "meditation"],
    queryFn: () => fetch("/api/sessions?type=meditation").then(res => res.json()),
  });

  const { data: sleepSessions = [] } = useQuery<Session[]>({
    queryKey: ["/api/sessions", "sleep"],
    queryFn: () => fetch("/api/sessions?category=sleep").then(res => res.json()),
  });

  const handlePlaySession = (session: Session) => {
    setCurrentSession(session);
    setIsPlaying(true);
  };

  const handleClosePlayer = () => {
    setCurrentSession(null);
    setIsPlaying(false);
  };

  const quickStartCategories = [
    {
      icon: Brain,
      title: "Focus",
      description: "Improve concentration and mental clarity",
      duration: "5-20 minutes",
      color: "bg-green bg-opacity-20",
      iconColor: "text-green",
      category: "focus"
    },
    {
      icon: Heart,
      title: "Stress Relief",
      description: "Release tension and find inner peace",
      duration: "10-30 minutes",
      color: "bg-primary-blue bg-opacity-20",
      iconColor: "text-primary-blue",
      category: "stress"
    },
    {
      icon: Moon,
      title: "Sleep",
      description: "Prepare your mind for restful sleep",
      duration: "15-45 minutes",
      color: "bg-accent-orange bg-opacity-20",
      iconColor: "text-accent-orange",
      category: "sleep"
    }
  ];

  const sleepContent = [
    {
      icon: BookOpen,
      title: "Enchanted Forest",
      description: "A magical journey through ancient woods",
      duration: "25 minutes",
      color: "bg-gradient-to-br from-indigo-500 to-purple-600",
      type: "story"
    },
    {
      icon: Waves,
      title: "Ocean Waves",
      description: "Gentle waves lapping the shore",
      duration: "Continuous",
      color: "bg-gradient-to-br from-blue-500 to-cyan-400",
      type: "sound"
    },
    {
      icon: CloudRain,
      title: "Forest Rain",
      description: "Soft rainfall in the wilderness",
      duration: "Continuous",
      color: "bg-gradient-to-br from-green-500 to-emerald-400",
      type: "sound"
    },
    {
      icon: Star,
      title: "Desert Night",
      description: "Under the vast starry sky",
      duration: "30 minutes",
      color: "bg-gradient-to-br from-orange-500 to-red-400",
      type: "story"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
                <Leaf className="text-white text-lg" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Mindful</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-light hover:text-primary-blue">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-light hover:text-primary-blue">
                <UserCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "meditate" && (
          <>
            {/* Hero Section */}
            <section className="mb-12">
              <div className="gradient-bg rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Find your calm</h2>
                  <p className="text-lg mb-6 opacity-90">Start your mindfulness journey with guided meditations</p>
                  <Button className="bg-white text-primary-blue px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105">
                    Start Meditating
                  </Button>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-8 right-8 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-float"></div>
                <div className="absolute bottom-8 right-20 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse-slow"></div>
              </div>
            </section>

            {/* Quick Start */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Start</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickStartCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Card key={category.category} className="p-6 card-shadow hover:shadow-lg transition-shadow cursor-pointer">
                      <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className={`${category.iconColor} text-xl`} />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{category.title}</h4>
                      <p className="text-light mb-4">{category.description}</p>
                      <div className="flex items-center text-sm text-light">
                        <span>{category.duration}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Featured Sessions */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Featured Sessions</h3>
                <Button variant="ghost" className="text-primary-blue font-medium hover:text-primary-blue-light">
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meditationSessions.slice(0, 3).map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onPlay={() => handlePlaySession(session)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "sleep" && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Sleep Stories & Sounds</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sleepContent.map((content) => {
                const Icon = content.icon;
                return (
                  <Card key={content.title} className="p-6 card-shadow hover:shadow-lg transition-all hover:transform hover:scale-105 cursor-pointer">
                    <div className={`w-12 h-12 ${content.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="text-white text-lg" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">{content.title}</h4>
                    <p className="text-light text-sm mb-4">{content.description}</p>
                    <div className="flex items-center text-sm text-light">
                      <span>{content.duration}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            {/* Sleep Sessions */}
            <div className="mt-12">
              <h4 className="text-xl font-bold text-gray-800 mb-6">Sleep Meditations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sleepSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onPlay={() => handlePlaySession(session)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "progress" && (
          <ProgressStats userId={1} />
        )}
      </main>

      {/* Audio Player */}
      {currentSession && (
        <AudioPlayer
          session={currentSession}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onClose={handleClosePlayer}
        />
      )}

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden z-40">
        <div className="flex items-center justify-around">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center p-2 ${activeTab === "meditate" ? "text-primary-blue" : "text-light"}`}
            onClick={() => setActiveTab("meditate")}
          >
            <Brain className="text-lg mb-1" />
            <span className="text-xs">Meditate</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center p-2 ${activeTab === "sleep" ? "text-primary-blue" : "text-light"}`}
            onClick={() => setActiveTab("sleep")}
          >
            <Moon className="text-lg mb-1" />
            <span className="text-xs">Sleep</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center p-2 ${activeTab === "progress" ? "text-primary-blue" : "text-light"}`}
            onClick={() => setActiveTab("progress")}
          >
            <div className="text-lg mb-1">📊</div>
            <span className="text-xs">Progress</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
