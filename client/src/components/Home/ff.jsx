import React from 'react';
import './ff.css';

const ShoeCard = () => {
  return (
    <div className="container">
      <div className="card">
        <div className="imgBx">
          <img src="https://assets.codepen.io/4164355/shoes.png" alt="Nike Shoes" />
        </div>
        <div className="contentBx">
          <h2>Nike Shoes</h2>
          <div className="size">
            <h3>Size :</h3>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
          </div>
          <div className="color">
            <h3>Color :</h3>
            <span className="color1"></span>
            <span className="color2"></span>
            <span className="color3"></span>
          </div>
          <a href="#">Buy Now</a>
        </div>
      </div>
    </div>
  );
};

export default ShoeCard;
