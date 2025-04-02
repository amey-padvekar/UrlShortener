import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [userUrls, setUserUrls] = useState([]); // State to hold user's URLs and QR codes

  const token = localStorage.getItem('token');

  // Fetch existing URLs and QR codes when the component mounts
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/auth/get-urls',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserUrls(response.data.urls);
        console.log(response.data.urls);
        console.log(userUrls) // Set the fetched URLs and QR codes
      } catch (error) {
        console.error('Error fetching URLs:', error);
      }
    };

    fetchUrls();
  }, [token]);

  const handleShortenUrl = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/url/generate-short-url',
        { originalURL:originalUrl},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShortenedUrl(response.data.shortenedUrl);
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?data=${response.data.shortenedUrl}&size=150x150`);
    } catch (error) {
      console.error('Error generating short URL:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6">URL Shortener</h1>

        {/* URL Shortening Form */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Enter URL</label>
          <input
            type="url"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          onClick={handleShortenUrl}
        >
          Generate Short URL
        </button>

        {/* Show the shortened URL and QR code */}
        {shortenedUrl && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg text-gray-700">Shortened URL:</h3>
            <p className="text-blue-500 truncate">
              <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
            </p>
          </div>
        )}

        {qrCode && (
          <div className="mt-6 flex justify-center">
            <img src={qrCode} alt="QR Code" />
          </div>
        )}

        {/* Display existing URLs and QR codes */}
        {userUrls.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg text-gray-700">Your Shortened URLs</h3>
            <ul className="list-none mt-4">
              {userUrls.map((url, index) => (
                <li key={index} className="mb-4 p-4 border border-gray-300 rounded-md">
                  <p className="text-blue-500 truncate">
                    <a href={url.shortURL} target="_blank" rel="noopener noreferrer">URL: {url.shortURL}</a>
                  </p>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${url.shortURL}&size=150x150`}
                    alt="QR Code"
                    className="mt-2"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
