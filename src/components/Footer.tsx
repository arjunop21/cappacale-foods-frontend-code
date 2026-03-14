import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold tracking-tight">
              CAPPACALE <span className="text-brand-accent">FOODS</span>
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Bringing you the finest organic spices and masalas from the heart of Kerala. 
              Zero adulteration, pure taste, and traditional processing.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-accent transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-brand-accent transition-colors">Search</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold mb-6">Categories</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-brand-accent transition-colors">Masalas</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Oils</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Snacks</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Tea & Coffee</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Dry Fruits</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold mb-6">Contact Info</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-brand-accent flex-shrink-0" />
                <span>Kochi, Kerala, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-brand-accent flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-brand-accent flex-shrink-0" />
                <span>info@cappacalefoods.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-gray-400">
            © 2024 Cappacale Foods Clone. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-gray-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
