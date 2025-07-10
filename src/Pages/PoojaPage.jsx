// src/Pages/PoojaPage.jsx

import React, { useState, useEffect } from 'react';
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

const AddPoojaModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ name: '', categoryname: '', description: '' });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            setError('Please upload an image.');
            return;
        }
        setIsSubmitting(true);
        setError('');

        const apiFormData = new FormData();
        apiFormData.append('name', formData.name);
        apiFormData.append('categoryname', formData.categoryname);
        apiFormData.append('description', formData.description);
        apiFormData.append('image', image);

        try {
            const response = await fetch('https://kalpyotish.onrender.com/api/add-poojas', {
                method: 'POST',
                body: apiFormData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add pooja');
            }
            const newPooja = await response.json();
            onSuccess(newPooja.data);
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
                <h2 style={{ marginTop: 0 }}>Add New Pooja</h2>
                {error && <p style={{ color: 'red', background: '#ffebee', padding: '10px', borderRadius: '4px' }}>Error: {error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Pooja Name" value={formData.name} onChange={handleInputChange} style={inputStyle} required />
                    <input type="text" name="categoryname" placeholder="Category Name" value={formData.categoryname} onChange={handleInputChange} style={inputStyle} required />
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} style={{ ...inputStyle, height: '100px', resize: 'vertical' }} required />
                    
                    {imagePreview ? (
                        <div style={{ position: 'relative', marginBottom: '15px' }}>
                            <img src={imagePreview} alt="preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px' }} />
                            <button type="button" onClick={handleRemoveImage} style={{
                                position: 'absolute', top: '5px', right: '5px', background: 'black', color: 'white',
                                border: 'none', borderRadius: '50%', width: '24px', height: '24px',
                                display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'
                            }}>
                                <FaTimes size={14} />
                            </button>
                        </div>
                    ) : (
                        <label htmlFor="image-upload" style={{
                            display: 'block', padding: '12px', border: '2px dashed #ccc', borderRadius: '6px', textAlign: 'center', cursor: 'pointer', marginBottom: '15px'
                        }}>
                            <FaCamera style={{ marginRight: '8px' }}/> Click to Upload Image
                        </label>
                    )}
                    <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: 'black', color: 'white', cursor: 'pointer' }}>
                            {isSubmitting ? 'Adding...' : 'Add Pooja'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Pooja Page Component ---

function PoojaPage() {
    const [poojas, setPoojas] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const fetchPoojas = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://kalpyotish.onrender.com/api/all-poojas');
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            setPoojas(result.data || {});
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoojas();
    }, []);
    
    const handleAddSuccess = () => {
        setIsAddModalOpen(false);
        setToastMessage('Pooja added successfully!');
        fetchPoojas(); // Re-fetch all poojas to get the latest list
    };

    const handleDelete = async (poojaId) => {
        if (window.confirm('Are you sure you want to delete this pooja?')) {
            try {
                const response = await fetch(`https://kalpyotish.onrender.com/api/delete-pooja/${poojaId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete pooja');
                }
                setToastMessage('Pooja deleted successfully!');
                fetchPoojas(); // Re-fetch all poojas to update the list
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>Loading Poojas...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: 'red' }}>Error: {error}</div>;

    return (
        <>
            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 style={{ fontFamily: 'Georgia, serif', margin: 0 }}>Online Poojas</h1>
                    <button onClick={() => setIsAddModalOpen(true)} style={{
                        backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '8px',
                        padding: '10px 20px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
                    }}>
                        + Add Pooja
                    </button>
                </div>

                {Object.keys(poojas).length > 0 ? Object.entries(poojas).map(([category, poojaList]) => (
                    <div key={category} style={{ marginBottom: '40px' }}>
                        <h2 style={{ borderBottom: '2px solid #ffc107', paddingBottom: '10px', marginBottom: '20px' }}>
                            {category}
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '20px'
                        }}>
                            {poojaList.map(pooja => (
                                <div key={pooja._id} style={{
                                    border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column'
                                }}>
                                    <img
                                        src={pooja.image || 'https://via.placeholder.com/300'}
                                        alt={pooja.name}
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                    <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ margin: '0 0 5px 0' }}>{pooja.name}</h3>
                                        <p style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px', whiteSpace: 'pre-wrap', flex: 1 }}>
                                            {pooja.description}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 'auto' }}>
                                            <button onClick={() => handleDelete(pooja._id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <FaTrash color="#c0392b" size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )) : <p>No poojas found.</p>}
            </div>

            {isAddModalOpen && <AddPoojaModal onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddSuccess} />}
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
        </>
    );
}

export default PoojaPage;