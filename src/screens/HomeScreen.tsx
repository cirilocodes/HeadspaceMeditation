import React from 'react';

export default function HomeScreen() {
  const todayStats = {
    meditationMinutes: 15,
    targetMeditation: 20,
    workoutMinutes: 30,
    targetWorkout: 45,
    currentStreak: 7,
  };

  return (
    <div className="screen">
      <div className="welcome-section">
        <h2 className="welcome-text">Welcome back!</h2>
        <p className="subtitle">Ready for today's wellness journey?</p>
      </div>

      <div>
        <h3 className="section-title">Today's Progress</h3>
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{todayStats.meditationMinutes}</span>
            <div className="stat-label">Meditation Minutes</div>
            <div className="stat-target">Goal: {todayStats.targetMeditation}</div>
          </div>
          
          <div className="stat-card">
            <span className="stat-number">{todayStats.workoutMinutes}</span>
            <div className="stat-label">Workout Minutes</div>
            <div className="stat-target">Goal: {todayStats.targetWorkout}</div>
          </div>
          
          <div className="stat-card">
            <span className="stat-number">{todayStats.currentStreak}</span>
            <div className="stat-label">Day Streak</div>
            <div className="stat-target">Keep it up!</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="section-title">Quick Start</h3>
        
        <button className="action-button">
          Start Meditation
        </button>
        
        <button className="action-button secondary">
          Begin Workout
        </button>
      </div>
    </div>
  );
}

