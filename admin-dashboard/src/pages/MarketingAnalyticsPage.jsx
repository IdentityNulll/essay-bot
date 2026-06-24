import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

function MarketingAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [overview, setOverview] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [campaigns, setCampaigns] = useState(null);
  const [referrals, setReferrals] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async (start = '', end = '') => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;

      const [overviewRes, funnelRes, campaignsRes, referralsRes, chartsRes] = await Promise.all([
        api.get('/admin/marketing/overview', { params }),
        api.get('/admin/marketing/funnel', { params }),
        api.get('/admin/marketing/campaigns-metrics', { params }),
        api.get('/admin/marketing/referrals', { params }),
        api.get('/admin/marketing/charts', { params })
      ]);

      setOverview(overviewRes.data);
      setFunnel(funnelRes.data);
      setCampaigns(campaignsRes.data);
      setReferrals(referralsRes.data);
      setChartData(chartsRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchAllData(startDate, endDate);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      {/* Date Range Filter */}
      <div className="section" style={{ marginBottom: '30px' }}>
        <h3>📅 Filter by Date Range</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
          <div>
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ marginLeft: '10px', padding: '8px' }}
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ marginLeft: '10px', padding: '8px' }}
            />
          </div>
          <button
            onClick={handleFilter}
            style={{
              padding: '8px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              alignSelf: 'flex-end'
            }}
          >
            Apply Filter
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>👥 Total Users</h3>
          <div className="value">{overview?.totalUsers || 0}</div>
        </div>

        <div className="stat-card">
          <h3>🆕 New Users</h3>
          <div className="value">{overview?.newUsers || 0}</div>
          <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '5px' }}>
            Today: {overview?.newUsersToday || 0}
          </div>
        </div>

        <div className="stat-card">
          <h3>📝 Essay Checks</h3>
          <div className="value">{overview?.totalEssayChecks || 0}</div>
        </div>

        <div className="stat-card">
          <h3>💰 Total Revenue</h3>
          <div className="value">{(overview?.totalRevenue || 0).toLocaleString()} UZS</div>
        </div>

        <div className="stat-card">
          <h3>🛍️ Purchases</h3>
          <div className="value">{overview?.totalPurchases || 0}</div>
        </div>

        <div className="stat-card">
          <h3>🔗 Referrals</h3>
          <div className="value">{overview?.totalReferrals || 0}</div>
        </div>
      </div>

      {/* Conversion Funnel */}
      {funnel?.stages && (
        <div className="section">
          <h2>📊 Conversion Funnel</h2>
          <div style={{ marginTop: '20px' }}>
            {funnel.stages.map((stage, index) => {
              const maxWidth = Math.max(...funnel.stages.map(s => s.count));
              const width = maxWidth > 0 ? (stage.count / maxWidth * 100) : 0;

              return (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold' }}>{stage.name}</span>
                    <span style={{ color: '#667eea', fontWeight: 'bold' }}>
                      {stage.count} users | {stage.conversion}% conversion | {stage.dropoff}% drop-off
                    </span>
                  </div>
                  <div
                    style={{
                      background: '#edf2f7',
                      borderRadius: '4px',
                      height: '30px',
                      width: '100%',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        background: '#667eea',
                        height: '100%',
                        width: `${width}%`,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '10px',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {width > 15 && <span>{stage.count}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts */}
      {chartData && (
        <div className="section">
          <h2>📈 Performance Trends</h2>

          <div style={{ marginTop: '30px', marginBottom: '40px' }}>
            <h3>Daily New Users</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.dailyNewUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#667eea"
                  name="New Users"
                  dot={{ fill: '#667eea' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3>Daily Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()} UZS`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#48bb78"
                  name="Revenue (UZS)"
                  dot={{ fill: '#48bb78' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3>Daily Purchases</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.dailyPurchases}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Purchases" fill="#f6ad55" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3>Daily Essay Checks</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.dailyEssayChecks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ed64a6"
                  name="Essay Checks"
                  dot={{ fill: '#ed64a6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Campaign Metrics */}
      {campaigns?.campaigns && campaigns.campaigns.length > 0 && (
        <div className="section">
          <h2>📢 Campaign Performance</h2>
          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#edf2f7' }}>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #cbd5e0' }}>Campaign</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #cbd5e0' }}>Users</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #cbd5e0' }}>Cost</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #cbd5e0' }}>Cost/User</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #cbd5e0' }}>Purchases</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #cbd5e0' }}>Revenue</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #cbd5e0' }}>ROI</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.campaigns.map((campaign, idx) => {
                  const roiColor = campaign.roi < 0 ? '#f56565' : '#48bb78';
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px' }}>{campaign.campaignName}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{campaign.usersAcquired}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{campaign.cost.toLocaleString()} UZS</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{campaign.costPerUser} UZS</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{campaign.purchases}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{campaign.revenue.toLocaleString()} UZS</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: roiColor, fontWeight: 'bold' }}>
                        {campaign.roi}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Referral Analytics */}
      {referrals && (
        <div className="section">
          <h2>🔗 Referral Analytics</h2>
          <div className="stats-grid" style={{ marginBottom: '30px' }}>
            <div className="stat-card">
              <h3>Links Generated</h3>
              <div className="value">{referrals.totalLinksGenerated}</div>
            </div>
            <div className="stat-card">
              <h3>Successful Referrals</h3>
              <div className="value">{referrals.successfulReferrals}</div>
            </div>
            <div className="stat-card">
              <h3>Conversion Rate</h3>
              <div className="value">{referrals.referralConversionRate}%</div>
            </div>
          </div>

          {referrals.topReferrers && referrals.topReferrers.length > 0 && (
            <div>
              <h3>🏆 Top Referrers</h3>
              <div style={{ overflowX: 'auto', marginTop: '15px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#edf2f7' }}>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #cbd5e0' }}>User</th>
                      <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #cbd5e0' }}>Referrals</th>
                      <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #cbd5e0' }}>Revenue Generated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.topReferrers.map((referrer, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px' }}>@{referrer.username}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>{referrer.referralCount}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          {referrer.totalRevenue.toLocaleString()} UZS
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MarketingAnalyticsPage;
