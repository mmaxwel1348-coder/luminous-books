import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getBooks } from '../lib/firebase';

export default function Storefront() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Checkout Modal State
  const [selectedBook, setSelectedBook] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [mpesaReceiveNumber, setMpesaReceiveNumber] = useState('0712345678');

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

  const handleMpesaCheckout = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) {
      alert('Please enter a valid M-Pesa phone number.');
      return;
    }
    setPaying(true);
    
    setTimeout(() => {
      setPaying(false);
      setPaymentSuccess(true);

      const savedSales = localStorage.getItem('luminiousbooks_sales');
      const salesData = savedSales ? JSON.parse(savedSales) : { totalSold: 0, totalRevenue: 0, salesList: [] };

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'Segoe UI, sans-serif', margin: 0, padding: 0 }}>
      <Head>
        <title>Luminous Books - Discover & Buy Books Online</title>
        <meta name="description" content="Instant downloads & physical delivery powered by secure M-Pesa checkout." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <style jsx global>{`
        html, body { margin: 0; padding: 0; background-color: #090d16; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animated-card {
          animation: fadeIn 0.5s ease-out forwards;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .animated-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 25px -5px rgba(56, 189, 248, 0.2);
        }
      `}</style>

      {/* Header Navigation for Customers */}
      <header style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          📚 LUMINOUS BOOKS
        </h1>
        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Kenya's Online Bookstore</span>
      </header>

      {/* Hero Section & Search */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid #334155', borderRadius: '20px', padding: '3rem 1.5rem', marginBottom: '2.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', fontWeight: '800' }}>Discover Extraordinary Books</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Instant delivery powered by secure M-Pesa Send Money checkout.</p>
          <input 
            type="text" 
            placeholder="Search by book title or author..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '550px', width: '100%', padding: '0.85rem 1.2rem', borderRadius: '12px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Catalog */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '4rem' }}>Loading catalog...</p>
        ) : filteredBooks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#1e293b', borderRadius: '16px' }}>
            <p style={{ color: '#94a3b8' }}>No books found.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {filteredBooks.map((book) => (
              <div key={book.id} className="animated-card" style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ height: '180px', background: 'linear-gradient(135deg, #334155, #0f172a)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', marginBottom: '1rem' }}>
                    📖
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#fff' }}>{book.title}</h3>
                  <p style={{ color: '#38bdf8', margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '600' }}>By {book.author}</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>{book.description}</p>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#34d399' }}>KES {book.price}</span>
                  <button 
                    onClick={() => setSelectedBook(book)}
                    style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.65rem 1.2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Buy via M-Pesa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* M-Pesa Checkout Modal */}
      {selectedBook && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)', padding: '1rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '420px' }}>
            {!paymentSuccess ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem' }}>📲 M-Pesa Payment</h3>
                  <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                </div>
                
                <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{selectedBook.title}</p>
                  <p style={{ margin: 0, color: '#34d399', fontSize: '1.1rem', fontWeight: 'bold' }}>Amount: KES {selectedBook.price}</p>
                </div>

                <div style={{ backgroundColor: '#1e293b', border: '1px dashed #38bdf8', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>Send Money To:</p>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#38bdf8' }}>📞 {mpesaReceiveNumber}</p>
                </div>

                <form onSubmit={handleMpesaCheckout}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>Your Phone Number (For Confirmation)</label>
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
                    {paying ? 'Processing Order...' : `Confirm KES ${selectedBook.price} Sent`}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ fontSize: '1.4rem', color: '#34d399', margin: '0 0 0.5rem 0' }}>Order Received!</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Thank you! Your payment confirmation has been recorded.</p>
                <button onClick={closeModal} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Back to Store
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
