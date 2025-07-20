import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(category) }]}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      </View>
      
      <Text style={styles.description}>{description}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.duration}>{duration} min</Text>
        <Text style={styles.level}>{level}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
  },
  level: {
    fontSize: 14,
    color: '#9ca3af',
    textTransform: 'capitalize',
  },
});