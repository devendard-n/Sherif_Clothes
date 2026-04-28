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

      if (error) console.error(error);
      else setProduct(data);
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

  const handleOrderWhatsApp = () => {
    const hasSizes = product.sizes?.length > 0;
    const hasColors = product.colors?.length > 0;

    // If admin added sizes, user must select size
    if (hasSizes && !selectedSize) {
      alert("Please select size");
      return;
    }

    // If admin added colors, user must select color
    if (hasColors && !selectedColor) {
      alert("Please select color");
      return;
    }

    const message = `Hi! I'd like to order:

Product: ${product.name}
${hasSizes ? `Size: ${selectedSize}` : ""}
${hasColors ? `Color: ${selectedColor}` : ""}
Price: ₹${product.offerprice || product.price}

Product Link: ${window.location.href}`;

    window.open(
      `https://wa.me/9003091927?text=${encodeURIComponent(message)}`
    );
  };
  // Size Stock check
  const getStock = () => {
    if (!selectedSize) return null;
    return product.size_stock?.[selectedSize] ?? 0;
  };

  // Color Stock check

  const getColorStock = () => {
    if (!selectedColor) return null;
    return product.color_stock?.[selectedColor] ?? 0;
  };

  const colorStock = getColorStock();

  const stock = getStock();

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

          {/* IMAGE */}
          <div>
            <div>
              <img
                src={product.images?.[selectedImage]}
                className="w-full rounded-lg mb-4"
              />

              <div className="flex gap-2 flex-wrap">
                {product.images?.map((img: string, index: number) => (
                  <img
                    key={index}
                    src={img}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 cursor-pointer border ${selectedImage === index ? "border-yellow-500" : ""
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* INFO */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {product.description}
              </p>
            )}

            <div className="my-4 text-xl font-bold">
              {product.offerprice ? (
                <>
                  ₹{product.offerprice}{" "}
                  <span className="line-through text-muted-foreground">
                    ₹{product.price}
                  </span>
                </>
              ) : (
                <>₹{product.price}</>
              )}
            </div>

            {/* 🔥 SIZES */}
            {product.sizes?.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 font-semibold">Select Size</h3>

                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition ${selectedSize === size
                        ? "bg-[var(--gold)] text-[var(--luxury-green)]"
                        : "hover:bg-muted"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 🔥 COLORS */}
            {product.colors?.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 font-semibold">Select Color</h3>

                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg transition ${selectedColor === color
                        ? "bg-[var(--gold)] text-[var(--luxury-green)]"
                        : "hover:bg-muted"
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                {colorStock !== null && (
                  <div className="mt-4 font-semibold">
                    {colorStock === 0 ? (
                      <span className="text-red-500">Out of Stock</span>
                    ) : colorStock <= 5 ? (
                      <span className="text-orange-500">
                        Only {colorStock} left
                      </span>
                    ) : (
                      <span className="text-green-500">In Stock</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* stock */}

            {stock !== null && (
              <div className="mt-4 font-semibold">
                {stock === 0 ? (
                  <span className="text-red-500">Out of Stock</span>
                ) : stock <= 5 ? (
                  <span className="text-orange-500">
                    Only {stock} left
                  </span>
                ) : (
                  <span className="text-green-500">In Stock</span>
                )}
              </div>
            )}

            {/* ORDER */}
            <button
              onClick={handleOrderWhatsApp}
              className="mt-8 w-full py-4 bg-[var(--gold)] text-[var(--luxury-green)] rounded-lg font-bold"
            >
              ORDER VIA WHATSAPP
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}