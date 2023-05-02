import { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const OPENAI_API_KEY = '${YOUR_OPENAI_API_KEY}';

  const handlePostRequest = async () => {
    setIsLoading(true);
    setImageUrl(null);
    // Send POST request to endpoint
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        'prompt': `${text} Meme`,
        'n': 1,
        'size': '512x512'
      })
    });
    const data = await response.json();
    // Update state with image URL
    setImageUrl(data.data[0].url);
    setIsLoading(false);
  };

  return (
    <div className="App">
      <h1>Meme Generator</h1>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter a keyword..." />
      <button type="submit" onClick={handlePostRequest}>{isLoading ? 'Sending Data...' : 'Send Data'}</button>
      <div className="image-container">
        <img src={imageUrl} alt="" />
      </div>
    </div>
  );
}

export default App;
