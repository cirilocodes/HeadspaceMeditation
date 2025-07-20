import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meditation Sessions</Text>
        <Text style={styles.headerSubtitle}>Choose your practice</Text>
      </View>

      <View style={styles.sessionsContainer}>
        {sessions.map((session) => (
          <TouchableOpacity key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionTitle}>{session.title}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(session.category) }]}>
                <Text style={styles.categoryText}>{session.category}</Text>
              </View>
            </View>
            
            <Text style={styles.sessionDescription}>{session.description}</Text>
            
            <View style={styles.sessionFooter}>
              <Text style={styles.duration}>{session.duration} min</Text>
              <Text style={styles.level}>{session.level}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  sessionsContainer: {
    padding: 20,
  },
  sessionCard: {
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
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionTitle: {
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
  sessionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  sessionFooter: {
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