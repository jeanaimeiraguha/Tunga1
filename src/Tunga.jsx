import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- 1. LOCAL STORAGE & DATA UTILITIES (Mimics Database and Persistence) ---

const DB_KEYS = {
    USERS: 'tunga_nakangaka_users',
    ORDERS: 'tunga_nakangaka_orders',
    PRODUCTS: 'tunga_nakangaka_products',
    CART: 'tunga_nakangaka_cart',
    CURRENT_USER: 'tunga_nakangaka_currentUser'
};

// Official Contact Details
const CONTACT = {
    WHATSAPP_NUMBER: '250732388667', // Used for WhatsApp link
    PHONE_NUMBER: '0794633684',     // Used for Mobile Payment/Contact
    EMAIL: 'uragiwenimanapatrick26@gmail.com'
};

const initialProducts = [
    { id: 'p001', name: 'Nike Air Max 270', category: 'men', price: 25000, imageUrl: 'https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg' },
    { id: 'p002', name: 'Puma Retro T-Shirt', category: 'men', price: 12000, imageUrl: 'https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_1280.png' },
    { id: 'p003', name: 'Adidas Sports Bra', category: 'women', price: 18000, imageUrl: 'https://cdn.pixabay.com/photo/2017/08/01/08/29/woman-2563491_1280.jpg' },
    { id: 'p004', name: 'Children’s Toy Car', category: 'kids', price: 6000, imageUrl: 'https://images.unsplash.com/photo-1601925375545-3f3f9828e83b?w=600&h=400&fit=crop&q=70' },
    { id: 'p005', name: 'Local Honey Jar', category: 'food', price: 8000, imageUrl: 'https://images.unsplash.com/photo-1558230278-f73752e25697?w=600&h=400&fit=crop&q=70' },
    { id: 'p006', name: 'Men’s Analog Watch', category: 'men', price: 55000, imageUrl: 'https://images.unsplash.com/photo-1523275371510-ae2da3b98c56?w=600&h=400&fit=crop&q=70' },
];

const getFromDB = (key, defaultValue) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
};

const saveToDB = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Error saving key ${key}:`, e);
    }
};

// --- 2. UTILITY COMPONENTS (Notification) ---

const Notification = ({ message, type, onClose }) => {
    const icon = {
        success: <i className="fas fa-check-circle mr-2"></i>,
        error: <i className="fas fa-times-circle mr-2"></i>,
        info: <i className="fas fa-info-circle mr-2"></i>,
    };
    const color = {
        success: 'bg-green-500 border-green-700',
        error: 'bg-red-500 border-red-700',
        info: 'bg-blue-500 border-blue-700',
    };

    return (
        <div className={`fixed bottom-5 right-5 z-[100] p-4 text-white rounded-lg shadow-xl flex items-center transition-all duration-300 transform translate-y-0 ${color[type]}`}>
            {icon[type]}
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 opacity-75 hover:opacity-100 transition">
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
};


// --- 3. CORE COMPONENTS (Header, Footer, ProductCard) ---

const Header = ({ appState, showPage, handleLogout }) => {
    const { currentUser, cart } = appState;
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="bg-gradient-to-r from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d] text-white py-4 shadow-xl sticky top-0 z-50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex justify-between items-center flex-wrap">
                    <div className="flex items-center text-2xl font-bold cursor-pointer transition transform hover:scale-105" onClick={() => showPage('home')}>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-2 font-bold text-[#1a2a6c] text-lg">TN</div>
                        <span className="hidden sm:inline">TUNGA NAKANGAKA</span>
                    </div>
                    
                    <ul className="flex list-none flex-wrap justify-center space-x-3 sm:space-x-5 text-sm md:text-base">
                        {['home', 'products', 'contact'].map(page => (
                            <li key={page}>
                                <button onClick={() => showPage(page)} className="text-white font-medium hover:text-[#fdbb2d] transition duration-300 capitalize">{page}</button>
                            </li>
                        ))}
                        <li>
                            <button onClick={() => showPage('cart')} className="text-white font-medium hover:text-[#fdbb2d] transition duration-300 relative">
                                Cart
                                {cartCount > 0 && <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">{cartCount}</span>}
                            </button>
                        </li>
                        
                        {currentUser ? (
                            <>
                                <li><button onClick={() => showPage('wallet')} className="text-white font-medium hover:text-[#fdbb2d] transition duration-300 hidden md:inline">Wallet</button></li>
                                <li><button onClick={() => showPage('referral')} className="text-white font-medium hover:text-[#fdbb2d] transition duration-300 hidden lg:inline">Invite</button></li>
                                {currentUser.isAdmin && <li><button onClick={() => showPage('admin')} className="font-bold text-[#fdbb2d] hover:text-white transition duration-300">Admin</button></li>}
                                <li><button onClick={handleLogout} className="text-red-300 hover:text-red-500 transition duration-300">Logout</button></li>
                            </>
                        ) : (
                            <>
                                <li><button onClick={() => showPage('login')} className="text-white font-medium hover:text-[#fdbb2d] transition duration-300">Login</button></li>
                                <li><button onClick={() => showPage('signup')} className="text-white font-medium hover:text-[#fdbb2d] transition duration-300">Sign Up</button></li>
                            </>
                        )}
                    </ul>
                    
                    {/* WhatsApp Link updated with the specified number */}
                    <a href={`https://wa.me/${CONTACT.WHATSAPP_NUMBER}`} className="bg-[#25D366] text-white py-2 px-3 sm:px-4 rounded-full flex items-center transition duration-300 hover:bg-[#128C7E] mt-2 md:mt-0 text-sm md:text-base transform hover:scale-105" target="_blank">
                        <i className="fab fa-whatsapp mr-1"></i> <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                </div>
            </div>
        </header>
    );
};

