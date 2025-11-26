import React from "react";
import { useNavigate } from "react-router-dom";

const BACK_ARROW = "←";

interface MobileBackButtonProps {
  text?: string;
}

const MobileBackButton: React.FC<MobileBackButtonProps> = ({ text }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button
      className="mobile-back-button"
      onClick={handleGoBack}
      aria-label="Voltar para a página anterior"
    >
      <span className="back-arrow">{BACK_ARROW}</span>
      {text && <span className="back-text">{text}</span>}
    </button>
  );
};

export default MobileBackButton;
