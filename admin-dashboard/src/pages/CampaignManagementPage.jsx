import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

function CampaignManagementPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    campaignName: '',
    cost: '',
    source: 'facebook',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/marketing/campaigns');
      setCampaigns(response.data.campaigns);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/marketing/campaigns/${editingId}`, formData);
      } else {
        await api.post('/admin/marketing/campaigns', formData);
      }
      setFormData({ campaignName: '', cost: '', source: 'facebook', startDate: '', endDate: '' });
      setEditingId(null);
      setShowForm(false);
      fetchCampaigns();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save campaign');
    }
  };

  const handleEdit = (campaign) => {
    setFormData({
      campaignName: campaign.campaignName,
      cost: campaign.cost,
      source: campaign.source,
      startDate: campaign.startDate?.split('T')[0] || '',
      endDate: campaign.endDate?.split('T')[0] || ''
    });
    setEditingId(campaign.campaignId);
    setShowForm(true);
  };

  const handleDelete = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await api.delete(`/admin/marketing/campaigns/${campaignId}`);
        fetchCampaigns();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete campaign');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ campaignName: '', cost: '', source: 'facebook', startDate: '', endDate: '' });
  };

  if (loading && campaigns.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading campaigns...</p>
      </div>
    );
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          {showForm ? '✕ Cancel' : '+ New Campaign'}
        </button>
      </div>

      {showForm && (
        <div className="section" style={{ marginBottom: '30px' }}>
          <h3>{editingId ? 'Edit Campaign' : 'Create New Campaign'}</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label>Campaign Name *</label>
              <input
                type="text"
                value={formData.campaignName}
                onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                required
                style={{ marginTop: '5px', padding: '8px', width: '100%', boxSizing: 'border-box' }}
                placeholder="e.g., Facebook Q1 2024"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Cost (UZS) *</label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                required
                style={{ marginTop: '5px', padding: '8px', width: '100%', boxSizing: 'border-box' }}
                placeholder="0"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Source *</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                style={{ marginTop: '5px', padding: '8px', width: '100%', boxSizing: 'border-box' }}
              >
                <option value="facebook">Facebook</option>
                <option value="google">Google</option>
                <option value="telegram">Telegram</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="organic">Organic</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                style={{ marginTop: '5px', padding: '8px', width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                style={{ marginTop: '5px', padding: '8px', width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  background: '#48bb78',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {editingId ? 'Update Campaign' : 'Create Campaign'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '10px 20px',
                  background: '#cbd5e0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="section">
        <h2>📢 All Campaigns</h2>
        {campaigns.length === 0 ? (
          <p style={{ color: '#718096', marginTop: '20px' }}>No campaigns yet. Create one to get started!</p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#edf2f7' }}>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #cbd5e0' }}>Campaign Name</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #cbd5e0' }}>Source</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #cbd5e0' }}>Cost</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #cbd5e0' }}>Start Date</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #cbd5e0' }}>End Date</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #cbd5e0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px' }}>{campaign.campaignName}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <span style={{
                        background: '#edf2f7',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.85rem'
                      }}>
                        {campaign.source}
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {campaign.cost.toLocaleString()} UZS
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {new Date(campaign.startDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : '-'}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(campaign)}
                        style={{
                          padding: '5px 10px',
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(campaign.campaignId)}
                        style={{
                          padding: '5px 10px',
                          background: '#f56565',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignManagementPage;
