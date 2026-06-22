import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [credits, setCredits] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users', {
        params: { page, search, limit: 20 }
      });
      setUsers(response.data.users);
      setTotalPages(response.data.pagination.pages);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setUserDetails(response.data);
      setSelectedUser(userId);
      setCredits(response.data.user.creditCount.toString());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch user details');
    }
  };

  const updateCredits = async () => {
    try {
      await api.put(`/admin/users/${selectedUser}/credits`, {
        creditCount: parseInt(credits)
      });
      setError('');
      alert('Credits updated successfully');
      fetchUsers();
      setSelectedUser(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update credits');
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="section" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #cbd5e0',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
      </div>

      <div className="section">
        <h2>👥 Users List ({users.length} on this page)</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Telegram ID</th>
                <th>Language</th>
                <th>Credits</th>
                <th>Essays</th>
                <th>Discount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td>@{user.username || 'N/A'}</td>
                  <td>{user.userId}</td>
                  <td>{getLanguageName(user.selectedLanguage)}</td>
                  <td><span className="badge badge-success">{user.creditCount}</span></td>
                  <td>{user.essaysCount || 0}</td>
                  <td>
                    {user.receivedBonusDiscount ? (
                      <span className="badge badge-warning">Yes</span>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                      onClick={() => fetchUserDetails(user.userId)}
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

      {selectedUser && userDetails && (
        <div className="modal open" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>👤 User Details</h2>
              <button className="modal-close" onClick={() => setSelectedUser(null)}>×</button>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Username:</strong> @{userDetails.user.username}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Telegram ID:</strong> {userDetails.user.userId}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Language:</strong> {getLanguageName(userDetails.user.selectedLanguage)}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Essays Count:</strong> {userDetails.stats.essaysCount}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Avg Band Score:</strong> {userDetails.stats.avgBand}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Member Since:</strong> {new Date(userDetails.user.createdAt).toLocaleDateString()}
            </div>

            <hr style={{ margin: '20px 0' }} />

            <h3 style={{ marginBottom: '15px' }}>Update Credits</h3>
            <div className="form-group">
              <label>New Credit Count</label>
              <input
                type="number"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" onClick={updateCredits} style={{ width: '100%' }}>
              Update Credits
            </button>

            {userDetails.essays.length > 0 && (
              <>
                <hr style={{ margin: '20px 0' }} />
                <h3 style={{ marginBottom: '15px' }}>📝 Recent Essays ({userDetails.essays.length})</h3>
                <div style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '10px'
                }}>
                  {userDetails.essays.map((essay, idx) => (
                    <div key={idx} style={{
                      padding: '10px',
                      borderBottom: '1px solid #e2e8f0',
                      marginBottom: '10px'
                    }}>
                      <div><strong>Band:</strong> {essay.finalBand || 'N/A'}</div>
                      <div><strong>Words:</strong> {essay.wordCount}</div>
                      <div><strong>Date:</strong> {new Date(essay.createdAt).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.9rem', color: '#718096', marginTop: '5px' }}>
                        {essay.essayText.substring(0, 100)}...
                      </div>
                    </div>
                  ))}
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

export default UsersPage;
