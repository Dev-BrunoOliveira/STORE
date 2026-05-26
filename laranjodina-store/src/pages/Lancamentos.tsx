import React from "react";
import ProductListing from "../components/ProductListing";

const Lancamentos: React.FC = () => {
  return (
    <ProductListing
      pageTitle="LANÇAMENTOS EXCLUSIVOS"
      categorySlug="lancamentos"
    />
  );
};

export default Lancamentos;
