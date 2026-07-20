import { Product } from "../types/Product";
import { API_BASE } from "../config/api";

interface ProductDetailsData extends Product {
  description: string;
  colors: string[];
  sizes: string[];
  category: string[];
}

// Backup dos produtos locais caso o banco de dados da API esteja vazio ou offline
const FULL_CATALOG: ProductDetailsData[] = [
  {
    id: 1,
    name: "Camiseta 2PAC",
    price: 119.9,
    imageUrl: "/img/2pac-modelo.jpg", 
    slug: "camiseta-2pac",
    description: "Camiseta 100% algodão com cromia vibrante do lendário rapper 2PAC.",
    colors: ["Preto"],
    sizes: ["P", "M", "G", "GG"],
    category: ["hiphop", "camisetas"],
  },
  {
    id: 2,
    name: "Camiseta Fresh Prince",
    price: 119.9,
    imageUrl: "/img/will-modelo.jpg",
    slug: "camiseta-will",
    description: "Design exclusivo Fresh Prince, 100% algodão fio 30.",
    colors: ["Preto"],
    sizes: ["P", "M", "G", "GG"],
    category: ["hiphop", "camisetas"],
  },
  {
    id: 3,
    name: "Camiseta Michael Jordan",
    price: 119.9,
    imageUrl: "/img/jordan-modelo.jpg",
    slug: "camiseta-jordan",
    description: "Camiseta em homenagem ao GOAT do basquete, estampa vibrante e durável.",
    colors: ["Preto"],
    sizes: ["P", "M", "G", "GG"],
    category: ["cultura negra", "camisetas"],
  },
  {
    id: 4,
    name: "Camiseta Breaking Bad",
    price: 119.9,
    imageUrl: "/img/bb-modelo.jpg",
    slug: "breaking-bad",
    description: "Camiseta temática Breaking Bad, perfeita para os fãs da série.",
    colors: ["Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
  },
  {
    id: 5,
    name: "Camiseta Tyler The Creator",
    price: 119.9,
    imageUrl: "/img/tyler-modelo.jpg",
    slug: "tyler-the-creator",
    description: "Black edition Tyler The Creator, estilo único e autêntico.",
    colors: ["Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas", "hiphop"],
  },
  {
    id: 6,
    name: "Camiseta Travis Scott",
    price: 119.9,
    imageUrl: "/img/travis-modelo.jpg",
    slug: "travis-scott",
    description: "Estampa exclusiva Travis Scott, tecido premium e conforto garantido.",
    colors: ["Preto"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "hiphop", "camisetas"],
  },
  {
    id: 7,
    name: "Camiseta Kendrick Lamar",
    price: 119.9,
    imageUrl: "/img/kendrick-modelo.jpg",
    slug: "kendrick-lamar",
    description: "Estampa exclusiva Kendrick Lamar, tecido premium e conforto garantido.",
    colors: ["Preto"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "hiphop", "camisetas"],
  },
  {
    id: 8,
    name: "Camiseta Kendrick Lamar Super Bowl",
    price: 119.9,
    imageUrl: "/img/superbowl.jpg",
    slug: "superbowl",
    description: "Estampa exclusiva Kendrick Lamar, tecido premium e conforto garantido.",
    colors: ["Preto"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "hiphop", "camisetas"],
  },
  {
    id: 9,
    name: "Camiseta Trem Bala",
    price: 119.9,
    imageUrl: "/img/trembala-modelo.jpg",
    slug: "trem-bala",
    description: "Camiseta com estampa inspiradora do Trem Bala de The Boys. Conforto e estilo em uma só peça.",
    colors: ["Preto"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
  },
  {
    id: 10,
    name: "Camiseta The Bear Yes Chef!",
    price: 119.9,
    imageUrl: "/img/thebear-modelo.jpg",
    slug: "the-bear-yes-chef",
    description: "Camiseta temática The Bear com a icônica frase 'Yes Chef!'. Conforto e estilo para os fãs da série.",
    colors: ["Preto"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
  },
  {
    id: 11,
    name: "Camiseta Agostinho Carrara",
    price: 119.9,
    imageUrl: "/img/agostinho-modelo.jpg",
    slug: "agostinho-carrara",
    description: "Camiseta divertida do Agostinho Carrara, personagem icônico da TV brasileira. Perfeita para fãs de humor.",
    colors: ["Preto"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
  },
  {
    id: 12,
    name: "Camiseta Airton Senna",
    price: 119.9,
    imageUrl: "/img/senna-modelo.jpg",
    slug: "airton-senna",
    description: "Camiseta em homenagem a Airton Senna, lenda do automobilismo brasileiro. Estilo e conforto para os fãs de velocidade.",
    colors: ["Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
  },
  {
    id: 13,
    name: "Camiseta Travis",
    price: 119.9,
    imageUrl: "/img/travis2-modelo.jpg",
    slug: "travis-scott2",
    description: "Estampa exclusiva Travis Scott, tecido premium e conforto garantido.",
    colors: ["Preto"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "hiphop", "camisetas"],
  },
  {
    id: 14,
    name: "Camiseta Laranjodina",
    price: 119.9,
    imageUrl: "/img/laranjodina-modelo.jpg",
    slug: "laranjodina",
    description: "Camiseta exclusiva Laranjodina, estilo vibrante e autêntico.",
    colors: ["Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
  },
  {
    id: 15,
    name: "Camiseta Leblon James",
    price: 119.9,
    imageUrl: "/img/leblon-modelo.jpg", 
    slug: "camiseta-leblon",
    description: "Peça de lançamento com arte conceitual urbana. Edição limitada.",
    colors: ["Preto"],
    sizes: ["P", "M", "G", "GG"],
    category: ["cultura negra", "camisetas"],
  },
  {
    id: 16,
    name: "Camiseta Breaking Bad Novo Mexico",
    price: 119.9,
    imageUrl: "/img/breakingbad-modelo.jpg", 
    slug: "camiseta-breakingbad2",
    description: "Peça de lançamento com arte conceitual urbana. Edição limitada.",
    colors: ["Branca"],
    sizes: ["P", "M", "G", "GG"],
    category: ["lancamentos", "camisetas"],
  },
  {
    id: 17,
    name: "Xícara Laranjodina",
    price: 69.9,
    imageUrl: "/img/xicara-modelo.png",
    slug: "xicara-laranjodina",
    description: "Xícara de cerâmica de alta qualidade para começar o dia com atitude.",
    colors: ["Branca"],
    sizes: ["Tamanho Único"],
    category: ["acessorios"],
  },
  {
    id: 18,
    name: "Ecobag Quem fez, fez",
    price: 49.9,
    imageUrl: "/img/ecobag-modelo.png",
    slug: "ecobag-quem-fez-fez",
    description: "Ecobag ecológica com design exclusivo da Laranjodina.",
    colors: ["Única"],
    sizes: ["Tamanho Único"],
    category: ["acessorios"],
  },
  {
    id: 19,
    name: "Bandeira Streetwear",
    price: 129.9,
    imageUrl: "/img/bandeira-modelo.png",
    slug: "bandeira-streetwear",
    description: "Bandeira decorativa estilo streetwear para pendurar no seu quarto ou estúdio.",
    colors: ["Preta"],
    sizes: ["40x40", "50x50", "60x60"],
    category: ["acessorios"],
  },
  {
    id: 20,
    name: "Boné Laranjodina",
    price: 89.9,
    imageUrl: "/img/bone-modelo.png" ,
    slug: "bone-laranjodina",
    description: "Boné verde com logo Laranjodina bordado e ajuste confortável",
    colors: ["Verde"],
    sizes: ["Tamanho Único"],
    category: ["acessorios"],
  },
];

/**
 * Busca a lista de produtos da API, permitindo filtro.
 */
export const fetchProducts = async (
  count?: number,
  categorySlug?: string
): Promise<ProductDetailsData[]> => {
  let products: ProductDetailsData[] = [];
  
  try {
    const response = await fetch(`${API_BASE}/api/produtos`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        products = data;
      }
    }
  } catch (error) {
    console.warn("API indisponível ou vazia, usando catálogo local (fallback).", error);
  }

  // Fallback: se a API falhou ou retornou vazio, usa os dados locais
  if (products.length === 0) {
    products = FULL_CATALOG;
  }

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
};

/**
 * Busca um produto específico pelo slug.
 */
export const getProductBySlug = async (
  slug: string
): Promise<ProductDetailsData | undefined> => {
  try {
    const response = await fetch(`${API_BASE}/api/produtos/${slug}`);
    if (response.ok) {
      const product = await response.json();
      return product;
    }
  } catch (error) {
    console.warn("API indisponível ao buscar slug, usando catálogo local (fallback).");
  }

  // Fallback local
  return FULL_CATALOG.find(p => p.slug === slug);
};

// Exporta o ProductDetailsData como Product para ser usado na tipagem em ProductDetails.tsx
export type { ProductDetailsData as Product };
