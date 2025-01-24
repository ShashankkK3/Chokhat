import React from "react";
import { Twitter, Facebook, Instagram } from "lucide-react";

// Reusable column for links
function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-white font-semibold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-gray-300">
        {links.map(({ label, icon }, i) => (
          <li key={i} className="flex items-center gap-2 hover:text-white transition">
            {icon && <span>{icon}</span>}
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-900 to-orange-700 text-white pt-10 px-6">
      {/* Top Footer Columns */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 pb-8">
        {/* Left Section */}
        <div>
          <h3 className="text-xl font-bold mb-1">Chokhat</h3>
          <p className="text-sm text-orange-200 mb-2">आपका डिजिटल चौखट</p>
          <p className="text-sm text-gray-200 mb-4">
            Your one-stop digital doorstep for home items, inspiration, and services. Bringing the beauty of Indian homes to your fingertips.
          </p>
          {/* Social Icons */}
          <div className="flex gap-3 text-white text-xl mt-4">
            <a href="#" className="hover:text-gray-300 transition">
              <Twitter className="w-5 h-5 cursor-pointer" />
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              <Facebook className="w-5 h-5 cursor-pointer" />
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              <Instagram className="w-5 h-5 cursor-pointer" />
            </a>
          </div>
        </div>

        {/* Center Links */}
        <FooterColumn
          title="Quick Links"
          links={[
            { label: "Marketplace", icon: "🛒" },
            { label: "Inspiration", icon: "🖼️" },
            { label: "Services", icon: "🛠️" },
          ]}
        />

        {/* Support Links */}
        <FooterColumn
          title="Support"
          links={[
            { label: "Help Center" },
            { label: "Contact Us" },
            { label: "Privacy Policy" },
            { label: "Terms of Service" },
          ]}
        />
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-orange-400 bg-gradient-to-r from-orange-900 to-orange-700 flex flex-col md:flex-row items-center justify-between px-6 py-4 text-sm text-gray-300">
        <span className="text-center md:text-left mb-2 md:mb-0 text-sm">
          © 2025 Chokhat. All rights reserved.
        </span>
        <div className="flex gap-5 items-center text-white">
          <a href="#" className="hover:text-gray-300 transition">
            <Twitter className="w-5 h-5 cursor-pointer" />
          </a>
          <a href="#" className="hover:text-gray-300 transition">
            <Facebook className="w-5 h-5 cursor-pointer" />
          </a>
          <a href="#" className="hover:text-gray-300 transition">
            <Instagram className="w-5 h-5 cursor-pointer" />
          </a>
        </div>
      </div>
    </footer>
  );
}
