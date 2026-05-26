import React from 'react';

const PixInstructions: React.FC<{ total: string }> = ({ total }) => {
    return (
        <div className="payment-form-box pix-box">
            <h3 className="form-title-small">Pague com PIX</h3>
            <p>Escaneie o QR Code abaixo para pagar o total de <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>{total}</span>.</p>
            
            <div className="pix-qr-code">
                <img src="./img/pix.jpg" alt="QR Code PIX" />
            </div>
            
            <p className="pix-timeout">A chave expira em 30 minutos.</p>
        </div>
    );
};

export default PixInstructions;