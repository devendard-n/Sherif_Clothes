import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useParams } from "react-router";
import { supabase } from "../../supabase";
import { ProductCard } from "./ProductCard";
import { Product } from "../types/product";
import { ProductFilters } from "./ProductFilters";

const subcategories = {
  baggy: "Baggy",
  regular: "Regular",
  formal: "Formal",
  oversized: "Oversized",
};

export function ShirtsPage() {
  const { subcategory } = useParams();

  const [selectedSub, setSelectedSub] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>(""); // ✅ added
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("category", "shirts");

      if (subcategory) {
        query = query.eq("subcategory", subcategory);
        setSelectedSub(subcategory); // ✅ sync UI
      }

      const { data, error } = await query;

      if (error) console.error(error);
      else setProducts(data as Product[]);
    };

    fetchProducts();
  }, [subcategory]);

  let filtered = products;

  // ✅ SUBCATEGORY (FIXED)
  if (selectedSub) {
    filtered = filtered.filter((p) => p.subcategory === selectedSub);
  }

  // ✅ SIZE
  if (selectedSize !== "all") {
    filtered = filtered.filter((p) =>
      p.sizes?.includes(selectedSize.toUpperCase())
    );
  }

  // ✅ COLOR (FIXED)
  if (selectedColor) {
    filtered = filtered.filter((p) =>
      p.colors?.includes(selectedColor)
    );
  }

  // ✅ PRICE
  if (priceRange !== "all") {
    filtered = filtered.filter((p) => {
      const price = p.offerprice || p.price;

      if (priceRange === "under1000") return price < 1000;
      if (priceRange === "1000-1500")
        return price >= 1000 && price <= 1500;
      if (priceRange === "above1500") return price > 1500;

      return true;
    });
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4">
            <span className="text-4xl sm:text-5xl font-black tracking-wider">
              {subcategory
                ? subcategories[subcategory as keyof typeof subcategories]
                : "ALL SHIRTS"}
            </span>
          </h1>
          <p className="text-muted-foreground">
            Discover our premium collection of men's shirts
          </p>
        </motion.div>

        {/* ✅ FILTERS */}
        <ProductFilters
          products={products} // ✅ REQUIRED
          subcategories={Object.keys(subcategories)}
          selectedSub={selectedSub}
          setSelectedSub={setSelectedSub}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedColor={selectedColor} // ✅ added
          setSelectedColor={setSelectedColor} // ✅ added
        />

        {/* PRODUCTS */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, index) => (
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
              No products found with the selected filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}