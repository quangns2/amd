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
      const response = await axios.post('http://localhost:5112/api/Shortener/create', originalUrl, {
        headers: {
          'Content-Type': 'application/json', // Đảm bảo gửi đúng kiểu JSON
        },
      });

      // Xử lý kết quả trả về
      if (response.data.shortUrl) {
        setShortenedUrl(response.data.shortUrl); // Lưu URL rút gọn
      }
    } catch (err) {
      console.error("Error:", err);
      setError('Lỗi khi tạo URL rút gọn');
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
          placeholder="Nhập URL cần rút gọn"
          className="url-input"
        />
        
        {/* Nút gửi yêu cầu tạo URL rút gọn */}
        <button onClick={createShortUrl} disabled={loading} className="submit-btn">
          {loading ? 'Đang xử lý...' : 'Tạo URL Rút Gọn'}
        </button>

        {/* Hiển thị thông báo lỗi */}
        {error && <p className="error-message">{error}</p>}

        {/* Hiển thị kết quả URL rút gọn */}
        {shortenedUrl && (
          <div className="result">
            <p>URL Rút Gọn: 
              <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
            </p>
            <button onClick={copyToClipboard} className="copy-btn">Sao chép</button>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
