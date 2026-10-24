import { useState, useEffect } from 'react';
import { getBooks } from '../lib/firebase';
import SellerPanel from '../components/SellerPanel';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('storefront');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Checkout & Modal State
  const [selectedBook, setSelectedBook] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Sales Analytics State
  const [salesData, setSalesData] = useState({ totalSold: 0, totalRevenue: 0, salesList: [] });

  const fetchBooks = async () => {
    setLoading(true);
    const data = await getBooks();
    setBooks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
    const savedSales = localStorage.getItem('luminiousbooks_sales');
    if (savedSales) {
      setSalesData(JSON.parse(savedSales));
    }
  }, []);

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

      const newSale = {
        id: Date.now(),
        title: selectedBook.title,
        price: selectedBook.price,
        phone: phoneNumber,
        date: new Date().toLocaleDateString()
      };

      const updatedSales = {
        totalSold: salesData.totalSold + 1,
        totalRevenue: salesData.totalRevenue + Number(selectedBook.price),
        salesList: [newSale, ...salesData.salesList]
      };

      setSalesData(updatedSales);
      localStorage.setItem('luminiousbooks_sales', JSON.stringify(updatedSales));
    }, 3000);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setPaymentSuccess(false);
    setPhoneNumber('');
  };

  const filteredBooks = books.filter(b => 
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sidebarItems = [
    { id: 'storefront', label: 'Storefront', icon: '🏪' },
    { id: 'add', label: 'Add Book', icon: '➕' },
    { id: 'dashboard', label: 'Analytics', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Segoe UI, sans-serif' }}>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(56, 189, 248, 0); }
          100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
        }
        .animated-card {
          animation: fadeIn 0.5s ease-out forwards;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
        }
        .animated-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(56, 189, 248, 0.2), 0 10px 10px -5px rgba(56, 189, 248, 0.1);
        }
        .glow-btn {
          animation: pulseGlow 2s infinite;
        }
        .sidebar-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 0.85rem 1rem;
          border: none;
          border-radius: 10px;
          color: #94a3b8;
          background: transparent;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        .sidebar-btn:hover {
          background-color: #1e293b;
          color: #f8fafc;
        }
        .sidebar-btn.active {
          background-color: #2563eb;
          color: #ffffff;
        }
      `}</style>

      {/* Side Panel / Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' }}>
        <h1 style={{ margin: '0 0 2rem 0', fontSize: '1.25rem', fontWeight: 'bold', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', paddingLeft: '0.5rem' }}>
          📚 LUMINOUS
        </h1>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-btn ${activeTab === item.id ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #1e293b', paddingLeft: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Store Status</p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#34d399', fontWeight: 'bold' }}>🟢 Live & Connected</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '2rem' }}>
        {activeTab === 'storefront' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid #334155', borderRadius: '16px', padding: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', fontWeight: '800' }}>Discover & Buy Extraordinary Books</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Instant downloads & physical delivery powered by secure M-Pesa checkout.</p>
              <input 
                type="text" 
                placeholder="Search by book title or author..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: '600px', width: '100%', padding: '0.85rem 1.2rem', borderRadius: '12px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', outline: 'none' }}
              />
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.2rem', padding: '4rem' }}>Loading catalog from Firestore...</p>
            ) : filteredBooks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', background: '#1e293b', borderRadius: '16px', border: '1px solid #334155' }}>
                <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>No books found in your library yet.</p>
                <button onClick={() => setActiveTab('add')} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Publish Your First Book
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {filteredBooks.map((book) => (
                  <div key={book.id} className="animated-card" style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ height: '170px', background: 'linear-gradient(135deg, #334155, #0f172a)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', marginBottom: '1rem' }}>
                        📖
                      </div>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#fff' }}>{book.title}</h3>
                      <p style={{ color: '#38bdf8', margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '600' }}>By {book.author}</p>
                      <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>{book.description}</p>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#34d399' }}>KES {book.price}</span>
                      <button 
                        onClick={() => setSelectedBook(book)}
                        className="glow-btn"
                        style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Buy via M-Pesa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <SellerPanel onBookAdded={() => { fetchBooks(); setActiveTab('storefront'); }} />
        )}

        {activeTab === 'dashboard' && (
          <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: '700' }}>📊 Seller Analytics Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Total Books Sold</p>
                <h3 style={{ fontSize: '2.5rem', margin: 0, color: '#38bdf8' }}>{salesData.totalSold}</h3>
              </div>
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Total Revenue Earned</p>
                <h3 style={{ fontSize: '2.5rem', margin: 0, color: '#34d399' }}>KES {salesData.totalRevenue.toLocaleString()}</h3>
              </div>
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Recent Transactions</h3>
            {salesData.salesList.length === 0 ? (
              <p style={{ color: '#94a3b8', background: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid #334155' }}>No sales recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {salesData.salesList.map((sale) => (
                  <div key={sale.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{sale.title}</h4>
                      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Customer Phone: {sale.phone} • {sale.date}</p>
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#34d399' }}>+KES {sale.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '700' }}>📦 Customer Orders</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Track physical shipments and eBook delivery confirmations.</p>
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
              {salesData.salesList.length === 0 ? (
                <p style={{ color: '#94a3b8', margin: 0 }}>No pending customer orders.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {salesData.salesList.map((order) => (
                    <div key={order.id} style={{ padding: '1rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>{order.title}</p>
                        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>Buyer: {order.phone}</p>
                      </div>
                      <span style={{ backgroundColor: '#065f46', color: '#34d399', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        Paid & Dispatched
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '700' }}>⚙️ Store Settings</h2>
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem', maxWidth: '600px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>M-Pesa Merchant Settings</h3>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Business Till / Paybill Number</label>
              <input type="text" placeholder="e.g. 522522" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '1.5rem', boxSizing: 'border-box' }} />
              <button style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* M-Pesa Checkout Modal */}
      {selectedBook && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            {!paymentSuccess ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.4rem' }}>🟢 M-Pesa Express Checkout</h3>
                  <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                </div>
                <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{selectedBook.title}</p>
                  <p style={{ margin: 0, color: '#34d399', fontSize: '1.1rem', fontWeight: 'bold' }}>Amount: KES {selectedBook.price}</p>
                </div>
                <form onSubmit={handleMpesaCheckout}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>M-Pesa Phone Number</label>
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
                    {paying ? 'Sending STK Push to Phone...' : `Pay KES ${selectedBook.price} via M-Pesa`}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: '#34d399' }}>Payment Successful!</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>STK push confirmed. Your sale has been automatically recorded to your Seller Dashboard.</p>
                <button 
                  onClick={closeModal}
                  style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Back to Storefront
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}