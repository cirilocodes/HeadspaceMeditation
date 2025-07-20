import React from 'react';

export default function SessionsScreen() {
  const sessions = [
    {
      id: '1',
      title: 'Morning Mindfulness',
      description: 'Start your day with gentle awareness',
      duration: 10,
      category: 'focus',
      level: 'beginner'
    },
    {
      id: '2',
      title: 'Stress Relief',
      description: 'Release tension and find calm',
      duration: 15,
      category: 'stress',
      level: 'intermediate'
    },
    {
      id: '3',
      title: 'Deep Sleep',
      description: 'Peaceful journey to restful sleep',
      duration: 20,
      category: 'sleep',
      level: 'beginner'
    },
    {
      id: '4',
      title: 'Focus Boost',
      description: 'Enhance concentration and clarity',
      duration: 12,
      category: 'focus',
      level: 'advanced'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'focus': return '#3b82f6';
      case 'stress': return '#10b981';
      case 'sleep': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="screen">
      <div style={{ background: 'white', padding: '20px', marginBottom: '20px', marginTop: '-20px', marginLeft: '-20px', marginRight: '-20px', borderBottom: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>Meditation Sessions</h2>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>Choose your practice</p>
      </div>

      <div>
        {sessions.map((session) => (
          <div key={session.id} className="session-card">
            <div className="session-header">
              <h3 className="session-title">{session.title}</h3>
              <div className="category-badge" style={{ backgroundColor: getCategoryColor(session.category) }}>
                <span>{session.category}</span>
              </div>
            </div>
            
            <p className="session-description">{session.description}</p>
            
            <div className="session-footer">
              <span className="duration">{session.duration} min</span>
              <span className="level">{session.level}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

