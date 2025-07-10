// src/Pages/ProductPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { FaTrash, FaTimes, FaCamera } from 'react-icons/fa';

// --- Reusable Components ---

const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    return (
        <div style={{
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: 'black', color: 'white', padding: '12px 25px', borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)', zIndex: 2000
        }}>
            {message}
        </div>
    );
};

const AddProductModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ name: '', price: '', description: '' });
    const [images, setImages] = useState([]); // Will hold the File objects
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            // Append new files to the existing array of files
            setImages(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const apiFormData = new FormData();
        apiFormData.append('name', formData.name);
        apiFormData.append('price', formData.price);
        apiFormData.append('description', formData.description);

        if (images.length === 0) {
            setError('Please upload at least one image.');
            setIsSubmitting(false);
            return;
        }

        images.forEach(imageFile => {
            apiFormData.append('images', imageFile);
        });

        try {
            const response = await fetch('https://kalpyotish.onrender.com/api/products/add-product', {
                method: 'POST',
                body: apiFormData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add product');
            }
            const newProduct = await response.json();
            onSuccess(newProduct.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '15px', boxSizing: 'border-box', fontSize: '16px' };
    
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: 'white', borderRadius: '8px', padding: '24px', width: '90%', maxWidth: '500px', position: 'relative' }}>
                <h2 style={{ marginTop: 0 }}>Add New Product</h2>
                {error && <p style={{ color: 'red', background: '#ffebee', padding: '10px', borderRadius: '4px' }}>Error: {error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange} style={inputStyle} required />
                    <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} style={inputStyle} required />
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} style={{ ...inputStyle, height: '100px', resize: 'vertical' }} required />
                    
                    <div>
                        <label htmlFor="image-upload" style={{
                            display: 'block', padding: '12px', border: '2px dashed #ccc', borderRadius: '6px', textAlign: 'center', cursor: 'pointer', marginBottom: '15px'
                        }}>
                            <FaCamera style={{ marginRight: '8px' }}/> Click to Upload Images
                        </label>
                        <input id="image-upload" type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </div>

                    {/* Image Previews */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                        {images.map((file, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                                <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                                <button type="button" onClick={() => handleRemoveImage(index)} style={{
                                    position: 'absolute', top: '-5px', right: '-5px', background: 'black', color: 'white',
                                    border: 'none', borderRadius: '50%', width: '20px', height: '20px',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'
                                }}>
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: 'black', color: 'white', cursor: 'pointer' }}>
                            {isSubmitting ? 'Adding...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Product Page Component ---

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://kalpyotish.onrender.com/api/products/all');
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();
                setProducts(result.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    
    const handleAddSuccess = (newProduct) => {
        setProducts(prev => [newProduct, ...prev]);
        setIsAddModalOpen(false);
        setToastMessage('Product added successfully!');
    };

    const handleDelete = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            // Optimistic deletion
            setProducts(prev => prev.filter(p => p._id !== productId));
            // API call would go here
            // fetch(`.../delete-product/${productId}`, { method: 'DELETE' });
            setToastMessage('Product deleted.');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>Loading Products...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: 'red' }}>Error: {error}</div>;

    return (
        <>
            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 style={{ fontFamily: 'Georgia, serif', margin: 0 }}>Products</h1>
                    <button onClick={() => setIsAddModalOpen(true)} style={{
                        backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '8px',
                        padding: '10px 20px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
                    }}>
                        + Add Product
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '20px'
                }}>
                    {products.map(product => (
                        <div key={product._id} style={{
                            border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column'
                        }}>
                            <img
                                src={product.images[0] || 'https://via.placeholder.com/300'}
                                alt={product.name}
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                            />
                            <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ margin: '0 0 5px 0' }}>{product.name}</h3>
                                <p style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px', flex: 1 }}>{product.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{product.price}</span>
                                    <button onClick={() => handleDelete(product._id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <FaTrash color="#c0392b" size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isAddModalOpen && <AddProductModal onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddSuccess} />}
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
        </>
    );
}

export default ProductPage;