const Footer = () => (
    <footer className="bg-[#1a2a6c] text-white py-8">
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6 border-b border-white/10 pb-6">
                <div className="col-span-2 md:col-span-1">
                    <h3 className="text-xl font-semibold mb-4">TUNGA NAKANGAKA</h3>
                    <p className="text-sm text-gray-300">Your trusted online shopping destination for quality products.</p>
                </div>
                <div><h3 className="text-xl font-semibold mb-4">Quick Links</h3><ul className="space-y-2 text-sm text-gray-300"><li>Home</li><li>Products</li><li>Contact</li></ul></div>
                <div><h3 className="text-xl font-semibold mb-4">Legal</h3><ul className="space-y-2 text-sm text-gray-300"><li>Terms of Service</li><li>Privacy Policy</li><li>Refund Policy</li></ul></div>
                {/* Contact Information Updated */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                    <p className="text-sm text-gray-300 mb-2"><i className="fas fa-envelope mr-2"></i> {CONTACT.EMAIL}</p>
                    <p className="text-sm text-gray-300 mb-2"><i className="fas fa-phone mr-2"></i> {CONTACT.PHONE_NUMBER} (Telefoni)</p>
                    <p className="text-sm text-gray-300"><i className="fab fa-whatsapp mr-2"></i> {CONTACT.WHATSAPP_NUMBER}</p>
                </div>
            </div>
            <div className="text-center pt-4 text-sm text-gray-400">
                &copy; 2025 TUNGA NAKANGAKA. All rights reserved.
            </div>
        </div>
    </footer>
);

const ProductCard = ({ product, addToCart }) => (
    <div className="group bg-white rounded-xl overflow-hidden shadow-lg transition duration-300 hover:shadow-2xl hover:scale-[1.03] transform">
        <div className="h-48 overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" loading="lazy"/>
        </div>
        <div className="p-4">
            <h4 className="font-semibold text-lg truncate text-gray-800">{product.name}</h4>
            <div className="font-bold text-[#b21f1f] my-2 text-xl">{product.price.toLocaleString('en-US')} RWF</div>
            <button
                onClick={() => addToCart(product)}
                className="bg-[#1a2a6c] text-white py-2 px-4 rounded-lg w-full transition duration-300 hover:bg-[#0d1a4d] hover:shadow-md"
            >
                <i className="fas fa-cart-plus mr-2"></i> Add to Cart
            </button>
        </div>
    </div>
);


// --- 4. PAGE COMPONENTS (Updated for Contact Details) ---

const HomePage = ({ appState, showPage, addToCart }) => (
    <div className="animate-fadeIn">
        {/* Hero Banner with Hover Effect */}
        <div className="bg-cover bg-center text-white py-16 sm:py-20 text-center rounded-xl mb-10 shadow-lg relative overflow-hidden transition duration-500 hover:shadow-2xl hover:scale-[1.01]" 
             style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80')" }}>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 animate-bounce-in">Welcome to TUNGA NAKANGAKA</h1>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-6">Your one-stop shop for quality shoes, clothing, and food products</p>
            <button onClick={() => showPage('products')} className="bg-[#fdbb2d] text-gray-900 py-3 px-8 rounded-md text-lg font-bold transition duration-300 hover:bg-[#e6a828] transform hover:scale-110">Shop Now</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10">
            {/* Feature Cards with hover animation */}
            {[{ icon: 'shoe-prints', title: 'Quality Shoes' }, { icon: 'tshirt', title: 'Fashion Clothing' }, { icon: 'utensils', title: 'Food Products' }, { icon: 'shipping-fast', title: 'Fast Delivery' }]
                .map((f, i) => (
                <div key={i} className="bg-white p-5 rounded-xl shadow-md text-center transition duration-300 hover:shadow-xl hover:-translate-y-1">
                    <i className={`fas fa-${f.icon} text-3xl sm:text-4xl text-[#1a2a6c] mb-3 transition duration-300 group-hover:scale-110`}></i>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1">{f.title}</h3>
                </div>
            ))}
        </div>

        <div className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-6 text-[#1a2a6c]">Latest Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {appState.products.slice(0, 3).map(p => (
                    <ProductCard key={p.id} product={p} addToCart={addToCart} />
                ))}
            </div>
        </div>
    </div>
);

