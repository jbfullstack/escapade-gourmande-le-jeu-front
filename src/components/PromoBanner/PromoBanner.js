



import React from 'react';
import './PromoBanner.css'
import src from '../../images/ia-taureau.png';


const PromoBanner = () => (
  <div id='promo-banner'>
    <h1 className="title">L'escapade Gourmande</h1>
    <img src={src} alt="Image" className="main-image" />        
  </div>
);

export default PromoBanner;
