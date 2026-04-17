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
                  <input
                    type="number"
                    value={p.stock}
                    onChange={async (e) => {
                      await supabase
                        .from("products")
                        .update({ stock: Number(e.target.value) })
                        .eq("id", p.id);
                      fetchProducts();
                    }}
                    className="w-16 border"
                  />
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
      images: [""],
      is_featured: false,
      is_trending: false,
      badge: "",
      colors: [],
      sizes: [],
      size_stock: {},
      color_stock: {},
    }
  );

  const [uploading, setUploading] = useState(false);

  const subcategories: any = {
    shirts: ["baggy", "oversized", "formal", "regular"],
    pants: ["jeans", "cargo", "formal", "baggy", "mom-fit"],
    combos: ["summer", "winter"],
    tshirts: ["oversized", "graphic", "plain", "polo", "full-sleeve"],
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
      images: [...formData.images, ...urls], // ✅ append images
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
          onChange={(e) =>
            setFormData({ ...formData, price: Number(e.target.value) })
          }
          className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg focus:border-yellow-400"
        />
        {/* ================= SIZE SECTION ================= */}
        <div className="col-span-2">

          <label className="block mb-2 font-medium">
            {formData.category === "pants" ? "Add Hip Sizes" : "Add Sizes"}
          </label>

          {/* ✅ NORMAL SIZE (ONLY FOR NON-PANTS) */}
          {formData.category !== "pants" && (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Enter size (e.g. M)"
                id="sizeInput"
                className="px-4 py-2 border rounded w-full"
              />

              <button
                type="button"
                onClick={() => {
                  const input: any = document.getElementById("sizeInput");
                  const value = input.value.trim().toUpperCase();

                  if (!value) return;

                  if (!formData.sizes.includes(value)) {
                    setFormData({
                      ...formData,
                      sizes: [...formData.sizes, value],
                      size_stock: {
                        ...formData.size_stock,
                        [value]: formData.size_stock?.[value] || 0,
                      },
                    });
                  }

                  input.value = "";
                }}
                className="px-4 bg-[var(--gold)] rounded"
              >
                Add
              </button>
            </div>
          )}

          {/* ✅ HIP SIZE (ONLY FOR PANTS) */}
          {formData.category === "pants" && (
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                placeholder="Enter hip size (e.g. 32)"
                id="hipInput"
                className="px-4 py-2 border rounded w-full"
              />

              <button
                type="button"
                onClick={() => {
                  const input: any = document.getElementById("hipInput");
                  const value = input.value.trim();

                  if (!value) return;

                  if (!formData.sizes.includes(value)) {
                    setFormData({
                      ...formData,
                      sizes: [...formData.sizes, value],
                      size_stock: {
                        ...formData.size_stock,
                        [value]: formData.size_stock?.[value] || 0,
                      },
                    });
                  }

                  input.value = "";
                }}
                className="px-4 bg-[var(--gold)] rounded"
              >
                Add
              </button>
            </div>
          )}

          {/* SIZE TAGS (UNCHANGED) */}
          <div className="flex gap-2 flex-wrap">
            {formData.sizes.map((size: string) => (
              <div
                key={size}
                className="px-3 py-1 bg-muted rounded flex items-center gap-2 text-black"
              >
                {size}
                <button
                  onClick={() => {
                    const updated = formData.sizes.filter(
                      (s: string) => s !== size
                    );

                    const updatedStock = { ...formData.size_stock };
                    delete updatedStock[size];

                    setFormData({
                      ...formData,
                      sizes: updated,
                      size_stock: updatedStock,
                    });
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

        </div>
        {/* ================= END SIZE SECTION ================= */}

        {/* SIZE STOCK */}
        <div className="col-span-2 bg-black/20 p-4 rounded-xl space-y-3">
          <p className="text-sm text-white/70">Size Stock</p>
          {formData.sizes.map((size: string) => (
            <div key={size} className="flex items-center gap-4">
              <span className="w-8 font-semibold">{size}</span>

              <input
                type="number"
                placeholder="Stock"
                value={formData.size_stock?.[size] ?? ""}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setFormData((prev: any) => ({
                    ...prev,
                    size_stock: {
                      ...prev.size_stock,
                      [size]: value,
                    },
                  }));
                }}
                className="w-24 px-3 py-2 bg-transparent border border-white/20 rounded"
              />
            </div>
          ))}
        </div>

        {/* COLORS */}
        <div className="col-span-2 bg-black/20 p-4 rounded-xl space-y-3">
          <p className="text-sm text-white/70">Color Stock</p>

          {formData.colors.map((color: string) => (
            <div key={color} className="flex items-center gap-4">
              <span className="w-20 font-semibold">{color}</span>

              <input
                type="number"
                value={formData.color_stock?.[color] ?? 0}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  setFormData((prev: any) => ({
                    ...prev,
                    color_stock: {
                      ...prev.color_stock,
                      [color]: value,
                    },
                  }));
                }}
                className="w-24 px-3 py-2 bg-transparent border border-white/20 rounded"
              />
            </div>
          ))}
        </div>


        {/* PRODUCT DISCRIPTION */}

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