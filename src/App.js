import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti'; // Assurez-vous d'importer le bon composant
import './App.css';
import wheelImage from './taureau.jpeg';

function App() {
  const [spinResult, setSpinResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [visiblePrize, setVisiblePrize] = useState(null);
  const [serverResponded, setServerResponded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const prizes = ['Un café', 'Un dessert du chef', 'Une salade', 'Un poulpe frais'];
  const SERVER_URL = 'http://127.0.0.1:3000/turn-the-wheel';

  useEffect(() => {
    if (spinning) {
      setAnimationIndex(0);
      setVisiblePrize(null);
      setShowConfetti(false);
      const interval = setInterval(() => {
        setAnimationIndex((prevIndex) => {
          if (prevIndex < prizes.length) {
            setVisiblePrize(prizes[prevIndex]);
            return prevIndex + 1;
          } else {
            clearInterval(interval);
            setSpinning(false);
            setShowConfetti(spinResult >= 0); 
            return prevIndex;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [spinning]);

  useEffect(() => {
    if (showConfetti) {
      const timeout = setTimeout(() => {
        setShowConfetti(false);
      }, 10000); // 10 secondes
      return () => clearTimeout(timeout);
    }
  }, [showConfetti]);

  const spinWheel = async () => {
    setSpinning(true);
    setSpinResult(null);    
    try {
      const response = await axios.get(SERVER_URL);
      const result = response.data;
      setSpinResult(result);
      setServerResponded(true);
    } catch (error) {
      console.error('Error spinning the wheel:', error);
    }
  };

  return (
    <div className="App">
      <h1>Escapade Gourmande</h1>
      <h3>Participez pour un petit cadeau lors de votre prochaine visite!</h3>
      <img src={wheelImage} alt="Wheel Image" style={{ width: '100%', maxWidth: '400px', margin: '20px 0' }} />
      
      {spinning && spinResult !== -1 ? (
        <div>
          <p>Traitement en cours...</p>
          {/* Animation pour afficher le prix actuel */}
          {visiblePrize && (
            <div key={animationIndex} className="PrizeAnimation">
              {visiblePrize}
            </div>
          )}
        </div>
      ) : (
        <div>
          <button onClick={spinWheel} disabled={serverResponded} className={serverResponded ? 'disabled' : ''}>
            Cliquez pour jouer
          </button>
          {spinResult !== null && (
            <p>
              {spinResult === -1
                ? `Désolée, vous n'êtes pas autorisé à participer plusieurs fois dans la même journée.`
                : <span dangerouslySetInnerHTML={{ __html: `Vous avez remporté : <strong>${prizes[spinResult]}</strong>!` }} />}
            </p>
          )}
          {/* Effet confetti */}
          {showConfetti && <Confetti />}
        </div>
      )}
    </div>
  );
}

export default App;
