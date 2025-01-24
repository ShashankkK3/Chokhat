import React from "react";
import {
  ShoppingCart,
  Image as ImageIcon,
  Hammer,
} from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full px-6 h-[57px] bg-white shadow flex justify-between items-center">
      {/* Left Logo */}
      <div className="flex items-center gap-4">
        <span className="text-2xl">🏠</span>
        <div className="leading-tight">
          <h1 className="text-lg font-bold">Chokhat</h1>
        
        </div>
      </div>

      {/* Center Nav Links */}
      <div className="flex gap-16 items-center">
  <button className="flex items-center gap-4 px-4 py-2 rounded-full font-medium text-orange-800 hover:bg-orange-100 transition">
    <ShoppingCart size={18} />
    <span>Marketplace</span>
  </button>
  <button className="flex items-center gap-4 px-4 py-2 rounded-full font-medium text-orange-800 hover:bg-orange-100 transition">
    <ImageIcon size={18} />
    <span>Inspiration</span>
  </button>
  <button className="flex items-center gap-4 px-4 py-2 rounded-full font-medium text-orange-800 hover:bg-orange-100 transition">
    <Hammer size={18} />
    <span>Services</span>
  </button>
</div>

      {/* Right CTA */}
      <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-medium transition">
        Get Started
      </button>
    </nav>
  );
}
