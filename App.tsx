import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SessionsScreen from './src/screens/SessionsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export default function App() {
  const [currentTab, setCurrentTab] = React.useState('Home');

  const renderCurrentScreen = () => {
    switch (currentTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Sessions':
        return <SessionsScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {currentTab === 'Home' ? 'Wellness App' : 
           currentTab === 'Sessions' ? 'Meditation Sessions' : 'Profile'}
        </Text>
      </View>
      
      <View style={styles.content}>
        {renderCurrentScreen()}
      </View>
      
      <View style={styles.tabBar}>
        <Text 
          style={[styles.tabItem, currentTab === 'Home' && styles.activeTab]} 
          onPress={() => setCurrentTab('Home')}
        >
          Home
        </Text>
        <Text 
          style={[styles.tabItem, currentTab === 'Sessions' && styles.activeTab]} 
          onPress={() => setCurrentTab('Sessions')}
        >
          Sessions
        </Text>
        <Text 
          style={[styles.tabItem, currentTab === 'Profile' && styles.activeTab]} 
          onPress={() => setCurrentTab('Profile')}
        >
          Profile
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e2e8f0',
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingVertical: 12,
  },
  tabItem: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#9ca3af',
    paddingVertical: 8,
  },
  activeTab: {
    color: '#6366f1',
    fontWeight: '600',
  },
});