// Catálogo de produtos no servidor — fonte única de verdade para preços.
// Nunca use preços vindos do frontend.

export interface CatalogProduct {
  slug: string;
  name: string;
  price: number;
}

export const CATALOG: CatalogProduct[] = [
  { slug: "camiseta-2pac",        name: "Camiseta 2PAC",                    price: 119.9 },
  { slug: "camiseta-will",        name: "Camiseta Fresh Prince",            price: 119.9 },
  { slug: "camiseta-jordan",      name: "Camiseta Michael Jordan",          price: 119.9 },
  { slug: "breaking-bad",         name: "Camiseta Breaking Bad",            price: 119.9 },
  { slug: "tyler-the-creator",    name: "Camiseta Tyler The Creator",       price: 119.9 },
  { slug: "travis-scott",         name: "Camiseta Travis Scott",            price: 119.9 },
  { slug: "kendrick-lamar",       name: "Camiseta Kendrick Lamar",          price: 119.9 },
  { slug: "superbowl",            name: "Camiseta Kendrick Super Bowl",     price: 119.9 },
  { slug: "trem-bala",            name: "Camiseta Trem Bala",               price: 119.9 },
  { slug: "the-bear-yes-chef",    name: "Camiseta The Bear Yes Chef!",      price: 119.9 },
  { slug: "agostinho-carrara",    name: "Camiseta Agostinho Carrara",       price: 119.9 },
  { slug: "airton-senna",         name: "Camiseta Airton Senna",            price: 119.9 },
  { slug: "travis-scott2",        name: "Camiseta Travis",                  price: 119.9 },
  { slug: "laranjodina",          name: "Camiseta Laranjodina",             price: 119.9 },
  { slug: "camiseta-leblon",      name: "Camiseta Leblon James",            price: 119.9 },
  { slug: "camiseta-breakingbad2",name: "Camiseta Breaking Bad Novo Mexico",price: 119.9 },
];

export const getProductBySlug = (slug: string): CatalogProduct | undefined =>
  CATALOG.find(p => p.slug === slug);
