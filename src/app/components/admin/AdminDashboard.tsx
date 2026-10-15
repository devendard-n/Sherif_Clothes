import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Package,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { supabase } from "../../../supabase";

export function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");

  useEffect(() => {
    const isAuth = localStorage.getItem("sherif-admin-auth") === "true";

    if (!isAuth) {
      navigate("/admin/login");
      return;
    }

    void fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Failed to fetch products:", error);
      alert(error.message);
      return;
    }

    setProducts(data || []);
  };

  const handleLogout = async () => {
    localStorage.removeItem("sherif-admin-auth");
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert(`Failed to delete product: ${error.message}`);
      return;
    }

    await fetchProducts();
  };

  const handleToggleOffer = async (product: any) => {
    const { error } = await supabase
      .from("products")
      .update({
        offerprice: product.offerprice
          ? null
          : Math.max(0, Number(product.price) - 200),
      })
      .eq("id", product.id);

    if (error) {
      alert(error.message);
      return;
    }

    await fetchProducts();
  };

  const handleToggleFeatured = async (product: any) => {
    const { error } = await supabase
      .from("products")
      .update({ is_featured: !product.is_featured })
      .eq("id", product.id);

    if (error) {
      alert(error.message);
      return;
    }

    await fetchProducts();
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      !filterCategory || product.category === filterCategory;

    const featuredMatch =
      !filterFeatured ||
      String(Boolean(product.is_featured)) === filterFeatured;

    return categoryMatch && featuredMatch;
  });

  const closeProductForm = () => {
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (product: any) => {
    const sizeStock = product.size_stock || {};

    const totalStock = Object.values(sizeStock).reduce(
      (total: number, quantity: any) =>
        total + Math.max(0, Number(quantity) || 0),
      0
    );

    const finalProduct = {
      ...product,
      images: product.images || [],
      sizes: product.sizes || [],
      size_stock: sizeStock,
      stock: totalStock,
    };

    let error;

    if (editingProduct) {
      const result = await supabase
        .from("products")
        .update(finalProduct)
        .eq("id", finalProduct.id);

      error = result.error;
    } else {
      const newProduct = { ...finalProduct };
      delete newProduct.id;

      const result = await supabase
        .from("products")
        .insert([newProduct]);

      error = result.error;
    }

    if (error) {
      alert(`Failed to save product: ${error.message}`);
      return;
    }

    await fetchProducts();
    closeProductForm();
    alert("Product saved successfully!");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-10 flex flex-wrap justify-between items-center gap-5">
          <div>
            <h1 className="text-4xl font-black">ADMIN DASHBOARD</h1>
            <p className="text-muted-foreground mt-2">
              Manage your products, images, and stock.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setIsAddingProduct(true);
              }}
              className="flex items-center gap-2 bg-[var(--gold)] text-black px-5 py-3 rounded-lg font-bold"
            >
              <Plus className="w-5 h-5" />
              ADD PRODUCT
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              LOGOUT
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filterCategory}
            onChange={(event) => setFilterCategory(event.target.value)}
            className="px-4 py-3 border rounded-lg bg-transparent"
          >
            <option value="">All Categories</option>
            <option value="shirts">Shirts</option>
            <option value="pants">Pants</option>
            <option value="tshirts">T-Shirts</option>
            <option value="combos">Combos</option>
          </select>

          <select
            value={filterFeatured}
            onChange={(event) => setFilterFeatured(event.target.value)}
            className="px-4 py-3 border rounded-lg bg-transparent"
          >
            <option value="">All Products</option>
            <option value="true">Featured</option>
            <option value="false">Normal</option>
          </select>
        </div>

        {/* PRODUCT TABLE */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left">
            <thead className="bg-black text-yellow-400">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Offer</th>
                <th className="p-3">Featured</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-3">
                    <img
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <span className="text-xs text-muted-foreground">
                      {product.images?.length || 0} image(s)
                    </span>
                  </td>

                  <td className="p-3">{product.name}</td>

                  <td className="p-3">
                    {product.category}
                    {product.subcategory
                      ? ` / ${product.subcategory}`
                      : ""}
                  </td>

                  <td className="p-3">₹{product.price}</td>

                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => void handleToggleOffer(product)}
                      className="underline"
                    >
                      {product.offerprice ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => void handleToggleFeatured(product)}
                    >
                      {product.is_featured ? "⭐ Featured" : "Normal"}
                    </button>
                  </td>

                  <td className="p-3">
                    {Number(product.stock) || 0}
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        title="Edit product"
                        onClick={() => setEditingProduct(product)}
                        className="text-yellow-400"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        title="Delete product"
                        onClick={() => void handleDeleteProduct(product.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PRODUCT FORM */}
        {(isAddingProduct || editingProduct) && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-3 sm:p-6">
            <div className="min-h-full flex items-start justify-center py-5">
              <ProductForm
                key={editingProduct?.id ?? "new-product"}
                product={editingProduct}
                onSave={handleSaveProduct}
                onCancel={closeProductForm}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ======================================================
   PRODUCT FORM
====================================================== */

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: any;
  onSave: (product: any) => Promise<void>;
  onCancel: () => void;
}) {
  useTheme();

  const [formData, setFormData] = useState<any>(() => ({
    description: product?.description || "",
    name: product?.name || "",
    category: product?.category || "shirts",
    subcategory: product?.subcategory || "",
    price: product?.price ?? 0,
    offerprice: product?.offerprice ?? null,
    stock: product?.stock ?? 0,
    images: Array.isArray(product?.images) ? [...product.images] : [],
    is_featured: product?.is_featured ?? false,
    is_trending: product?.is_trending ?? false,
    badge: product?.badge || "",
    colors: product?.colors || [],
    sizes: product?.sizes || [],
    size_stock: product?.size_stock || {},
    ...(product?.id !== undefined ? { id: product.id } : {}),
  }));

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const subcategories: Record<string, string[]> = {
    shirts: ["baggy", "Drop-shoulder", "formal", "unique"],
    pants: ["jeans", "cargo", "formal", "baggy", "mom-fit"],
    combos: ["summer", "winter"],
    tshirts: ["Drop-shoulder", "graphic", "plain", "polo", "full-sleeve"],
  };

  const sizeOptions =
    formData.category === "pants"
      ? ["28", "30", "32", "34", "36", "38", "40"]
      : ["XS", "S", "M", "L", "XL", "XXL"];

  const updateField = (field: string, value: any) => {
    setFormData((current: any) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleSize = (size: string, checked: boolean) => {
    setFormData((current: any) => {
      const currentSizes: string[] = current.sizes || [];

      const sizes = checked
        ? Array.from(new Set([...currentSizes, size]))
        : currentSizes.filter((item) => item !== size);

      const size_stock = { ...(current.size_stock || {}) };

      if (checked) {
        if (size_stock[size] === undefined) {
          size_stock[size] = 0;
        }
      } else {
        delete size_stock[size];
      }

      return { ...current, sizes, size_stock };
    });
  };

  /* UPLOAD IMAGE TO SUPABASE STORAGE */
  const uploadImageFile = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return null;
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}-${safeName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) {
      console.error("Image upload failed:", error);
      alert(`Image upload failed: ${error.message}`);
      return null;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  /* ADD MULTIPLE IMAGES */
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const url = await uploadImageFile(file);
        if (url) uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        setFormData((current: any) => ({
          ...current,
          images: [...(current.images || []), ...uploadedUrls],
        }));
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("An error occurred while uploading images.");
    } finally {
      setUploading(false);
    }
  };

  /* REPLACE A SPECIFIC IMAGE */
  const handleReplaceImage = async (index: number, file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setUploading(true);

    try {
      const newUrl = await uploadImageFile(file);

      if (!newUrl) return;

      setFormData((current: any) => {
        const images = [...(current.images || [])];

        if (index < images.length) {
          images[index] = newUrl;
        }

        return { ...current, images };
      });
    } catch (error) {
      console.error("Image replacement failed:", error);
      alert("Unable to replace this image.");
    } finally {
      setUploading(false);
    }
  };

  /* REMOVE IMAGE FROM PRODUCT */
  const handleRemoveImage = (index: number) => {
    const confirmed = window.confirm(
      "Remove this image from the product? Save the product to confirm this change."
    );

    if (!confirmed) return;

    setFormData((current: any) => ({
      ...current,
      images: (current.images || []).filter(
        (_: string, imageIndex: number) => imageIndex !== index
      ),
    }));
  };

  /* SAVE PRODUCT */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (uploading || saving) return;

    if (!formData.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    setSaving(true);

    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const totalStock = Object.values(formData.size_stock || {}).reduce(
    (total: number, quantity: any) =>
      total + Math.max(0, Number(quantity) || 0),
    0
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl rounded-2xl border border-yellow-500/40 bg-[var(--luxury-green)] p-5 sm:p-8 text-white shadow-2xl"
    >
      {/* FORM HEADER */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {product ? "EDIT PRODUCT" : "ADD PRODUCT"}
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Manage product details, photos, and stock.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          aria-label="Close product form"
          className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* PRODUCT NAME */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Product Name
          </label>
          <input
            required
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Product name"
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 outline-none focus:border-yellow-400"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(event) =>
              setFormData((current: any) => ({
                ...current,
                category: event.target.value,
                subcategory: "",
              }))
            }
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 outline-none focus:border-yellow-400"
          >
            <option value="shirts" className="bg-black">Shirts</option>
            <option value="pants" className="bg-black">Pants</option>
            <option value="combos" className="bg-black">Combos</option>
            <option value="tshirts" className="bg-black">T-Shirts</option>
          </select>
        </div>

        {/* SUBCATEGORY */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Subcategory
          </label>
          <select
            value={formData.subcategory}
            onChange={(event) =>
              updateField("subcategory", event.target.value)
            }
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 outline-none focus:border-yellow-400"
          >
            <option value="" className="bg-black">
              Select Subcategory
            </option>
            {(subcategories[formData.category] || []).map((subcategory) => (
              <option
                key={subcategory}
                value={subcategory}
                className="bg-black"
              >
                {subcategory}
              </option>
            ))}
          </select>
        </div>

        {/* PRICE */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Price (₹)
          </label>
          <input
            type="number"
            min="0"
            required
            value={formData.price}
            onChange={(event) =>
              updateField("price", Number(event.target.value))
            }
            placeholder="Price"
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 outline-none focus:border-yellow-400"
          />
        </div>

        {/* SIZE-WISE STOCK */}
        <div className="sm:col-span-2 rounded-lg border border-white/15 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Package className="h-5 w-5 text-yellow-400" />
            <h3 className="font-semibold">Available Sizes and Stock</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {sizeOptions.map((size) => {
              const selected = (formData.sizes || []).includes(size);

              return (
                <label
                  key={size}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 ${
                    selected
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-white/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={(event) =>
                      toggleSize(size, event.target.checked)
                    }
                  />
                  <span>{size}</span>
                </label>
              );
            })}
          </div>

          {(formData.sizes || []).length > 0 && (
            <div className="mt-5">
              <h4 className="mb-3 text-sm font-semibold">
                Quantity per Size
              </h4>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {formData.sizes.map((size: string) => (
                  <div key={size}>
                    <label className="mb-1 block text-sm text-white/70">
                      Size {size}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.size_stock?.[size] ?? 0}
                      onChange={(event) => {
                        const value = Math.max(
                          0,
                          Math.floor(Number(event.target.value) || 0)
                        );

                        setFormData((current: any) => ({
                          ...current,
                          size_stock: {
                            ...(current.size_stock || {}),
                            [size]: value,
                          },
                        }));
                      }}
                      className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 outline-none focus:border-yellow-400"
                    />
                  </div>
                ))}
              </div>

              <p className="mt-4 text-sm font-semibold text-yellow-300">
                Total stock: {totalStock}
              </p>
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold">
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description || ""}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder="Product description"
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 outline-none focus:border-yellow-400"
          />
        </div>

        {/* BADGE */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Product Badge
          </label>
          <select
            value={formData.badge || ""}
            onChange={(event) => updateField("badge", event.target.value)}
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3"
          >
            <option value="" className="bg-black">No Badge</option>
            <option value="LIMITED" className="bg-black">LIMITED</option>
            <option value="UNIQUE" className="bg-black">UNIQUE</option>
            <option value="HOT DEAL" className="bg-black">HOT DEAL</option>
          </select>
        </div>

        {/* OFFER PRICE */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Offer Price (optional)
          </label>
          <input
            type="number"
            min="0"
            value={formData.offerprice ?? ""}
            onChange={(event) =>
              updateField(
                "offerprice",
                event.target.value === ""
                  ? null
                  : Number(event.target.value)
              )
            }
            placeholder="Offer price"
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 outline-none focus:border-yellow-400"
          />
        </div>

        {/* PRODUCT FLAGS */}
        <div className="sm:col-span-2 flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(formData.is_featured)}
              onChange={(event) =>
                updateField("is_featured", event.target.checked)
              }
            />
            ⭐ Featured
          </label>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(formData.is_trending)}
              onChange={(event) =>
                updateField("is_trending", event.target.checked)
              }
            />
            🔥 Trending
          </label>
        </div>

        {/* ==================================================
            IMAGE MANAGER
        ================================================== */}
        <div className="sm:col-span-2 rounded-xl border border-yellow-400/30 p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <ImageIcon className="h-6 w-6 text-yellow-400" />
            <div>
              <h3 className="text-lg font-bold">Product Images</h3>
              <p className="text-sm text-white/60">
                Add, preview, replace, or remove product photos.
              </p>
            </div>
          </div>

          {/* ADD IMAGES */}
          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg bg-yellow-500 px-4 py-3 font-bold text-black transition hover:bg-yellow-400 ${
              uploading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <Plus className="h-5 w-5" />
            {uploading ? "Uploading..." : "Add Images"}

            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={(event) => void handleImageUpload(event)}
              className="hidden"
            />
          </label>

          {uploading && (
            <p className="mt-3 text-sm text-yellow-300">
              Please wait while your images upload...
            </p>
          )}

          {/* IMAGE PREVIEWS */}
          {(formData.images || []).length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {formData.images.map((imageUrl: string, index: number) => (
                <div
                  key={`${imageUrl}-${index}`}
                  className="overflow-hidden rounded-lg border border-white/20 bg-black/20"
                >
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="h-40 w-full object-cover"
                    />

                    <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                      Image {index + 1}
                    </span>
                  </div>

                  <div className="p-2">
                    {/* REPLACE IMAGE */}
                    <label
                      className={`mb-2 flex cursor-pointer items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20 ${
                        uploading ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <ImageIcon className="h-4 w-4" />
                      Replace

                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          event.target.value = "";

                          if (file) {
                            void handleReplaceImage(index, file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>

                    {/* REMOVE IMAGE */}
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => handleRemoveImage(index)}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-red-600/90 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-white/30 p-8 text-center">
              <ImageIcon className="mx-auto mb-3 h-10 w-10 text-white/40" />
              <p className="font-semibold">No product images</p>
              <p className="mt-1 text-sm text-white/60">
                Click Add Images to upload photos for this product.
              </p>
            </div>
          )}

          <p className="mt-4 text-xs text-white/50">
            Image changes are saved when you click Save Product. Removing a
            photo here removes it from this product's image list, but does not
            delete the original file from Supabase Storage.
          </p>
        </div>
      </div>

      {/* SAVE AND CANCEL */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={uploading || saving}
          className="flex-1 rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "SAVING..." : "SAVE PRODUCT"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 rounded-lg bg-white/10 px-5 py-3 font-semibold hover:bg-white/20 disabled:opacity-50"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}