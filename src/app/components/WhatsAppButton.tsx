import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const phoneNumber = "9003091927"; // Replace with actual WhatsApp business number
    const message = "Hi! I'm interested in your products from Sherif Clothvibez";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 p-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-2xl transition-all duration-300 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-50"
      />
      <MessageCircle className="w-6 h-6 relative z-10" />
    </motion.button>
  );
}
