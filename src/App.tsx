import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Lancamentos from "./pages/Lancamentos";
import Hiphop from "./pages/Hiphop";
import Camisetas from "./pages/Camisetas";
import Sobre from "./pages/Sobre";
import ProductDetails from "./pages/ProductDetails";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Cart from "./components/Cart";
import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lancamentos" element={<Lancamentos />} />
          <Route path="/camisetas" element={<Camisetas />} />
          <Route path="/hiphop" element={<Hiphop />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/cadastro" element={<Signup />} />
          <Route path="/produto/:slug" element={<ProductDetails />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/cadastro" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Rota 404 */}
          <Route
            path="*"
            element={
              <div
                className="container"
                style={{
                  textAlign: "center",
                  padding: "100px 0",
                  color: "var(--color-text-light)",
                }}
              >
                <h1
                  className="text-uppercase-black"
                  style={{ fontSize: "4rem", color: "var(--color-accent)" }}
                >
                  404
                </h1>
                <p style={{ fontSize: "1.25rem", marginTop: "1rem" }}>
                  Página não encontrada. Volte para a
                  <Link
                    to="/"
                    style={{
                      color: "var(--color-accent)",
                      textDecoration: "underline",
                      marginLeft: "5px",
                    }}
                  >
                    Home
                  </Link>
                  .
                </p>
              </div>
            }
          />
        </Routes>
      </Layout>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "var(--color-accent)",
            color: "var(--color-black)",
            fontWeight: "bold",
          },
        }}
      />
    </Router>
  );
}

export default App;
