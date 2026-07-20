import { Product } from "../types/Product";
import { API_BASE } from "../config/api";

interface ProductDetailsData extends Product {
  description: string;
  colors: string[];
  sizes: string[];
  category: string[];
}

/**
 * Busca a lista de produtos da API, permitindo filtro.
 */
export const fetchProducts = async (
  count?: number,
  categorySlug?: string
): Promise<ProductDetailsData[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/produtos`);
    if (!response.ok) throw new Error("Erro ao buscar produtos");
    let products: ProductDetailsData[] = await response.json();

    if (categorySlug === "mais-vendidos") {
      // Retorna os 4 primeiros produtos se "mais-vendidos" for passado
      products = products.slice(0, 4);
    } else if (categorySlug && categorySlug !== "todos") {
      // Filtra por categoria
      products = products.filter((p) =>
        p.category.some((cat) => cat === categorySlug)
      );
    }

    if (count) {
      products = products.slice(0, count);
    }

    return products;
  } catch (error) {
    console.error("fetchProducts error:", error);
    return [];
  }
};

/**
 * Busca um produto específico pelo slug.
 */
export const getProductBySlug = async (
  slug: string
): Promise<ProductDetailsData | undefined> => {
  try {
    const response = await fetch(`${API_BASE}/api/produtos/${slug}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error("Erro ao buscar produto por slug");
    }
    const product: ProductDetailsData = await response.json();
    return product;
  } catch (error) {
    console.error("getProductBySlug error:", error);
    return undefined;
  }
};

// Exporta o ProductDetailsData como Product para ser usado na tipagem em ProductDetails.tsx
export type { ProductDetailsData as Product };
