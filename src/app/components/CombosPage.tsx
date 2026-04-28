import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { ProductCard } from "./ProductCard";
import { Package } from "lucide-react";
import { Product } from "../types/product";
import { ProductFilters } from "./ProductFilters";
import { useSearchParams } from "react-router-dom"; // ✅ ADDED

export function CombosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("");

  // ✅ NEW: subcategory state
  const [selectedSub, setSelectedSub] = useState<string>("");

  // ✅ NEW: subcategories
  const subcategories = ["summer", "winter"];

  // ✅ NEW: read URL param
  const [searchParams] = useSearchParams();
  const subcategoryParam = searchParams.get("type");

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

  // ✅ APPLY URL FILTER
  useEffect(() => {
    if (subcategoryParam) {
      setSelectedSub(subcategoryParam);
    }
  }, [subcategoryParam]);

  // ✅ FILTER LOGIC
  useEffect(() => {
    let filtered = products;

    // ✅ SUBCATEGORY
    if (selectedSub) {
      filtered = filtered.filter(
        (p) =>
          p.subcategory?.toLowerCase() ===
          selectedSub.toLowerCase()
      );
    }

    // SIZE
    if (selectedSize && selectedSize !== "all") {
      filtered = filtered.filter((p) =>
        p.sizes?.some(
          (s: string) =>
            s.toLowerCase() === selectedSize.toLowerCase()
        )
      );
    }

    // PRICE
    if (priceRange !== "all") {
      filtered = filtered.filter((p) => {
        const price = Number(p.offerprice || p.price);

        if (priceRange === "under1000") return price < 1000;

        if (priceRange === "1000-2000")
          return price >= 1000 && price <= 2000;

        if (priceRange === "above2000") return price > 2000;

        return false;
      });
    }

    // COLOR
    if (selectedColor) {
      filtered = filtered.filter((p) =>
        p.colors?.some(
          (c: string) =>
            c.toLowerCase() === selectedColor.toLowerCase()
        )
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedSize, priceRange, selectedColor, selectedSub]);

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

        {/* FILTER */}
        <ProductFilters
          products={products}
          subcategories={subcategories}        // ✅ ADDED
          selectedSub={selectedSub}            // ✅ ADDED
          setSelectedSub={setSelectedSub}      // ✅ ADDED
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />

        {/* PRODUCTS */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((product, index) => (
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
              No combo offers 
            </p>
          </div>
        )}

      </div>
    </div>
  );
}