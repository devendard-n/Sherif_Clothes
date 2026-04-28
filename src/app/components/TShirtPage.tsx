import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { supabase } from "../../supabase";
import { ProductCard } from "./ProductCard";
import { ProductFilters } from "./ProductFilters";
import { useSearchParams } from "react-router-dom";

const subcategories: Record<string, string> = {
  "Drop-shoulder": "Drop-shoulder",
  plain: "Plain",
  polo: "Polo",
  "full-sleeve": "Full Sleeve",
};

export function TShirtPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  // ✅ FILTER STATES
  const [selectedSub, setSelectedSub] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");

  // ✅ URL PARAM
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

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

  // ✅ APPLY URL FILTER
  useEffect(() => {
    if (type) {
      setSelectedSub(type);
    }
  }, [type]);

  // ✅ MAIN FILTER ENGINE (single source of truth)
  useEffect(() => {
    let filtered = [...products];

    // SUBCATEGORY
    if (selectedSub) {
      filtered = filtered.filter(
        (p) =>
          p.subcategory?.toLowerCase() ===
          selectedSub.toLowerCase()
      );
    }

    // SIZE
    if (selectedSize) {
      filtered = filtered.filter((p) =>
        p.sizes?.includes(selectedSize.toUpperCase())
      );
    }


    // PRICE
    if (selectedPrice === "under1000") {
      filtered = filtered.filter(
        (p) => Number(p.offerprice || p.price) < 1000
      );
    }

    if (selectedPrice === "1000-2000") {
      filtered = filtered.filter((p) => {
        const price = Number(p.offerprice || p.price);
        return price >= 1000 && price <= 2000;
      });
    }

    if (selectedPrice === "above2000") {
      filtered = filtered.filter(
        (p) => Number(p.offerprice || p.price) > 2000
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedSub, selectedSize, selectedColor, selectedPrice]);

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

        {/* FILTER */}
        <ProductFilters
          products={products}
          subcategories={Object.keys(subcategories)}
          selectedSub={selectedSub}
          setSelectedSub={setSelectedSub}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          priceRange={selectedPrice}
          setPriceRange={setSelectedPrice}
        />

        {/* PRODUCTS */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((product) => (
              <motion.div key={product.id}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              No T-Shirts Found
            </p>
          </div>
        )}

      </div>
    </div>
  );
}