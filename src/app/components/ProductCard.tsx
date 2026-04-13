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
    const phoneNumber = "9597929428";
    const message = `Hi! I'm interested in:\n\nProduct: ${product.name}\nPrice: ₹${product.offerprice || product.price
      }\n\nLink: ${window.location.origin}/product/${product.id}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link
        to={`/product/${product.id}`}
        className="block bg-card border-2 border-transparent hover:border-[var(--gold)] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
      >
        <div className="relative h-80 overflow-hidden bg-muted">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {product.badge && (
              <div className="bg-[var(--gold)] text-[var(--luxury-green)] px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                {product.badge}
              </div>
            )}
            {isLowStock && !isOutOfStock && (
              <div className="bg-[var(--gold)] text-[var(--luxury-green)] px-3 py-1 rounded-full text-xs font-bold">
                Only {product.stock} left
              </div>
            )}
            {isOutOfStock && (
              <div className="bg-destructive text-white px-3 py-1 rounded-full text-xs font-bold">
                OUT OF STOCK
              </div>
            )}
          </div>

          <div className="absolute inset-0 bg-[var(--luxury-green)]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ShoppingBag className="w-12 h-12 text-[var(--gold)]" />
            </motion.div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="mb-2">
            <span className="text-lg font-bold line-clamp-1">
              {product.name}
            </span>
            {product.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {product.description}
              </p>
            )}
          </h3>

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

          {/* SIZES */}
          {product.sizes?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {product.sizes.slice(0, 4).map((size: string) => (
                <span
                  key={size}
                  className="px-2 py-1 text-xs border rounded"
                >
                  {size}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2 mb-4">
            <div
              className={`w-2 h-2 rounded-full ${isOutOfStock
                ? "bg-destructive"
                : isLowStock
                  ? "bg-[var(--gold)]"
                  : "bg-green-500"
                }`}
            />
            <span className="text-sm text-muted-foreground">
              {isOutOfStock ? "Out of Stock" : "In Stock"}
            </span>
          </div>


        </div>
      </Link>
    </motion.div>
  );
}