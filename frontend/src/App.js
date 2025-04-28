import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Đảm bảo bạn đã tạo file CSS

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hàm gửi yêu cầu POST để tạo URL rút gọn
  const createShortUrl = async () => {
    if (!originalUrl) return;

    setLoading(true);
    setError('');

    try {
      // Gửi yêu cầu POST với URL cần rút gọn
      const response = await axios.post('http://localhost:5113/gateway/api/Shortener/create', originalUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Xử lý kết quả trả về
      if (response.data.shortUrl) {
        setShortenedUrl(response.data.shortUrl); // Lưu URL rút gọn
      }
    } catch (err) {
      console.error("Error:", err);
      setError('Error creating shortened URL');
    }

    setLoading(false);
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedUrl);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>URL Shortener</h1>
        
        {/* Input cho URL gốc */}
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter the URL to shorten"
          className="url-input"
        />
        
        {/* Nút gửi yêu cầu tạo URL rút gọn */}
        <button onClick={createShortUrl} disabled={loading} className="submit-btn">
          {loading ? 'Processing...' : 'Create Short URL'}
        </button>

        {/* Hiển thị thông báo lỗi */}
        {error && <p className="error-message">{error}</p>}

        {/* Hiển thị kết quả URL rút gọn */}
        {shortenedUrl && (
          <div className="result">
            <p>Short URL: 
              <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
            </p>
            <button onClick={copyToClipboard} className="copy-btn">Copy To Clipboard</button>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
