import React, { useState } from 'react';
import { Play, Clock, Star, Filter, Search } from 'lucide-react';

export default function SessionsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All', color: '#6366f1' },
    { id: 'focus', name: 'Focus', color: '#3b82f6' },
    { id: 'stress', name: 'Stress Relief', color: '#10b981' },
    { id: 'sleep', name: 'Sleep', color: '#8b5cf6' },
    { id: 'mindfulness', name: 'Mindfulness', color: '#f59e0b' },
  ];

  const sessions = [
    {
      id: '1',
      title: 'Morning Mindfulness',
      description: 'Start your day with gentle awareness and intentional breathing',
      duration: 10,
      category: 'mindfulness',
      level: 'beginner',
      rating: 4.8,
      plays: 1250,
      instructor: 'Sarah Chen'
    },
    {
      id: '2',
      title: 'Stress Relief Flow',
      description: 'Release tension and find your center through guided relaxation',
      duration: 15,
      category: 'stress',
      level: 'intermediate',
      rating: 4.9,
      plays: 980,
      instructor: 'Marcus Johnson'
    },
    {
      id: '3',
      title: 'Deep Sleep Journey',
      description: 'Peaceful transition to restful sleep with body scan meditation',
      duration: 25,
      category: 'sleep',
      level: 'beginner',
      rating: 4.7,
      plays: 2100,
      instructor: 'Luna Williams'
    },
    {
      id: '4',
      title: 'Laser Focus',
      description: 'Sharpen concentration and mental clarity for peak performance',
      duration: 12,
      category: 'focus',
      level: 'advanced',
      rating: 4.6,
      plays: 750,
      instructor: 'David Kim'
    },
    {
      id: '5',
      title: 'Anxiety Release',
      description: 'Gentle techniques to calm racing thoughts and worries',
      duration: 18,
      category: 'stress',
      level: 'beginner',
      rating: 4.8,
      plays: 1400,
      instructor: 'Emma Rodriguez'
    },
    {
      id: '6',
      title: 'Present Moment',
      description: 'Cultivate awareness of the here and now',
      duration: 8,
      category: 'mindfulness',
      level: 'beginner',
      rating: 4.5,
      plays: 890,
      instructor: 'Alex Thompson'
    }
  ];

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : '#6b7280';
  };

  const filteredSessions = sessions.filter(session => {
    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="screen">
      <div className="search-section">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search sessions, instructors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="categories-section">
        <div className="categories-scroll">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              style={{ 
                backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                borderColor: category.color 
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="sessions-grid">
        {filteredSessions.map((session) => (
          <div key={session.id} className="modern-session-card">
            <div className="session-image">
              <div 
                className="session-gradient"
                style={{ background: `linear-gradient(135deg, ${getCategoryColor(session.category)}20, ${getCategoryColor(session.category)}40)` }}
              >
                <div className="play-button">
                  <Play size={24} fill="white" />
                </div>
              </div>
            </div>
            
            <div className="session-content">
              <div className="session-meta">
                <span className="session-instructor">{session.instructor}</span>
                <div className="session-rating">
                  <Star size={12} fill="#fbbf24" className="text-yellow-400" />
                  <span>{session.rating}</span>
                </div>
              </div>
              
              <h3 className="session-title">{session.title}</h3>
              <p className="session-description">{session.description}</p>
              
              <div className="session-details">
                <div className="detail-item">
                  <Clock size={14} />
                  <span>{session.duration} min</span>
                </div>
                <div className="detail-item">
                  <div className={`level-badge level-${session.level}`}>
                    {session.level}
                  </div>
                </div>
                <div className="detail-item plays">
                  <span>{session.plays.toLocaleString()} plays</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="empty-state">
          <Search size={48} className="empty-icon" />
          <h3>No sessions found</h3>
          <p>Try adjusting your search or category filters</p>
        </div>
      )}
    </div>
  );
}