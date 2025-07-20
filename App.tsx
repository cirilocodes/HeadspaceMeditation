import React from 'react';
import './src/styles/mobile.css';
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
    <div className="mobile-app">
      <div className="mobile-header">
        <h1 className="header-title">
          {currentTab === 'Home' ? 'Wellness App' : 
           currentTab === 'Sessions' ? 'Meditation Sessions' : 'Profile'}
        </h1>
      </div>
      
      <div className="mobile-content">
        {renderCurrentScreen()}
      </div>
      
      <div className="mobile-tab-bar">
        <button 
          className={`tab-item ${currentTab === 'Home' ? 'active' : ''}`}
          onClick={() => setCurrentTab('Home')}
        >
          Home
        </button>
        <button 
          className={`tab-item ${currentTab === 'Sessions' ? 'active' : ''}`}
          onClick={() => setCurrentTab('Sessions')}
        >
          Sessions
        </button>
        <button 
          className={`tab-item ${currentTab === 'Profile' ? 'active' : ''}`}
          onClick={() => setCurrentTab('Profile')}
        >
          Profile
        </button>
      </div>
    </div>
  );
}

