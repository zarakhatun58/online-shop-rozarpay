import React from "react";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#ed3b5f] text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold">Online Shop</h2>
            <p className="mt-2 text-sm opacity-90">
              Your one-stop shop for everything you love. Secure, fast, and
              reliable shopping experience.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact
                </a>
              </li>
              
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-black">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-black">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-black">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-black">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="text-center text-sm opacity-80">
          © {new Date().getFullYear()} Online Shop. All rights reserved.
        </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
