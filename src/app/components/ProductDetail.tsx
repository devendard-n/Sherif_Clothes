import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import { supabase } from "../../supabase";
import { ChevronLeft } from "lucide-react";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
  const hasColors = Array.isArray(product.colors) && product.colors.length > 0;

  const getSizeStock = (size: string): number => {
    return Math.max(0, Number(product.size_stock?.[size]) || 0);
  };

  const getColorStock = (color: string): number => {
    return Math.max(0, Number(product.color_stock?.[color]) || 0);
  };

  const selectedSizeStock = selectedSize ? getSizeStock(selectedSize) : null;
  const selectedColorStock = selectedColor ? getColorStock(selectedColor) : null;

  const handleOrderWhatsApp = () => {
    if (hasSizes && !selectedSize) {
      alert("Please select a size.");
      return;
    }

    if (hasColors && !selectedColor) {
      alert("Please select a color.");
      return;
    }

    if (selectedSize && getSizeStock(selectedSize) === 0) {
      alert("The selected size is out of stock.");
      return;
    }

    if (selectedColor && getColorStock(selectedColor) === 0) {
      alert("The selected color is out of stock.");
      return;
    }

    const message = `Hi! I'd like to order:

Product: ${product.name}
${hasSizes ? `Size: ${selectedSize}` : ""}
${hasColors ? `Color: ${selectedColor}` : ""}
Price: ₹${product.offerprice || product.price}

Product Link: ${window.location.href}`;

    window.open(
      `https://wa.me/919003091927?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const totalSizeStock = hasSizes
    ? product.sizes.reduce(
        (total: number, size: string) => total + getSizeStock(size),
        0
      )
    : Number(product.stock) || 0;

  const isOutOfStock = hasSizes
    ? totalSizeStock === 0
    : Number(product.stock) === 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* BACK */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-[var(--gold)] mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>BACK</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* IMAGES */}
          <div>
            <img
              src={product.images?.[selectedImage] || "/placeholder.jpg"}
              alt={product.name}
              className="w-full rounded-lg mb-4"
            />

            <div className="flex gap-2 flex-wrap">
              {product.images?.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 object-cover cursor-pointer border ${
                    selectedImage === index
                      ? "border-yellow-500"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {product.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {product.description}
              </p>
            )}

            {/* PRICE */}
            <div className="my-4 text-xl font-bold">
              {product.offerprice ? (
                <>
                  <span>₹{product.offerprice}</span>{" "}
                  <span className="line-through text-muted-foreground">
                    ₹{product.price}
                  </span>
                </>
              ) : (
                <>₹{product.price}</>
              )}
            </div>

            {/* SIZE-WISE STOCK */}
            {hasSizes && (
              <div className="mt-6">
                <h3 className="mb-3 font-semibold">Select Size</h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.sizes.map((size: string) => {
                    const qty = getSizeStock(size);
                    const outOfStock = qty === 0;
                    const lowStock = qty > 0 && qty <= 5;
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={outOfStock}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-lg border p-3 text-left transition ${
                          isSelected
                            ? "border-[var(--gold)] bg-[var(--gold)]/10"
                            : "border-border"
                        } ${
                          outOfStock
                            ? "cursor-not-allowed opacity-60"
                            : "hover:border-[var(--gold)]"
                        }`}
                      >
                        <span className="block font-bold">{size}</span>

                        <span
                          className={`mt-1 block text-sm ${
                            outOfStock
                              ? "text-red-500"
                              : lowStock
                              ? "text-orange-500"
                              : "text-green-500"
                          }`}
                        >
                          {outOfStock
                            ? "Out of Stock"
                            : lowStock
                            ? `Only ${qty} left`
                            : "In Stock"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedSizeStock !== null && (
                  <p className="mt-3 font-semibold">
                    Selected size ({selectedSize}):{" "}
                    {selectedSizeStock === 0 ? (
                      <span className="text-red-500">Out of Stock</span>
                    ) : selectedSizeStock <= 5 ? (
                      <span className="text-orange-500">
                        Only {selectedSizeStock} left
                      </span>
                    ) : (
                      <span className="text-green-500">In Stock</span>
                    )}
                  </p>
                )}
              </div>
            )}

            {/* COLOR-WISE STOCK */}
            {hasColors && (
              <div className="mt-6">
                <h3 className="mb-3 font-semibold">Select Color</h3>

                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color: string) => {
                    const qty = getColorStock(color);
                    const outOfStock = qty === 0;
                    const lowStock = qty > 0 && qty <= 5;

                    return (
                      <button
                        key={color}
                        type="button"
                        disabled={outOfStock}
                        onClick={() => setSelectedColor(color)}
                        className={`rounded-lg border px-4 py-2 transition ${
                          selectedColor === color
                            ? "bg-[var(--gold)] text-[var(--luxury-green)]"
                            : ""
                        } ${
                          outOfStock
                            ? "cursor-not-allowed opacity-50 line-through"
                            : "hover:bg-muted"
                        }`}
                      >
                        <span className="block">{color}</span>
                        <span className="block text-xs">
                          {outOfStock
                            ? "Out of Stock"
                            : lowStock
                            ? `Only ${qty} left`
                            : "In Stock"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STOCK FOR PRODUCTS WITHOUT SIZES OR COLORS */}
            {!hasSizes && !hasColors && (
              <div className="mt-4 font-semibold">
                {isOutOfStock ? (
                  <span className="text-red-500">Out of Stock</span>
                ) : totalSizeStock <= 5 ? (
                  <span className="text-orange-500">
                    Only {totalSizeStock} left
                  </span>
                ) : (
                  <span className="text-green-500">In Stock</span>
                )}
              </div>
            )}

            {/* ORDER BUTTON */}
            <button
              type="button"
              onClick={handleOrderWhatsApp}
              disabled={isOutOfStock}
              className={`mt-8 w-full py-4 rounded-lg font-bold transition ${
                isOutOfStock
                  ? "cursor-not-allowed bg-gray-300 text-gray-600"
                  : "bg-[var(--gold)] text-[var(--luxury-green)]"
              }`}
            >
              {isOutOfStock ? "OUT OF STOCK" : "ORDER VIA WHATSAPP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
