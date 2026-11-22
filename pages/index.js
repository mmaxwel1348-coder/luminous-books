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
      description: 'Inspiring choral and devotional audio collection (MP3/WAV).',
      previewAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      fullAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    { 
      id: 'm2', 
      title: 'Divine Grace - Full Album', 
      artist: 'Dr. Peter Ngotho Njoroge', 
      price: '500', 
      description: 'Complete uplifting musical experience with soul-stirring melodies.',
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
        <title>Luminous - Dr. Peter Ngotho Njoroge's Bookstore & Music</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; }
        html,
