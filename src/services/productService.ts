import { Product } from "../types/Product";

interface ProductDetailsData extends Product {
  description: string;
  colors: string[];
  sizes: string[];
  category: string[];
}

const FULL_CATALOG: ProductDetailsData[] = [
  {
    id: 1,
    name: "Camiseta 2PAC Classic",
    price: 99.9,
    oldPrice: 119.9,
    imageUrl: "/img/2PAC PEITA.jpg",
    slug: "camiseta-2pac",
    description:
      "Camiseta 100% algodão com estampa serigráfica de alta qualidade. Perfeita para o estilo Hiphop.",
    colors: ["Preto", "Branco"],
    sizes: ["P", "M", "G", "GG"],
    category: ["hiphop", "camisetas"],
  },
  {
    id: 2,
    name: "Camiseta Fresh Prince",
    price: 119.9,
    imageUrl: "/img/WILL PEITA.jpg",
    slug: "camiseta-will",
    description:
      "Design exclusivo Fresh Prince, modelagem oversized. Algodão fio 30.",
    colors: ["Branco", "Roxo"],
    sizes: ["P", "M", "G", "GG"],
    category: ["hiphop", "camisetas"],
  },
  {
    id: 3,
    name: "Camiseta Michael Jordan",
    price: 119.9,
    imageUrl: "/img/JORDAN PEITA.jpg",
    slug: "camiseta-jordan",
    description:
      "Camiseta em homenagem ao GOAT do basquete, estampa vibrante e durável.",
    colors: ["Vermelho", "Preto"],
    sizes: ["P", "M", "G", "GG"],
    category: ["cultura negra", "camisetas"],
  },
  {
    id: 4,
    name: "Camiseta Leblon James",
    price: 119.9,
    imageUrl: "/img/LEBLON PEITA.jpg",
    slug: "camiseta-leblon",
    description:
      "Peça de lançamento com arte conceitual urbana. Edição limitada.",
    colors: ["Preto", "Cinza"],
    sizes: ["P", "M", "G", "GG"],
    category: ["cultura negra", "camisetas"],
  },
  {
    id: 5,
    name: "Camiseta Tyler The Creator",
    price: 119.9,
    imageUrl: "/img/TYLER PEITA.jpg",
    slug: "tyler-the-creator",
    description: "Black edition Tyler The Creator, estilo único e autêntico.",
    colors: ["Preto", "Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
  },
  {
    id: 6,
    name: "Camiseta Travis Scott",
    price: 169.9,
    imageUrl: "/img/TRAVIS PEITA.jpg",
    slug: "travis-scott",
    description:
      "Estampa exclusiva Travis Scott, tecido premium e conforto garantido.",
    colors: ["Cinza"],
    sizes: ["M", "G"],
    category: ["lancamentos", "hiphop", "camisetas"],
  },
];

/**
 * Simula a busca de produtos em uma API com um pequeno delay, permitindo filtro.
 */
export const fetchProducts = (
  count: number = FULL_CATALOG.length,
  categorySlug?: string
): Promise<ProductDetailsData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredProducts = FULL_CATALOG;

      if (categorySlug === "mais-vendidos") {
        filteredProducts = FULL_CATALOG.slice(0, 4);
      } else if (categorySlug && categorySlug !== "todos") {
        // CORREÇÃO DO FILTRO: Usar .some() para verificar se o array de categorias INCLUI o slug
        filteredProducts = FULL_CATALOG.filter((p) =>
          p.category.some((cat) => cat === categorySlug)
        );
      }

      resolve(filteredProducts.slice(0, count));
    }, 500);
  });
};

/**
 * Busca um único produto pelo slug.
 */
export const getProductBySlug = (
  slug: string
): Promise<ProductDetailsData | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Busca o produto no catálogo completo
      const product = FULL_CATALOG.find((p) => p.slug === slug);
      resolve(product);
    }, 300);
  });
};

// Exporta o ProductDetailsData como Product para ser usado na tipagem em ProductDetails.tsx
export type { ProductDetailsData as Product };
