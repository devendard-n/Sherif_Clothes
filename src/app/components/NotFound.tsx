import { Link } from "react-router";
import { Home as HomeIcon } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4">
          <span className="text-9xl font-black text-[var(--gold)]">404</span>
        </h1>
        <h2 className="mb-6">
          <span className="text-3xl font-bold">Page Not Found</span>
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--luxury-green)] px-8 py-4 rounded-lg font-bold tracking-wider transition-all duration-300"
        >
          <HomeIcon className="w-5 h-5" />
          <span>BACK TO HOME</span>
        </Link>
      </div>
    </div>
  );
}
