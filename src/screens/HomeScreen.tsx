import React, { useState, useEffect } from 'react';
import { Play, Clock, Target, Flame, Calendar, TrendingUp } from 'lucide-react';

export default function HomeScreen() {
  const [todayStats, setTodayStats] = useState({
    meditationMinutes: 15,
    targetMeditation: 20,
    workoutMinutes: 30,
    targetWorkout: 45,
    currentStreak: 7,
  });

  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Good morning');
    else if (hour < 17) setTimeOfDay('Good afternoon');
    else setTimeOfDay('Good evening');
  }, []);

  const quickActions = [
    {
      title: 'Morning Mindfulness',
      subtitle: '5 min meditation',
      duration: '5 min',
      color: 'from-blue-500 to-purple-600',
      icon: Play,
    },
    {
      title: 'Focus Boost',
      subtitle: 'Enhance concentration',
      duration: '10 min',
      color: 'from-green-500 to-teal-600',
      icon: Target,
    },
    {
      title: 'Quick Stretch',
      subtitle: 'Body movement',
      duration: '7 min',
      color: 'from-orange-500 to-red-600',
      icon: Clock,
    },
  ];

  return (
    <div className="screen">
      <div className="welcome-section">
        <h2 className="welcome-text">{timeOfDay}!</h2>
        <p className="subtitle">Ready to elevate your wellness today?</p>
      </div>

      <div className="progress-section">
        <div className="section-header">
          <h3 className="section-title">Today's Progress</h3>
          <TrendingUp size={20} className="text-indigo-600" />
        </div>
        
        <div className="stats-grid">
          <div className="stat-card meditation">
            <div className="stat-icon">
              <Play size={16} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{todayStats.meditationMinutes}</span>
              <div className="stat-label">Meditation</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill meditation"
                  style={{ width: `${(todayStats.meditationMinutes / todayStats.targetMeditation) * 100}%` }}
                />
              </div>
              <div className="stat-target">{todayStats.targetMeditation} min goal</div>
            </div>
          </div>
          
          <div className="stat-card workout">
            <div className="stat-icon">
              <Target size={16} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{todayStats.workoutMinutes}</span>
              <div className="stat-label">Exercise</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill workout"
                  style={{ width: `${(todayStats.workoutMinutes / todayStats.targetWorkout) * 100}%` }}
                />
              </div>
              <div className="stat-target">{todayStats.targetWorkout} min goal</div>
            </div>
          </div>
          
          <div className="stat-card streak">
            <div className="stat-icon">
              <Flame size={16} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{todayStats.currentStreak}</span>
              <div className="stat-label">Day Streak</div>
              <div className="stat-target">Amazing!</div>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <div className="section-header">
          <h3 className="section-title">Quick Start</h3>
          <Calendar size={20} className="text-indigo-600" />
        </div>
        
        {quickActions.map((action, index) => (
          <button key={index} className={`action-card bg-gradient-to-r ${action.color}`}>
            <div className="action-content">
              <div className="action-icon">
                <action.icon size={20} />
              </div>
              <div className="action-info">
                <h4 className="action-title">{action.title}</h4>
                <p className="action-subtitle">{action.subtitle}</p>
              </div>
              <div className="action-duration">
                {action.duration}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

