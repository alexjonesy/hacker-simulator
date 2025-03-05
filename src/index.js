import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';

export function BinaryRain() {
  const [binaryStrings, setBinaryStrings] = useState([]);

  useEffect(() => {
    const generateBinaryString = () => {
      return Array(20).fill(0).map(() => Math.round(Math.random())).join('');
    };

    const strings = Array(10).fill(0).map((_, i) => ({
      id: i,
      text: generateBinaryString(),
      left: `${Math.random() * 100}%`,
      animationDuration: `${15 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 5}s`
    }));

    setBinaryStrings(strings);
  }, []);

  return (
    <div className="binary-overlay">
      {binaryStrings.map(string => (
        <div
          key={string.id}
          className="binary-rain"
          style={{
            left: string.left,
            animationDuration: string.animationDuration,
            animationDelay: string.animationDelay
          }}
        >
          {string.text}
        </div>
      ))}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);