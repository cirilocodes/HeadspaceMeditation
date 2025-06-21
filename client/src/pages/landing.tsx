import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Brain, Moon, Star, Heart, Shield, Users, Clock } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: "Guided Meditation",
      description: "Expert-led sessions to improve focus and reduce stress"
    },
    {
      icon: Moon,
      title: "Sleep Stories",
      description: "Peaceful narratives to help you drift off naturally"
    },
    {
      icon: Heart,
      title: "Progress Tracking",
      description: "Monitor your mindfulness journey with detailed insights"
    },
    {
      icon: Users,
      title: "Community",
      description: "Join millions on their path to better mental health"
    }
  ];

  const benefits = [
    { icon: Shield, text: "Reduce anxiety and stress" },
    { icon: Clock, text: "Better sleep quality" },
    { icon: Star, text: "Improved focus and clarity" },
    { icon: Heart, text: "Enhanced emotional well-being" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Leaf className="text-white text-lg" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mindful
              </h1>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/api/auth/google'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-2 rounded-full transition-all transform hover:scale-105"
            >
              Sign In with Google
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Find Your Peace
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Join millions who have discovered the power of mindfulness. Reduce stress, improve sleep, and find clarity with guided meditations.
            </p>
            <Button 
              onClick={() => window.location.href = '/api/auth/google'}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-12 py-4 rounded-full text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Start Your Journey
            </Button>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
              alt="Peaceful meditation scene"
              className="relative rounded-3xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            Everything You Need for Inner Peace
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-8 text-center hover:shadow-xl transition-all hover:transform hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-white text-2xl" />
                  </div>
                  <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-16 text-gray-800 dark:text-white">
            Proven Benefits of Mindfulness
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-center space-x-4 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="text-white text-lg" />
                  </div>
                  <span className="text-lg font-medium text-gray-800 dark:text-white">
                    {benefit.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-4xl font-bold mb-6">
            Ready to Transform Your Life?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Start your mindfulness journey today with personalized meditation sessions.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/auth/google'}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-12 py-4 rounded-full text-lg transition-all transform hover:scale-105"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Leaf className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold">Mindful</span>
          </div>
          <p className="text-gray-400">
            Find peace, clarity, and better sleep through the power of mindfulness.
          </p>
        </div>
      </footer>
    </div>
  );
}