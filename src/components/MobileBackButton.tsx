import React from 'react';
import { useNavigate } from 'react-router-dom';

// Ícone de seta para a esquerda (Unicode)
const BACK_ARROW = '←'; 

interface MobileBackButtonProps {
  // Título opcional para o botão (ex: "Voltar para Produtos")
  text?: string; 
}

const MobileBackButton: React.FC<MobileBackButtonProps> = ({ text }) => {
  const navigate = useNavigate();

  // Função para voltar uma página no histórico do navegador
  const handleGoBack = () => {
    navigate(-1); 
  };

  // O componente renderiza um botão que só será visível em mobile
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