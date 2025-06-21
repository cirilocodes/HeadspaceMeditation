import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import SessionCard from "@/components/session-card";
import AudioPlayer from "@/components/audio-player";
import ProgressStats from "@/components/progress-stats";
import SearchModal from "@/components/search-modal";
import ProfileModal from "@/components/profile-modal";
import MeditationTimer from "@/components/meditation-timer";
import WorkoutCard from "@/components/workout-card";
import DailyGoals from "@/components/daily-goals";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Brain, Heart, Moon, BookOpen, Waves, CloudRain, Star, Search, UserCircle, LogOut, Play, Settings, Dumbbell, Target } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Session } from "@shared/schema";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"meditate" | "sleep" | "progress" | "workouts" | "goals">("meditate");
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/auth/google";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

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

  const { data: workouts = [] } = useQuery({
    queryKey: ["/api/workouts"],
    queryFn: () => fetch("/api/workouts").then(res => res.json()),
  });

  const handlePlaySession = (session: Session) => {
    if (!user) return;
    
    setCurrentSession(session);
    setIsPlaying(true);
    
    // Create or update progress entry
    setTimeout(() => {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          sessionId: session.id,
          completed: false,
          timeSpent: 0
        })
      }).catch(() => {}); // Silent fail for demo
    }, 100);
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
    <div className="min-h-screen bg-neutral dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
                <Leaf className="text-white text-lg" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mindful</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-light hover:text-primary-blue"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-light hover:text-primary-blue"
                onClick={() => setShowProfile(true)}
              >
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="h-5 w-5" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-light hover:text-red-500"
                onClick={() => window.location.href = '/api/logout'}
              >
                <LogOut className="h-5 w-5" />
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
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center items-center">
                    <Button 
                      className="bg-white text-primary-blue px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg min-w-[160px]"
                      onClick={() => {
                        const randomSession = meditationSessions[Math.floor(Math.random() * meditationSessions.length)];
                        if (randomSession) handlePlaySession(randomSession);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Quick Start
                    </Button>
                    <Button 
                      variant="outline"
                      className="bg-white/10 text-white border-white/30 px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all transform hover:scale-105 backdrop-blur-sm min-w-[160px]"
                      onClick={() => setShowTimer(true)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Custom Timer
                    </Button>
                  </div>
                </div>
                {/* Enhanced decorative elements */}
                <div className="absolute top-8 right-8 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-float meditation-breathe"></div>
                <div className="absolute bottom-8 right-20 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-8 w-16 h-16 bg-white bg-opacity-5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
              </div>
            </section>

            {/* Quick Start */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Quick Start</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickStartCategories.map((category) => {
                  const Icon = category.icon;
                  const categorySessions = meditationSessions.filter(s => s.category === category.category);
                  const randomSession = categorySessions[Math.floor(Math.random() * categorySessions.length)];
                  
                  return (
                    <Card 
                      key={category.category} 
                      className="p-6 card-shadow hover:shadow-lg transition-all hover:transform hover:scale-[1.02] cursor-pointer group"
                      onClick={() => randomSession && handlePlaySession(randomSession)}
                    >
                      <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`${category.iconColor} text-xl`} />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{category.title}</h4>
                      <p className="text-light mb-4">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-light">{category.duration}</span>
                        <Button 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary-blue hover:bg-primary-blue-light"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (randomSession) handlePlaySession(randomSession);
                          }}
                        >
                          Start Now
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Featured Sessions */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Featured Sessions</h3>
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
          <>
            {/* Sleep Hero */}
            <section className="mb-12">
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Sweet Dreams</h2>
                  <p className="text-lg mb-6 opacity-90">Drift off with soothing stories and calming sounds</p>
                  <Button 
                    className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
                    onClick={() => {
                      const randomSleepSession = sleepSessions[Math.floor(Math.random() * sleepSessions.length)];
                      if (randomSleepSession) handlePlaySession(randomSleepSession);
                    }}
                  >
                    Explore Sleep Content
                  </Button>
                </div>
                <div className="absolute top-8 right-8 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-float"></div>
                <div className="absolute bottom-8 right-20 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse-slow"></div>
              </div>
            </section>

            {/* Sleep Categories */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Sleep Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sleepContent.map((content) => {
                  const Icon = content.icon;
                  const matchingSessions = sleepSessions.filter(s => 
                    (content.type === "story" && s.type === "sleep_story") ||
                    (content.type === "sound" && s.type === "sleep_sound")
                  );
                  const randomSession = matchingSessions[Math.floor(Math.random() * matchingSessions.length)];
                  
                  return (
                    <Card 
                      key={content.title} 
                      className="p-6 card-shadow hover:shadow-lg transition-all hover:transform hover:scale-[1.02] cursor-pointer group"
                      onClick={() => randomSession && handlePlaySession(randomSession)}
                    >
                      <div className={`w-12 h-12 ${content.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="text-white text-lg" />
                      </div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">{content.title}</h4>
                      <p className="text-light text-sm mb-4">{content.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-light">{content.duration}</span>
                        <Button 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-indigo-600 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (randomSession) handlePlaySession(randomSession);
                          }}
                        >
                          Listen
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
            
            {/* All Sleep Sessions */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-800 dark:text-white">All Sleep Content</h4>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Stories</Button>
                  <Button variant="outline" size="sm">Sounds</Button>
                  <Button variant="outline" size="sm">Meditations</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sleepSessions.map((session) => (
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

        {activeTab === "workouts" && (
          <>
            <section className="mb-12">
              <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Active</h2>
                  <p className="text-lg mb-6 opacity-90">Strengthen your body with guided workouts</p>
                  <Button 
                    className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
                    onClick={() => {
                      const randomWorkout = workouts[Math.floor(Math.random() * workouts.length)];
                      if (randomWorkout) window.open(randomWorkout.videoUrl, '_blank');
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Training
                  </Button>
                </div>
                <div className="absolute top-8 right-8 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-float"></div>
                <div className="absolute bottom-8 right-20 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse-slow"></div>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Workout Library</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts.map((workout: any) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onPlay={() => window.open(workout.videoUrl, '_blank')}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "goals" && user && (
          <DailyGoals userId={user.id} />
        )}

        {activeTab === "progress" && user && (
          <ProgressStats userId={user.id} />
        )}
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onPlaySession={handlePlaySession}
      />

      {/* Profile Modal */}
      {user && (
        <ProfileModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          user={user}
        />
      )}

      {/* Meditation Timer */}
      <MeditationTimer
        isOpen={showTimer}
        onClose={() => setShowTimer(false)}
        onStartSession={(duration) => {
          // Create a custom timer session
          const timerSession = {
            id: 'timer-session',
            title: `${duration} Minute Meditation`,
            description: "Guided breathing and mindfulness",
            category: "focus",
            level: "beginner",
            duration: duration,
            audioUrl: "/audio/timer-meditation.mp3",
            imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
            type: "meditation",
            createdAt: new Date()
          };
          handlePlaySession(timerSession as Session);
          setShowTimer(false);
        }}
      />

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
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2 md:hidden z-40">
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
