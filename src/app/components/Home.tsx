import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Star, TrendingUp } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabase";
import { useTheme } from "../contexts/ThemeContext";
import { CategorySection } from "./CategorySection";

export function Home() {
  const [offerProducts, setOfferProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ THEME
  const { theme } = useTheme();

  // ✅ SLIDER STATE (UNCHANGED)
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { type: "video", src: "./src/videos/bg.mp4" },
    { type: "image", src: "./src/images/test3.jpeg" },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error(error);
      return;
    }

    const trending = data.filter(
      (p: any) => p.is_trending || p.offerprice
    );

    const featured = data.filter((p: any) => p.is_featured);

    setOfferProducts(trending);
    setFeaturedProducts(featured);
  };

  // AUTO SCROLL (UNCHANGED)
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      if (scrollContainer) {
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
    };

    const intervalId = setInterval(scroll, 20);
    return () => clearInterval(intervalId);
  }, []);

  // AUTO SLIDE (UNCHANGED)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${theme === "dark"
          ? "bg-[var(--luxury-green)] text-white"
          : "bg-white text-black"
        }`}
    >

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">

        {/* SLIDES */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${currentSlide === index ? "opacity-100" : "opacity-0"
                }`}
            >
              {slide.type === "video" ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={slide.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={slide.src}
                  className="w-full h-full object-cover"
                />
              )}

              {/* ✅ THEME BASED OVERLAY */}
              <div
                className={`absolute inset-0 ${theme === "dark"
                    ? "bg-gradient-to-r from-[var(--luxury-green)]/95 via-[var(--luxury-green)]/80 to-transparent"
                    : "bg-gradient-to-r from-white/80 via-white/50 to-transparent"
                  }`}
              ></div>
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <motion.div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="inline-flex items-center space-x-2 bg-[var(--gold)]/20 border border-[var(--gold)] px-6 py-2 rounded-full mb-8">
            <TrendingUp className="w-4 h-4 text-[var(--gold)]" />
            <span className="text-[var(--gold)] text-sm tracking-widest">
              SPRING COLLECTION 2026
            </span>
          </div>

          <h1 className="mb-6">
            <span className={`block text-5xl font-black ${theme === "dark" ? "text-white" : "text-black"
              }`}>
              TREND STARTS
            </span>
            <span className="block text-5xl font-black text-[var(--gold)]">
              HERE
            </span>
          </h1>

          <p className={`text-lg mb-10 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>
            Elevate your style with our premium collection
          </p>

          <button
            onClick={() =>
              document
                .getElementById("category-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-[var(--gold)] px-8 py-4 rounded-lg"
          >
            SHOP NOW
          </button>
        </motion.div>

        {/* DOTS */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${currentSlide === index
                  ? "bg-[var(--gold)]"
                  : theme === "dark"
                    ? "bg-white/50"
                    : "bg-black/40"
                }`}
            />
          ))}
        </div>

      </section>

      {/* 🔥 OFFERS */}
      <section className="py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black">LIMITED TIME OFFERS</h2>
        </div>

        <div className="relative overflow-hidden">
          <div ref={scrollRef} className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0 px-4 overflow-x-auto">
            {offerProducts.map((product, index) => (
              <div key={`${product.id}-${index}`} className="w-full md:w-80">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.images?.[0]}
                    className="h-80 w-full object-cover"
                  />

                  <div>
                    <h3>{product.name}</h3>

                    {product.offerprice && (
                      <>
                        <span className="text-lg font-bold text-[var(--gold)]">
                          ₹{product.offerprice}
                        </span>
                        <span className="line-through">
                          ₹{product.price}
                        </span>
                      </>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⭐ FEATURED */}
      <section className="py-20">
        <div className="grid grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <CategorySection />
    </div>
  );
}