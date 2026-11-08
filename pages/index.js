import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Storefront() {
  const [activeCategory, setActiveCategory] = useState('home');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [mpesaReceiveNumber, setMpesaReceiveNumber] = useState('0712345678');

  // Reader Modal State (Books)
  const [selectedBook, setSelectedBook] = useState(null);
  const [isFullBookUnlocked, setIsFullBookUnlocked] = useState(false);

  // Music Player Modal State
  const [selectedSong, setSelectedSong] = useState(null);
  const [isFullSongUnlocked, setIsFullSongUnlocked] = useState(false);

  const defaultBooks = [
    {
      id: 'b1',
      title: 'A HERITAGE OF GOLD',
      author: 'Dr. Peter Ngotho Njoroge',
      price: '600',
      summary: 'Are our youth lost, or are they a treasure waiting to be discovered? In a world wounded by moral confusion, broken families, and a widening generational gap, mentorship is no longer a luxury—it is a lifeline. In A Heritage of Gold, Dr. Peter Ngotho Njoroge invites parents, teachers, and guardians on an eye-opening journey into the sacred responsibility of guiding the next generation. Beneath the surface of every young person lies untapped potential and divine brilliance. This book explores the heart of mentorship, tackles the silent crisis facing the boy child, masterfully guides communication and counseling, and provides crucial safeguards for building a safe, life-giving legacy. Read the preview and unlock full chapter access today!',
      fullText: '[CHAPTER 1: UNDERSTANDING MENTORSHIP]\n\nMentorship is a relationship in which a more experienced or knowledgeable individual guides and supports the personal or professional growth of another...\n\n[CHAPTER 2: THE SACRIFICE OF MENTORSHIP]\n\nTo sacrifice means giving up something valuable for the benefit of someone else. In mentorship, this might include our time, comfort, personal space, or material resources...\n\n[CHAPTER 3: THE BOY CHILD DEBATE]\n\nIn recent years, a growing debate has emerged around the plight of the boy child, sparked by grave concern over the state of modern boys...'
    }
  ];

  const defaultSongs = [
    { 
      id: 'm1', 
      title: 'Sacred Hymns Vol. 1', 
      artist: 'Dr. Peter Ngotho Njoroge', 
      price: '200', 
      description: 'Inspiring Catholic choral and devotional audio collection (MP3/WAV).',
      previewAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      fullAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    { 
      id: 'm2', 
      title: 'Divine Grace - Full Album', 
      artist: 'Dr. Peter Ngotho Njoroge', 
      price: '500', 
      description: 'Complete uplifting Catholic musical experience with soul-stirring melodies.',
      previewAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      fullAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
  ];

  useEffect(() => {
    try {
      const localBooks = JSON.parse(localStorage.getItem('luminiousbooks_local_catalog') || '[]');
      const combinedBooks = localBooks.length > 0 ? [...localBooks, ...defaultBooks] : defaultBooks;
      setBooks(combinedBooks);

      const savedPhone = localStorage.getItem('luminiousbooks_mpesa_phone');
      if (savedPhone) {
        setMpesaReceiveNumber(savedPhone);
      }
    } catch (e) {
      setBooks(defaultBooks);
    }
    setLoading(false);
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
      setIsFullBookUnlocked(true);
      setIsFullSongUnlocked(true);

      try {
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
      } catch (err) {
        console.error(err);
      }

      setCart([]);
    }, 2000);
  };

  const closeModal = () => {
    setCheckoutOpen(false);
    setPaymentSuccess(false);
    setPhoneNumber('');
  };

  let localSongs = [];
  try {
    localSongs = JSON.parse(localStorage.getItem('luminiousmusic_local_catalog') || '[]');
  } catch (e) {
    localSongs = [];
  }
  const allSongs = localSongs.length > 0 ? [...localSongs, ...defaultSongs] : defaultSongs;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Segoe UI, sans-serif', margin: 0, padding: 0, overflowX: 'hidden', boxSizing: 'border-box' }}>
      <Head>
        <title>Luminous - Dr. Peter Ngotho Njoroge's Bookstore & Sacred Music</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background-color: #090d16 !important;
          color: #f8fafc;
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }
        .desktop-sidebar { display: flex; }
        .mobile-header { display: none; }
        .main-content { margin-left: 70px; padding: 2rem 1.5rem; }

        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .main-content { margin-left: 0 !important; padding: 1.5rem 1rem !important; }
        }
      `}</style>

      {/* Mobile Top Header */}
      <header className="mobile-header" style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0.75rem 1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.1rem', color: '#38bdf8' }}>
          <span>✝️</span> Dr. Ngotho
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setActiveCategory('home')} style={{ padding: '0.5rem 0.65rem', borderRadius: '8px', border: 'none', backgroundColor: activeCategory === 'home' ? '#2563eb' : '#1e293b', color: '#fff', cursor: 'pointer' }}>🏠</button>
          <button onClick={() => setActiveCategory('books')} style={{ padding: '0.5rem 0.65rem', borderRadius: '8px', border: 'none', backgroundColor: activeCategory === 'books' ? '#2563eb' : '#1e293b', color: '#fff', cursor: 'pointer' }}>📖</button>
          <button onClick={() => setActiveCategory('music')} style={{ padding: '0.5rem 0.65rem', borderRadius: '8px', border: 'none', backgroundColor: activeCategory === 'music' ? '#2563eb' : '#1e293b', color: '#fff', cursor: 'pointer' }}>🎛️</button>
          <button onClick={() => setActiveCategory('cart')} style={{ padding: '0.5rem 0.65rem', borderRadius: '8px', border: 'none', backgroundColor: activeCategory === 'cart' ? '#2563eb' : '#1e293b', color: '#fff', cursor: 'pointer', position: 'relative' }}>
            🛒
            {cart.length > 0 && <span style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', padding: '1px 5px', fontSize: '0.65rem', fontWeight: 'bold' }}>{cart.length}</span>}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar" style={{ width: '70px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '1.5rem 0', flexDirection: 'column', alignItems: 'center', gap: '1rem', flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, height: '100vh', zIndex: 100 }}>
        <div style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>✝️</div>
        <button title="Home & About Author" onClick={() => setActiveCategory('home')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'home' ? '#2563eb' : 'transparent', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>🏠</button>
        <button title="Catholic Books Store" onClick={() => setActiveCategory('books')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'books' ? '#2563eb' : 'transparent', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>📖</button>
        <button title="Sacred Catholic Music" onClick={() => setActiveCategory('music')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'music' ? '#2563eb' : 'transparent', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>🎛️</button>
        <button title="Shopping Cart" onClick={() => setActiveCategory('cart')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', border: 'none', backgroundColor: activeCategory === 'cart' ? '#2563eb' : 'transparent', color: '#fff', fontSize: '1.4rem', cursor: 'pointer', position: 'relative' }}>
          🛒
          {cart.length > 0 && <span style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem', fontWeight: 'bold' }}>{cart.length}</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, paddingBottom: '6rem' }}>
        
        {/* HOME VIEW */}
        {activeCategory === 'home' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a, #1e1b4b)', border: '1px solid #334155', borderRadius: '24px', padding: '3.5rem 2rem', textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '4rem' }}>🕊️</span>
              <h1 style={{ fontSize: '2.8rem', margin: '1rem 0 0.5rem 0', fontWeight: '800', color: '#fff' }}>Luminous Ministries & Bookstore</h1>
              <p style={{ color: '#38bdf8', fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>Extraordinary Catholic Literature & Sacred Compositions by Dr. Peter Ngotho Njoroge</p>
            </div>

            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '2.5rem', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1.5rem', borderBottom: '2px solid #2563eb', paddingBottom: '0.75rem' }}>📖 Meet the Author & Composer: Dr. Peter Ngotho Njoroge</h2>
              
              <p style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '1.25rem' }}>
                Welcome to a sanctuary of faith, wisdom, and divine inspiration. I am <strong style={{ color: '#38bdf8' }}>Dr. Peter Ngotho Njoroge</strong>—an author, publisher, and sacred music composer called to touch souls and uplift spirits through extraordinary Catholic literature and heavenly melodies.
              </p>

              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.25rem' }}>
                Born with a deep passion for spiritual growth and community mentorship, my journey has been dedicated to guiding the next generation and nurturing moral resilience. In an era marked by shifting cultural values and generational gaps, my literary works—such as <em style={{ color: '#38bdf8' }}>A Heritage of Gold</em>—serve as practical lifelines for parents, educators, and mentors seeking to build strong, faith-centered legacies.
              </p>

              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                Beyond writing, my heart resonates deeply with sacred choral composition. Through uplifting hymns and spiritual audio collections, I strive to create devotional spaces where every believer can draw closer to God through song. Thank you for walking this journey of faith with me.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                <button onClick={() => setActiveCategory('books')} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.9rem 1.75rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.05rem' }}>Browse Catholic Books 📚</button>
                <button onClick={() => setActiveCategory('music')} style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.9rem 1.75rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.05rem' }}>Listen to Sacred Songs 🎛️</button>
              </div>
            </div>
          </div>
        )}

        {/* BOOKS VIEW */}
        {activeCategory === 'books' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid #334155', borderRadius: '20px', padding: '2rem 1.25rem', marginBottom: '2rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', fontWeight: '800' }}>📚 Extraordinary Catholic Books</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: 0 }}>Read summaries and buy full spiritual literature by Dr. Peter Ngotho Njoroge.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {books.map((book) => (
                <div key={book.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ height: '140px', background: 'linear-gradient(135deg, #334155, #0f172a)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', marginBottom: '1rem' }}>✝️</div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#fff' }}>{book.title}</h3>
                    <p style={{ color: '#38bdf8', margin: '0 0 0.75rem 0', fontSize: '0.9rem', fontWeight: '600' }}>By {book.author || 'Dr. Peter Ngotho Njoroge'}</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{book.summary}</p>
                  </div>

                  <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#34d399' }}>KES {book.price}</span>
                      <button 
                        onClick={() => setSelectedBook(book)}
                        style={{ backgroundColor: '#334155', color: '#fff', padding: '0.5rem 0.85rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                      >
                        📖 Read Summary
                      </button>
                    </div>
                    <button 
                      onClick={() => addToCart(book)} 
                      style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.65rem 1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
                    >
                      + Add to Cart (KES {book.price})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MUSIC VIEW */}
        {activeCategory === 'music' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid #334155', borderRadius: '20px', padding: '2rem 1.25rem', marginBottom: '2rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', fontWeight: '800' }}>💿 Sacred Catholic Music Catalog</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: 0 }}>Soul-stirring hymns and spiritual audio tracks by Dr. Peter Ngotho Njoroge.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {allSongs.map((track) => (
                <div key={track.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ height: '140px', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', marginBottom: '1rem' }}>🎵</div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#fff' }}>{track.title}</h3>
                    <p style={{ color: '#818cf8', margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '600' }}>Composer: {track.artist || 'Dr. Peter Ngotho Njoroge'}</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>{track.description}</p>
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#34d399' }}>KES {track.price}</span>
                      <button 
                        onClick={() => setSelectedSong(track)}
                        style={{ backgroundColor: '#334155', color: '#fff', padding: '0.5rem 0.85rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                      >
                        🎧 Preview Audio
                      </button>
                    </div>
                    <button 
                      onClick={() => addToCart(track)} 
                      style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.65rem 1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
                    >
                      + Add to Cart (KES {track.price})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CART VIEW */}
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

      {/* BOOK READER MODAL */}
      {selectedBook && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(5px)', padding: '1rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '650px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                  {isFullBookUnlocked ? '🔓 Full Book Access Unlocked' : '📖 Free Summary & Preview'}
                </span>
                <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.3rem', color: '#fff' }}>{selectedBook.title}</h3>
              </div>
              <button onClick={() => setSelectedBook(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.6rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem', marginBottom: '1.25rem' }}>
              {!isFullBookUnlocked ? (
                <div>
                  <div style={{ backgroundColor: '#0f172a', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155', marginBottom: '1.25rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#38bdf8', fontSize: '1rem' }}>Book Summary</h4>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: 0, fontSize: '1rem' }}>{selectedBook.summary}</p>
                  </div>
                  
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', borderRadius: '12px', border: '1px dashed #38bdf8' }}>
                    <p style={{ color: '#cbd5e1', margin: '0 0 1rem 0', fontSize: '0.95rem' }}>Want to read the full book? Purchase this title to unlock complete chapter access instantly.</p>
                    <button 
                      onClick={() => {
                        setSelectedBook(null);
                        addToCart(selectedBook);
                        setCheckoutOpen(true);
                      }}
                      style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      Buy Full Book for KES {selectedBook.price} 💳
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #34d399' }}>
                  <p style={{ color: '#34d399', fontWeight: 'bold', margin: '0 0 1rem 0' }}>✅ Thank you for your purchase! Enjoy reading:</p>
                  <pre style={{ whiteSpace: 'pre-wrap', color: '#e2e8f0', fontFamily: 'Segoe UI, sans-serif', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
                    {selectedBook.fullText}
                  </pre>
                </div>
              )}
            </div>

            <button onClick={() => setSelectedBook(null)} style={{ padding: '0.75rem', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Close Reader
            </button>
          </div>
        </div>
      )}

      {/* MUSIC PLAYER / PREVIEW MODAL */}
      {selectedSong && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(5px)', padding: '1rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                  {isFullSongUnlocked ? '🔓 Full Audio Unlocked' : '🎧 Audio Preview'}
                </span>
                <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.3rem', color: '#fff' }}>{selectedSong.title}</h3>
              </div>
              <button onClick={() => setSelectedSong(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.6rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '1rem' }}>{selectedSong.description}</p>
              
              {!isFullSongUnlocked ? (
                <div>
                  <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '12px', border: '1px solid #334155', marginBottom: '1rem', textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Sample Preview (30s):</p>
                    <audio controls style={{ width: '100%' }}>
                      <source src={selectedSong.previewAudio || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>

                  <div style={{ textAlign: 'center', padding: '1.25rem', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', borderRadius: '12px', border: '1px dashed #38bdf8' }}>
                    <p style={{ color: '#cbd5e1', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>Want full streaming & downloadable MP3/WAV access?</p>
                    <button 
                      onClick={() => {
                        setSelectedSong(null);
                        addToCart(selectedSong);
                        setCheckoutOpen(true);
                      }}
                      style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                      Buy Full Track for KES {selectedSong.price} 💳
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #34d399', textAlign: 'center' }}>
                  <p style={{ color: '#34d399', fontWeight: 'bold', margin: '0 0 1rem 0' }}>✅ Purchase Confirmed! Stream or Download Below:</p>
                  <audio controls style={{ width: '100%', marginBottom: '1rem' }}>
                    <source src={selectedSong.fullAudio || selectedSong.previewAudio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>

            <button onClick={() => setSelectedSong(null)} style={{ padding: '0.75rem', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Close Player
            </button>
          </div>
        </div>
      )}

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

      {/* M-Pesa Checkout Modal */}
      {checkoutOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, backdropFilter: 'blur(5px)', padding: '1rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '20px', padding: '1.75rem', width: '100%', maxWidth: '420px' }}>
            {!paymentSuccess ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>📲 M-Pesa Send Money Checkout</h3>
                  <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                </div>
                
                <div style={{ backgroundColor: '#0f172a', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.0rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>Items in Cart: {cart.length}</p>
                  <p style={{ margin: 0, color: '#34d399', fontSize: '1.1rem', fontWeight: 'bold' }}>Total Due: KES {cartTotal}</p>
                </div>

                <div style={{ backgroundColor: '#1e293b', border: '1px dashed #38bdf8', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>Send Money To (Dr. Peter Ngotho Njoroge):</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#38bdf8' }}>📞 {mpesaReceiveNumber}</p>
                </div>

                <form onSubmit={handleMpesaCheckout}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>Your M-Pesa Phone Number (For Confirmation)</label>
                  <input 
                    type="tel" 
                    placeholder="0712345678" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', marginBottom: '1.25rem' }}
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
                <p style={{ color: '#94a3b8', marginBottom: '1.25rem' }}>Thank you! Your full book and audio access has been unlocked.</p>
                <button onClick={closeModal} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Start Listening / Reading
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
