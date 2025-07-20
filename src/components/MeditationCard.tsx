import React from 'react';

interface MeditationCardProps {
  title: string;
  description: string;
  duration: number;
  category: string;
  level: string;
  onPress?: () => void;
}

export default function MeditationCard({ 
  title, 
  description, 
  duration, 
  category, 
  level, 
  onPress 
}: MeditationCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'focus': return '#3b82f6';
      case 'stress': return '#10b981';
      case 'sleep': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="session-card" onClick={onPress}>
      <div className="session-header">
        <h3 className="session-title">{title}</h3>
        <div className="category-badge" style={{ backgroundColor: getCategoryColor(category) }}>
          <span>{category}</span>
        </div>
      </div>
      
      <p className="session-description">{description}</p>
      
      <div className="session-footer">
        <span className="duration">{duration} min</span>
        <span className="level">{level}</span>
      </div>
    </div>
  );
}

