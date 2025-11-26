import React, { useState } from "react";
import { useCartStore } from "../components/store/cartStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// IMPORTAÇÃO DOS NOVOS COMPONENTES (Para funcionar a renderização condicional)
import CreditCardForm from "../components/CreditCardForm"; 
import PixInstructions from "../components/PixInstructions"; 
import MobileBackButton from '../components/MobileBackButton'; // Se for usado no Checkout

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
    
  // 1. TODOS OS HOOKS E ESTADOS DEVEM FICAR AQUI, NO TOPO:
  const [formData, setFormData] = useState({
    cep: "",
    address: "",
    city: "",
    state: "",
    paymentMethod: "credit_card",
  });

  const [isLoading, setIsLoading] = useState(false);

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shippingCost = 0.0; // Frete grátis para simulação
  const cartTotal = subtotal + shippingCost;

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Seu carrinho está vazio!");
      return;
    }

    if (
      !formData.address ||
      !formData.cep ||
      !formData.city ||
      !formData.state
    ) {
      toast.error("Preencha todos os campos de endereço!");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      clearCart();

      toast.success("Pedido Finalizado com Sucesso!", { icon: "✅" });

      navigate("/");
    }, 1500);
  };

  // 2. FUNÇÃO DE RENDERIZAÇÃO CONDICIONAL
  const renderPaymentComponent = () => {
    const totalFormatted = formatPrice(cartTotal);

    if (formData.paymentMethod === "credit_card") {
      return <CreditCardForm />;
    }
    if (formData.paymentMethod === "pix") {
      return <PixInstructions total={totalFormatted} />;
    }
   
    return <p>Selecione um método de pagamento.</p>;
  };


  // 3. O RETURN PRINCIPAL DEVE FICAR NO FINAL
  return ( 
    <div className="container checkout-page">
        {/* 🛑 Botão de Voltar para Mobile */}
        <MobileBackButton text="Voltar ao Carrinho" /> 
        
        {/* Aqui você pode incluir o bloco <h1 className="page-title">Seu Carrinho</h1> se precisar */}
           {" "}
      <h1 className="text-uppercase-black checkout-title">
                Checkout: Finalizar Compra      {" "}
      </h1>
           {" "}
      <form onSubmit={handleFinalize} className="checkout-layout-grid">
                {/* COLUNA 1: DADOS DE ENVIO E PAGAMENTO */}       {" "}
        <div className="shipping-details-box">
                    <h2 className="section-subtitle">1. Endereço de Envio</h2> 
                 {" "}
          <div className="form-group">
                       {" "}
            <input
              type="text"
              name="cep"
              placeholder="CEP"
              required
              onChange={handleChange}
              className="form-input"
              value={formData.cep}
            />
                       {" "}
            <input
              type="text"
              name="address"
              placeholder="Endereço (Rua, Número)"
              required
              onChange={handleChange}
              className="form-input"
              value={formData.address}
            />
                       {" "}
            <div className="form-row">
                           {" "}
              <input
                type="text"
                name="city"
                placeholder="Cidade"
                required
                onChange={handleChange}
                className="form-input"
                value={formData.city}
              />
                           {" "}
              <input
                type="text"
                name="state"
                placeholder="Estado (Ex: SP)"
                required
                maxLength={2}
                onChange={handleChange}
                className="form-input"
                value={formData.state}
              />
                         {" "}
            </div>
                     {" "}
          </div>
                    <h2 className="section-subtitle">2. Pagamento</h2>         {" "}
          <select
            name="paymentMethod"
            onChange={handleChange}
            className="form-input select-input"
            value={formData.paymentMethod}
          >
                        <option value="credit_card">Cartão de Crédito</option> 
                      <option value="pix">Pix</option>           {" "}
          </select>
          {/* 3. Renderização Condicional do Formulário de Pagamento */}
          <div className="payment-method-details">
            {renderPaymentComponent()}
          </div>
                 {" "}
        </div>
                {/* COLUNA 2: RESUMO DO PEDIDO E BOTÃO */}       {" "}
        <div className="checkout-summary-box">
                    <h2 className="section-subtitle">3. Resumo do Pedido</h2>
          {/* ... (Resumo do pedido e totais) ... */}         {" "}
          <button
            type="submit"
            className="btn-accent btn-finalize"
            disabled={isLoading}
          >
                        {isLoading ? "FINALIZANDO..." : "FINALIZAR COMPRA"}     
               {" "}
          </button>
                   {" "}
          <p className="security-info">🔒 Seus dados estão seguros.</p>       {" "}
        </div>
             {" "}
      </form>
         {" "}
    </div>
  );
};

export default Checkout;