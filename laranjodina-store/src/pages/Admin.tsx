import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiShoppingBag,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiSearch,
  FiSliders,
} from "react-icons/fi";
import { useAuthStore } from "../components/store/authStore";
import toast from "react-hot-toast";
import {
  fetchProducts,
  saveProduct,
  deleteProduct,
  seedInitialProducts,
  Product,
} from "../services/productService";
import { db } from "../config/firebase";
import { ref, get, set, update } from "firebase/database";

type AdminTab = "products" | "orders" | "settings";

const AVAILABLE_CATEGORIES = [
  { id: "camisetas", name: "Camisetas" },
  { id: "lancamentos", name: "Lançamentos" },
  { id: "hiphop", name: "Hip-Hop" },
  { id: "acessorios", name: "Acessórios" },
  { id: "cultura negra", name: "Cultura Negra" },
];

const Admin: React.FC = () => {
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<AdminTab>("products");

  // Estados de Produtos
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado do Modal de Produto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productForm, setProductForm] = useState({
    id: 0,
    name: "",
    slug: "",
    price: "",
    oldPrice: "",
    imageUrl: "",
    description: "",
    colors: ["Preto"],
    sizes: ["P", "M", "G", "GG"],
    category: ["camisetas"],
  });

  // Estados de Pedidos
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Estados de Configurações
  const [announcementText, setAnnouncementText] = useState("");
  const [loadingSettings, setLoadingSettings] = useState(false);

  // Verificação de permissão Admin
  const isUserAdmin =
    user?.isAdmin ||
    (user?.email && (user.email.includes("brunooliver") || user.email.includes("admin")));

  useEffect(() => {
    if (isUserAdmin) {
      loadProducts();
      loadOrders();
      loadSettings();
    }
  }, [isUserAdmin]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      toast.error("Erro ao carregar produtos.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const ordersRef = ref(db, "orders");
      const snapshot = await get(ordersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const compiled: any[] = [];
        Object.keys(data).forEach((userKey) => {
          const userOrders = data[userKey];
          Object.keys(userOrders).forEach((orderKey) => {
            compiled.push({
              key: orderKey,
              userId: userKey,
              ...userOrders[orderKey],
            });
          });
        });
        compiled.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setAllOrders(compiled);
      }
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadSettings = async () => {
    try {
      const annRef = ref(db, "settings/announcement");
      const snapshot = await get(annRef);
      if (snapshot.exists()) {
        setAnnouncementText(snapshot.val());
      }
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
    }
  };

  if (!user || !isUserAdmin) {
    return (
      <div className="container order-status-page">
        <div className="order-status-box">
          <div className="order-status-icon">🔒</div>
          <h1 className="text-uppercase-black">Acesso Restrito ao Admin</h1>
          <p>Você não tem permissão para acessar o painel de administração.</p>
          <Link to="/" className="btn-accent order-status-btn">
            Voltar à Loja
          </Link>
        </div>
      </div>
    );
  }

  // --- Handlers de Produto ---
  const handleOpenAddModal = () => {
    const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id || 0)) + 1 : 1;
    setEditingProduct(null);
    setProductForm({
      id: nextId,
      name: "",
      slug: "",
      price: "",
      oldPrice: "",
      imageUrl: "",
      description: "",
      colors: ["Preto"],
      sizes: ["P", "M", "G", "GG"],
      category: ["camisetas"],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : "",
      imageUrl: product.imageUrl,
      description: product.description || "",
      colors: product.colors || ["Preto"],
      sizes: product.sizes || ["P", "M", "G", "GG"],
      category: product.category || ["camisetas"],
    });
    setIsModalOpen(true);
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.imageUrl) {
      toast.error("Preencha Nome, Preço e URL da Imagem.");
      return;
    }

    const generatedSlug =
      productForm.slug.trim() ||
      productForm.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const newProd: Product = {
      id: productForm.id,
      name: productForm.name.trim(),
      slug: generatedSlug,
      price: parseFloat(productForm.price),
      oldPrice: productForm.oldPrice ? parseFloat(productForm.oldPrice) : undefined,
      imageUrl: productForm.imageUrl.trim(),
      description: productForm.description.trim(),
      colors: productForm.colors,
      sizes: productForm.sizes,
      category: productForm.category,
    };

    try {
      await saveProduct(newProd);
      toast.success(
        editingProduct ? "Produto atualizado com sucesso!" : "Novo produto cadastrado!"
      );
      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      toast.error("Erro ao salvar produto no Firebase.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;
    try {
      await deleteProduct(id);
      toast.success("Produto excluído com sucesso.");
      loadProducts();
    } catch (err) {
      toast.error("Erro ao excluir produto.");
    }
  };

  const handleRestoreInitialCatalog = async () => {
    if (!window.confirm("Deseja importar o catálogo padrão inicial para o Firebase?")) return;
    try {
      await seedInitialProducts();
      toast.success("Catálogo inicial carregado no Firebase!");
      loadProducts();
    } catch (err) {
      toast.error("Erro ao restaurar catálogo.");
    }
  };

  const handleUpdateOrderStatus = async (userId: string, orderKey: string, newStatus: string) => {
    try {
      await update(ref(db, `orders/${userId}/${orderKey}`), {
        status: newStatus,
        updatedAt: Date.now(),
      });
      toast.success(`Status atualizado para "${newStatus}"!`);
      loadOrders();
    } catch (err) {
      toast.error("Erro ao atualizar status do pedido.");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSettings(true);
    try {
      await set(ref(db, "settings/announcement"), announcementText.trim());
      toast.success("Configurações salvas no Firebase!");
    } catch (err) {
      toast.error("Erro ao salvar configurações.");
    } finally {
      setLoadingSettings(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="container account-page" style={{ maxWidth: "1200px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 className="text-uppercase-black account-title" style={{ margin: 0 }}>
            Painel Admin 👑
          </h1>
          <p style={{ color: "var(--text-muted)", margin: "5px 0 0 0" }}>
            Gerencie produtos, pedidos e configurações da Laranjodina
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleRestoreInitialCatalog} className="btn-accent" style={{ background: "#333", color: "#fff", fontSize: "0.85rem", padding: "8px 16px" }}>
            <FiRefreshCw style={{ marginRight: "6px" }} /> Restaurar Catálogo Padrão
          </button>
        </div>
      </div>

      {/* ── NAVEGAÇÃO DE ABAS ── */}
      <div style={{ display: "flex", gap: "15px", borderBottom: "1px solid var(--border-color, #333)", marginBottom: "2rem", paddingBottom: "10px" }}>
        <button
          onClick={() => setActiveTab("products")}
          style={{
            background: activeTab === "products" ? "var(--color-accent)" : "transparent",
            color: activeTab === "products" ? "var(--color-black)" : "#fff",
            border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px"
          }}
        >
          <FiPackage /> Produtos ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          style={{
            background: activeTab === "orders" ? "var(--color-accent)" : "transparent",
            color: activeTab === "orders" ? "var(--color-black)" : "#fff",
            border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px"
          }}
        >
          <FiShoppingBag /> Pedidos dos Clientes ({allOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          style={{
            background: activeTab === "settings" ? "var(--color-accent)" : "transparent",
            color: activeTab === "settings" ? "var(--color-black)" : "#fff",
            border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px"
          }}
        >
          <FiSliders /> Configurações da Loja
        </button>
      </div>

      {/* ── ABA 1: PRODUTOS ── */}
      {activeTab === "products" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "15px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
              <FiSearch style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Buscar produto por nome ou slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "45px" }}
              />
            </div>
            <button onClick={handleOpenAddModal} className="btn-accent" style={{ padding: "12px 24px" }}>
              <FiPlus style={{ marginRight: "8px" }} /> Novo Produto
            </button>
          </div>

          {loadingProducts ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>Carregando produtos...</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff", background: "var(--surface-color, #1a1a1a)", borderRadius: "8px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #333", textAlign: "left", background: "#111" }}>
                    <th style={{ padding: "15px" }}>Foto</th>
                    <th style={{ padding: "15px" }}>Nome</th>
                    <th style={{ padding: "15px" }}>Preço</th>
                    <th style={{ padding: "15px" }}>Categorias</th>
                    <th style={{ padding: "15px" }}>Tamanhos</th>
                    <th style={{ padding: "15px", textAlign: "right" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #262626" }}>
                      <td style={{ padding: "12px 15px" }}>
                        <img src={p.imageUrl} alt={p.name} style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "6px" }} />
                      </td>
                      <td style={{ padding: "12px 15px", fontWeight: "bold" }}>
                        {p.name}
                        <br />
                        <small style={{ color: "var(--text-muted)", fontWeight: "normal" }}>slug: {p.slug}</small>
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        {fmt(p.price)}
                        {p.oldPrice && (
                          <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "0.8rem", marginLeft: "6px" }}>
                            {fmt(p.oldPrice)}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        {p.category ? p.category.join(", ") : "-"}
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        {p.sizes ? p.sizes.join(", ") : "-"}
                      </td>
                      <td style={{ padding: "12px 15px", textAlign: "right" }}>
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          style={{ background: "transparent", border: "none", color: "var(--color-accent)", cursor: "pointer", marginRight: "12px" }}
                          title="Editar"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          style={{ background: "transparent", border: "none", color: "#FF5252", cursor: "pointer" }}
                          title="Excluir"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ABA 2: PEDIDOS DOS CLIENTES ── */}
      {activeTab === "orders" && (
        <div>
          {loadingOrders ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>Carregando pedidos...</p>
          ) : allOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", background: "var(--surface-color, #1a1a1a)", borderRadius: "8px" }}>
              <p>Nenhum pedido realizado ainda.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {allOrders.map((ord) => (
                <div key={ord.key} style={{ background: "var(--surface-color, #1a1a1a)", padding: "20px", borderRadius: "8px", border: "1px solid #333" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Pedido #{ord.id?.slice(-6) || ord.key.slice(-6)}</h3>
                      <p style={{ margin: "4px 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        Comprador: <strong>{ord.payer?.name || "Cliente"}</strong> ({ord.payer?.email || "Sem e-mail"})
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Status:</label>
                      <select
                        value={ord.status || "pendente"}
                        onChange={(e) => handleUpdateOrderStatus(ord.userId, ord.key, e.target.value)}
                        style={{
                          background: "#111", color: "#fff", border: "1px solid #444", padding: "6px 12px", borderRadius: "6px"
                        }}
                      >
                        <option value="pendente">⏳ Pendente</option>
                        <option value="pago">✅ Pago</option>
                        <option value="enviado">🚚 Enviado</option>
                        <option value="entregue">🎉 Entregue</option>
                        <option value="cancelado">❌ Cancelado</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid #333", borderBottom: "1px solid #333", padding: "10px 0", margin: "10px 0" }}>
                    <strong>Itens:</strong>
                    <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                      {ord.items && ord.items.map((it: any, idx: number) => (
                        <li key={idx}>
                          {it.name} ({it.size}) — {it.quantity}x de {fmt(it.price || 0)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    <span>Endereço: {ord.shippingAddress?.street}, {ord.shippingAddress?.number} - {ord.shippingAddress?.city}/{ord.shippingAddress?.state}</span>
                    <strong style={{ color: "#fff", fontSize: "1.1rem" }}>Total: {fmt(ord.total || 0)}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ABA 3: CONFIGURAÇÕES DA LOJA ── */}
      {activeTab === "settings" && (
        <div style={{ background: "var(--surface-color, #1a1a1a)", padding: "25px", borderRadius: "8px", border: "1px solid #333" }}>
          <h2 style={{ marginTop: 0 }}>Anúncio do Topo da Loja</h2>
          <form onSubmit={handleSaveSettings}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>
                Texto da barra promocional superior (Banner do topo):
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Ex: FRETE GRÁTIS EM COMPRAS ACIMA DE R$ 300,00 | Parcele em até 6x sem juros"
                className="form-input"
              />
            </div>
            <button type="submit" className="btn-accent" disabled={loadingSettings}>
              {loadingSettings ? "Salvando..." : "Salvar Configurações"}
            </button>
          </form>
        </div>
      )}

      {/* ── MODAL DE ADICIONAR / EDITAR PRODUTO ── */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px"
        }}>
          <div style={{
            background: "#181818", padding: "30px", borderRadius: "12px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", border: "1px solid #333"
          }}>
            <h2 className="text-uppercase-black" style={{ marginTop: 0 }}>
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </h2>

            <form onSubmit={handleSaveProductForm} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Nome do Produto *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  className="form-input"
                  placeholder="Ex: Camiseta 2PAC Vintage"
                />
              </div>

              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    className="form-input"
                    placeholder="119.90"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Preço Antigo (Desconto)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.oldPrice}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                    className="form-input"
                    placeholder="159.90 (opcional)"
                  />
                </div>
              </div>

              <div>
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>URL da Imagem *</label>
                <input
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  required
                  className="form-input"
                  placeholder="Ex: /img/2pac-modelo.jpg ou https://..."
                />
              </div>

              <div>
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Descrição</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="form-input"
                  rows={3}
                  placeholder="Descrição detalhada do produto..."
                />
              </div>

              <div>
                <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Categorias:</label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {AVAILABLE_CATEGORIES.map((cat) => (
                    <label key={cat.id} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.9rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={productForm.category.includes(cat.id)}
                        onChange={(e) => {
                          const exists = productForm.category.includes(cat.id);
                          const updated = exists
                            ? productForm.category.filter((c) => c !== cat.id)
                            : [...productForm.category, cat.id];
                          setProductForm({ ...productForm, category: updated });
                        }}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
                <button type="submit" className="btn-accent" style={{ flex: 1 }}>
                  Salvar Produto
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-accent"
                  style={{ background: "#333", color: "#fff" }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
