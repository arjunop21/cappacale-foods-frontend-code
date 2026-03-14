import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {product.weight}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-serif font-semibold text-gray-900 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 flex-grow">
          Pure and organic {product.name.toLowerCase()} for authentic taste.
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">Rs. {product.price + 10}.00</span>
            <span className="text-xl font-bold text-brand-primary">Rs. {product.price}.00</span>
          </div>
          
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white p-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
