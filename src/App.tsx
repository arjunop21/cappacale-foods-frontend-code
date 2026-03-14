import React, {useEffect, useState} from 'react';
import {Header} from './components/Header';
import {ProductCard} from './components/ProductCard';
import {Footer} from './components/Footer';
import {Cart} from './components/Cart';
import {Contact} from './components/Contact';
import {Login} from './components/Auth/Login';
import {Register} from './components/Auth/Register';
import {AdminDashboard} from './components/Admin/Dashboard';
import {CartItem, Product} from './types';
import {motion} from 'motion/react';
import {PRODUCTS} from './constants';
import {AuthProvider, useAuth} from './hooks/useAuth';

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'demo'>('connected');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [view, setView] = useState<'shop' | 'admin' | 'contact'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const {isAdmin} = useAuth();

  useEffect(() => {
    // Check health for DB status
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.database === 'disconnected') {
          setDbStatus('demo');
        }
      })
      .catch(() => setDbStatus('demo'));

    fetch('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(PRODUCTS);
          setDbStatus('demo');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.warn('Backend API unavailable, falling back to static data:', err);
        setProducts(PRODUCTS);
        setDbStatus('demo');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setShowAllProducts(false);
  }, [selectedCategory]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? {...item, quantity: item.quantity + 1} : item
        );
      }
      return [...prev, {...product, quantity: 1}];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return {...item, quantity: newQty};
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const goHome = () => {
    setSelectedCategory(null);
    setView('shop');
  };

  const normalizeCategory = (value?: string | null) => (value || '').trim().toLowerCase();

  if (view === 'admin' && isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
          onLoginClick={() => setShowLogin(true)}
          onRegisterClick={() => setShowRegister(false)}
          onAdminClick={() => setView('admin')}
          onCategoryClick={cat => {
            setSelectedCategory(cat);
            setView('shop');
          }}
          onContactClick={() => setView('contact')}
          onHomeClick={goHome}
        />
        <main className="flex-grow">
          <AdminDashboard />
        </main>
        <Footer />
        <button
          onClick={goHome}
          className="fixed bottom-8 left-8 bg-white text-brand-primary px-6 py-3 rounded-xl font-bold shadow-xl border border-gray-100 z-50"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  if (view === 'contact') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
          onLoginClick={() => setShowLogin(true)}
          onRegisterClick={() => setShowRegister(true)}
          onAdminClick={() => setView('admin')}
          onCategoryClick={cat => {
            setSelectedCategory(cat);
            setView('shop');
          }}
          onContactClick={() => setView('contact')}
          onHomeClick={goHome}
        />
        <main className="flex-grow">
          <Contact />
        </main>
        <Footer />

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
        />

        {showLogin && <Login onClose={() => setShowLogin(false)} />}
        {showRegister && <Register onClose={() => setShowRegister(false)} />}
      </div>
    );
  }

  const filteredProducts = selectedCategory
    ? products.filter(p => normalizeCategory(p.category) === normalizeCategory(selectedCategory))
    : products;

  const productsToShow =
    selectedCategory || showAllProducts ? filteredProducts : filteredProducts.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      {dbStatus === 'demo' && (
        <div className="bg-amber-500 text-white text-center py-2 text-xs font-bold uppercase tracking-widest z-[60]">
          {/* Running in Demo Mode (Database Disconnected) - Changes will not be saved */}
        </div>
      )}
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onAdminClick={() => setView('admin')}
        onCategoryClick={cat => {
          setSelectedCategory(cat);
          setView('shop');
        }}
        onContactClick={() => setView('contact')}
        onHomeClick={goHome}
      />

      <main className="flex-grow">
        {/* Hero Section - Only show when no category is selected */}
        {!selectedCategory && (
          <section className="relative h-[500px] bg-brand-primary overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <img
                src="https://picsum.photos/seed/kerala-spices/1920/1080"
                alt="Spices Background"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start text-left text-white">
              <motion.span
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                className="bg-brand-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              >
                Premium Quality Spices
              </motion.span>
              <motion.h2
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight"
              >
                Taste the <br /> <span className="text-brand-accent">Tradition</span>
              </motion.h2>
              <motion.p
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.2}}
                className="text-xl text-gray-200 max-w-xl font-light mb-10"
              >
                Directly from the heart of Kerala, we bring you the most authentic,
                hand-picked spices that transform every meal into a celebration.
              </motion.p>
              <motion.button
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.3}}
                onClick={() => {
                  const el = document.getElementById('shop-grid');
                  el?.scrollIntoView({behavior: 'smooth'});
                }}
                className="bg-white text-brand-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-accent hover:text-white transition-all shadow-2xl"
              >
                Shop Collection
              </motion.button>
            </div>
          </section>
        )}

        {/* Featured Categories - Only show on home page */}
        {!selectedCategory && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Explore Categories</h2>
                <div className="h-1 w-20 bg-brand-accent mx-auto"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {name: 'MASALA', icon: '🌶️', color: 'bg-red-50'},
                  {name: 'Oils', icon: '🫗', color: 'bg-yellow-50'},
                  {name: 'Dry Fruits', icon: '🥜', color: 'bg-orange-50'},
                  {name: 'Tea Powder', icon: '☕', color: 'bg-green-50'},
                ].map(cat => (
                  <motion.div
                    key={cat.name}
                    whileHover={{y: -10}}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`${cat.color} p-8 rounded-3xl text-center cursor-pointer border border-transparent hover:border-brand-primary transition-all`}
                  >
                    <span className="text-5xl mb-4 block">{cat.icon}</span>
                    <h3 className="font-bold text-gray-900">{cat.name}</h3>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Product Grid */}
        <section id="shop-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-4xl font-serif font-bold text-gray-900">
                  {selectedCategory ? `${selectedCategory} Collection` : 'Our Masala Collection'}
                </h2>
                {dbStatus === 'demo' && (
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    
                  </span>
                )}
              </div>
              <div className="h-1 w-20 bg-brand-accent mt-4"></div>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mt-4 text-sm text-brand-primary hover:underline flex items-center"
                >
                  ✕ Clear Filter
                </button>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm font-medium text-gray-500">
              <span>Showing {productsToShow.length} products</span>
              <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              Array.from({length: 8}).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100"></div>
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500">No products found in this category.</p>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mt-4 text-brand-primary font-bold hover:underline"
                >
                  View All Products
                </button>
              </div>
            ) : (
              productsToShow.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))
            )}
          </div>

          {!selectedCategory && filteredProducts.length > 8 && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setShowAllProducts(prev => !prev)}
                className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-accent transition-colors"
              >
                {showAllProducts ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="bg-white py-20 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-serif font-bold">100% Organic</h3>
                <p className="text-gray-500 text-sm">Sourced directly from organic farms in Kerala with zero chemicals.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-serif font-bold">Live Milling</h3>
                <p className="text-gray-500 text-sm">Freshly ground spices to preserve natural oils and intense aroma.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-serif font-bold">Fast Delivery</h3>
                <p className="text-gray-500 text-sm">Quick and safe delivery across India right to your doorstep.</p>
              </div>
            </div>
          </div>

        </section>

        <Contact />
      </main>

      <Footer />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showRegister && <Register onClose={() => setShowRegister(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ShopContent />
    </AuthProvider>
  );
}
