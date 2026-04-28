import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer
      className={`mt-20 mx-4 mb-6 rounded-2xl px-6 md:px-10 py-10 transition-all duration-500`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Contact Us</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5" />
              <span>+91 90030 91927</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <span>abcdef@gmail.com</span>
            </div>
          </div>


          <div className="space-y-2 text-sm">
            <p >
              Terms & Conditions
            </p>
            <p >
              Privacy Policy
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-start md:items-end text-left md:text-right space-y-6">
          <h3 className="text-2xl font-semibold">Follow Us On</h3>

          {/* SOCIAL MEDIA RIGHT END */}
          <div className="flex gap-5 md:justify-end w-full">
            <a
              href="https://www.instagram.com/sherif_clothvibez/?__pwa=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-6 h-6 hover:text-[var(--gold)] transition" />
            </a>

            <a href="tel:+919003091927">
              <Phone className="w-6 h-6 hover:text-[var(--gold)] transition" />
            </a>

            <a
              href="https://maps.app.goo.gl/SddSjBDee4pmLHvBA?g_st=iw"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin className="w-6 h-6 hover:text-[var(--gold)] transition" />
            </a>
          </div>

          {/* ADDRESS */}
          <div>
            <h4 className="text-xl font-semibold mb-2">Shop Address</h4>

            <p
              className={`text-sm ${
                isDark ? "text-white/70" : "text-black/70"
              }`}
            >
              ABC Colony, <br />
              DEF, Trichy. <br />
              Tamilnadu 123456
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}