const ProductsPage = ({ appState, addToCart }) => {
    const categories = useMemo(() => ['all', 'men', 'women', 'kids', 'food'], []);
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    const filteredProducts = useMemo(() => {
        return appState.products.filter(p => 
            selectedCategory === 'all' || p.category === selectedCategory
        );
    }, [selectedCategory, appState.products]);

    return (
        <div className="animate-fadeIn">
            <h1 className="text-4xl font-bold mb-6 text-[#1a2a6c]">Our Products</h1>
            <div className="flex mb-6 border-b border-gray-300 overflow-x-auto whitespace-nowrap">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`py-3 px-5 text-lg font-medium cursor-pointer border-b-2 transition duration-300 whitespace-nowrap 
                            ${selectedCategory === cat ? 'border-[#b21f1f] text-[#b21f1f] font-bold shadow-inner' : 'border-transparent hover:border-gray-400 text-gray-600'}`}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(p => (
                    <ProductCard key={p.id} product={p} addToCart={addToCart} />
                ))}
                {filteredProducts.length === 0 && <p className="col-span-full text-center py-10 text-gray-500">No products found in this category.</p>}
            </div>
        </div>
    );
};

const WalletPage = ({ appState, showPage, addNotification }) => {
    const { currentUser } = appState;
    const [amount, setAmount] = useState('');
    
    if (!currentUser) return <div className="text-center py-20 text-red-600">Please log in to view your Wallet.</div>;

    const balance = currentUser.wallet || 50000; // Mock balance

    const handleTransaction = (type) => {
        if (!amount || isNaN(amount) || amount <= 0) {
            addNotification('Please enter a valid amount.', 'error');
            return;
        }
        
        if (type === 'withdraw' && amount > balance) {
            addNotification('Insufficient funds.', 'error');
            return;
        }
        
        addNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} of ${amount} RWF requested. Processing... (Mock)`, 'info');
        setAmount('');
    };

    return (
        <div className="animate-fadeIn max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-[#1a2a6c] text-center">My Wallet</h1>
            <div className="bg-white rounded-xl p-8 shadow-2xl mb-8 text-center border-b-4 border-[#b21f1f] transition transform hover:scale-[1.02]">
                <h2 className="text-2xl font-semibold">Current Balance</h2>
                <div className="text-6xl font-extrabold text-[#1a2a6c] my-4">{balance.toLocaleString('en-US')} RWF</div>
                <p className="text-gray-600">Available for shopping or withdrawal</p>
                <div className="mt-8 flex justify-center space-x-4">
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (RWF)" className="p-3 border border-gray-300 rounded-lg w-40 text-center"/>
                    <button onClick={() => handleTransaction('deposit')} className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition hover:bg-green-700 transform hover:scale-105"><i className="fas fa-plus-circle mr-2"></i>Deposit</button>
                    <button onClick={() => handleTransaction('withdraw')} className="bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition hover:bg-red-700 transform hover:scale-105"><i className="fas fa-minus-circle mr-2"></i>Withdraw</button>
                </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-[#1a2a6c]">Transaction History (Mock)</h2>
                <p className="text-gray-500">No recent transactions to display.</p>
            </div>
        </div>
    );
};

const ReferralPage = ({ appState, addNotification }) => {
    const { currentUser } = appState;
    
    if (!currentUser) return <div className="text-center py-20 text-red-600">Please log in to view your Referral link.</div>;

    const referralLink = `https://tunga.co/ref=${currentUser.id.slice(-6).toUpperCase()}`;
    const referralCount = 3; // Mock value
    const earnedBonus = referralCount * 6000; // Mock 6000 RWF per referral

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        addNotification('Referral link copied to clipboard!', 'success');
    };

    return (
        <div className="animate-fadeIn max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-[#1a2a6c] text-center">Invite & Earn</h1>
            <div className="bg-white rounded-xl p-8 shadow-lg mb-8 text-center border-t-4 border-[#fdbb2d]">
                <h2 className="text-3xl font-semibold mb-2 text-[#b21f1f]">Earn 6,000 RWF for Every Friend You Refer!</h2>
                <p className="text-gray-600">Share your referral link with friends and earn when they shop.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    <div className="bg-gray-100 rounded-lg p-4 shadow-inner">
                        <h3 className="text-lg">Total Referrals</h3>
                        <div className="text-4xl font-bold text-[#1a2a6c] my-2">{referralCount}</div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 shadow-inner">
                        <h3 className="text-lg">Earned Bonus (RWF)</h3>
                        <div className="text-4xl font-bold text-[#1a2a6c] my-2">{earnedBonus.toLocaleString('en-US')}</div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 shadow-inner">
                        <h3 className="text-lg">Your ID</h3>
                        <div className="text-4xl font-bold text-[#1a2a6c] my-2">{currentUser.id.slice(-6).toUpperCase()}</div>
                    </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-5 mt-5 border">
                    <h3 className="text-xl font-semibold mb-3">Your Referral Link</h3>
                    <div className="flex">
                        <input type="text" value={referralLink} readOnly className="flex-1 p-3 border border-gray-300 rounded-l-lg text-sm md:text-base bg-white truncate"/>
                        <button onClick={copyLink} className="bg-[#1a2a6c] text-white py-3 px-4 rounded-r-lg transition hover:bg-[#0d1a4d] transform hover:scale-[1.05] active:scale-100">
                            <i className="fas fa-copy"></i> Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactPage = ({ addNotification }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock submission
        console.log('Contact form submitted:', formData);
        addNotification('Message sent successfully! We will get back to you soon.', 'success');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-4xl font-bold mb-6 text-[#1a2a6c] text-center">Contact Us</h1>
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border-l-4 border-[#b21f1f]">
                <p className="text-center mb-6 text-gray-600">
                    Reach us via **WhatsApp: {CONTACT.WHATSAPP_NUMBER}**, **Phone: {CONTACT.PHONE_NUMBER}**, or email us using the form below.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-1 font-medium">Full Name</label>
                        <input type="text" id="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#1a2a6c] focus:border-[#1a2a6c] transition"/>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-1 font-medium">Email Address</label>
                        <input type="email" id="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#1a2a6c] focus:border-[#1a2a6c] transition" placeholder={CONTACT.EMAIL}/>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="message" className="block mb-1 font-medium">Message</label>
                        <textarea id="message" value={formData.message} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#1a2a6c] focus:border-[#1a2a6c] transition" rows="4"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-[#1a2a6c] text-white py-3 rounded-lg text-lg transition hover:bg-[#0d1a4d] transform hover:scale-[1.01] active:scale-100">
                        <i className="fas fa-paper-plane mr-2"></i> Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

const CartPage = ({ appState, updateCartItemQuantity, removeFromCart, showPage }) => {
    const { cart } = appState;
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    return (
        <div className="animate-fadeIn">
            <h1 className="text-4xl font-bold mb-6 text-[#1a2a6c]">Shopping Cart</h1>
            
            {cart.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                    <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4 animate-bounce-slow"></i>
                    <p className="text-xl text-gray-600">Your cart is empty.</p>
                    <button onClick={() => showPage('products')} className="mt-4 bg-[#b21f1f] text-white py-2 px-6 rounded-lg hover:bg-[#a11c1c] transition transform hover:scale-105">Start Shopping</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex bg-white p-4 rounded-xl shadow-md items-center transition duration-300 hover:shadow-lg">
                                <div className="w-16 h-16 bg-gray-100 mr-4 rounded-md flex-shrink-0 overflow-hidden">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-lg truncate">{item.name}</h4>
                                    <div className="font-bold text-[#1a2a6c]">{item.price.toLocaleString('en-US')} RWF</div>
                                    <div className="flex items-center mt-2 space-x-2">
                                        <button onClick={() => updateCartItemQuantity(item.id, -1)} className="bg-gray-300 w-6 h-6 rounded-full hover:bg-gray-400 text-sm transition">-</button>
                                        <span className="font-bold">{item.quantity}</span>
                                        <button onClick={() => updateCartItemQuantity(item.id, 1)} className="bg-gray-300 w-6 h-6 rounded-full hover:bg-gray-400 text-sm transition">+</button>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col justify-between items-end h-full">
                                    <p className="font-bold text-lg text-gray-700">{(item.price * item.quantity).toLocaleString('en-US')} RWF</p>
                                    <button onClick={() => removeFromCart(item.id)} className="bg-red-500 text-white py-1 px-3 rounded-md text-sm hover:bg-red-600 mt-2 transition">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cart-summary bg-white p-5 rounded-xl shadow-lg h-fit border-t-4 border-[#b21f1f]">
                        <h2 className="text-2xl font-semibold mb-3">Order Summary</h2>
                        <div className="text-4xl font-bold text-[#1a2a6c] my-4 border-t pt-4">Total: {cartTotal.toLocaleString('en-US')} RWF</div>
                        <button onClick={() => showPage('checkout')} className="w-full bg-[#1a2a6c] text-white py-3 rounded-lg text-xl transition hover:bg-[#0d1a4d] transform hover:scale-[1.01]">Proceed to Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const CheckoutPage = ({ appState, showPage, createNewOrder, addNotification }) => {
    const [paymentMethod, setPaymentMethod] = useState('mobile');

    if (!appState.currentUser) {
        addNotification('Please log in to checkout.', 'error');
        showPage('login');
        return null;
    }
    
    const cartTotal = appState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        const orderId = Date.now().toString().slice(-10);
        const orderData = {
            id: orderId,
            userId: appState.currentUser.id,
            items: appState.cart,
            total: cartTotal,
            method: paymentMethod,
            status: 'pending',
            date: new Date().toISOString().split('T')[0]
        };
        createNewOrder(orderData);
        addNotification(`Order #${orderId} submitted! Status: Pending. Please complete your payment.`, 'success');
        showPage('home'); // Redirect to home/orders page
    };

    return (
        <div className="animate-fadeIn max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-[#1a2a6c] text-center">Checkout</h1>
            <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-[#b21f1f]">
                <h2 className="text-3xl font-bold text-center mb-6 text-[#b21f1f]">Total: {cartTotal.toLocaleString('en-US')} RWF</h2>

                <h3 className="text-xl font-semibold mb-4 text-[#1a2a6c]">Select Payment Method</h3>
                <div className="flex flex-wrap gap-4 mb-6">
                    {['mobile', 'binance', 'wallet'].map(method => (
                        <div key={method} onClick={() => setPaymentMethod(method)}
                             className={`flex-1 p-4 border-2 rounded-lg cursor-pointer text-center transition duration-300 transform hover:scale-[1.03] ${paymentMethod === method ? 'border-[#1a2a6c] bg-blue-50 shadow-md' : 'border-gray-300 hover:border-gray-400'}`}>
                            <i className={`fas fa-${method === 'mobile' ? 'mobile-alt' : (method === 'binance' ? 'dollar-sign' : 'wallet')} text-2xl mb-2 text-[#1a2a6c]`}></i>
                            <h4 className="font-semibold">{method.charAt(0).toUpperCase() + method.slice(1)}</h4>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmitOrder}>
                    <div className="space-y-4">
                        {paymentMethod === 'mobile' && (
                            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#1a2a6c]">
                                {/* Mobile Payment Number Updated */}
                                <p className="mb-3 font-bold">Please transfer the amount to: **{CONTACT.PHONE_NUMBER}** (MTN/Airtel)</p>
                                <label className="block font-medium">Upload Payment Proof (Screenshot)</label>
                                <input type="file" required className="w-full p-2 border border-gray-300 rounded-lg bg-white"/>
                            </div>
                        )}
                        {paymentMethod === 'binance' && (
                            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#1a2a6c]">
                                {/* Binance Email Updated */}
                                <p className="mb-3 font-bold">Send equivalent USDT to: **{CONTACT.EMAIL}**</p>
                                <label className="block font-medium">Upload Transaction Screenshot</label>
                                <input type="file" required className="w-full p-2 border border-gray-300 rounded-lg bg-white"/>
                            </div>
                        )}
                        {paymentMethod === 'wallet' && (
                            <div className="bg-red-100 text-red-700 p-4 rounded-lg border-l-4 border-red-500">
                                <p className="font-semibold">Your current wallet balance is: 50,000 RWF (Mock). This option is for future integration.</p>
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={paymentMethod === 'wallet'} className={`w-full text-white py-3 rounded-lg text-lg mt-6 transition hover:scale-[1.01] ${paymentMethod === 'wallet' ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b21f1f] hover:bg-[#a11c1c]'}`}>
                        <i className="fas fa-money-check-alt mr-2"></i> Confirm Order
                    </button>
                </form>
            </div>
        </div>
    );
};

const LoginPage = ({ showPage, handleLogin, addNotification }) => {
    const [email, setEmail] = useState('admin@tunga.com'); // Pre-fill for easy demo
    const [password, setPassword] = useState('password123');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const users = getFromDB(DB_KEYS.USERS, [{ id: 'u000', email: 'admin@tunga.com', password: 'password123', name: 'Admin User', isAdmin: true, wallet: 50000 }]);
        const user = users.find(u => u.email === email && u.password === password); 
        
        if (user) {
            handleLogin(user);
            addNotification(`Welcome back, ${user.name}!`, 'success');
        } else {
            addNotification('Invalid credentials. Try admin@tunga.com / password123', 'error');
        }
    };

    return (
        <div className="animate-fadeIn max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-[#1a2a6c] text-center">Login to Your Account</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#fdbb2d]">
                <div className="mb-5">
                    <label className="block mb-1 font-medium">Email or Phone Number</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#1a2a6c] focus:border-[#1a2a6c]" placeholder="Enter email or phone number" />
                </div>
                <div className="mb-5">
                    <label className="block mb-1 font-medium">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#1a2a6c] focus:border-[#1a2a6c]" placeholder="Enter your password" />
                </div>
                <button type="submit" className="w-full bg-[#1a2a6c] text-white py-3 rounded-lg text-lg transition hover:bg-[#0d1a4d] transform hover:scale-[1.01]">Login</button>
                <p className="text-center mt-4 text-sm">
                    <button type="button" onClick={() => showPage('forgot-password')} className="text-[#1a2a6c] hover:underline">Forgot Password?</button>
                </p>
                <p className="text-center mt-2 text-sm">
                    Don't have an account? <button type="button" onClick={() => showPage('signup')} className="text-[#1a2a6c] hover:underline">Sign Up</button>
                </p>
            </form>
        </div>
    );
};

const SignupPage = ({ showPage, addNotification }) => {
    const [data, setData] = useState({ name: '', email: '', phone: '', password: '' });
    
    const handleChange = (e) => setData({ ...data, [e.target.id]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newUser = { ...data, id: 'u' + Date.now(), isAdmin: false, wallet: 0 };
        const existingUsers = getFromDB(DB_KEYS.USERS, []);
        saveToDB(DB_KEYS.USERS, [...existingUsers, newUser]);
        addNotification('Account created successfully! Please log in.', 'success');
        showPage('login');
    };

    return (
        <div className="animate-fadeIn max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-[#1a2a6c] text-center">Create an Account</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#fdbb2d]">
                <div className="mb-5"><label className="block mb-1 font-medium">Full Name</label><input type="text" id="name" value={data.name} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter your full name" /></div>
                <div className="mb-5"><label className="block mb-1 font-medium">Email Address</label><input type="email" id="email" value={data.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter your email" /></div>
                <div className="mb-5"><label className="block mb-1 font-medium">Phone Number</label><input type="tel" id="phone" value={data.phone} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter your phone number" /></div>
                <div className="mb-5"><label className="block mb-1 font-medium">Password</label><input type="password" id="password" value={data.password} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg" placeholder="At least 8 characters" /></div>
                <button type="submit" className="w-full bg-[#1a2a6c] text-white py-3 rounded-lg text-lg transition hover:bg-[#0d1a4d] transform hover:scale-[1.01]">Sign Up</button>
                <p className="text-center mt-4 text-sm">Already have an account? <button type="button" onClick={() => showPage('login')} className="text-[#1a2a6c] hover:underline">Login</button></p>
            </form>
        </div>
    );
};

const AdminPage = ({ appState, addNotification }) => {
    const [adminSection, setAdminSection] = useState('dashboard');
    const [mockProduct, setMockProduct] = useState({ name: 'New Item', price: 10000 });
    
    if (!appState.currentUser || !appState.currentUser.isAdmin) {
        return <div className="text-center py-20 text-red-600">ACCESS DENIED.</div>;
    }
    
    const totalSales = appState.orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = appState.orders.filter(o => o.status === 'pending').length;
    
    const mockAddProduct = () => {
        const newProduct = { ...mockProduct, id: 'p' + Date.now(), category: 'men', imageUrl: initialProducts[0].imageUrl };
        saveToDB(DB_KEYS.PRODUCTS, [...appState.products, newProduct]);
        addNotification(`${newProduct.name} added successfully! (Reload to see effect)`, 'success');
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-4xl font-bold mb-6 text-[#1a2a6c] text-center">Admin Panel</h1>
            <div className="bg-white rounded-xl p-6 shadow-2xl border-b-4 border-[#fdbb2d]">
                <div className="flex mb-5 border-b border-gray-300 overflow-x-auto whitespace-nowrap">
                    {['dashboard', 'products', 'orders', 'users'].map(section => (
                        <button key={section} onClick={() => setAdminSection(section)}
                            className={`py-2 px-5 font-semibold transition transform hover:scale-105 ${adminSection === section ? 'border-b-2 border-[#1a2a6c] text-[#1a2a6c]' : 'text-gray-600 hover:text-gray-800'}`}>
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </button>
                    ))}
                </div>
                
                {adminSection === 'dashboard' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                        <div className="bg-gray-100 rounded-lg p-5 text-center shadow-md"><h3 className="text-lg">Total Users</h3><div className="text-4xl font-bold text-[#1a2a6c] my-2">{appState.users.length}</div></div>
                        <div className="bg-gray-100 rounded-lg p-5 text-center shadow-md"><h3 className="text-lg">Pending Orders</h3><div className="text-4xl font-bold text-[#1a2a6c] my-2">{pendingOrders}</div></div>
                        <div className="bg-gray-100 rounded-lg p-5 text-center shadow-md"><h3 className="text-lg">Total Sales (RWF)</h3><div className="text-4xl font-bold text-[#1a2a6c] my-2">{totalSales.toLocaleString('en-US')}</div></div>
                    </div>
                )}
                
                {adminSection === 'products' && (
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold mb-4 text-[#b21f1f]">Add New Product (Mock)</h2>
                        <div className="flex space-x-3 mb-6">
                            <input type="text" value={mockProduct.name} onChange={(e) => setMockProduct({ ...mockProduct, name: e.target.value })} placeholder="Product Name" className="p-3 border rounded-lg flex-1"/>
                            <input type="number" value={mockProduct.price} onChange={(e) => setMockProduct({ ...mockProduct, price: parseInt(e.target.value) || 0 })} placeholder="Price" className="p-3 border rounded-lg w-32"/>
                            <button onClick={mockAddProduct} className="bg-green-600 text-white py-3 px-6 rounded-lg transition hover:bg-green-700">Add Product</button>
                        </div>
                        <h2 className="text-2xl font-semibold mb-4 text-[#1a2a6c]">All Products ({appState.products.length})</h2>
                        {/* Table would go here */}
                    </div>
                )}
                
                {adminSection === 'orders' && (
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold mb-4 text-[#1a2a6c]">Orders ({appState.orders.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left table-auto border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100"><th className="p-3">ID</th><th className="p-3">Total</th><th className="p-3">Date</th><th className="p-3">Status</th></tr>
                                </thead>
                                <tbody>
                                    {appState.orders.map(order => (
                                        <tr key={order.id} className="border-b hover:bg-gray-50"><td className="p-3 text-sm">{order.id}</td><td className="p-3 font-semibold">{order.total.toLocaleString('en-US')} RWF</td><td className="p-3 text-sm">{order.date}</td><td className={`p-3 font-semibold ${order.status === 'pending' ? 'text-orange-500' : 'text-green-500'}`}>{order.status}</td></tr>
                                    ))}
                                    {appState.orders.length === 0 && <tr><td colSpan="4" className="p-3 text-center text-gray-500">No orders placed yet.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- 5. MAIN APPLICATION COMPONENT ---

export const TungaApp = () => {
    // Initialize DB with a default admin user and products
    const [products, setProducts] = useState(getFromDB(DB_KEYS.PRODUCTS, initialProducts));
    const [users, setUsers] = useState(getFromDB(DB_KEYS.USERS, [{ id: 'u000', email: 'admin@tunga.com', password: 'password123', name: 'Admin User', isAdmin: true, wallet: 50000 }]));
    const [orders, setOrders] = useState(getFromDB(DB_KEYS.ORDERS, []));
    
    // Core App State
    const [currentUser, setCurrentUser] = useState(getFromDB(DB_KEYS.CURRENT_USER, null));
    const [cart, setCart] = useState(getFromDB(DB_KEYS.CART, []));
    const [activePage, setActivePage] = useState('home');
    const [notification, setNotification] = useState(null);

    // Notification Handler
    const addNotification = useCallback((message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    }, []);

    // Persistence Effects (Saves state to local storage on change)
    useEffect(() => { saveToDB(DB_KEYS.CART, cart); }, [cart]);
    useEffect(() => { saveToDB(DB_KEYS.CURRENT_USER, currentUser); }, [currentUser]);
    useEffect(() => { saveToDB(DB_KEYS.USERS, users); }, [users]);
    useEffect(() => { saveToDB(DB_KEYS.ORDERS, orders); }, [orders]);
    useEffect(() => { saveToDB(DB_KEYS.PRODUCTS, products); }, [products]);


    // --- Core State Logic Functions (Updated to use addNotification) ---

    const showPage = (pageId) => { 
        if (pageId === 'admin' && (!currentUser || !currentUser.isAdmin)) {
            addNotification('Admin access required.', 'error');
            return;
        }
        setActivePage(pageId); 
    };
    
    const handleLogin = (user) => {
        setCurrentUser(user);
        showPage('home');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCart([]); // Clear cart on logout
        addNotification('You have been logged out.', 'info');
        showPage('login');
    };

    const addToCart = useCallback((product, quantity = 1) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
            if (existingItemIndex > -1) {
                const newCart = prevCart.map((item, index) =>
                    index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
                );
                addNotification(`${product.name} quantity increased.`, 'info');
                return newCart;
            } else {
                addNotification(`${product.name} added to cart!`, 'success');
                return [...prevCart, { ...product, quantity }];
            }
        });
    }, [addNotification]);

    const updateCartItemQuantity = useCallback((productId, change) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item =>
                item.id === productId ? { ...item, quantity: item.quantity + change } : item
            ).filter(item => item.quantity > 0);
            return updatedCart;
        });
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
        addNotification('Item removed from cart.', 'info');
    }, [addNotification]);
    
    const createNewOrder = (orderData) => {
        setOrders(prevOrders => [...prevOrders, orderData]);
        setCart([]); // Clear cart after order
    };

    const appState = { currentUser, cart, products, users, orders };

    // --- Conditional Page Rendering ---
    let PageComponent;
    const commonProps = { appState, showPage, addNotification };

    switch (activePage) {
        case 'products': PageComponent = <ProductsPage {...commonProps} addToCart={addToCart} />; break;
        case 'cart': PageComponent = <CartPage {...commonProps} updateCartItemQuantity={updateCartItemQuantity} removeFromCart={removeFromCart} />; break;
        case 'checkout': PageComponent = <CheckoutPage {...commonProps} createNewOrder={createNewOrder} />; break;
        case 'login': PageComponent = <LoginPage {...commonProps} handleLogin={handleLogin} />; break;
        case 'signup': PageComponent = <SignupPage {...commonProps} />; break;
        case 'wallet': PageComponent = <WalletPage {...commonProps} />; break;
        case 'referral': PageComponent = <ReferralPage {...commonProps} />; break;
        case 'contact': PageComponent = <ContactPage {...commonProps} />; break;
        case 'admin': PageComponent = <AdminPage {...commonProps} />; break;
        case 'forgot-password': PageComponent = <div className="text-center py-20 animate-fadeIn"><h2 className='text-3xl text-[#b21f1f]'>Forgot Password</h2><p className='mt-3'>A mock password reset link has been sent to your email.</p></div>; break;
        case 'home':
        default: PageComponent = <HomePage {...commonProps} addToCart={addToCart} />; break;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <style>
                {`
                /* Custom Keyframes for Animations */
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s infinite ease-in-out;
                }
                `}
            </style>
            
            <Header appState={appState} showPage={showPage} handleLogout={handleLogout} />
            
            <main className="flex-grow py-8 px-4 md:px-8">
                <div className="container mx-auto max-w-6xl">
                    {PageComponent}
                </div>
            </main>
            
            <Footer />
            
            {notification && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                    onClose={() => setNotification(null)} 
                />
            )}
        </div>
    );
};

export default TungaApp;