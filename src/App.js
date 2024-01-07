import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti'; // Assurez-vous d'importer le bon composant
import './App.css';
import wheelImage from './taureau.jpeg';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode.react';

function App() {
  const [spinResult, setSpinResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [visiblePrize, setVisiblePrize] = useState(null);
  const [serverResponded, setServerResponded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(null);
  const prizes = ['Un café', 'Un dessert du chef', 'Une salade', 'Un poulpe frais'];
  // const SERVER_URL = 'http://127.0.0.1:3000/turn-the-wheel';
  const SERVER_URL = 'https://escapade-gourmande-le-jeu-back.vercel.app/turn-the-wheel';
  

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
            if ( spinResult >= 0) {
              setCurrentDateTime(new Date())
              setShowConfetti(true)
            }
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

  const handleCaptureScreen = () => {   
    setShowConfetti(false); 
    // timeout to remove confetti on screen
    setTimeout(() => { 
      const element = document.getElementById('App'); // Replace 'capture' with the ID of the element you want to capture
    
      html2canvas(element).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = `escapade-gourmande-bon-cadeau-${new Date().toUTCString()}.png`;
        link.click();
      });
    }, 200);
  };

  return (
    <div className="App" id='App'>
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

          {spinResult !== null && spinResult > -1 && currentDateTime !== null && (            
            <p className='dateTime'>
             {currentDateTime.toLocaleString()}
            </p>
          )}

          {spinResult !== null && spinResult > -1 && (
            <div>
              <QRCode id='qr-code' value={currentDateTime.toUTCString() + ' - ' + prizes[spinResult]} />
              <span dangerouslySetInnerHTML={{ __html: `</br>` }} />
              <button onClick={handleCaptureScreen}>Télécharger le bon cadeau</button>
            </div>
          )}


          {/* Effet confetti */}
          {spinResult !== null && spinResult > -1 && showConfetti && <Confetti />}
        </div>
        
      )}
    </div>
  );
}

export default App;
