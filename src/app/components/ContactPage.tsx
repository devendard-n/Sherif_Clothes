import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = `New Contact Form Submission:\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nMessage: ${formData.message}`;
    const phoneNumber = " 9003091927";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-4">
            <span className="text-4xl sm:text-5xl font-black tracking-wider">
              GET IN TOUCH
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions? We're here to help you find your perfect style
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="mb-6">
                <span className="text-3xl font-black tracking-wider">
                  CONTACT INFORMATION
                </span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Reach out to us through any of the following channels
              </p>
            </div>

            <div className="space-y-6">
              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-start space-x-4 p-6 bg-card border-2 border-transparent hover:border-[var(--gold)] rounded-lg transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-[var(--gold)]" />
                </div>
                <div>
                  <h3 className="mb-1">
                    <span className="font-bold">Phone</span>
                  </h3>
                  <p className="text-muted-foreground">+91 123 456 7890</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-start space-x-4 p-6 bg-card border-2 border-transparent hover:border-[var(--gold)] rounded-lg transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[var(--gold)]" />
                </div>
                <div>
                  <h3 className="mb-1">
                    <span className="font-bold">Email</span>
                  </h3>
                  <p className="text-muted-foreground">
                    contact@sherifclothvibez.com
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-start space-x-4 p-6 bg-card border-2 border-transparent hover:border-[var(--gold)] rounded-lg transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[var(--gold)]" />
                </div>
                <div>
                  <h3 className="mb-1">
                    <span className="font-bold">Location</span>
                  </h3>
                  <p className="text-muted-foreground">
                    123 Fashion Street, Mumbai, India
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Social or additional info */}
            <div className="p-8 bg-gradient-to-br from-[var(--luxury-green)] to-[var(--luxury-green-light)] rounded-lg border-2 border-[var(--gold)]">
              <h3 className="mb-3">
                <span className="text-xl font-bold text-[var(--gold)]">
                  Store Hours
                </span>
              </h3>
              <div className="space-y-2 text-gray-200">
                <p>Monday - Saturday: 10:00 AM - 9:00 PM</p>
                <p>Sunday: 11:00 AM - 7:00 PM</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card p-8 rounded-lg border-2 border-[var(--gold)] space-y-6"
            >
              <h2 className="mb-6">
                <span className="text-2xl font-black tracking-wider">
                  SEND US A MESSAGE
                </span>
              </h2>

              <div>
                <label className="block mb-2 font-medium">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border-2 border-muted focus:border-[var(--gold)] rounded-lg outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border-2 border-muted focus:border-[var(--gold)] rounded-lg outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border-2 border-muted focus:border-[var(--gold)] rounded-lg outline-none transition-colors"
                  placeholder="+91 123 456 7890"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 bg-background border-2 border-muted focus:border-[var(--gold)] rounded-lg outline-none transition-colors resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--luxury-green)] rounded-lg font-bold tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
              >
                <span>SEND MESSAGE</span>
                <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
