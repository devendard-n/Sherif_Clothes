import { Phone, Mail, MapPin, Instagram, Youtube } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className={`mt-20 mx-4 mb-6 rounded-2xl px-8 py-10 transition-colors duration-500 ${theme === "dark"
        ? "bg-[var(--luxury-green)] text-white"
        : "bg-gray-100 text-black"
        }`}
    >
      <div className="flex flex-col md:flex-row md:justify-between">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          <div className="space-y-4">
            <p>Call us</p>
            <p>Write To Us</p>
          </div>

          {/* PHONE */}
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 border p-1 rounded" />
            <span>+91 93607 27462</span>
          </div>

          {/* EMAIL */}
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 border p-1 rounded" />
            <span>dustedmen@gmail.com</span>
          </div>

          {/* LINE */}
          <div
            className={`border-t ${theme === "dark" ? "border-white/20" : "border-black/20"
              }`}
          />

          {/* LINKS */}
          <div className="space-y-1 text-sm">
            <p className="text-red-500 cursor-pointer">Terms & Conditions</p>
            <p className="text-red-500 cursor-pointer">Privacy policy</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className=" space-y-6">

          <h3 className="text-lg font-semibold">Follow Us On</h3>

          {/* SOCIAL ICONS */}
          <div className="flex  space-x-4 gap-4">
            <a
              href="https://www.instagram.com/_ram_.kutty/?__pwa=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-6 h-6 cursor-pointer hover:text-[var(--gold)]" />
            </a>
            <Phone className="w-6 h-6 cursor-pointer hover:text-[var(--gold)]" />
            {/* LOCATION ICON */}
            <MapPin className="w-6 h-6 cursor-pointer hover:text-[var(--gold)]" />
          </div>



          {/* ADDRESS */}
          <div>
            <h4 className="font-semibold mb-2">Shop Address</h4>
            <p className="text-sm text-red-500">
              State Bank Colony, <br />
              Batlagundu, Dindigul. <br />
              Tamilnadu 624202
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}


// {/* RIGHT SIDE */}
// <div className="flex justify-center space-x-4">

//   <a
//     href="https://www.instagram.com/_ram_.kutty/?__pwa=1"
//     target="_blank"
//     rel="noopener noreferrer"
//   >
//     <Instagram className="w-6 h-6 cursor-pointer hover:text-[var(--gold)]" />
//   </a>

//   <a href="tel:+919360727462">
//     <Phone className="w-6 h-6 cursor-pointer hover:text-[var(--gold)]" />
//   </a>

// </div>