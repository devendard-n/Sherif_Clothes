import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useSearchParams } from "react-router-dom"; // ✅ FIXED
import { supabase } from "../../supabase";
import { ProductCard } from "./ProductCard";
import { Product } from "../types/product";
import { ProductFilters } from "./ProductFilters";

const subcategories: Record<string, string> = {
  unique: "unique",
  formal: "Formal",
  "Drop-shoulder": "Drop-shoulder",
};

export function ShirtsPage() {


  // ✅ NEW (same as PantsPage)
  const [searchParams] = useSearchParams();
  const subcategory = searchParams.get("type") as string | null;

  const [selectedSub, setSelectedSub] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("");
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
  }, [subcategory]); // ✅ reacts to ?type=

  let filtered = products;

  // SUBCATEGORY
  if (selectedSub) {
    filtered = filtered.filter((p) => p.subcategory === selectedSub);
  }

  // SIZE
  if (selectedSize !== "all") {
    filtered = filtered.filter((p) =>
      p.sizes?.includes(selectedSize)
    );
  }



  // PRICE
  if (priceRange !== "all") {
    filtered = filtered.filter((p) => {
      const price = p.offerprice || p.price;

      if (priceRange === "under1000") return price < 1000;

      if (priceRange === "1000-2000")
        return price >= 1000 && price <= 2000;

      if (priceRange === "above2000") return price > 2000;

      return false; // ✅ IMPORTANT (not true)
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

        {/* FILTERS */}
        <ProductFilters
          products={products}
          subcategories={Object.keys(subcategories)}
          selectedSub={selectedSub}
          setSelectedSub={setSelectedSub}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />

        {/* PRODUCTS */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filtered.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              No products found with the selected filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}