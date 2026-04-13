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

  // ✅ Detect size type (hip vs S/M/L)
  const availableSizes: string[] = Array.from(
    new Set(
      (products || [])
        .flatMap((p: any) => {
          if (Array.isArray(p.sizes)) return p.sizes;
          if (typeof p.sizes === "string") return p.sizes.split(",");
          return [];
        })
        .map((s: string) => s.toUpperCase().trim())
    )
  );

  // ✅ Detect if numeric sizes (pants)
  const isNumericSize = availableSizes.every((s) =>
    !isNaN(Number(s))
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
            className={`px-6 py-3 border-2 rounded-lg font-bold transition ${
              selectedSub === sub
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
            <option value="all" className="bg-black text-base text-white">
              {isNumericSize ? "All Sizes" : "All Sizes"}
            </option>

            {availableSizes.map((size) => (
              <option
                key={size}
                value={size}
                className="bg-black text-base text-white"
              >
                {/* ✅ Format display */}
                {isNumericSize ? `${size}` : size}
              </option>
            ))}
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
            <option value="all" className="bg-black text-base text-white">
              All Prices
            </option>
            <option value="under1000" className="bg-black text-base text-white">
              Under ₹1000
            </option>
            <option value="1000-2000" className="bg-black text-base text-white">
              ₹1000 - ₹2000
            </option>
            <option value="above2000" className="bg-black text-base text-white">
              Above ₹2000
            </option>
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