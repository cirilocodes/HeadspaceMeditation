import React, { useState } from 'react';
import { User, Award, Settings, Bell, ChevronRight, Edit, Trophy, Calendar, Target } from 'lucide-react';

export default function ProfileScreen() {
  const [userStats] = useState({
    totalMinutes: 1250,
    currentStreak: 7,
    totalSessions: 45,
    favoriteCategory: 'Focus',
    weeklyGoal: 140,
    completedThisWeek: 95,
    rank: 'Mindful Explorer',
    joinDate: 'March 2024'
  });

  const achievements = [
    { 
      id: 1,
      title: '7-Day Streak', 
      description: 'Meditated for 7 consecutive days', 
      completed: true, 
      icon: '🔥',
      points: 50,
      date: '2024-07-15'
    },
    { 
      id: 2,
      title: 'First Session', 
      description: 'Completed your first meditation', 
      completed: true, 
      icon: '🌱',
      points: 25,
      date: '2024-03-10'
    },
    { 
      id: 3,
      title: '100 Minutes', 
      description: 'Accumulated 100 minutes of practice', 
      completed: true, 
      icon: '⏰',
      points: 100,
      date: '2024-06-20'
    },
    { 
      id: 4,
      title: '30-Day Challenge', 
      description: 'Complete 30 days of meditation', 
      completed: false, 
      icon: '🏆',
      points: 200,
      progress: 23
    },
    { 
      id: 5,
      title: 'Early Bird', 
      description: 'Complete 10 morning sessions', 
      completed: true, 
      icon: '🌅',
      points: 75,
      date: '2024-05-15'
    }
  ];

  const settingsItems = [
    { 
      id: 1,
      title: 'Notification Settings', 
      subtitle: 'Manage your reminders',
      icon: Bell,
      action: () => console.log('Open notifications')
    },
    { 
      id: 2,
      title: 'Daily Goals', 
      subtitle: 'Set your meditation targets',
      icon: Target,
      action: () => console.log('Open goals')
    },
    { 
      id: 3,
      title: 'Audio Quality', 
      subtitle: 'Choose playback preferences',
      icon: Settings,
      action: () => console.log('Open audio settings')
    },
    { 
      id: 4,
      title: 'Account Settings', 
      subtitle: 'Update your profile',
      icon: User,
      action: () => console.log('Open account')
    }
  ];

  return (
    <div className="screen">
      <div className="modern-profile-header">
        <div className="profile-background">
          <div className="avatar-container">
            <div className="avatar-large">
              <User size={32} />
            </div>
            <button className="edit-avatar">
              <Edit size={16} />
            </button>
          </div>
          <div className="profile-info">
            <h2 className="user-name">Demo User</h2>
            <p className="user-rank">{userStats.rank}</p>
            <p className="user-details">Member since {userStats.joinDate}</p>
          </div>
        </div>
        
        <div className="weekly-progress">
          <div className="progress-header">
            <span className="progress-label">Weekly Goal</span>
            <span className="progress-numbers">{userStats.completedThisWeek}/{userStats.weeklyGoal} min</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill weekly"
              style={{ width: `${(userStats.completedThisWeek / userStats.weeklyGoal) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="stats-overview">
        <div className="section-header">
          <h3 className="section-title">Your Journey</h3>
          <Trophy size={20} className="text-yellow-500" />
        </div>
        
        <div className="modern-stats-grid">
          <div className="modern-stat-card primary">
            <div className="stat-icon-bg">
              <Calendar size={18} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{userStats.totalMinutes}</span>
              <span className="stat-label">Total Minutes</span>
            </div>
          </div>
          
          <div className="modern-stat-card secondary">
            <div className="stat-icon-bg">
              <Award size={18} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{userStats.currentStreak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </div>
          
          <div className="modern-stat-card accent">
            <div className="stat-icon-bg">
              <Target size={18} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{userStats.totalSessions}</span>
              <span className="stat-label">Sessions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <div className="section-header">
          <h3 className="section-title">Achievements</h3>
          <span className="achievement-count">{achievements.filter(a => a.completed).length}/{achievements.length}</span>
        </div>
        
        {achievements.map((achievement) => (
          <div key={achievement.id} className={`modern-achievement-card ${!achievement.completed ? 'incomplete' : ''}`}>
            <div className="achievement-icon">
              <span className="achievement-emoji">{achievement.icon}</span>
            </div>
            <div className="achievement-content">
              <div className="achievement-header">
                <h4 className="achievement-title">{achievement.title}</h4>
                <span className="achievement-points">+{achievement.points} pts</span>
              </div>
              <p className="achievement-description">{achievement.description}</p>
              {achievement.completed && achievement.date && (
                <span className="achievement-date">Completed {achievement.date}</span>
              )}
              {!achievement.completed && achievement.progress && (
                <div className="achievement-progress">
                  <div className="progress-text">{achievement.progress}/30 days</div>
                  <div className="mini-progress-bar">
                    <div 
                      className="mini-progress-fill"
                      style={{ width: `${(achievement.progress / 30) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className={`achievement-status ${achievement.completed ? 'completed' : 'incomplete'}`}>
              {achievement.completed ? '✓' : '○'}
            </div>
          </div>
        ))}
      </div>

      <div className="settings-section">
        <h3 className="section-title">Settings</h3>
        
        {settingsItems.map((item) => (
          <button key={item.id} className="modern-setting-item" onClick={item.action}>
            <div className="setting-icon">
              <item.icon size={20} />
            </div>
            <div className="setting-content">
              <span className="setting-title">{item.title}</span>
              <span className="setting-subtitle">{item.subtitle}</span>
            </div>
            <ChevronRight size={20} className="setting-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
}

