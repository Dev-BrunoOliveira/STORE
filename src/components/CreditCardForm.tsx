import React from 'react';

const CreditCardForm: React.FC = () => {
    return (
        <div className="payment-form-box">
            <h3 className="form-title-small">Dados do Cartão</h3>
            <div className="form-group">
                <input type="text" placeholder="Número do Cartão" required className="form-input" maxLength={16} />
                <input type="text" placeholder="Nome Impresso no Cartão" required className="form-input" />
                <div className="form-row">
                    <input type="text" placeholder="Validade (MM/AA)" required className="form-input" maxLength={5} />
                    <input type="text" placeholder="CVV" required className="form-input" maxLength={4} />
                </div>
            </div>
        </div>
    );
};

export default CreditCardForm;