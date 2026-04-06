import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { supabase } from "../../supabase";
import { ProductCard } from "./ProductCard";
import { ProductFilters } from "./ProductFilters"; // ✅ CORRECT

export function TShirtPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", "tshirts");

    if (error) console.error(error);
    else {
      setProducts(data || []);
      setFilteredProducts(data || []);
    }
  };

  // ✅ FILTER LOGIC
  const handleFilterChange = (filters: any) => {
    let result = [...products];

    if (filters.subcategory) {
      result = result.filter((p) => p.subcategory === filters.subcategory);
    }

    if (filters.size) {
      result = result.filter((p) =>
        p.sizes?.includes(filters.size)
      );
    }

    if (filters.color) {
      result = result.filter((p) => p.color === filters.color);
    }

    if (filters.price === "low") {
      result = result.filter((p) => (p.offerprice || p.price) < 1000);
    }

    if (filters.price === "mid") {
      result = result.filter((p) => {
        const price = p.offerprice || p.price;
        return price >= 1000 && price <= 2000;
      });
    }

    if (filters.price === "high") {
      result = result.filter((p) => (p.offerprice || p.price) > 2000);
    }

    setFilteredProducts(result);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <motion.div className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-wider">
            T-SHIRTS
          </h1>
          <p className="text-muted-foreground">
            Premium collection of t-shirts
          </p>
        </motion.div>

        {/* ✅ FILTER */}
        <ProductFilters onFilterChange={handleFilterChange} />

        {/* PRODUCTS */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div key={product.id}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground">
              No T-Shirts Found
            </p>
          </div>
        )}

      </div>
    </div>
  );
}