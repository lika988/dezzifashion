import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Menu, X, ArrowRight, Star, Instagram, Facebook, Twitter, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

/**
 * DEZZI FASHION - Luxury Store Application
 * Designed for High-End Impact & Mobile Responsiveness
 */

// --- Assets & Data ---

const HERO_IMAGES = [
  "https://ik.imagekit.io/p78ewpzv2/DEZZI%20FASHION/Gemini_Generated_Image_yq738xyq738xyq73.png",
  "https://ik.imagekit.io/p78ewpzv2/DEZZI%20FASHION/Gemini_Generated_Image_a49y8za49y8za49y.png"
];

const PRODUCTS = [
  {
    id: 1,
    title: "Dusty Pink Lace Illusion",
    subtitle: "Square Neck Formal Gown",
    price: 890,
    description: "A masterpiece of ethereal elegance. This dusty pink formal gown features intricate lace illusion detailing, a structured square neckline, and flowing long sleeves. Tailored to perfection to create a timeless silhouette for your most memorable occasions.",
    images: [
      "https://ik.imagekit.io/p78ewpzv2/DEZZI%20FASHION/Gemini_Generated_Image_zbd9puzbd9puzbd9.png",
      "https://ik.imagekit.io/p78ewpzv2/DEZZI%20FASHION/Gemini_Generated_Image_ga9pkfga9pkfga9p.png",
      "https://ik.imagekit.io/p78ewpzv2/DEZZI%20FASHION/Gemini_Generated_Image_a49y8za49y8za49y.png"
    ],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 2,
    title: "Ivory Satin Royal",
    subtitle: "Structured Shoulder Bridal Gown",
    price: 1250,
    description: "Command the room with regal grace. This ivory white satin ball gown is defined by its architectural structured shoulders and sweeping skirt. Designed for the modern bride or gala attendee who demands a presence that is both powerful and purely feminine.",
    images: [
      "https://ik.imagekit.io/p78ewpzv2/DEZZI%20FASHION/Gemini_Generated_Image_how82hhow82hhow8.png",
      "https://ik.imagekit.io/p78ewpzv2/DEZZI%20FASHION/Gemini_Generated_Image_yq738xyq738xyq73.png"
    ],
    sizes: ["XS", "S", "M", "L"]
  }
];

// Duplicate products to simulate a larger collection for the slider
const CAROUSEL_PRODUCTS = [...PRODUCTS, ...PRODUCTS, ...PRODUCTS]; 

// --- Components ---

