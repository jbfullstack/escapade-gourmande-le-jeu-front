import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti'; // Assurez-vous d'importer le bon composant
import './App.css';
import PromoBanner from './components/PromoBanner/PromoBanner';
import SpinButton from './components/SpinButton/SpinButton';
import SpinResultMessage from './components/SpinResultMessage/SpinResultMessage';
import html2canvas from 'html2canvas';
import QRCodeDisplay from './components/QRCodeDisplay/QRCodeDisplay';
import ConditionsLine from './components/ConditionsLine/ConditionsLine';

function App() {
  const [voucherId, setVoucherId] = useState(null);
  const [spinResult, setSpinResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [visiblePrize, setVisiblePrize] = useState(null);
  const [serverResponded, setServerResponded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(null);

  const prizes = "Un café, Un dessert du chef, Une salade, Un poulpe frais".split(',');
  // const prizes = process.env.REACT_APP_PRIZE_LIST.split(',');
  const SERVER_URL = "https://escapade-gourmande-le-jeu-back.vercel.app/turn-the-wheel";
  // const SERVER_URL = "http://127.0.0.1:3000/turn-the-wheel";
  // const SERVER_URL = process.env.REACT_APP_NESTJS_SERVER_URL;
  

  const confettiEffectDuration = 5000;
  

  useEffect(() => {
    if (!spinning) {   
      setAnimationIndex(0);
      setVisiblePrize(null);
    } else {
      const updatePrizeDisplay = (prevIndex) => {
        if (prevIndex < prizes.length) {
          setVisiblePrize(prizes[prevIndex]);
          return prevIndex + 1;
        } else {
          handleAnimationEnd();
          return 0; // No increment after reaching the end
        }
      };

      const handleAnimationEnd = () => {
        clearInterval(interval);
        setSpinning(false);
        setCurrentDateTime(new Date());    
      };

      const interval = setInterval(() => {
        setAnimationIndex(updatePrizeDisplay);
      }, 1000);
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
    setVoucherId(null);
    try {
      const response = await axios.get(SERVER_URL);
      const result = response.data.generatedNumber;
      const voucherId = response.data.voucherId;
      setSpinResult(result);      
      if (result > -1) {
        setVoucherId(voucherId);
        const timeout = setTimeout(() => {
        setShowConfetti(true);
        clearTimeout(timeout);
        }, confettiEffectDuration);
      }
      setServerResponded(true);
    } catch (error) {
      console.error('Error spinning the wheel:', error);
    }
  };

  const downloadVoucher = () => {   
    setShowConfetti(false); 
    // timeout to remove confetti on screen
    setTimeout(() => { 
      const element = document.getElementById('Voucher'); 
    
      html2canvas(element).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = `escapade-gourmande-voucher-${new Date().toUTCString()}.png`;
        link.click();
      });
    }, 200);
  };

  return (
    <div className="App" id='Voucher'>   

   
      { showConfetti && ( <Confetti /> )}
      <PromoBanner/>
          
      {spinning && spinResult !== -1 ? (
        <figure>
          <figcaption>Traitement en cours...</figcaption>
          {visiblePrize && (
            <div key={animationIndex} className="PrizeAnimation">
              {visiblePrize}
            </div>
          )} 
        </figure>
      ) : (

        <section>
          {spinResult === null ? (
            <SpinButton onClick={spinWheel} isDisabled={serverResponded} />
          ) : (
            <article>                            
              <SpinResultMessage result={spinResult} prizes={prizes}/> 
              {spinResult > -1 && (
                <aside>
                  <button onClick={downloadVoucher}>Télécharger le bon cadeau</button>
                  <br/>
                  <ConditionsLine display={!spinning} />
                  <time className='dateTime'>{currentDateTime.toLocaleString()}</time>
                  <QRCodeDisplay dateTime={currentDateTime} prize={prizes[spinResult]} voucherId={voucherId}/>                  
                </aside>
              )}               
            </article>
          )}         
        </section> 
      )}      
    </div>
  );
}

export default App;
