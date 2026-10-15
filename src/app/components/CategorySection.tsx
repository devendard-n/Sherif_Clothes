import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router";

export function CategorySection() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const categories = [
    {
      name: "Formal Shirts",
      img: "/src/images/formalShirt.jpeg",
      path: "/shirts",
      filter: "formal",
    },
    {
      name: "Unique Shirts",
      img: "/src/images/uniqueShirt.jpeg",
      path: "/shirts",
      filter: "unique",
    },
    {
      name: "Drop-shoulder Shirts",
      img: "/src/images/drop-shoulder-shirt.jpeg",
      path: "/shirts",
      filter: "Drop-shoulder",
    },
    {
      name: "Baggy Shirts",
      img: "/src/images/baggyShirt.jpeg",
      path: "/shirts",
      filter: "baggy",
    },
    {
      name: "Baggy Pants",
      img: "/src/images/baggy.jpeg",
      path: "/pants",
      filter: "baggy",
    },
    {
      name: "Jeans",
      img: "/src/images/jeans.jpeg",
      path: "/pants",
      filter: "jeans",
    },
    {
      name: "Mom-fit",
      img: "/src/images/momFit.jpeg",
      path: "/pants",
      filter: "mom-fit",
    },
    {
      name: "Cargo",
      img: "/src/images/cargo.jpeg",
      path: "/pants",
      filter: "cargo",
    },
    {
      name: "Drop-shoulder T-Shirts",
      img: "/src/images/drop-shoulder-tshirt.jpeg",
      path: "/tshirts",
      filter: "Drop-shoulder",
    },
    {
      name: "Plain T-Shirts",
      img: "/src/images/plain-tshirt.jpeg",
      path: "/tshirts",
      filter: "plain",
    },
    {
      name: "Polo T-Shirts",
      img: "/src/images/polo-tshirt.jpeg",
      path: "/tshirts",
      filter: "polo",
    },
    {
      name: "Full-sleeve T-Shirts",
      img: "/src/images/full-sleeve-tshirt.jpeg",
      path: "/tshirts",
      filter: "full-sleeve",
    },
  ];

  return (
    <section
      id="category-section"
      className={`py-20 px-6 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[var(--luxury-green)] text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-black">
            Shop by <span className="text-[var(--gold)]">Category</span>
          </h2>

          <p className="text-gray-300 text-sm mt-2">
            Discover premium styles curated for you
          </p>
        </div>

        <span
          onClick={() => navigate("/shirts")}
          className="text-[var(--gold)] text-sm cursor-pointer hover:underline"
        >
          ALL →
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() =>
              navigate(
                `${cat.path}?type=${encodeURIComponent(cat.filter)}`
              )
            }
            className="relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10"
          >
            <img
              src={cat.img}
              alt={cat.name}
              loading="lazy"
              className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute bottom-4 left-4">
              <h3 className="font-semibold text-white">{cat.name}</h3>

              <span className="text-xs text-[var(--gold)] tracking-wide">
                SHOP →
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}