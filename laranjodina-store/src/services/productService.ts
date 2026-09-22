import { Product } from "../types/Product";
import { db } from "../config/firebase";
import { ref, get, set, remove } from "firebase/database";

interface ProductDetailsData extends Product {
  description: string;
  colors: string[];
  sizes: string[];
  category: string[];
}


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
  {
    id: 21,
    name: "Xícaras Casal",
    price: 149.9,
    imageUrl: "/img/xicaraCasal.webp",
    slug: "xicara-casal",
    description: "Xícara para casal, perfeita para presentear ou compartilhar momentos especiais.",
    colors: ["Branca"],
    sizes: ["Tamanho Único"],
    category: ["acessorios"],
  },
  {
    id: 22,
    name: "Touca Laranjodina",
    price: 89.9,
    imageUrl: "/img/touca-modelo.jpg",
    slug: "touca-laranjodina",
    description: "Touca verde com logo Laranjodina bordado e ajuste confortável",
    colors: ["Verde"],
    sizes: ["Tamanho Único"],
    category: ["acessorios"],
  },
  {
    id: 23,
    name: "Touca Black LD",
    price: 89.9,
    imageUrl: "/img/touca-modelo2.jpg",
    slug: "touca-black-laranjodina",
    description: "Touca preta com logo Laranjodina bordado e ajuste confortável",
    colors: ["Preta"],
    sizes: ["Tamanho Único"],
    category: ["acessorios"],
  },
   {
    id: 24,
    name: "Touca Green LD",
    price: 89.9,
    imageUrl: "/img/touca-modelo1.jpg",
    slug: "touca-green-laranjodina",
    description: "Touca verde com logo Laranjodina bordado e ajuste confortável",
    colors: ["Verde"],
    sizes: ["Tamanho Único"],
    category: ["acessorios"],
  },
];

export const seedInitialProducts = async (forceOverwrite = false): Promise<ProductDetailsData[]> => {
  try {
    const productsRef = ref(db, "produtos");
    const snapshot = await get(productsRef);
    
    if (!snapshot.exists() || forceOverwrite) {
      const initialMap: { [id: string]: ProductDetailsData } = {};
      FULL_CATALOG.forEach(p => {
        initialMap[p.id] = p;
      });
      await set(productsRef, initialMap);
      return FULL_CATALOG;
    } else {
      const data = snapshot.val();
      const dbProductsMap: Record<string, ProductDetailsData> = Array.isArray(data)
        ? data.reduce((acc, item) => {
            if (item && item.id) acc[item.id] = item;
            return acc;
          }, {} as Record<string, ProductDetailsData>)
        : data || {};

      let hasChanges = false;
      FULL_CATALOG.forEach(localProd => {
        if (!dbProductsMap[localProd.id]) {
          dbProductsMap[localProd.id] = localProd;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        await set(productsRef, dbProductsMap);
      }

      return Object.values(dbProductsMap);
    }
  } catch (err) {
    console.warn("Erro ao popular catálogo no Firebase, usando fallback local.", err);
    return FULL_CATALOG;
  }
};

export const fetchProducts = async (
  count?: number,
  categorySlug?: string
): Promise<ProductDetailsData[]> => {
  let products: ProductDetailsData[] = [];
  
  try {
    const productsRef = ref(db, "produtos");
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const dbProductsMap: Record<string, ProductDetailsData> = Array.isArray(data)
        ? data.reduce((acc, item) => {
            if (item && item.id) acc[item.id] = item;
            return acc;
          }, {} as Record<string, ProductDetailsData>)
        : data || {};

      let hasChanges = false;
      FULL_CATALOG.forEach(catProd => {
        if (!dbProductsMap[catProd.id]) {
          // Produto novo adicionado pelo código -> insere no mapa
          dbProductsMap[catProd.id] = catProd;
          hasChanges = true;
        } else {
          // Produto já existe no Firebase. Se a imageUrl estiver totalmente vazia ou indefinida, usa a do código
          const existing = dbProductsMap[catProd.id];
          if (!existing.imageUrl || existing.imageUrl.trim() === "") {
            dbProductsMap[catProd.id] = { ...existing, imageUrl: catProd.imageUrl };
            hasChanges = true;
          }
        }
      });

      // Se houver novos produtos do código, sincroniza no Firebase em segundo plano
      if (hasChanges) {
        set(productsRef, dbProductsMap).catch((err) =>
          console.warn("Erro ao sincronizar produtos ausentes no Firebase:", err)
        );
      }

      products = Object.values(dbProductsMap);
    } else {
      products = await seedInitialProducts();
    }
  } catch (error) {
    console.warn("Erro ao buscar produtos do Firebase, usando catálogo local (fallback).", error);
    products = FULL_CATALOG;
  }

  // Garantir que nenhum produto fique sem imagem
  products = products.map((prod) => {
    if (!prod.imageUrl || prod.imageUrl.trim() === "") {
      const catalogMatch = FULL_CATALOG.find((c) => String(c.id) === String(prod.id));
      return { ...prod, imageUrl: catalogMatch?.imageUrl || "/img/logo.png" };
    }
    return prod;
  });

  if (categorySlug === "mais-vendidos") {
    products = products.slice(0, 4);
  } else if (categorySlug && categorySlug !== "todos") {
    products = products.filter((p) =>
      p.category && p.category.some((cat) => cat.toLowerCase() === categorySlug.toLowerCase())
    );
  }

  if (count) {
    products = products.slice(0, count);
  }

  return products;
};

export const getProductBySlug = async (
  slug: string
): Promise<ProductDetailsData | undefined> => {
  const allProducts = await fetchProducts();
  return allProducts.find(p => p.slug.toLowerCase() === slug.toLowerCase());
};

export const getProductById = async (
  id: number | string
): Promise<ProductDetailsData | undefined> => {
  const allProducts = await fetchProducts();
  return allProducts.find(p => String(p.id) === String(id));
};

/**
 * Salvar / Editar produto no Firebase Database.
 */
export const saveProduct = async (product: ProductDetailsData): Promise<void> => {
  // Firebase Realtime DB rejeita objetos com propriedades 'undefined'.
  // Removemos qualquer chave com valor undefined antes de salvar.
  const cleanProduct: Record<string, any> = {};
  (Object.keys(product) as Array<keyof ProductDetailsData>).forEach((key) => {
    const val = product[key];
    if (val !== undefined) {
      cleanProduct[key] = val;
    }
  });

  const productRef = ref(db, `produtos/${product.id}`);
  await set(productRef, cleanProduct);
};

/**
 * Deletar produto do Firebase Database.
 */
export const deleteProduct = async (productId: number | string): Promise<void> => {
  const productRef = ref(db, `produtos/${productId}`);
  await remove(productRef);
};

// Exporta o ProductDetailsData como Product para ser usado na tipagem em ProductDetails.tsx
export type { ProductDetailsData as Product };

