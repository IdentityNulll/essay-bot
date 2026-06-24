import React, { useState, useEffect } from 'react';
import api, { getAuthToken, setAuthToken, clearAuthToken } from './services/api.js';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import EssaysPage from './pages/EssaysPage';
import BroadcastPage from './pages/BroadcastPage';
import MarketingAnalyticsPage from './pages/MarketingAnalyticsPage';
import CampaignManagementPage from './pages/CampaignManagementPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAuthToken());

  const handleLogin = (token) => {
    setAuthToken(token);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    clearAuthToken();
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
      <div className="main">
        <Header title={getPageTitle(currentPage)} onLogout={handleLogout} />
        <div className="content">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'users' && <UsersPage />}
          {currentPage === 'essays' && <EssaysPage />}
          {currentPage === 'broadcast' && <BroadcastPage />}
          {currentPage === 'marketing' && <MarketingAnalyticsPage />}
          {currentPage === 'campaigns' && <CampaignManagementPage />}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ currentPage, onNavigate, onLogout }) {
  return (
    <div className="sidebar">
      <h2>📊 Admin</h2>
      <div
        className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
        onClick={() => onNavigate('dashboard')}
      >
        📈 Dashboard
      </div>
      <div
        className={`nav-item ${currentPage === 'users' ? 'active' : ''}`}
        onClick={() => onNavigate('users')}
      >
        👥 Users
      </div>
      <div
        className={`nav-item ${currentPage === 'essays' ? 'active' : ''}`}
        onClick={() => onNavigate('essays')}
      >
        📝 Essays
      </div>
      <div
        className={`nav-item ${currentPage === 'broadcast' ? 'active' : ''}`}
        onClick={() => onNavigate('broadcast')}
      >
        📢 Broadcast
      </div>
      <div
        className={`nav-item ${currentPage === 'marketing' ? 'active' : ''}`}
        onClick={() => onNavigate('marketing')}
      >
        📊 Marketing Analytics
      </div>
      <div
        className={`nav-item ${currentPage === 'campaigns' ? 'active' : ''}`}
        onClick={() => onNavigate('campaigns')}
      >
        🎯 Campaigns
      </div>
      <div className="nav-item" onClick={onLogout} style={{ marginTop: '20px', background: '#f56565' }}>
        🚪 Logout
      </div>
    </div>
  );
}

function Header({ title, onLogout }) {
  return (
    <div className="header">
      <h1>{title}</h1>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </div>
  );
}

function getPageTitle(page) {
  const titles = {
    dashboard: '📊 Dashboard',
    users: '👥 All Users',
    essays: '📝 All Essays',
    broadcast: '📢 Broadcast Messages',
    marketing: '📊 Marketing Analytics',
    campaigns: '🎯 Campaign Management'
  };
  return titles[page] || 'Dashboard';
}

export default App;