const Button = ({ children, variant = 'primary', className = '', onClick }) => {
  const baseStyle = "uppercase tracking-widest text-xs font-bold py-4 px-8 transition-all duration-300 transform hover:-translate-y-1";
  const variants = {
    primary: "bg-stone-900 text-white hover:bg-stone-800",
    outline: "border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white",
    white: "bg-white text-stone-900 hover:bg-stone-100"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const CartDrawer = ({ isOpen, onClose, cartItems, removeFromCart }) => {
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-stone-100">
          <h2 className="font-serif text-2xl text-stone-900">Your Bag ({cartItems.length})</h2>
          <button onClick={onClose}><X className="w-6 h-6 text-stone-500 hover:text-stone-900" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p className="font-sans uppercase tracking-widest text-sm">Your bag is empty</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <img src={item.images[0]} alt={item.title} className="w-24 h-32 object-cover" />
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-serif text-lg leading-tight">{item.title}</h3>
                    <p className="text-xs text-stone-500 mt-1 uppercase tracking-wider">{item.selectedSize}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-sans text-sm">${item.price.toLocaleString()}</span>
                    <button onClick={() => removeFromCart(idx)} className="text-xs text-red-400 underline hover:text-red-600">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-stone-50 border-t border-stone-100">
          <div className="flex justify-between mb-6 text-stone-900 font-bold">
            <span className="uppercase tracking-widest text-sm">Total</span>
            <span className="font-serif text-xl">${total.toLocaleString()}</span>
          </div>
          <Button className="w-full">Checkout</Button>
        </div>
      </div>
    </div>
  );
};

const ProductModal = ({ product, isOpen, onClose, addToCart }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if(isOpen) {
      setCurrentImage(0);
      setSelectedSize(null);
      setIsPaused(false);
    }
  }, [isOpen]);

  // Auto-slide functionality for Product Modal
  useEffect(() => {
    if (!isOpen || !product || isPaused) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, product, isPaused]);

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white"><X className="w-6 h-6" /></button>
        
        {/* Gallery */}
        <div 
          className="relative h-[40vh] md:h-full bg-stone-100 overflow-hidden group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <img 
            src={product.images[currentImage]} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-105" 
          />
          
          {/* Manual Navigation Arrows */}
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/30 backdrop-blur hover:bg-white text-stone-900 rounded-full transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/30 backdrop-blur hover:bg-white text-stone-900 rounded-full transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {product.images.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentImage(idx)}
                className={`w-2 h-2 rounded-full transition-all ${currentImage === idx ? 'bg-stone-900 w-6' : 'bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="p-8 md:p-12 lg:p-16 overflow-y-auto bg-white flex flex-col justify-center">
          <span className="text-stone-500 uppercase tracking-[0.2em] text-xs mb-4">Dezzi Collection</span>
          <h2 className="font-serif text-3xl md:text-5xl text-stone-900 mb-2">{product.title}</h2>
          <h3 className="text-stone-500 text-lg md:text-xl font-light mb-6">{product.subtitle}</h3>
          
          <p className="text-stone-600 leading-relaxed mb-8 font-light text-sm md:text-base">
            {product.description}
          </p>

          <div className="mb-8">
            <span className="block text-xs uppercase tracking-widest font-bold mb-4">Select Size</span>
            <div className="flex gap-3">
              {product.sizes.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 flex items-center justify-center border transition-all ${selectedSize === size ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 hover:border-stone-400 text-stone-600'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-stone-100">
            <span className="font-serif text-3xl text-stone-900">${product.price}</span>
            <Button 
              onClick={() => {
                if(!selectedSize) return alert("Please select a size");
                addToCart({...product, selectedSize});
                onClose();
              }}
              className="px-12"
            >
              Add to Bag
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Hero Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Responsive Carousel Listener
  useEffect(() => {
    const handleResize = () => setItemsPerView(window.innerWidth >= 768 ? 2 : 1);
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-Slide Logic (3 Seconds)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // 3 second slide interval

    return () => clearInterval(interval);
  }, [currentSlide, itemsPerView, isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const maxIndex = CAROUSEL_PRODUCTS.length - itemsPerView;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const maxIndex = CAROUSEL_PRODUCTS.length - itemsPerView;
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    setCartOpen(true);
  };

  const removeFromCart = (index) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    setCartItems(newItems);
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 selection:bg-stone-200">
      {/* Styles for specific fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Lato:wght@300;400;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Lato', sans-serif; }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed w-full z-40 transition-all duration-500 ${isScrolled || isMobileMenuOpen ? 'bg-white text-stone-900 py-4 shadow-sm' : 'bg-transparent text-white py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex gap-8 text-xs uppercase tracking-widest font-bold">
              <a href="#" className="hover:opacity-70 transition-opacity">Collection</a>
              <a href="#" className="hover:opacity-70 transition-opacity">Bridal</a>
              <a href="#" className="hover:opacity-70 transition-opacity">Maison</a>
            </div>
          </div>

          <a href="#" className={`text-2xl lg:text-3xl font-serif tracking-widest font-bold transition-all ${isScrolled ? 'scale-90' : 'scale-100'}`}>
            DEZZI
          </a>

          <div className="flex items-center gap-6">
            <div className="hidden lg:block text-xs uppercase tracking-widest font-bold">
              <a href="#" className="hover:opacity-70 transition-opacity">Account</a>
            </div>
            <button onClick={() => setCartOpen(true)} className="relative group">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-30 pt-24 px-6 transition-transform duration-500 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col gap-8 text-2xl font-serif">
          <a href="#" className="border-b border-stone-100 pb-4" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</a>
          <a href="#" className="border-b border-stone-100 pb-4" onClick={() => setIsMobileMenuOpen(false)}>Ready to Wear</a>
          <a href="#" className="border-b border-stone-100 pb-4" onClick={() => setIsMobileMenuOpen(false)}>Bridal</a>
          <a href="#" className="border-b border-stone-100 pb-4" onClick={() => setIsMobileMenuOpen(false)}>Maison</a>
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative h-screen w-full overflow-hidden">
        {HERO_IMAGES.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-[2000ms] ease-in-out ${index === heroIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={img} 
              alt="Hero" 
              className={`w-full h-full object-cover object-top transition-transform duration-[8000ms] ease-linear ${index === heroIndex ? 'scale-110' : 'scale-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          </div>
        ))}

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <span className="uppercase tracking-[0.3em] text-xs md:text-sm mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">Est. 2024</span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl mb-8 leading-tight animate-in fade-in zoom-in-95 duration-1000">
            Elegance <br/><span className="italic font-light">Redefined</span>
          </h1>
          <Button variant="white" className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            View Collection
          </Button>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block text-white/70">
           <span className="text-[10px] uppercase tracking-widest writing-vertical">Scroll</span>
        </div>
      </header>

      {/* Featured Collection - CAROUSEL SLIDER */}
      <section className="py-24 px-6 md:px-12 bg-white relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl md:text-5xl mb-6 text-stone-900">The Atelier Collection</h2>
            <p className="text-stone-500 font-light leading-relaxed">
              Meticulously crafted for the modern muse. DEZZI embodies the perfect balance of structural integrity and fluid grace.
            </p>
          </div>

          {/* Carousel Wrapper */}
          <div 
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Nav Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-8 z-10 p-3 bg-white/80 backdrop-blur hover:bg-stone-900 hover:text-white rounded-full shadow-lg transition-all border border-stone-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-8 z-10 p-3 bg-white/80 backdrop-blur hover:bg-stone-900 hover:text-white rounded-full shadow-lg transition-all border border-stone-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slider Track */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)` }}
              >
                {CAROUSEL_PRODUCTS.map((product, index) => (
                  <div 
                    key={`${product.id}-${index}`} 
                    className={`flex-shrink-0 px-4 cursor-pointer`}
                    style={{ width: `${100 / itemsPerView}%` }}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="relative overflow-hidden aspect-[3/4] mb-6 bg-stone-100">
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-110"
                      />
                      {/* Secondary Image on Hover (Desktop) */}
                      <img 
                        src={product.images[1]} 
                        alt={product.title} 
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-0 hover:opacity-100 transition-opacity duration-700 hidden lg:block"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 hover:opacity-100 transition-opacity duration-500 translate-y-4 hover:translate-y-0">
                        <button className="w-full bg-white/90 backdrop-blur text-stone-900 py-4 uppercase text-xs tracking-widest font-bold hover:bg-white">
                          Quick View
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-start px-1">
                      <div>
                        <h3 className="font-serif text-2xl text-stone-900 mb-1 hover:text-stone-600 transition-colors">{product.title}</h3>
                        <p className="text-stone-500 text-sm font-light">{product.subtitle}</p>
                      </div>
                      <span className="font-sans text-stone-900 font-bold">${product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: CAROUSEL_PRODUCTS.length - itemsPerView + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-stone-900 w-6' : 'bg-stone-300 hover:bg-stone-500'}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
             <Button variant="outline">View All Creations</Button>
          </div>
        </div>
      </section>

      {/* Brand Story / Parallax-like */}
      <section className="py-24 bg-stone-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
            <img src="https://ik.imagekit.io/p78ewpzv2/DEZZI%20FASHION/Gemini_Generated_Image_a49y8za49y8za49y.png" className="w-full h-full object-cover grayscale" alt="Background"/>
        </div>
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <span className="uppercase tracking-[0.2em] text-stone-400 text-sm">Behind the Brand</span>
            <h2 className="font-serif text-4xl md:text-6xl leading-tight">
              Where Artistry <br/> Meets Fabric
            </h2>
            <p className="text-stone-300 font-light text-lg leading-relaxed max-w-md">
              Every DEZZI garment is a testament to superior craftsmanship. We source the finest silks and satins from around the globe, ensuring that your presence is felt before you even enter the room.
            </p>
            <div className="pt-4">
              <a href="#" className="inline-flex items-center gap-2 uppercase tracking-widest text-xs font-bold border-b border-white/30 pb-1 hover:border-white transition-all">
                Read Our Story <ArrowRight className="w-4 h-4"/>
              </a>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md">
             <div className="aspect-[4/5] bg-stone-800 p-2 relative">
                <div className="w-full h-full border border-white/20 absolute top-4 left-4 z-0"></div>
                <img src="https://ik.imagekit.io/p78ewpzv2/DEZZI%20FASHION/Gemini_Generated_Image_how82hhow82hhow8.png" className="w-full h-full object-cover relative z-10 grayscale hover:grayscale-0 transition-all duration-700" alt="Atelier"/>
             </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-6 text-center max-w-xl">
           <h3 className="font-serif text-3xl mb-4">Join the Inner Circle</h3>
           <p className="text-stone-500 mb-8 font-light">Be the first to view our seasonal editorials and exclusive releases.</p>
           <div className="flex flex-col md:flex-row gap-4">
             <input type="email" placeholder="Email Address" className="flex-1 bg-white border border-stone-200 px-6 py-4 focus:outline-none focus:border-stone-900 transition-colors font-sans placeholder:text-stone-300"/>
             <Button>Subscribe</Button>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-stone-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
            <div className="col-span-1 md:col-span-1">
              <a href="#" className="text-3xl font-serif font-bold tracking-widest block mb-6">DEZZI</a>
              <div className="flex gap-4 text-stone-400">
                <Instagram className="w-5 h-5 hover:text-stone-900 cursor-pointer transition-colors"/>
                <Facebook className="w-5 h-5 hover:text-stone-900 cursor-pointer transition-colors"/>
                <Twitter className="w-5 h-5 hover:text-stone-900 cursor-pointer transition-colors"/>
              </div>
            </div>
            
            <div>
              <h4 className="uppercase text-xs font-bold tracking-widest mb-6">Shop</h4>
              <ul className="space-y-4 text-sm text-stone-500 font-light">
                <li><a href="#" className="hover:text-stone-900 transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-stone-900 transition-colors">Dresses</a></li>
                <li><a href="#" className="hover:text-stone-900 transition-colors">Bridal</a></li>
                <li><a href="#" className="hover:text-stone-900 transition-colors">Accessories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="uppercase text-xs font-bold tracking-widest mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-stone-500 font-light">
                <li><a href="#" className="hover:text-stone-900 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-stone-900 transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-stone-900 transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-stone-900 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="uppercase text-xs font-bold tracking-widest mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-stone-500 font-light">
                <li><a href="#" className="hover:text-stone-900 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-stone-900 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-stone-400 font-light border-t border-stone-100 pt-8">
            <p>&copy; 2024 DEZZI Fashion. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Designed for Excellence.</p>
          </div>
        </div>
      </footer>

      {/* Interactive Elements */}
      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cartItems={cartItems}
        removeFromCart={removeFromCart}
      />

      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        addToCart={addToCart}
      />

    </div>
  );
}
