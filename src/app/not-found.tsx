"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-extrabold text-accent/20 mb-4">404</div>
        <h1 className="text-3xl font-bold text-foreground mb-3">Page not found</h1>
        <p className="text-foreground-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-all duration-200"
          >
            <Home size={18} />
            Go Home
          </Link>
          <button
            onClick={() => history.back()}
            className="flex items-center gap-2 px-5 py-3 border border-border hover:border-accent/40 text-foreground-secondary hover:text-foreground rounded-xl transition-all duration-200"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
