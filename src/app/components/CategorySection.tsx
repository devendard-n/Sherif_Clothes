import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router";

export function CategorySection() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const categories = [
    { name: "Shirts", img: "./src/images/logo.jpeg", path: "/shirts" },
    { name: "Pants", img: "./src/images/logo.jpeg", path: "/pants" },
    { name: "combos", img: "./src/images/logo.jpeg", path: "/combos" },
    { name: "tshirts", img: "./src/images/logo.jpeg", path: "/tshirts" },
    {
      name: "Baggy Pants",
      img: "./src/images/kerala-baggy.jpeg",
      path: "/pants",
      filter: "baggy",
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
              <h3 className="font-semibold text-lg">{cat.name}</h3>

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