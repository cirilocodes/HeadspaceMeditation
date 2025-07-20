import React, { useState, useEffect } from 'react';
import { Home, Play, User, Calendar, Clock, Star, Award, Settings, Bell, ChevronRight } from 'lucide-react';
import HomeScreen from './screens/HomeScreen';
import SessionsScreen from './screens/SessionsScreen';
import ProfileScreen from './screens/ProfileScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('Home');

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
    <div className="mobile-app">
      <div className="mobile-header">
        <h1 className="header-title">
          {currentTab === 'Home' ? 'Wellness' : 
           currentTab === 'Sessions' ? 'Meditations' : 'Profile'}
        </h1>
        <button className="header-action">
          <Bell size={20} />
        </button>
      </div>
      
      <div className="mobile-content">
        {renderCurrentScreen()}
      </div>
      
      <div className="mobile-tab-bar">
        <button 
          className={`tab-item ${currentTab === 'Home' ? 'active' : ''}`}
          onClick={() => setCurrentTab('Home')}
        >
          <Home size={20} />
          <span>Home</span>
        </button>
        <button 
          className={`tab-item ${currentTab === 'Sessions' ? 'active' : ''}`}
          onClick={() => setCurrentTab('Sessions')}
        >
          <Play size={20} />
          <span>Sessions</span>
        </button>
        <button 
          className={`tab-item ${currentTab === 'Profile' ? 'active' : ''}`}
          onClick={() => setCurrentTab('Profile')}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
}