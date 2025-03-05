import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="glitch-overlay"></div>
      <div className="crt-lines"></div>
      
      <div className="content">
        <h1 className="glitch-text" data-text="CYBER ATTACK SIMULATOR">
          CYBER ATTACK SIMULATOR
        </h1>
        <p className="subtitle">// Access granted_</p>
        <button 
          className="start-button" 
          onClick={() => navigate('/terminal')}
        >
          <span className="button-text">START HACKING</span>
          <div className="button-glitch"></div>
        </button>
      </div>

      <div className="matrix-bg"></div>
    </div>
  );
}

export default Home;
