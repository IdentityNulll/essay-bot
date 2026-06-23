import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

function EssaysPage() {
  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEssay, setSelectedEssay] = useState(null);
  const [essayDetails, setEssayDetails] = useState(null);
  const [minBand, setMinBand] = useState('');
  const [maxBand, setMaxBand] = useState('');

  useEffect(() => {
    fetchEssays();
  }, [page, minBand, maxBand]);

  const fetchEssays = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/essays', {
        params: {
          page,
          limit: 20,
          minBand: minBand || undefined,
          maxBand: maxBand || undefined
        }
      });
      setEssays(response.data.essays);
      setTotalPages(response.data.pagination.pages);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch essays');
    } finally {
      setLoading(false);
    }
  };

  const fetchEssayDetails = async (essayId) => {
    try {
      const response = await api.get(`/admin/essays/${essayId}`);
      setEssayDetails(response.data);
      setSelectedEssay(essayId);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch essay details');
    }
  };

  if (loading && essays.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading essays...</p>
      </div>
    );
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="section" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>🔍 Filter by Band Score</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr auto',
          gap: '10px'
        }}>
          <input
            type="number"
            placeholder="Min Band"
            min="0"
            max="9"
            value={minBand}
            onChange={(e) => {
              setMinBand(e.target.value);
              setPage(1);
            }}
          />
          <input
            type="number"
            placeholder="Max Band"
            min="0"
            max="9"
            value={maxBand}
            onChange={(e) => {
              setMaxBand(e.target.value);
              setPage(1);
            }}
          />
          <button
            className="btn btn-secondary"
            onClick={() => {
              setMinBand('');
              setMaxBand('');
              setPage(1);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="section">
        <h2>📝 Essays ({essays.length} on this page)</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Band Score</th>
                <th>Word Count</th>
                <th>Language</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {essays.map((essay) => (
                <tr key={essay._id}>
                  <td>@{essay.username || 'Unknown'}</td>
                  <td>
                    <span className={`badge badge-${getBandColor(essay.finalBand)}`}>
                      {essay.finalBand || 'Pending'}
                    </span>
                  </td>
                  <td>{essay.wordCount}</td>
                  <td>{getLanguageName(essay.language)}</td>
                  <td>{new Date(essay.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                      onClick={() => fetchEssayDetails(essay._id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={page === p ? 'active' : ''}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {selectedEssay && essayDetails && (
        <div className="modal open" onClick={() => setSelectedEssay(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📄 Essay Details</h2>
              <button className="modal-close" onClick={() => setSelectedEssay(null)}>×</button>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>User ID:</strong> {essayDetails.essay.userId}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Username:</strong> @{essayDetails.user.username || 'N/A'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Band Score:</strong> <span className="badge badge-success">{essayDetails.essay.finalBand || 'N/A'}</span>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Word Count:</strong> {essayDetails.essay.wordCount}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Date:</strong> {new Date(essayDetails.essay.createdAt).toLocaleString()}
            </div>

            <hr style={{ margin: '20px 0' }} />

            <h3 style={{ marginBottom: '10px' }}>Question</h3>
            <div style={{
              background: '#f7fafc',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px',
              minHeight: '40px',
              maxHeight: '100px',
              overflowY: 'auto',
              color: '#2d3748'
            }}>
              {essayDetails.essay.questionText || '(Question not provided)'}
            </div>

            <h3 style={{ marginBottom: '10px' }}>Essay Text</h3>
            <div style={{
              background: '#f7fafc',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px',
              minHeight: '100px',
              maxHeight: '200px',
              overflowY: 'auto',
              color: '#2d3748',
              whiteSpace: 'pre-wrap'
            }}>
              {essayDetails.essay.essayText}
            </div>

            {essayDetails.essay.geminiReport && (
              <>
                <h3 style={{ marginBottom: '10px' }}>AI Feedback Report</h3>
                <div style={{
                  background: '#f7fafc',
                  padding: '10px',
                  borderRadius: '6px',
                  minHeight: '100px',
                  maxHeight: '250px',
                  overflowY: 'auto',
                  color: '#2d3748',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  {essayDetails.essay.geminiReport}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getLanguageName(code) {
  const names = { en: '🇬🇧 English', uz: '🇺🇿 O\'zbekcha', ru: '🇷🇺 Русский' };
  return names[code] || 'Unknown';
}

function getBandColor(band) {
  if (band >= 7.5) return 'success';
  if (band >= 6.5) return 'warning';
  return 'danger';
}

export default EssaysPage;
