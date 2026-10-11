import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Package,
  Image as ImageIcon,
  DollarSign,
} from "lucide-react";
import { supabase } from "../../../supabase";

export function AdminDashboard() {

  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  // ✅ FILTER STATE
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");

  useEffect(() => {
    // ✅ AUTH CHECK
    const isAuth = localStorage.getItem("sherif-admin-auth") === "true";

    if (!isAuth) {
      navigate("/admin/login");
      return;
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) console.error(error);
    else setProducts(data || []);
  };

  const handleLogout = async () => {
    // ✅ CLEAR LOCAL AUTH
    localStorage.removeItem("sherif-admin-auth");

    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Delete this product?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  };

  const handleToggleOffer = async (product: any) => {
    await supabase
      .from("products")
      .update({
        offerprice: product.offerprice ? null : product.price - 200,
      })
      .eq("id", product.id);

    fetchProducts();
  };

  const handleToggleFeatured = async (product: any) => {
    await supabase
      .from("products")
      .update({ is_featured: !product.is_featured })
      .eq("id", product.id);

    fetchProducts();
  };

  const filteredProducts = products.filter((p) => {
    const categoryMatch =
      !filterCategory || p.category === filterCategory;

    const featuredMatch =
      !filterFeatured ||
      String(p.is_featured) === filterFeatured;

    return categoryMatch && featuredMatch;
  });

  return (

    <div className="min-h-screen pt-24 pb-16 ">
      <div className="max-w-7xl mx-auto px-4">

        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black">ADMIN DASHBOARD</h1>
            <p className="text-muted-foreground">
              Manage your products
            </p>
          </div>

          <div className="flex gap-4 mb-6">

            <select
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border rounded "
            >
              <option value="" className="bg-black text-base text-white">All Categories</option>
              <option value="shirts" className="bg-black text-base text-white">Shirts</option>
              <option value="pants" className="bg-black text-base text-white">Pants</option>
              <option value="tshirts" className="bg-black text-base text-white">T-Shirts</option>
            </select>

            <select
              onChange={(e) => setFilterFeatured(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="" className="bg-black text-base text-white">All</option>
              <option value="true" className="bg-black text-base text-white">Featured</option>
              <option value="false" className="bg-black text-base text-white">Normal</option>
            </select>

          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsAddingProduct(true);
                setEditingProduct(null);
              }}
              className="bg-[var(--gold)] px-6 py-3 rounded-lg font-bold"
            >
              + ADD PRODUCT
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-lg"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* TABLE */}
        <table className="w-full border">
          <thead className="bg-black text-yellow-400">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Offer</th>
              <th>Featured</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className="border-t">
                <td>
                  <img src={p.images?.[0]} className="w-16 h-16" />
                </td>

                <td>{p.name}</td>

                <td>
                  {p.category} / {p.subcategory}
                </td>

                <td>₹{p.price}</td>

                <td>
                  <button onClick={() => handleToggleOffer(p)}>
                    {p.offerprice ? "Active" : "Inactive"}
                  </button>
                </td>

                <td>
                  <button onClick={() => handleToggleFeatured(p)}>
                    {p.is_featured ? "⭐ Featured" : "Normal"}
                  </button>
                </td>


                <td>
                  <button onClick={() => setEditingProduct(p)}>✏️</button>
                  <button onClick={() => handleDeleteProduct(p.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(isAddingProduct || editingProduct) && (
          <div className="fixed inset-0 z-50 bg-[#021814]">

            {/* CLOSE ON BACKGROUND CLICK */}
            <div
              className="absolute inset-0"
              onClick={() => {
                setIsAddingProduct(false);
                setEditingProduct(null);
              }}
            />

            {/* FORM */}
            <div className="relative z-50 w-full h-full">
              <ProductForm
                product={editingProduct}
                onSave={async (product: any) => {

                  // ✅ CALCULATE TOTAL STOCK
                  const totalStock = Object.values(product.size_stock || {})
                    .reduce((sum: number, val: any) => sum + Number(val || 0), 0);

                  const finalProduct = {
                    ...product,
                    stock: totalStock, // ✅ SYNC STOCK
                  };

                  let result;

                  if (editingProduct) {
                    result = await supabase
                      .from("products")
                      .update(finalProduct)
                      .eq("id", finalProduct.id);
                  } else {
                    const newProduct = { ...finalProduct };
                    delete newProduct.id;

                    result = await supabase
                      .from("products")
                      .insert([newProduct]);
                  }

                  if (result.error) {
                    alert(result.error.message);
                    return;
                  }

                  fetchProducts();
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                }}
                onCancel={() => {
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= PRODUCT FORM ================= */

function ProductForm({ product, onSave, onCancel }: any) {
  const { theme } = useTheme();

  const [formData, setFormData] = useState(
    product || {
      description: "",
      name: "",
      category: "shirts",
      subcategory: "",
      price: 0,
      stock: 0,
      images: [],
      is_featured: false,
      is_trending: false,
      badge: "",
      colors: [],
      sizes: [],
      size_stock: {},
    }
  );

  const [uploading, setUploading] = useState(false);

  const subcategories: any = {
    shirts: ["baggy", "Drop-shoulder", "formal", "unique"],
    pants: ["jeans", "cargo", "formal", "baggy", "mom-fit"],
    combos: ["summer", "winter"],
    tshirts: ["Drop-shoulder", "graphic", "plain", "polo", "full-sleeve"],
  };

  // Clothing size choices depend on the product category.
  const sizeOptions =
    formData.category === "pants"
      ? ["28", "30", "32", "34", "36", "38", "40"]
      : ["XS", "S", "M", "L", "XL", "XXL"];

  const toggleSize = (size: string, checked: boolean) => {
    const currentSizes: string[] = formData.sizes || [];
    const sizes = checked
      ? Array.from(new Set([...currentSizes, size]))
      : currentSizes.filter((currentSize: string) => currentSize !== size);

    const size_stock = { ...(formData.size_stock || {}) };
    if (checked) {
      if (size_stock[size] === undefined || size_stock[size] === null) {
        size_stock[size] = 0;
      }
    } else {
      delete size_stock[size];
    }

    setFormData({ ...formData, sizes, size_stock });
  };

  const handleImageUpload = async (e: any) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    let urls: string[] = [];

    for (let file of files) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (!error) {
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        urls.push(data.publicUrl);
      }
    }

    setFormData({
      ...formData,
      images: [...(formData.images || []), ...urls], // append uploaded images
    });

    setUploading(false);
  };

  return (
    <div className="bg-[#fff] border border-yellow-500/40 rounded-2xl p-8 w-full max-w-3xl mx-auto shadow-2xl max-h-[90vh] overflow-y-auto bg-[var(--luxury-green)] text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-wide text-white">
          {product ? "EDIT PRODUCT" : "ADD PRODUCT"}
        </h2>
        <button
          onClick={onCancel}
          className="text-white/60 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* NAME */}
        <input
          placeholder="Product Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg focus:border-yellow-400 outline-none"
        />

        {/* CATEGORY */}
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value,
              subcategory: "",
            })
          }
          className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg focus:border-yellow-400"
        >
          <option value="shirts" className="bg-black text-base text-white">Shirts</option>
          <option value="pants" className="bg-black text-base text-white">Pants</option>
          <option value="combos" className="bg-black text-base text-white">Combos</option>
          <option value="tshirts" className="bg-black text-base text-white">T-Shirts</option>
        </select>

        {/* SUBCATEGORY */}
        <select
          value={formData.subcategory}
          onChange={(e) =>
            setFormData({ ...formData, subcategory: e.target.value })
          }
          className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg focus:border-yellow-400"
        >
          <option value="" className="bg-black text-base text-white">Select Subcategory</option>
          {subcategories[formData.category]?.map((sub: string) => (
            <option key={sub} value={sub} className="bg-black text-base text-white">
              {sub}
            </option>
          ))}
        </select>

        {/* PRICE */}
        <input
          type="number"
          placeholder="Price"
          value={formData.price ?? 0}
          onChange={(e) =>
            setFormData({ ...formData, price: Number(e.target.value) })
          }
          className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg focus:border-yellow-400"
        />
        
        {/* SIZE OPTIONS AND SIZE-WISE STOCK */}
        <div className="col-span-2 space-y-4 rounded-lg border border-white/15 p-4">
          <div>
            <label className="block mb-3 text-sm font-semibold text-white">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-3">
              {sizeOptions.map((size) => {
                const selected = (formData.sizes || []).includes(size);

                return (
                  <label
                    key={size}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                      selected
                        ? "border-yellow-400 bg-yellow-400/10"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => toggleSize(size, e.target.checked)}
                    />
                    <span className="font-medium text-white">{size}</span>
                  </label>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-white/60">
              {formData.category === "pants"
                ? "Choose waist sizes for pants."
                : "Choose clothing sizes available for this product."}
            </p>
          </div>

          {(formData.sizes || []).length > 0 && (
            <div>
              <label className="block mb-3 text-sm font-semibold text-white">
                Stock Quantity for Each Size
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(formData.sizes || []).map((size: string) => (
                  <div key={size} className="space-y-2">
                    <label className="block text-sm text-white/80">
                      Size {size}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      inputMode="numeric"
                      value={formData.size_stock?.[size] ?? 0}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        const quantity = rawValue === ""
                          ? 0
                          : Math.max(0, Math.floor(Number(rawValue) || 0));

                        setFormData({
                          ...formData,
                          size_stock: {
                            ...(formData.size_stock || {}),
                            [size]: quantity,
                          },
                        });
                      }}
                      className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg focus:border-yellow-400 outline-none"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-white/70">
                Total stock: {Object.values(formData.size_stock || {}).reduce(
                  (sum: number, quantity: any) => sum + Number(quantity || 0),
                  0
                )}
              </p>
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <textarea
          placeholder="Product Description"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="col-span-2 w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg focus:border-yellow-400 outline-none"
          rows={3}
        />

        {/* BADGE + FLAGS */}
        <div className="col-span-2 flex flex-wrap gap-4 items-center">
          <select
            value={formData.badge || ""}
            onChange={(e) =>
              setFormData({ ...formData, badge: e.target.value })
            }
            className="px-4 py-3 bg-transparent border border-white/20 rounded-lg"
          >
            <option value="" className="bg-black text-base text-white">No Badge</option>
            <option value="LIMITED" className="bg-black text-base text-white">LIMITED</option>
            <option value="UNIQUE" className="bg-black text-base text-white">UNIQUE</option>
            <option value="HOT DEAL" className="bg-black text-base text-white">HOT DEAL</option>
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.is_featured || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_featured: e.target.checked,
                })
              }
            />
            ⭐ Featured
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.is_trending || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_trending: e.target.checked,
                })
              }
            />
            🔥 Trending
          </label>
        </div>

        {/* OFFER PRICE */}
        <input
          type="number"
          placeholder="Offer Price (optional)"
          value={formData.offerprice || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              offerprice: e.target.value
                ? Number(e.target.value)
                : null,
            })
          }
          className="col-span-2 w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg"
        />

        {/* IMAGE */}
        <div className="col-span-2">
          <label className="block mb-2 text-sm text-white/70">Product Image</label>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg"
          />
        </div>

        {uploading && <p className="col-span-2">Uploading...</p>}

        {formData.images?.[0] && (
          <img
            src={formData.images[0]}
            className="w-28 h-28 object-cover rounded-lg col-span-2 border border-white/20"
          />
        )}
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => onSave(formData)}
          disabled={uploading}
          className="flex-1 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:scale-105 transition"
        >
          SAVE
        </button>

        <button
          onClick={onCancel}
          className="flex-1 py-3 bg-white/10 rounded-lg hover:bg-white/20"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}