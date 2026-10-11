import { motion } from "motion/react";
import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const orderViaWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    const phoneNumber = "919003091927";

    const message = `Hi! I'm interested in:

Product: ${product.name}
Price: ₹${product.offerprice || product.price}

Link: ${window.location.origin}/product/${product.id}`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const stock = Math.max(0, Number(product.stock) || 0);
  const isLowStock = stock > 0 && stock <= 5;
  const isOutOfStock = stock === 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link
        to={`/product/${product.id}`}
        aria-label={`${product.name}${isOutOfStock ? ", out of stock" : ""}`}
        className={`block bg-card border-2 border-transparent rounded-lg overflow-hidden transition-all duration-300 ${
          isOutOfStock
            ? "opacity-80 cursor-not-allowed"
            : "hover:border-[var(--gold)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        }`}
      >
        {/* Product image */}
        <div className="relative h-80 overflow-hidden bg-muted">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isOutOfStock ? "grayscale" : "group-hover:scale-110"
            }`}
          />

          {/* Hover overlay */}
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-[var(--luxury-green)]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ShoppingBag className="w-12 h-12 text-[var(--gold)]" />
              </motion.div>
            </div>
          )}

          {/* Stock status badge */}
          {isOutOfStock ? (
            <div className="absolute top-3 left-3 rounded-md bg-red-600 px-3 py-2 text-sm font-bold text-white shadow-md">
              Out of Stock
            </div>
          ) : isLowStock ? (
            <div className="absolute top-3 left-3 rounded-md bg-orange-500 px-3 py-2 text-sm font-bold text-white shadow-md">
              Only {stock} left!
            </div>
          ) : null}
        </div>

        {/* Product details */}
        <div className="p-6">
          <h3 className="mb-2">
            <span className="text-lg font-bold line-clamp-1">
              {product.name}
            </span>
          </h3>

          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center space-x-3 mb-4">
            {product.offerprice ? (
              <>
                <span className="text-2xl font-bold text-[var(--gold)]">
                  ₹{product.offerprice}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-[var(--gold)]">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Stock text */}
          {isOutOfStock ? (
            <p className="text-sm font-semibold text-red-600">
              This product is currently unavailable.
            </p>
          ) : isLowStock ? (
            <p className="text-sm font-semibold text-orange-500">
              Hurry! Only {stock} left in stock.
            </p>
          ) : (
            <p className="text-sm font-medium text-green-600">
              In Stock
            </p>
          )}

          {/* WhatsApp order button */}
          <button
            type="button"
            onClick={orderViaWhatsApp}
            disabled={isOutOfStock}
            className={`mt-4 w-full rounded-md px-4 py-3 font-semibold transition-colors ${
              isOutOfStock
                ? "cursor-not-allowed bg-gray-300 text-gray-600"
                : "bg-[var(--luxury-green)] text-white hover:bg-[var(--gold)] hover:text-black"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "Order via WhatsApp"}
          </button>
        </div>
      </Link>
    </motion.div>
  );
}