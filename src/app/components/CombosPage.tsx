import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { ProductCard } from "./ProductCard";
import { Package } from "lucide-react";
import { Product } from "../types/product";
import { ProductFilters } from "./ProductFilters"; // ✅ CORRECT

export function CombosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "combos");

      if (error) console.error(error);
      else {
        setProducts(data as Product[]);
        setFilteredProducts(data as Product[]);
      }
    };

    fetchProducts();
  }, []);

  // ✅ FILTER LOGIC
  const handleFilterChange = (filters: any) => {
    let result = [...products];

    if (filters.subcategory) {
      result = result.filter(
        (p: any) => p.subcategory === filters.subcategory
      );
    }

    if (filters.color) {
      result = result.filter(
        (p: any) => p.color === filters.color
      );
    }

    if (filters.size) {
      result = result.filter(
        (p: any) => p.size === filters.size
      );
    }

    if (filters.price === "low") {
      result = result.filter((p: any) => p.price < 500);
    }

    if (filters.price === "mid") {
      result = result.filter(
        (p: any) => p.price >= 500 && p.price <= 1000
      );
    }

    if (filters.price === "high") {
      result = result.filter((p: any) => p.price > 1000);
    }

    setFilteredProducts(result);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-[var(--gold)]/10 border border-[var(--gold)] px-4 py-2 rounded-full mb-6">
            <Package className="w-5 h-5 text-[var(--gold)]" />
            <span className="text-[var(--gold)] text-sm tracking-wider">
              BUNDLE DEALS
            </span>
          </div>
          <h1 className="mb-4">
            <span className="text-4xl sm:text-5xl font-black tracking-wider">
              COMBO OFFERS
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete outfits at unbeatable prices. Save more when you buy together!
          </p>
        </motion.div>

        {/* ✅ FILTER */}
        <ProductFilters onFilterChange={handleFilterChange} />

        {/* PRODUCTS */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground">
              No combo offers available at the moment
            </p>
          </div>
        )}

      </div>
    </div>
  );
}