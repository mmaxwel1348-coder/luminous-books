import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getBooks } from '../lib/firebase';

export default function Storefront() {
  const [activeCategory, setActiveCategory] = useState('home');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [mpesaReceiveNumber, setMpesaReceiveNumber] = useState('0712345678');

  const musicTracks = [
    { id: 'm1', title: 'Sacred Hymns Vol. 1', artist: 'Mr. Ngotho', price: '200', description: 'Inspiring Catholic choral and devotional audio collection (MP3/WAV).' },
    { id: 'm2', title: 'Divine Grace - Full Album', artist: 'Mr. Ngotho', price: '500', description: 'Complete uplifting Catholic musical experience with soul-stirring melodies.' },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const data = await getBooks();
      setBooks(data);
      setLoading(false);
    };
    fetchBooks();

    const savedPhone = localStorage.getItem('luminiousbooks_mpesa_phone');
    if (savedPhone) {
      setMpesaReceiveNumber(savedPhone);
    }
  }, []);

  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now() + Math.random() }]);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handleMpesaCheckout = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) {
      alert('Please enter a valid M-Pesa phone number (e.g. 0712345678)');
      return;
    }
    setPaying(true);
    
    setTimeout(() => {
      setPaying(false);
      setPaymentSuccess(true);

      const savedSales = localStorage.getItem('luminiousbooks_sales');
      const salesData = savedSales ? JSON.parse(savedSales) : { totalSold: 0, totalRevenue: 0, salesList: [] };

      const newSalesList = cart.map(item => ({
        id: Date.now() + Math.random(),
        title: item.title,
        price: item.price,
        phone: phoneNumber,
        date: new Date().toLocaleDateString()
      }));

      const updatedSales = {
        totalSold: salesData.totalSold + cart.length,
        totalRevenue: salesData.totalRevenue + cartTotal,
        salesList: [...newSalesList, ...salesData.salesList]
      };

      localStorage.setItem('luminiousbooks_sales', JSON.stringify(updatedSales));
      setCart([]);
    }, 3000);
  };

  const closeModal = () => {
    setCheckoutOpen(false);
    setPaymentSuccess(false);
    setPhoneNumber('');
  };

  const filteredBooks = books.filter(b => 
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMusic = musicTracks.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Segoe UI, sans-serif', margin: 0, padding: 0, overflowX: 'hidden', boxSizing: 'border-box' }}>
      <Head>
        <title>Luminous - Mr. Ngotho's Bookstore & Sacred Music</title>
        <meta name="description" content="Discover extraordinary Catholic books and sacred music compositions by Mr. Ngotho." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <style jsx global>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background-color: #090d16 !important;
          color: #f8fafc;
          width: 100%;
          overflow-x: hidden;
        }
        /* Desktop sidebar visible, mobile header hidden by default */
        .desktop-sidebar { display: flex; }
        .mobile-header { display: none; }
        .main-content { margin-left: 70px; padding: 2rem 1.5rem; }

        /* On mobile screens (under 768px), hide sidebar and show top header with full width text */
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .main-content { margin-left: 0 !important; padding: 1.5rem 1rem !important; }
        }
      `}</style>

      {/* Mobile Top Navigation Header */}
      <header className="mobile-header" style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0.75rem 1rem', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.1rem', color: '#38bdf8' }}>
          <span>✝️</span> Mr. Ngotho
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActiveCategory('home')}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: activeCategory === 'home' ? '#2563eb' : '#1e293b', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}
          >
            🏠
          </button>
          <button 
            onClick={() => setActiveCategory('books')}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: activeCategory === 'books' ? '#2563eb' : '#1e293b', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}
          >
            📖
          </button>
          <button 
            onClick={() => setActiveCategory('music')}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: activeCategory === 'music' ? '#2563eb' : '#1e293b', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}
          >
            🎛️
          </button>
          <button 
            onClick={() => setActiveCategory('cart')}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: activeCategory === 'cart' ? '#2563eb' : '#1e293b', color: '#fff', fontSize: '1rem', cursor: 'pointer', position: 'relative' }}
          >
            🛒
            {cart.length > 0 && (
              <span style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', padding: '1px 5px', fontSize: '0.65rem', fontWeight: 'bold' }}>
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Desktop Fixed Sidebar Navigation */}
      <aside className="desktop-sidebar" style={{ 
        width: '70px', 
        backgroundColor: '#0f172a', 
        borderRight: '1px solid #1e293b', 
        padding: '1.5rem 0', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '1rem', 
        flexShrink: 0, 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        bottom: 0, 
        height: '100vh', 
        zIndex: 100, 
        boxSizing: 'border-box' 
      }}>
        <div style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>✝️</div>

        <button 
          title="Home & About Author"
          onClick={() => setActiveCategory('home')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px',
            borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'home' ? '#2563eb' : 'transparent',
            color: '#fff', fontSize: '1.4rem', cursor: 'pointer'
          }}
        >
          🏠
        </button>

        <button 
          title="Catholic Books Store"
          onClick={() => setActiveCategory('books')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px',
            borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'books' ? '#2563eb' : 'transparent',
            color: '#fff', fontSize: '1.4rem', cursor: 'pointer'
          }}
        >
          📖
        </button>

        <button 
          title="Sacred Catholic Music"
          onClick={() => setActiveCategory('music')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px',
            borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'music' ? '#2563eb' : 'transparent',
            color: '#fff', fontSize: '1.4rem', cursor: 'pointer'
          }}
        >
          🎛️
        </button>

        <button 
          title="Shopping Cart"
          onClick={() => setActiveCategory('cart')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px',
            borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'cart' ? '#2563eb' : 'transparent',
            color: '#fff', fontSize: '1.4rem', cursor: 'pointer', position: 'relative'
          }}
        >
          🛒
          {cart.length > 0 && (
            <span style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {cart.length}
            </span>
          )}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="main-content" style={{ flex: 1, boxSizing: 'border-box', minWidth: 0, paddingBottom: '6rem' }}>
        
        {/* HOME / AUTOBIOGRAPHY VIEW */}
        {activeCategory === 'home' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a, #1e1b4b)', border: '1px solid #334155', borderRadius: '24px', padding: '2.5rem 1.25rem', textAlign: 'center', marginBottom: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
              <span style={{ fontSize: '3.5rem' }}>🕊️</span>
              <h1 style={{ fontSize: '2.2rem', margin: '1rem 0 0.5rem 0', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>Luminous Ministries & Bookstore</h1>
              <p style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>Extraordinary Catholic Literature & Sacred Compositions by Mr. Ngotho</p>
            </div>

            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '1.75rem 1.25rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '1.25rem', borderBottom: '2px solid #2563eb', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>📖</span> Meet the Author & Composer: Mr. Ngotho
              </h2>
              
              <p style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.25rem' }}>
                Welcome to a sanctuary of faith, wisdom, and divine inspiration. I am <strong style={{ color: '#38bdf8' }}>Mr. Ngotho</strong>—a dedicated author, publisher, and sacred music composer called to touch souls and uplift spirits through extraordinary Catholic literature and heavenly melodies.
              </p>

              <div style={{ background: '#0f172a', borderLeft: '4px solid #38bdf8', padding: '1rem 1.25rem', borderRadius: '0 12px 12px 0', margin: '1.25rem 0' }}>
                <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: 0, fontSize: '1rem', lineHeight: '1.6' }}>
                  "To write a page that brings someone closer to truth, and to compose a melody that echoes in prayer—this is my life's highest calling and deepest joy." — Mr. Ngotho
                </p>
              </div>

              <p style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.25rem' }}>
                For years, my journey has been deeply rooted in the richness of the Catholic faith. Every book curated and published in this catalog is handpicked to provide profound spiritual nourishment, deep theological clarity, and life-changing moral grounding. Whether you are seeking spiritual growth, historical insights into the Church, or devotional guides, these extraordinary texts are designed to illuminate your path.
              </p>

              <p style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.75rem' }}>
                Beyond the printed page lies the power of sacred song. As a composer, I channel prayer into music. Each Catholic hymn and choral composition offered here is crafted to elevate congregational and personal prayer, creating an atmosphere of profound reverence and heavenly peace.
              </p>

              <h3 style={{ fontSize: '1.3rem', color: '#34d399', marginBottom: '0.75rem' }}>✨ Explore What Awaits You:</h3>
              <ul style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.7', paddingLeft: '1.2rem', marginBottom: '1.75rem' }}>
                <li><strong>Extraordinary Catholic Books:</strong> Deep doctrinal guides, inspiring biographies of saints, and powerful devotionals.</li>
                <li><strong>Sacred Catholic Songs:</strong> Original hymns, spiritual albums, and peaceful choral tracks to quiet the mind and open the heart to God.</li>
                <li><strong>Seamless M-Pesa Checkout:</strong> A swift, secure, and personal ordering experience managed directly with trusted mobile payments.</li>
              </ul>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <button 
                  onClick={() => setActiveCategory('books')} 
                  style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.85rem 1.5rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)' }}
                >
                  Browse Catholic Books 📚
                </button>
                <button 
                  onClick={() => setActiveCategory('music')} 
                  style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.85rem 1.5rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)' }}
                >
                  Listen to Sacred Songs 🎛️
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH BAR FOR STORE CATEGORIES */}
        {activeCategory !== 'home' && activeCategory !== 'cart' && (
          <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid #334155', borderRadius: '20px', padding: '2rem 1.25rem', marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', fontWeight: '800' }}>
              {activeCategory === 'books' ? '📚 Extraordinary Catholic Books' : '💿 Sacred Catholic Music Catalog'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
              {activeCategory === 'books' ? 'Handpicked spiritual literature by Mr. Ngotho.' : 'Soul-stirring hymns and spiritual compositions.'}
            </p>
            <input 
              type="text" 
              placeholder={activeCategory === 'books' ? "Search by book title..." : "Search sacred tracks..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: '550px', width: '100%', padding: '0.85rem 1.2rem', borderRadius: '12px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

        {/* Books View */}
        {activeCategory === 'books' && (
          <div>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '4rem' }}>Loading catalog...</p>
            ) : filteredBooks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', background: '#1e293b', borderRadius: '16px' }}>
                <p style={{ color: '#94a3b8' }}>No books found.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {filteredBooks.map((book) => (
                  <div key={book.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ height: '160px', background: 'linear-gradient(135deg, #334155, #0f172a)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', marginBottom: '1rem' }}>✝️</div>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#fff' }}>{book.title}</h3>
                      <p style={{ color: '#38bdf8', margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '600' }}>By {book.author || 'Mr. Ngotho'}</p>
                      <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>{book.description}</p>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#34d399' }}>KES {book.price}</span>
                      <button onClick={() => addToCart(book)} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.65rem 1.1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Music View */}
        {activeCategory === 'music' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {filteredMusic.map((track) => (
              <div key={track.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ height: '160px', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', marginBottom: '1rem' }}>🎵</div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#fff' }}>{track.title}</h3>
                  <p style={{ color: '#818cf8', margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '600' }}>Composer: {track.artist}</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>{track.description}</p>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#34d399' }}>KES {track.price}</span>
                  <button onClick={() => addToCart(track)} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.65rem 1.1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart View */}
        {activeCategory === 'cart' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.25rem' }}>🛒 Your Shopping Cart</h2>
            {cart.length === 0 ? (
              <div style={{ backgroundColor: '#1e293b', padding: '2.5rem', borderRadius: '16px', textAlign: 'center', border: '1px solid #334155' }}>
                <p style={{ color: '#94a3b8', fontSize: '1.05rem', margin: 0 }}>Your cart is empty.</p>
              </div>
            ) : (
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.25rem' }}>
                {cart.map((item) => (
                  <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #334155' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem' }}>{item.title}</h4>
                      <p style={{ margin: 0, color: '#38bdf8', fontSize: '0.8rem' }}>{item.author ? `Author: ${item.author}` : `Composer: ${item.artist}`}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#34d399', fontSize: '0.95rem' }}>KES {item.price}</span>
                      <button onClick={() => removeFromCart(item.cartId)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '1.1rem', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', marginTop: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: '#34d399' }}>KES {cartTotal}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Checkout Button */}
      {cart.length > 0 && (
        <button 
          onClick={() => setCheckoutOpen(true)}
          style={{
            position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#059669', color: '#ffffff',
            padding: '0.85rem 1.5rem', borderRadius: '50px', border: 'none', fontWeight: 'bold', fontSize: '1rem',
            cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.5)', zIndex: 900,
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <span>Checkout via M-Pesa (KES {cartTotal})</span> 💳
        </button>
      )}

      {/* M-Pesa Payment Checkout Modal */}
      {checkoutOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)', padding: '1rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '20px', padding: '1.75rem', width: '100%', maxWidth: '420px', boxSizing: 'border-box' }}>
            {!paymentSuccess ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>📲 M-Pesa Send Money Checkout</h3>
                  <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                </div>
                
                <div style={{ backgroundColor: '#0f172a', padding: '0.85rem', borderRadius: '10px', marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>Items in Cart: {cart.length}</p>
                  <p style={{ margin: 0, color: '#34d399', fontSize: '1.1rem', fontWeight: 'bold' }}>Total Due: KES {cartTotal}</p>
                </div>

                <div style={{ backgroundColor: '#1e293b', border: '1px dashed #38bdf8', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>Send Money To (Mr. Ngotho):</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#38bdf8' }}>📞 {mpesaReceiveNumber}</p>
                </div>

                <form onSubmit={handleMpesaCheckout}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>Your M-Pesa Phone Number (For Confirmation)</label>
                  <input 
                    type="tel" 
                    placeholder="0712345678" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', marginBottom: '1.25rem', boxSizing: 'border-box' }}
                  />
                  <button 
                    type="submit" 
                    disabled={paying}
                    style={{ width: '100%', padding: '0.85rem', backgroundColor: paying ? '#475569' : '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: paying ? 'not-allowed' : 'pointer' }}
                  >
                    {paying ? 'Processing Order...' : `Confirm KES ${cartTotal} Sent`}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ fontSize: '1.3rem', color: '#34d399', margin: '0 0 0.5rem 0' }}>Order Confirmed!</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.25rem' }}>Thank you! Your transaction has been recorded and submitted.</p>
                <button onClick={closeModal} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
