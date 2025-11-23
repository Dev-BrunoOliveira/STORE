// src/components/TopBar.tsx

import React from 'react';

const messages = [
    { text: '🚚 FRETE GRÁTIS em compras acima de R$ 300,00!' },
    { text: '💳 Parcele em até 6x sem juros nos cartões de crédito.' },
    { text: '💰 5% DE CASHBACK EM TODAS AS COMPRAS!' },
];

const allMessages = [...messages, ...messages]; 

const TopBar: React.FC = () => {
    return (
        <div className="top-bar-main">
            <div className="container">

                {/* 1. VISUAL DESKTOP (Estatico e Centralizado) */}
                <div className="top-bar-content-desktop">
                    <span className="top-bar-message-static">{messages[0].text}</span>
                    <span className="top-bar-separator">|</span>
                    <span className="top-bar-message-static">{messages[1].text}</span>
                </div>

                {/* 2. VISUAL MOBILE (Ticker Animado) */}
                <div className="top-bar-ticker-wrapper">
                    <div className="top-bar-ticker-content">
                        {allMessages.map((msg, index) => (
                            <div key={index} className="top-bar-item">
                                <span className="top-bar-message-ticker">{msg.text}</span>
                                <span className="top-bar-separator-ticker">|</span> 
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TopBar;