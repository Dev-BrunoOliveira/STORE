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
    price: 119.9,
    imageUrl: "/img/2pac-modelo.jpg", 
    slug: "camiseta-2pac",
    description:
      "Camiseta 100% algodão com estampa serigráfica de alta qualidade. Perfeita para o estilo Hiphop.",
    colors: ["Preto", "Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["hiphop", "camisetas"],
  },
  {
    id: 2,
    name: "Camiseta Fresh Prince",
    price: 119.9,
    imageUrl: "/img/will-modelo.jpg",
    slug: "camiseta-will",
    description:
      "Design exclusivo Fresh Prince, modelagem oversized. Algodão fio 30.",
    colors: ["Preto", "Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["hiphop", "camisetas"],
  },
  {
    id: 3,
    name: "Camiseta Michael Jordan",
    price: 119.9,
    imageUrl: "/img/jordan-modelo.jpg",
    slug: "camiseta-jordan",
    description:
      "Camiseta em homenagem ao GOAT do basquete, estampa vibrante e durável.",
    colors: ["Preto", "Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["cultura negra", "camisetas"],
  },
  {
    id: 4,
    name: "Camiseta Leblon James",
    price: 119.9,
    imageUrl: "/img/leblon-modelo.jpg", 
    slug: "camiseta-leblon",
    description:
      "Peça de lançamento com arte conceitual urbana. Edição limitada.",
    colors: ["Preto"],
    sizes: ["P", "M", "G", "GG"],
    category: ["cultura negra", "camisetas"],
  },
  {
    id: 5,
    name: "Camiseta Tyler The Creator",
    price: 119.9,
    imageUrl: "/img/tyler-modelo.jpg",
    slug: "tyler-the-creator",
    description: "Black edition Tyler The Creator, estilo único e autêntico.",
    colors: ["Preto", "Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas", "hiphop"],
  },
  {
    id: 6,
    name: "Camiseta Travis Scott",
    price: 119.9,
    imageUrl: "/img/travis-modelo.jpg",
    slug: "travis-scott",
    description:
      "Estampa exclusiva Travis Scott, tecido premium e conforto garantido.",
    colors: ["Preto", "Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "hiphop", "camisetas"],
  },
  {
    id: 7,
    name: "Camiseta Kendrick Lamar",
    price: 119.9,
    imageUrl: "/img/kendrick-modelo.jpg",
    slug: "kendrick-lamar",
    description:
      "Estampa exclusiva Kendrick Lamar, tecido premium e conforto garantido.",
    colors: ["Preto", "Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "hiphop", "camisetas"],
  },
  {
    id: 8,
    name: "Camiseta Kendrick Lamar Super Bowl",
    price: 119.9,
    imageUrl: "/img/kendricksb-modelo.jpg",
    slug: "kendrick-lamar",
    description:
      "Estampa exclusiva Kendrick Lamar, tecido premium e conforto garantido.",
    colors: ["Preto", "Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "hiphop", "camisetas"],
  },
  {
    id: 9,
    name: "Camiseta Trem Bala",
    price: 119.9,
    imageUrl: "/img/trembala-modelo.jpg",
    slug: "trem-bala",
    description:
      "Camiseta com estampa inspiradora do Trem Bala de The Boys. Conforto e estilo em uma só peça.",
    colors: ["Preto", "Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
  },
  {
    id: 10,
    name: "Camiseta The Bear Yes Chef!",
    price: 119.9,
    imageUrl: "/img/thebear-modelo.jpg",
    slug: "the-bear-yes-chef",
    description:
      "Camiseta temática The Bear com a icônica frase 'Yes Chef!'. Conforto e estilo para os fãs da série.",
    colors: ["Preto", "Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
  },
  {
    id: 11,
    name: "Camiseta Agostinho Carrara",
    price: 119.9,
    imageUrl: "/img/agostinho-modelo.jpg",
    slug: "agostinho-carrara",
    description:
      "Camiseta divertida do Agostinho Carrara, personagem icônico da TV brasileira. Perfeita para fãs de humor.",
    colors: ["Preto", "Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
  },
  {
    id: 12,
    name: "Camiseta Airton Senna",
    price: 119.9,
    imageUrl: "/img/senna-modelo.jpg",
    slug: "airton-senna",
    description:
      "Camiseta em homenagem a Airton Senna, lenda do automobilismo brasileiro. Estilo e conforto para os fãs de velocidade.",
    colors: ["Preto", "Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
  },
  {
    id: 13,
    name: "Camiseta Travis",
    price: 119.9,
    imageUrl: "/img/travis2-modelo.jpg",
    slug: "travis-scott2",
    description:
      "Estampa exclusiva Travis Scott, tecido premium e conforto garantido.",
    colors: ["Preto", "Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "hiphop", "camisetas"],
  },
   {
    id: 12,
    name: "Camiseta Laranjodina ",
    price: 119.9,
    imageUrl: "/img/laranjodina-modelo.jpg",
    slug: "laranjodina",
    description:
      "Camiseta exclusiva Laranjodina, estilo vibrante e autêntico.",
    colors: ["Preto", "Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
  },
   {
    id: 13,
    name: "Camiseta Breaking Bad ",
    price: 119.9,
    imageUrl: "/img/bb-modelo.jpg",
    slug: "breaking-bad",
    description:
      "Camiseta temática Breaking Bad, perfeita para os fãs da série.",
    colors: ["Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
  },
  {
    id: 14,
    name: "Camiseta Polo Verde Musgo",
    price: 119.9,
    imageUrl: "/img/poloverde-modelo.jpg",
    slug: "polo-verde-musgo",
    description:
      "Camiseta polo verde musgo, estilo clássico e confortável.",
    colors: ["Verde Musgo"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
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
        filteredProducts = FULL_CATALOG.filter((p) =>
          p.category.some((cat) => cat === categorySlug)
        );
      }

      resolve(filteredProducts.slice(0, count));
    }, 500);
  });
};

export const getProductBySlug = (
  slug: string
): Promise<ProductDetailsData | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = FULL_CATALOG.find((p) => p.slug === slug);
      resolve(product);
    }, 300);
  });
};

// Exporta o ProductDetailsData como Product para ser usado na tipagem em ProductDetails.tsx
export type { ProductDetailsData as Product };
