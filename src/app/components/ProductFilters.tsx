import { ChevronDown } from "lucide-react";

export function ProductFilters({
  products = [],
  subcategories = [],
  selectedSub,
  setSelectedSub,
  selectedSize,
  setSelectedSize,
  priceRange,
  setPriceRange,
  selectedColor,
  setSelectedColor,
}: any) {

  const availableSizes = Array.from(
    new Set(
      (products || []).flatMap((p: any) => p.sizes || [])
    )
  );

  return (
    <div className="mb-12 text-center">

      {/* SUBCATEGORY BUTTONS */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {subcategories?.map((sub: string) => (
          <button
            key={sub}
            onClick={() =>
              setSelectedSub(selectedSub === sub ? "" : sub)
            }
            className={`px-6 py-3 border-2 rounded-lg font-bold transition ${selectedSub === sub
              ? "bg-[var(--gold)] text-[var(--luxury-green)]"
              : "border-[var(--gold)] text-[var(--gold)]"
              }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* FILTER ROW */}
      <div className="flex gap-4 justify-center flex-wrap">

        {/* SIZE */}
        <div className="relative">
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="appearance-none px-6 py-3 pr-12 border-2 border-[var(--gold)] rounded-lg bg-transparent min-w-[160px] font-medium"
          >
            <option value="all" className="bg-black text-base text-white">All Sizes</option>
            <option value="S" className="bg-black text-base text-white">S</option>
            <option value="M" className="bg-black text-base text-white">M</option>
            <option value="L" className="bg-black text-base text-white">L</option>
            <option value="XL" className="bg-black text-base text-white">XL</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 pointer-events-none" />
        </div>

        {/* PRICE */}
        <div className="relative">
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="appearance-none px-6 py-3 border-2 border-[var(--gold)] rounded-lg"
          >
            <option value="all" className="bg-black text-base text-white">All Prices</option>
            <option value="under1000" className="bg-black text-base text-white">Under ₹1000</option>
            <option value="1000-2000" className="bg-black text-base text-white">₹1000 - ₹2000</option>
            <option value="above2000" className="bg-black text-base text-white">Above ₹2000</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 pointer-events-none" />
        </div>


        {/* CLEAR FILTER BUTTON */}
        <button
          onClick={() => {
            setSelectedSub("");
            setSelectedSize("all");
            setPriceRange("all");
            setSelectedColor("");
          }}
          className="px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg font-bold hover:bg-red-500 hover:text-white transition"
        >
          Clear Filters
        </button>

      </div>
    </div>
  );
}