import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p className="spinner-text">Carregando...</p>
    </div>
  );
};

export default Spinner;
