import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="value">{stats?.totalUsers || 0}</div>
        </div>

        <div className="stat-card">
          <h3>Total Essays Checked</h3>
          <div className="value">{stats?.totalEssays || 0}</div>
        </div>

        <div className="stat-card">
          <h3>Average Credits/User</h3>
          <div className="value">{(stats?.avgCredits || 0).toFixed(1)}</div>
        </div>

        <div className="stat-card">
          <h3>Users with Discount</h3>
          <div className="value">{stats?.usersWithDiscount || 0}</div>
        </div>

        <div className="stat-card">
          <h3>Total Credits in System</h3>
          <div className="value">{stats?.totalCredits || 0}</div>
        </div>
      </div>

      {stats?.bandDistribution && stats.bandDistribution.length > 0 && (
        <div className="section">
          <h2>📊 Band Score Distribution</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '15px'
          }}>
            {stats.bandDistribution.map((item) => (
              <div
                key={item.band}
                style={{
                  background: '#edf2f7',
                  padding: '15px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                  {item.band || 'N/A'}
                </div>
                <div style={{ color: '#718096', fontSize: '0.9rem', marginTop: '5px' }}>
                  {item.count} essays
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section" style={{ textAlign: 'center', padding: '40px' }}>
        <h3 style={{ color: '#667eea', marginBottom: '10px' }}>✅ Dashboard Ready</h3>
        <p style={{ color: '#718096' }}>
          Navigate to Users, Essays, or Broadcast sections to manage your bot
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;
