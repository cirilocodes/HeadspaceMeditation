import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";

interface MeditationTimerProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (duration: number) => void;
}

export default function MeditationTimer({ isOpen, onClose, onStartSession }: MeditationTimerProps) {
  const [duration, setDuration] = useState([10]); // in minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'setup' | 'running' | 'complete'>('setup');

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setPhase('complete');
    }
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setTimeLeft(duration[0] * 60);
    setIsRunning(true);
    setPhase('running');
    onStartSession(duration[0]);
  };

  const pauseTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setPhase('setup');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (duration[0] === 0) return 0;
    return ((duration[0] * 60 - timeLeft) / (duration[0] * 60)) * 100;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Meditation Timer</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {phase === 'setup' && (
            <>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Set Your Practice Time
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose how long you'd like to meditate
                </p>
              </div>

              <Card className="p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-primary-blue mb-2">
                    {duration[0]}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">minutes</div>
                </div>
                
                <Slider
                  value={duration}
                  onValueChange={setDuration}
                  min={1}
                  max={60}
                  step={1}
                  className="w-full"
                />
                
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>1 min</span>
                  <span>60 min</span>
                </div>
              </Card>

              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 20].map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    onClick={() => setDuration([time])}
                    className={duration[0] === time ? "bg-primary-blue text-white" : ""}
                  >
                    {time}m
                  </Button>
                ))}
              </div>

              <Button onClick={startTimer} className="w-full bg-primary-blue hover:bg-primary-blue-light">
                <Play className="h-4 w-4 mr-2" />
                Start Meditation
              </Button>
            </>
          )}

          {phase === 'running' && (
            <>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Meditation in Progress
                </h3>
                
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                      className="text-primary-blue transition-all duration-1000 ease-linear"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800 dark:text-white">
                        {formatTime(timeLeft)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">remaining</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={pauseTimer} variant="outline" className="flex-1">
                  {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isRunning ? 'Pause' : 'Resume'}
                </Button>
                <Button onClick={resetTimer} variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {phase === 'complete' && (
            <>
              <div className="text-center">
                <div className="text-6xl mb-4">🧘‍♀️</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Well Done!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  You've completed your {duration[0]} minute meditation session
                </p>
              </div>

              <div className="space-y-3">
                <Button onClick={resetTimer} className="w-full bg-primary-blue hover:bg-primary-blue-light">
                  Start Another Session
                </Button>
                <Button onClick={onClose} variant="outline" className="w-full">
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}