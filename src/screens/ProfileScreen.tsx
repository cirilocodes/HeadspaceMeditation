import React from 'react';

export default function ProfileScreen() {
  const userStats = {
    totalMinutes: 1250,
    currentStreak: 7,
    totalSessions: 45,
    favoriteCategory: 'Focus',
  };

  const achievements = [
    { title: '7-Day Streak', description: 'Meditated for 7 consecutive days', completed: true },
    { title: 'First Session', description: 'Completed your first meditation', completed: true },
    { title: '100 Minutes', description: 'Accumulated 100 minutes of practice', completed: true },
    { title: '30-Day Challenge', description: 'Complete 30 days of meditation', completed: false },
  ];

  return (
    <div className="screen">
      <div className="profile-header">
        <div className="avatar">
          DU
        </div>
        <h2 className="user-name">Demo User</h2>
        <p className="user-email">demo@example.com</p>
      </div>

      <div>
        <h3 className="section-title">Your Journey</h3>
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{userStats.totalMinutes}</span>
            <div className="stat-label">Total Minutes</div>
          </div>
          
          <div className="stat-card">
            <span className="stat-number">{userStats.currentStreak}</span>
            <div className="stat-label">Current Streak</div>
          </div>
          
          <div className="stat-card">
            <span className="stat-number">{userStats.totalSessions}</span>
            <div className="stat-label">Sessions</div>
          </div>
          
          <div className="stat-card">
            <span className="stat-number">{userStats.favoriteCategory}</span>
            <div className="stat-label">Favorite</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="section-title">Achievements</h3>
        
        {achievements.map((achievement, index) => (
          <div key={index} className={`achievement-card ${!achievement.completed ? 'incomplete' : ''}`}>
            <div className="achievement-content">
              <h4 className="achievement-title">
                {achievement.title}
              </h4>
              <p className="achievement-description">
                {achievement.description}
              </p>
            </div>
            <div className={`achievement-badge ${achievement.completed ? 'completed' : 'incomplete'}`}>
              {achievement.completed ? '✓' : '○'}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="section-title">Settings</h3>
        
        <div className="setting-item">
          <span className="setting-text">Notification Preferences</span>
          <span className="setting-arrow">›</span>
        </div>
        
        <div className="setting-item">
          <span className="setting-text">Audio Quality</span>
          <span className="setting-arrow">›</span>
        </div>
        
        <div className="setting-item">
          <span className="setting-text">Daily Goals</span>
          <span className="setting-arrow">›</span>
        </div>
      </div>
    </div>
  );
}

