import React from "react";

const BingoGame = () => {
  return (
    <div className="bingo-container">
      <h1>Cricket Bingo</h1>
      <div className="bingo-grid">
        {Array.from({ length: 16 }).map((_, index) => (
          <div key={index} className="bingo-card">Slot {index + 1}</div>
        ))}
      </div>
      <button className="bingo-button">Play</button>
    </div>
  );
};

export default BingoGame;
