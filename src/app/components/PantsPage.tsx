import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useSearchParams } from "react-router-dom"; // ✅ FIXED
import { supabase } from "../../supabase";
import { ProductCard } from "./ProductCard";
import { ProductFilters } from "./ProductFilters";
import { Product } from "../types/product";

const subcategories: Record<string, string> = {
  jeans: "Jeans",
  formal: "Formal",
  baggy: "Baggy",
  "mom-fit": "Mom Fit",
  cargo: "Cargo",
};

export function PantsPage() {
  // ✅ Read query param (type-safe)
  const [searchParams] = useSearchParams();
  const subcategory = searchParams.get("type") as string | null;

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSub, setSelectedSub] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("category", "pants");

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

  // ✅ FILTER LOGIC
  let filtered = products;

  // SUBCATEGORY
  if (selectedSub) {
    filtered = filtered.filter(
      (p) => p.subcategory === selectedSub
    );
  }

  // SIZE
  if (selectedSize !== "all") {
    filtered = filtered.filter((p) =>
      p.sizes?.includes(selectedSize)
    );
  }

  // COLOR
  if (selectedColor) {
    filtered = filtered.filter((p) =>
      p.colors?.includes(selectedColor)
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
                ? subcategories[subcategory]
                : "ALL PANTS"}
            </span>
          </h1>
          <p className="text-muted-foreground">
            Explore our premium range of men's pants
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
            {filtered.map((product) => (
              <motion.div key={product.id}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              No products found 
            </p>
          </div>
        )}

      </div>
    </div>
  );
}