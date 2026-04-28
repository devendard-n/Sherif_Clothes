import { Filter } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router";

export function CategorySection() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const categories = [
    { name: "Formal Shirts", img: "./src/images/test.jpg", path: "/shirts", filter: "formal" },
    { name: "unique Shirts", img: "./src/images/logo.jpeg", path: "/shirts", filter: "unique" },
    { name: "Drop-shoulder Shirts", img: "./src/images/logo.jpeg", path: "/shirts", filter: "Drop-shoulder" },
    { name: "Baggy Shirts", img: "./src/images/test.jpg", path: "/shirts", filter: "baggy" },
    { name: "Baggy Pants", img: "./src/images/kerala-baggy.jpeg", path: "/pants", filter: "baggy", },
    { name: "Jeans", img: "./src/images/kerala-baggy.jpeg", path: "/pants", filter: "jeans", },
    { name: "mom-fit", img: "./src/images/kerala-baggy.jpeg", path: "/pants", filter: "mom-fit", },
    { name: "cargo", img: "./src/images/kerala-baggy.jpeg", path: "/pants", filter: "cargo", },
    { name: "Drop-shoulder T-Shirts", img: "./src/images/logo.jpeg", path: "/tshirts", filter: "Drop-shoulder" },
    { name: "plain T-Shirts", img: "./src/images/logo.jpeg", path: "/tshirts", filter: "plain" },
    { name: "polo T-Shirts", img: "./src/images/logo.jpeg", path: "/tshirts", filter: "polo" },
    { name: "full-sleeve T-Shirts", img: "./src/images/logo.jpeg", path: "/tshirts", filter: "full-sleeve" },
  ];

  return (
    <section
      id="category-section"
      className={`py-20 px-6 transition-colors duration-500 ${theme === "dark"
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

        <span className="text-[var(--gold)] text-sm cursor-pointer hover:underline">
          ALL →
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => {
              if (cat.filter) {
                navigate(`${cat.path}?type=${cat.filter}`);
              } else {
                navigate(cat.path);
              }
            }}
            className="relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10"
          >
            <img
              src={cat.img}
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