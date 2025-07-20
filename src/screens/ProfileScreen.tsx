import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

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
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>DU</Text>
        </View>
        <Text style={styles.userName}>Demo User</Text>
        <Text style={styles.userEmail}>demo@example.com</Text>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Journey</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.totalMinutes}</Text>
            <Text style={styles.statLabel}>Total Minutes</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.totalSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.favoriteCategory}</Text>
            <Text style={styles.statLabel}>Favorite</Text>
          </View>
        </View>
      </View>

      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        
        {achievements.map((achievement, index) => (
          <View key={index} style={[styles.achievementCard, !achievement.completed && styles.incompleteCard]}>
            <View style={styles.achievementContent}>
              <Text style={[styles.achievementTitle, !achievement.completed && styles.incompleteText]}>
                {achievement.title}
              </Text>
              <Text style={[styles.achievementDescription, !achievement.completed && styles.incompleteText]}>
                {achievement.description}
              </Text>
            </View>
            <View style={[styles.achievementBadge, achievement.completed ? styles.completedBadge : styles.incompleteBadge]}>
              <Text style={styles.badgeText}>{achievement.completed ? '✓' : '○'}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notification Preferences</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Audio Quality</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Daily Goals</Text>
          <Text style={styles.settingArrow}>›</Text>
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
  profileHeader: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsSection: {
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
  statItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  achievementsSection: {
    padding: 20,
    paddingTop: 0,
  },
  achievementCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  incompleteCard: {
    backgroundColor: '#f9fafb',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  incompleteText: {
    color: '#9ca3af',
  },
  achievementBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    backgroundColor: '#10b981',
  },
  incompleteBadge: {
    backgroundColor: '#e5e7eb',
  },
  badgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  settingsSection: {
    padding: 20,
    paddingTop: 0,
  },
  settingItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingText: {
    fontSize: 16,
    color: '#1f2937',
  },
  settingArrow: {
    fontSize: 20,
    color: '#9ca3af',
  },
});