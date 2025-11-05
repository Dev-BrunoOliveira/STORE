import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    
    <Router>
      <Layout>
        
        <Routes>
          
          <Route path="/" element={<Home />} />
          
          
          {/* O ':slug' é um parâmetro dinâmico para carregar o produto correto */}
          <Route path="/produto/:slug" element={<ProductDetails />} />

          
          <Route path="*" element={
              <div className="text-center py-20">
                  <h1 className="text-5xl font-black text-treze-accent">404</h1>
                  <p className="text-xl mt-4">Página não encontrada. Volte para a <a href="/" className="underline text-treze-accent">Home</a>.</p>
              </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;