import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const todayStats = {
    meditationMinutes: 15,
    targetMeditation: 20,
    workoutMinutes: 30,
    targetWorkout: 45,
    currentStreak: 7,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.subtitle}>Ready for today's wellness journey?</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{todayStats.meditationMinutes}</Text>
            <Text style={styles.statLabel}>Meditation Minutes</Text>
            <Text style={styles.statTarget}>Goal: {todayStats.targetMeditation}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{todayStats.workoutMinutes}</Text>
            <Text style={styles.statLabel}>Workout Minutes</Text>
            <Text style={styles.statTarget}>Goal: {todayStats.targetWorkout}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{todayStats.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
            <Text style={styles.statTarget}>Keep it up!</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Start</Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Start Meditation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Begin Workout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: '#6366f1',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366f1',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  statTarget: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 2,
  },
  quickActions: {
    padding: 20,
  },
  actionButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButtonText: {
    color: '#6366f1',
  },
});