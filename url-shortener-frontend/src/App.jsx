import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleShorten = async () => {
    setError(null); // Reset lỗi trước khi gửi request

    try {
      const response = await fetch("http://localhost:5112/api/Shortener", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ OriginalUrl: originalUrl }) // Đúng tên biến
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi rút gọn URL!");
      }

      const data = await response.json();
      setShortUrl(data.shortUrl); // Cập nhật lại key
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">URL Shortener</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Nhập URL cần rút gọn"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleShorten}>
          Rút gọn
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {shortUrl && (
        <div className="alert alert-success">
          <strong>URL rút gọn:</strong>{" "}
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
