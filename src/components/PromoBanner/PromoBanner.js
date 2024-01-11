



import React from 'react';
import './PromoBanner.css'
import src from '../../images/ia-taureau.png';


const PromoBanner = ({ showHeadline }) => (
  <div id='promo-banner'>
    <h1 className="title">L'escapade Gourmande</h1>
    <img src={src} alt="Image" className="main-image" />
    {showHeadline && (
      <h3 className="head-line">
      Remportez un lot, <br /> à récupérer lors de <br /> * votre prochaine visite *
    </h3> 
    )}       
  </div>
);

export default PromoBanner;
