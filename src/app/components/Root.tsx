import { Outlet } from "react-router";
import { ThemeProvider } from "../contexts/ThemeContext";
import { Navbar } from "./Navbar";
import { WhatsAppButton } from "./WhatsAppButton";
import { Footer } from "./Footer";

export function Root() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <WhatsAppButton />
      </div>
      <Footer />
    </ThemeProvider>
  );
}
