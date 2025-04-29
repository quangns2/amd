import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [recordCount, setRecordCount] = useState(0);

  
  // Gọi API để lấy lịch sử
  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5113/gateway/api/Shortener/get-all');
      setHistory(response.data);
      setRecordCount(response.data.length);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Gửi yêu cầu rút gọn URL
  const createShortUrl = async () => {
    if (!originalUrl) return;
    if (!originalUrl.startsWith('https://')) {
      setError('URL must start with "https://".');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5113/gateway/api/Shortener/create',
        originalUrl,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.shortUrl) {
        setShortenedUrl(response.data.shortUrl);
        fetchHistory(); // Cập nhật lại lịch sử
      }
    } catch (err) {
      console.error("Error:", err);
      setError('Error creating shortened URL');
    }

    setLoading(false);
  };

  // Hàm xóa URL
  const deleteShortUrl = async (id) => {
    try {
      await axios.delete(`http://localhost:5113/gateway/api/Shortener/delete/${id}`);
      setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));
      alert('URL deleted successfully!');
      fetchHistory();
    } catch (err) {
      console.error('Error deleting URL:', err);
      alert('Failed to delete URL. Please try again.');
    }
  };

  // Copy
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedUrl);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>URL Shortener</h1>

        {/* Input URL */}
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter the URL to shorten"
          className="url-input"
        />

        <button onClick={createShortUrl} disabled={loading} className="submit-btn">
          {loading ? 'Processing...' : 'Create Short URL'}
        </button>

        {error && <p className="error-message">{error}</p>}

        {shortenedUrl && (
          <div className="result">
            <p>Short URL:
              <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
            </p>
            <button onClick={copyToClipboard} className="copy-btn">Copy To Clipboard</button>
          </div>
        )}

        {/* Lịch sử dạng bảng */}
        <div className="history-box">
          <h2>History</h2>
          <p>Total records: {recordCount}</p>
          {history.length > 0 ? (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Original URL</th>
                  <th>Shortened URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <a href={item.originalUrl} target="_blank" rel="noopener noreferrer">
                        {item.originalUrl}
                      </a>
                    </td>
                    <td>
                      <a
                        href={`http://localhost:5112/${item.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        http://localhost:5112/{item.shortCode}
                      </a>
                    </td>
                    <td>
                      <button onClick={() => deleteShortUrl(item.id)} className="delete-btn">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
