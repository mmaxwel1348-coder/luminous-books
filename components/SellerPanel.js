import { useState } from 'react';
import { addBookToDatabase } from '../lib/firebase';

export default function SellerPanel({ onBookAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.price) {
      alert('Please fill in the title, author, and price.');
      return;
    }
    setSubmitting(true);
    const result = await addBookToDatabase({
      ...formData,
      price: Number(formData.price),
      createdAt: new Date()
    });
    setSubmitting(false);

    if (result.success) {
      alert('Book saved successfully to your database!');
      setFormData({ title: '', author: '', price: '', description: '' });
      if (onBookAdded) onBookAdded();
    } else {
      alert('Failed to save book. Please try again.');
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '2rem', maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginTop: 0, color: '#0f172a' }}>Add a New Book</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Fill out the details below to publish a book to your store.</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Book Title</label>
          <input 
            type="text" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            placeholder="e.g. The Alchemist" 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Author</label>
          <input 
            type="text" 
            value={formData.author} 
            onChange={(e) => setFormData({...formData, author: e.target.value})} 
            placeholder="e.g. Paulo Coelho" 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Price (KES)</label>
          <input 
            type="number" 
            value={formData.price} 
            onChange={(e) => setFormData({...formData, price: e.target.value})} 
            placeholder="e.g. 1500" 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Description</label>
          <textarea 
            rows="4" 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            placeholder="Brief summary or details about the book..." 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          style={{ width: '100%', padding: '0.85rem', backgroundColor: submitting ? '#94a3b8' : '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer' }}
        >
          {submitting ? 'Saving to Database...' : 'Save Book to Database'}
        </button>
      </form>
    </div>
  );
}