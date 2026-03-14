import React from 'react';
import {ShoppingBag, Search, User, Menu, ChevronDown, LogOut, LayoutDashboard, X} from 'lucide-react';
import {motion, AnimatePresence} from 'motion/react';
import {useAuth} from '../hooks/useAuth';
import {catalogApi} from '../services/catalog';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onAdminClick: () => void;
  onCategoryClick: (category: string) => void;
  onContactClick: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onCartClick,
  onLoginClick,
  onRegisterClick,
  onAdminClick,
  onCategoryClick,
  onContactClick,
  onHomeClick,
}) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = React.useState(false);
  const [isMobileAccountOpen, setIsMobileAccountOpen] = React.useState(false);
  const {user, logout, isAuthenticated, isAdmin} = useAuth();

  const fallbackCategories = ['Masala', 'Oils', 'Dry Fruits', 'Tea Powder', 'Millet'];
  const [categories, setCategories] = React.useState<string[]>(fallbackCategories);

  React.useEffect(() => {
    let isMounted = true;
    catalogApi
      .getCategories()
      .then(data => {
        if (!isMounted) return;
        if (data.length > 0) setCategories(data);
      })
      .catch(() => {
        // Keep fallback categories if backend is unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button
              className="p-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={onHomeClick}
          >
            <h1 className="text-2xl font-serif font-bold text-brand-primary tracking-tight">
              CAPPACALE <span className="text-brand-accent">FOODS</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={onHomeClick}
              className="text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors"
            >
              HOME
            </button>

            {/* Categories Dropdown */}
            <div
              className="relative group h-20 flex items-center"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <button className="text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors flex items-center space-x-1">
                <span>CATEGORIES</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 10}}
                    transition={{duration: 0.2}}
                    className="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50 overflow-hidden"
                  >
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          onCategoryClick(category);
                          setIsCategoriesOpen(false);
                        }}
                        className="w-full text-left block px-4 py-3 text-sm text-gray-700 hover:bg-brand-secondary hover:text-brand-primary transition-colors font-medium"
                      >
                        {category}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={onContactClick}
              className="text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors"
            >
              CONTACT
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-brand-primary transition-colors hidden sm:block">
              <Search size={20} />
            </button>

            <div className="relative">
              <button
                onClick={() => (isAuthenticated ? setIsUserMenuOpen(!isUserMenuOpen) : onLoginClick())}
                className="p-2 text-gray-600 hover:text-brand-primary transition-colors flex items-center space-x-2"
              >
                <User size={20} />
                {isAuthenticated && <span className="text-xs font-bold hidden md:block">{user?.name.split(' ')[0]}</span>}
              </button>

              <AnimatePresence>
                {isUserMenuOpen && isAuthenticated && (
                  <motion.div
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 10}}
                    className="absolute top-full right-0 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50 overflow-hidden"
                  >
                    {isAdmin && (
                      <button
                        onClick={() => {
                          onAdminClick();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <LayoutDashboard size={16} />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={onCartClick}
              className="p-2 text-gray-600 hover:text-brand-primary transition-colors relative"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <motion.span
                  initial={{scale: 0}}
                  animate={{scale: 1}}
                  className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-brand-accent rounded-full"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{x: -320}}
              animate={{x: 0}}
              exit={{x: -320}}
              transition={{type: 'tween', duration: 0.25}}
              className="fixed top-0 left-0 h-full w-72 bg-white z-[60] md:hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
                <span className="text-lg font-serif font-bold text-brand-primary">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-brand-primary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 flex-1 overflow-y-auto space-y-6">
                <button
                  onClick={() => {
                    onHomeClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-sm font-semibold text-gray-800 hover:text-brand-primary transition-colors"
                >
                  Home
                </button>

                <div>
                  <button
                    onClick={() => setIsMobileCategoriesOpen(prev => !prev)}
                    className="w-full flex items-center justify-between text-sm font-semibold text-gray-800 hover:text-brand-primary transition-colors"
                  >
                    <span>Categories</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isMobileCategoriesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isMobileCategoriesOpen && (
                      <motion.div
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: 'auto'}}
                        exit={{opacity: 0, height: 0}}
                        className="mt-3 pl-3 space-y-2 overflow-hidden"
                      >
                        {categories.map(category => (
                          <button
                            key={category}
                            onClick={() => {
                              onCategoryClick(category);
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full text-left text-sm text-gray-700 hover:text-brand-primary transition-colors"
                          >
                            {category}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <button
                    onClick={() => setIsMobileAccountOpen(prev => !prev)}
                    className="w-full flex items-center justify-between text-sm font-semibold text-gray-800 hover:text-brand-primary transition-colors"
                  >
                    <span>Contact</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isMobileAccountOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isMobileAccountOpen && (
                      <motion.div
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: 'auto'}}
                        exit={{opacity: 0, height: 0}}
                        className="mt-3 pl-3 space-y-2 overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            onLoginClick();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-left text-sm text-gray-700 hover:text-brand-primary transition-colors"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => {
                            onRegisterClick();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-left text-sm text-gray-700 hover:text-brand-primary transition-colors"
                        >
                          Register
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
