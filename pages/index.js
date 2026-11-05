import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getBooks } from '../lib/firebase';

export default function Storefront() {
  const [activeCategory, setActiveCategory] = useState('books');
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
    { id: 'm1', title: 'Single Release Vol. 1', artist: 'Max', price: '200', description: 'High quality audio download (MP3/WAV).' },
    { id: 'm2', title: 'Full Album Experience', artist: 'Max', price: '500', description: 'Complete digital album with exclusive bonus tracks.' },
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Segoe UI, sans-serif', margin: 0, padding: 0 }}>
      <Head>
        <title>Luminous - Storefront</title>
        <meta name="description" content="Discover books and music tracks powered by M-Pesa." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <aside style={{ width: '70px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' }}>
        <div style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>✨</div>

        <button 
          title="Books Store"
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
          title="Music Store"
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

      <main style={{ flex: 1, padding: '2rem 1.5rem', boxSizing: 'border-box', minWidth: 0, paddingBottom: '6rem' }}>
        {activeCategory !== 'cart' && (
          <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid #334155', borderRadius: '20px', padding: '2.5rem 1.5rem', marginBottom: '2.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0', fontWeight: '800' }}>
              {activeCategory === 'books' ? '📚 Discover & Buy Books' : '💿 Digital Music Catalog'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '1.5rem' }}>
              {activeCategory === 'books' ? 'Add books to your cart and checkout via M-Pesa.' : 'Buy and stream exclusive music directly.'}
            </p>
            <input 
              type="text" 
              placeholder={activeCategory === 'books' ? "Search by book title or author..." : "Search music tracks..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: '550px', width: '100%', padding: '0.85rem 1.2rem', borderRadius: '12px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

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
                      <div style={{ height: '160px', background: 'linear-gradient(135deg, #334155, #0f172a)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', marginBottom: '1rem' }}>📖</div>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#fff' }}>{book.title}</h3>
                      <p style={{ color: '#38bdf8', margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '600' }}>By {book.author}</p>
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

        {activeCategory === 'music' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {filteredMusic.map((track) => (
              <div key={track.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ height: '160px', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', marginBottom: '1rem' }}>🎛️</div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#fff' }}>{track.title}</h3>
                  <p style={{ color: '#818cf8', margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '600' }}>Artist: {track.artist}</p>
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

        {activeCategory === 'cart' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>🛒 Your Shopping Cart</h2>
            {cart.length === 0 ? (
              <div style={{ backgroundColor: '#1e293b', padding: '3rem', borderRadius: '16px', textAlign: 'center', border: '1px solid #334155' }}>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}>Your cart is empty.</p>
              </div>
            ) : (
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
                {cart.map((item) => (
                  <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #334155' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{item.title}</h4>
                      <p style={{ margin: 0, color: '#38bdf8', fontSize: '0.85rem' }}>{item.author ? `Author: ${item.author}` : `Artist: ${item.artist}`}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#34d399' }}>KES {item.price}</span>
                      <button onClick={() => removeFromCart(item.cartId)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', marginTop: '0.5rem', fontWeight: 'bold', fontSize: '1.3rem' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: '#34d399' }}>KES {cartTotal}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {cart.length > 0 && (
        <button 
          onClick={() => setCheckoutOpen(true)}
          style={{
            position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#059669', color: '#ffffff',
            padding: '1rem 1.75rem', borderRadius: '50px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem',
            cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.5)', zIndex: 900,
            display: 'flex', alignItems: 'center', gap: '10px'
          }}
        >
          <span>Checkout via M-Pesa (KES {cartTotal})</span> 💳
        </button>
      )}

      {checkoutOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)', padding: '1rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '440px', boxSizing: 'border-box' }}>
            {!paymentSuccess ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem' }}>📲 M-Pesa Send Money Checkout</h3>
                  <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                </div>
                
                <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>Items in Cart: {cart.length}</p>
                  <p style={{ margin: 0, color: '#34d399', fontSize: '1.2rem', fontWeight: 'bold' }}>Total Due: KES {cartTotal}</p>
                </div>

                <div style={{ backgroundColor: '#1e293b', border: '1px dashed #38bdf8', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>Send Money To:</p>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#38bdf8' }}>📞 {mpesaReceiveNumber}</p>
                </div>

                <form onSubmit={handleMpesaCheckout}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>Your M-Pesa Phone Number (For Confirmation)</label>
                  <input 
                    type="tel" 
                    placeholder="0712345678" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', marginBottom: '1.5rem', boxSizing: 'border-box' }}
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
                <h3 style={{ fontSize: '1.4rem', color: '#34d399', margin: '0 0 0.5rem 0' }}>Order Confirmed!</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Thank you! Your transaction has been recorded and submitted.</p>
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
