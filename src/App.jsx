import { useState, useEffect, useRef, Suspense } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Text3D, Environment, ContactShadows, useTexture, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Search, Sun, Moon, Plus, MapPin, Clock, Phone, Facebook, Instagram, Twitter, Menu, X, ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Menu Data
const menuData = [
  { id: 1, name: "Mint Lemonade", description: "Refreshing mint leaves with fresh lemon juice", price: 120, category: "lemonade", image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80" },
  { id: 2, name: "Strawberry Lemonade", description: "Sweet strawberries blended with tangy lemonade", price: 150, category: "lemonade", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80" },
  { id: 3, name: "Blue Lagoon Lemonade", description: "Exotic blue curacao with fresh lemonade", price: 180, category: "lemonade", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80" },
  { id: 4, name: "Cheese Pizza", description: "Loaded with melted mozzarella and parmesan", price: 450, category: "pizza", image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&q=80" },
  { id: 5, name: "Chicken BBQ Pizza", description: "Grilled chicken, BBQ sauce, red onions", price: 650, category: "pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
  { id: 6, name: "Pepperoni Pizza", description: "Classic pepperoni with extra cheese", price: 700, category: "pizza", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80" },
  { id: 7, name: "Beef Burger", description: "Juicy beef patty with lettuce, tomato, special sauce", price: 280, category: "burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id: 8, name: "Crispy Chicken Burger", description: "Crispy fried chicken with coleslaw, spicy mayo", price: 320, category: "burger", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80" },
  { id: 9, name: "Double Smash Burger", description: "Two smashed beef patties with double cheese", price: 450, category: "burger", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50d5?w=400&q=80" },
  { id: 10, name: "Club Sandwich", description: "Triple-decker with turkey, bacon, eggs", price: 220, category: "sandwich", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80" },
  { id: 11, name: "Chicken Sandwich", description: "Grilled chicken with avocado, honey mustard", price: 250, category: "sandwich", image: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&q=80" },
  { id: 12, name: "Cheese Sandwich", description: "Toasted bread with melted cheese", price: 200, category: "sandwich", image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&q=80" },
  { id: 13, name: "Cappuccino", description: "Espresso with steamed milk foam", price: 180, category: "coffee", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80" },
  { id: 14, name: "Latte", description: "Smooth espresso with creamy steamed milk", price: 220, category: "coffee", image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&q=80" },
  { id: 15, name: "Cold Coffee", description: "Chilled espresso with milk and ice", price: 250, category: "coffee", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80" },
  { id: 16, name: "Sweet Curd", description: "Fresh homemade creamy curd", price: 120, category: "curd", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80" },
  { id: 17, name: "Mango Curd", description: "Rich mango pulp mixed with creamy curd", price: 160, category: "curd", image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80" },
  { id: 18, name: "Chocolate Curd", description: "Decadent chocolate mixed with smooth curd", price: 180, category: "curd", image: "https://images.unsplash.com/photo-1511914678378-2906b1f69dcf?w=400&q=80" },
]

const categories = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'lemonade', name: 'Lemonade', icon: '🍋' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'burger', name: 'Burger', icon: '🍔' },
  { id: 'sandwich', name: 'Sandwich', icon: '🥪' },
  { id: 'coffee', name: 'Coffee', icon: '☕' },
  { id: 'curd', name: 'Curd', icon: '🥛' },
]

// 3D Components
function FloatingElement({ position, rotation, children }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={position} rotation={rotation}>
        {children}
      </mesh>
    </Float>
  )
}

function LemonadeGlass() {
  return (
    <FloatingElement position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <cylinderGeometry args={[0.8, 0.6, 2, 32]} />
      <meshPhysicalMaterial
        color="#FFE066"
        transparent
        opacity={0.7}
        roughness={0.1}
        metalness={0}
        transmission={0.5}
      />
    </FloatingElement>
  )
}

function Burger3D() {
  return (
    <FloatingElement position={[0, 0, 0]} rotation={[0.2, 0, 0]}>
      <cylinderGeometry args={[1, 1, 0.5, 32]} />
      <meshStandardMaterial color="#8B4513" roughness={0.8} />
    </FloatingElement>
  )
}

function Pizza3D() {
  return (
    <FloatingElement position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
      <meshStandardMaterial color="#FFD93D" roughness={0.6} />
    </FloatingElement>
  )
}

function Scene({ mousePosition }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mousePosition.x * 0.5, 0.1)
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mousePosition.y * 0.5, 0.1)
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF6B35" />

      <group ref={meshRef}>
        <LemonadeGlass />
      </group>

      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
    </>
  )
}

// Particle Background
function ParticleBackground() {
  const particles = useRef([])

  useEffect(() => {
    const count = 50
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1
      })
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {['🍋', '🍊', '🍓', '🥑', '☕', '🍔', '🍕'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-20"
          initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
          animate={{
            y: [null, Math.random() * -100],
            x: [null, Math.random() * 50 - 25],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  )
}

// Loading Screen
function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-light dark:bg-bg-dark"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-6xl mb-6"
      >
        🍹
      </motion.div>
      <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-primary to-accent"
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-gray-500 font-medium"
      >
        Loading deliciousness...
      </motion.p>
    </motion.div>
  )
}

// Navbar Component
function Navbar({ darkMode, setDarkMode, searchQuery, setSearchQuery }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'glass-nav shadow-lg' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-3xl md:text-4xl">🍹</span>
            <div>
              <h1 className="font-heading text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Juicy n Smoothie
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block">Digital Menu</p>
            </div>
          </motion.div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu..."
                className="w-full px-5 py-2.5 rounded-full bg-white/80 dark:bg-dark/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-full bg-white/50 dark:bg-dark/50 flex items-center justify-center text-xl"
            >
              {darkMode ? '🌙' : '☀️'}
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden w-10 h-10 rounded-full bg-white/50 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu..."
                  className="w-full px-5 py-2.5 rounded-full bg-white/80 dark:bg-dark/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

// Hero Section
function HeroSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-secondary/20 to-primary/20 blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.5 }}
          className="mb-6"
        >
          <span className="text-8xl md:text-9xl filter drop-shadow-2xl">🍹</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-4"
        >
          <span className="text-primary">Juicy</span>{' '}
          <span className="text-secondary dark:text-white">n</span>{' '}
          <span className="text-accent">Smoothie</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-4 font-medium"
        >
          Fresh Taste. <span className="text-primary">Futuristic</span> Experience.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-base text-gray-500 dark:text-gray-400 mb-8"
        >
          Scan. Explore. Enjoy. 🍽️
        </motion.p>

        <motion.button
          onClick={handleViewMenu}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer"
        >
          <span>View Menu</span>
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}

// Category Tabs
function CategoryTabs({ activeCategory, setActiveCategory }) {
  return (
    <section className="py-8 px-4 sticky top-16 md:top-20 z-30 bg-bg-light/95 dark:bg-bg-dark/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="font-heading text-2xl md:text-3xl font-bold">
            <span className="text-secondary dark:text-white">Our</span>{' '}
            <span className="text-primary">Categories</span>
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

// Menu Card
function MenuCard({ item, index }) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -12 }}
      className="menu-card group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-white text-xs font-semibold rounded-full">
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className="font-heading text-lg font-bold mb-2 text-gray-800 dark:text-white">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-mono text-xl font-bold text-primary">
            ৳{item.price}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-primary text-white hover:shadow-lg hover:shadow-primary/40'
            }`}
          >
            {added ? '✓' : '+'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Menu Section
function MenuSection({ activeCategory, searchQuery }) {
  const filteredItems = menuData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section id="menu" className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">
            <span className="text-secondary dark:text-white">Our</span>{' '}
            <span className="text-primary">Menu</span>
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredItems.length} items
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-gray-500 text-lg">No items found</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <MenuCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Special Offer Section
function SpecialOffer() {
  return (
    <section id="offer" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 bg-black/30" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block px-6 py-2 bg-white text-primary font-bold rounded-full text-sm mb-4"
          >
            🔥 Today's Special
          </motion.span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">
            Special Offer
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          className="glass rounded-3xl p-8 md:p-12 text-center"
        >
          <div className="text-6xl md:text-7xl mb-6">🍕+🍋</div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            Buy 1 Pizza Get 1 Lemonade Free!
          </h3>
          <p className="text-white/80 text-lg mb-6">
            Valid for all pizza varieties. Refreshing lemonade included!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <span>🔥</span>
            <span>Limited Time Offer</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

// About Section
function AboutSection() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80"
                alt="Restaurant Interior"
                className="w-full rounded-3xl shadow-2xl object-cover h-80 md:h-96"
              />
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -bottom-6 -right-6 bg-gradient-to-r from-primary to-accent text-white p-6 rounded-2xl shadow-lg"
              >
                <p className="font-bold text-3xl">5+</p>
                <p className="text-sm">Years Active</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              <span className="text-secondary dark:text-white">About</span>{' '}
              <span className="text-primary">Us</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              Juicy n Smoothie brings fresh flavors, handcrafted drinks, premium burgers, pizzas, sandwiches, and coffee together in one modern dining experience.
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Our commitment to quality ingredients and exceptional taste has made us a favorite destination for food lovers seeking a delightful culinary journey.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {[
                { number: '18+', label: 'Menu Items' },
                { number: '6', label: 'Categories' },
                { number: '⭐⭐⭐⭐⭐', label: 'Rating' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <span className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</span>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  const contactItems = [
    { icon: Phone, label: 'Phone', value: '+1 234 567 890', href: 'tel:+1234567890' },
    { icon: Facebook, label: 'Facebook', value: '@JuicyNSmoothie', href: 'https://facebook.com', isSocial: true },
    { icon: Instagram, label: 'Instagram', value: '@juicy_nsmoothie', href: 'https://instagram.com', isSocial: true },
    { icon: Clock, label: 'Hours', value: '10AM - 10PM', href: '#' },
  ]

  return (
    <section id="contact" className="py-20 px-4 bg-gray-100/50 dark:bg-gray-900/50">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-3xl md:text-4xl font-bold text-center mb-12"
        >
          <span className="text-secondary dark:text-white">Contact</span>{' '}
          <span className="text-primary">Us</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {contactItems.map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              target={item.isSocial ? '_blank' : undefined}
              rel={item.isSocial ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-2xl p-6 text-center hover:bg-primary/10 transition-colors"
            >
              <item.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
              <p className="font-semibold text-sm">{item.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.value}</p>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-6 bg-gray-200/50 dark:bg-gray-800/50 rounded-2xl"
        >
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
            <MapPin className="w-5 h-5" />
            <span>Location</span>
          </div>
          <div className="h-48 bg-gray-300/50 dark:bg-gray-700/50 rounded-xl flex items-center justify-center">
            <span className="text-gray-500">🗺️ Interactive Map Coming Soon</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="py-12 px-4 bg-gradient-to-r from-secondary to-secondary-dark text-white">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex justify-center gap-4 mb-6">
          {[Facebook, Instagram, Twitter].map((Icon, i) => (
            <motion.a
              key={i}
              href="#"
              whileHover={{ scale: 1.1, y: -5 }}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
            >
              <Icon className="w-5 h-5" />
            </motion.a>
          ))}
        </div>

        <h3 className="font-heading text-2xl font-bold mb-2">
          🍹 Juicy n Smoothie
        </h3>
        <p className="text-white/80 mb-4">Fresh Taste, Smooth Experience</p>

        <div className="border-t border-white/20 pt-6 mt-6">
          <p className="text-white/60 text-sm mb-2">
            Designed with ❤️ for Juicy n Smoothie
          </p>
          <p className="text-white/40 text-xs">
            A product of <span className="text-accent">SabrWare</span>
          </p>
          <p className="text-white/30 text-xs mt-3">
            © 2024 Juicy n Smoothie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

// Mobile Bottom Nav
function MobileBottomNav() {
  const navItems = [
    { href: '#hero', icon: '🏠', label: 'Home' },
    { href: '#menu', icon: '🍽️', label: 'Menu' },
    { href: '#offer', icon: '🔥', label: 'Offers' },
    { href: '#contact', icon: '📞', label: 'Contact' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      <div className="glass-nav border-t border-gray-200/20 dark:border-gray-700/20">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="mobile-nav-item flex flex-col items-center py-2 px-4 text-gray-600 dark:text-gray-400"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

// Main App
function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  useEffect(() => {
    // Mouse position tracking
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleViewMenu = () => {
    const menuSection = document.getElementById('menu')
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFEF9] dark:bg-[#0D1117] transition-colors duration-300">
      <ParticleBackground />
      <LoadingScreen />

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main>
        <HeroSection />
        <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <MenuSection activeCategory={activeCategory} searchQuery={searchQuery} />
        <SpecialOffer />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />
      <MobileBottomNav />

      <div className="h-20 md:hidden" />
    </div>
  )
}

export default App