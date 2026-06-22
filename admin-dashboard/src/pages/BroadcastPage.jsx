import React, { useState } from 'react';
import api from '../services/api.js';

function BroadcastPage() {
  const [recipientType, setRecipientType] = useState('all');
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('en');
  const [minCredit, setMinCredit] = useState('');
  const [maxCredit, setMaxCredit] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleBroadcast = async () => {
    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const payload = {
        message,
        recipientType
      };

      if (recipientType === 'language') {
        payload.language = language;
      } else if (recipientType === 'creditRange') {
        payload.minCredit = minCredit ? parseInt(minCredit) : 0;
        payload.maxCredit = maxCredit ? parseInt(maxCredit) : 999;
      }

      const response = await api.post('/admin/broadcast', payload);
      setResult(response.data);
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="section">
        <h2>📢 Broadcast Message to Users</h2>

        <div className="form-group">
          <label>Recipient Type</label>
          <select
            value={recipientType}
            onChange={(e) => setRecipientType(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="language">By Language</option>
            <option value="creditRange">By Credit Range</option>
          </select>
        </div>

        {recipientType === 'language' && (
          <div className="form-group">
            <label>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">🇬🇧 English</option>
              <option value="uz">🇺🇿 O'zbekcha</option>
              <option value="ru">🇷🇺 Русский</option>
            </select>
          </div>
        )}

        {recipientType === 'creditRange' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Min Credits</label>
              <input
                type="number"
                value={minCredit}
                onChange={(e) => setMinCredit(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Max Credits</label>
              <input
                type="number"
                value={maxCredit}
                onChange={(e) => setMaxCredit(e.target.value)}
                placeholder="999"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Message Content</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here. Supports HTML formatting: <b>bold</b>, <i>italic</i>, <code>code</code>"
            rows="8"
            style={{ fontFamily: 'monospace' }}
          />
        </div>

        <div style={{
          background: '#f7fafc',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '0.9rem',
          color: '#2d3748'
        }}>
          <strong>📝 Preview:</strong>
          <div style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
            {message || '(empty message)'}
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleBroadcast}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '1rem'
          }}
        >
          {loading ? 'Sending...' : '📤 Send to Users'}
        </button>
      </div>

      {result && (
        <div className="section" style={{ marginTop: '20px' }}>
          <h2>✅ Broadcast Result</h2>
          <div className="success">
            Message sent successfully!
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px'
          }}>
            <div className="stat-card">
              <h3>Successfully Sent</h3>
              <div className="value" style={{ color: '#48bb78' }}>
                {result.sent}
              </div>
            </div>

            <div className="stat-card">
              <h3>Total Recipients</h3>
              <div className="value">
                {result.total}
              </div>
            </div>

            <div className="stat-card">
              <h3>Failed</h3>
              <div className="value" style={{ color: '#f56565' }}>
                {result.failed}
              </div>
            </div>
          </div>

          {result.errors && result.errors.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>❌ Failed Deliveries</h3>
              <div style={{
                background: '#fed7d7',
                padding: '15px',
                borderRadius: '6px',
                maxHeight: '200px',
                overflowY: 'auto',
                fontSize: '0.9rem'
              }}>
                {result.errors.map((err, idx) => (
                  <div key={idx} style={{ marginBottom: '5px' }}>
                    User {err.userId}: {err.error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="section" style={{ marginTop: '20px', background: '#edf2f7' }}>
        <h3 style={{ color: '#667eea', marginBottom: '10px' }}>💡 Tips</h3>
        <ul style={{ color: '#2d3748', lineHeight: '1.6' }}>
          <li>Messages are sent directly to user Telegram chats</li>
          <li>Support HTML formatting: &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;code&gt;code&lt;/code&gt;</li>
          <li>Max message length: ~4000 characters</li>
          <li>Use carefully - avoid spamming users</li>
        </ul>
      </div>
    </div>
  );
}

export default BroadcastPage;
