import React, { useState, useEffect } from 'react';

// A simple, self-contained Toast component
const Toast = ({ message, type, onClose }) => {
    const baseStyle = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        color: 'white',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 1000,
        transition: 'transform 0.3s ease-in-out',
        transform: 'translateX(0)',
    };

    const typeStyle = {
        success: { backgroundColor: '#28a745' },
        error: { backgroundColor: '#dc3545' },
    };

    // Auto-close the toast
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Toast disappears after 3 seconds

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    return (
        <div style={{ ...baseStyle, ...typeStyle[type] }}>
            {message}
        </div>
    );
};


const BannerPage = () => {
    // State for existing banners fetched from the API
    const [banners, setBanners] = useState([]);
    // State for files selected by the user for upload
    const [selectedFiles, setSelectedFiles] = useState([]);
    // State for image previews (using object URLs)
    const [previewImages, setPreviewImages] = useState([]);

    // Loading states
    const [isLoading, setIsLoading] = useState(true); // For fetching banners
    const [isUploading, setIsUploading] = useState(false); // For adding banners
    const [deletingId, setDeletingId] = useState(null); // Tracks which banner is being deleted

    // Error state
    const [error, setError] = useState(null);

    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    const API_BASE_URL = 'https://kalpyotish.onrender.com/api/banners';

    // --- Utility Functions ---
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    // --- API Functions ---
    const fetchBanners = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/get-banner`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            if (result.success) {
                setBanners(result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch banners.');
            }
        } catch (err) {
            setError(err.message);
            showToast(err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDeleteBanner = async (bannerId) => {
        if (!window.confirm('Are you sure you want to delete this banner?')) {
            return;
        }

        setDeletingId(bannerId); // Set loading state for this specific banner
        try {
            const response = await fetch(`${API_BASE_URL}/banners/${bannerId}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (!response.ok) {
                 throw new Error(result.message || `Failed to delete. Status: ${response.status}`);
            }

            if (result.success) {
                showToast('Banner deleted successfully!', 'success');
                // Update state to remove the banner from the UI
                setBanners(prevBanners => prevBanners.filter(b => b._id !== bannerId));
            } else {
                throw new Error(result.message || 'An unknown error occurred during deletion.');
            }
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setDeletingId(null); // Reset loading state
        }
    };

    // --- Component Lifecycle ---
    useEffect(() => {
        fetchBanners();
    }, []);
    
    useEffect(() => {
        const newPreviewImages = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(newPreviewImages);
        return () => newPreviewImages.forEach(url => URL.revokeObjectURL(url));
    }, [selectedFiles]);


    // --- Event Handlers ---
    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
        event.target.value = null; 
    };

    const handleRemovePreviewImage = (indexToRemove) => {
        setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleUploadBanners = async () => {
        if (selectedFiles.length === 0) return;
        setIsUploading(true);
        setError(null);
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('images', file));

        try {
            const response = await fetch(`${API_BASE_URL}/add-banner`, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || `Upload failed with status: ${response.status}`);
            
            if (result.success) {
                showToast('Banners uploaded successfully!', 'success');
                setSelectedFiles([]);
                fetchBanners();
            } else {
                throw new Error(result.message || 'An unknown error occurred during upload.');
            }
        } catch (err) {
            setError(err.message);
            showToast(`Upload Error: ${err.message}`, 'error');
        } finally {
            setIsUploading(false);
        }
    };
    
    // --- Styles ---
    const styles = {
        container: { fontFamily: 'Arial, sans-serif', margin: '2rem auto', padding: '2rem', maxWidth: '900px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)' },
        header: { color: '#333', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' },
        section: { marginBottom: '2rem' },
        controlsContainer: { display: 'flex', alignItems: 'center' },
        button: { backgroundColor: '#ffc107', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background-color 0.3s ease', marginLeft: '10px' },
        buttonDisabled: { backgroundColor: '#ccc', cursor: 'not-allowed' },
        fileInputLabel: { display: 'inline-block', padding: '12px 20px', backgroundColor: '#ffc107', color: 'white', borderRadius: '5px', cursor: 'pointer' },
        hiddenInput: { display: 'none' },
        previewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '1.5rem', position: 'relative' },
        previewImageWrapper: { position: 'relative', border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
        previewImage: { width: '100%', height: '150px', objectFit: 'cover', display: 'block' },
        removeButton: { position: 'absolute', top: '5px', right: '5px', background: 'rgba(0, 0, 0, 0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', lineHeight: '1' },
        loaderOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', color: '#333', fontWeight: 'bold', borderRadius: '5px', zIndex: 10 },
        bannerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
        bannerImageWrapper: { position: 'relative', borderRadius: '5px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', },
        bannerImage: { width: '100%', display: 'block' },
        deleteButton: { position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(220, 53, 69, 0.8)', color: 'white', border: 'none', borderRadius: '5px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s', },
        deleteButtonHover: { backgroundColor: 'rgba(220, 53, 69, 1)' },
        statusText: { textAlign: 'center', padding: '2rem', color: '#666', fontSize: '1.1rem' },
        errorText: { color: 'red', marginTop: '1rem' },
    };

    return (
        <div style={styles.container}>
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            
            <h1 style={styles.header}>Banner Management</h1>

            <div style={styles.section}>
                <h2>Add New Banners</h2>
                <div style={styles.controlsContainer}>
                    <label htmlFor="file-upload" style={styles.fileInputLabel}>Choose Images</label>
                    <input id="file-upload" type="file" multiple accept="image/*" onChange={handleFileChange} style={styles.hiddenInput} disabled={isUploading} />
                    <button onClick={handleUploadBanners} style={{ ...styles.button, ...(isUploading || selectedFiles.length === 0 ? styles.buttonDisabled : {}) }} disabled={isUploading || selectedFiles.length === 0}>
                        {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} Image(s)`}
                    </button>
                </div>
                
                {previewImages.length > 0 && (
                    <div style={styles.previewGrid}>
                        {isUploading && <div style={styles.loaderOverlay}>Uploading...</div>}
                        {previewImages.map((imageSrc, index) => (
                            <div key={index} style={styles.previewImageWrapper}>
                                <img src={imageSrc} alt="Preview" style={styles.previewImage} />
                                <button onClick={() => handleRemovePreviewImage(index)} style={styles.removeButton} title="Remove Image">×</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <hr />

            <div style={styles.section}>
                <h2>Current Banners</h2>
                {isLoading ? (<p style={styles.statusText}>Loading banners...</p>) 
                : error && !banners.length ? (<p style={{...styles.statusText, ...styles.errorText}}>Error: {error}</p>) 
                : banners.length > 0 ? (
                    <div style={styles.bannerGrid}>
                        {banners.map((banner) => (
                            <div key={banner._id} style={styles.bannerImageWrapper}>
                                <img src={banner.url} alt="Banner" style={styles.bannerImage} />
                                <button onClick={() => handleDeleteBanner(banner._id)} style={styles.deleteButton} title="Delete Banner" disabled={deletingId === banner._id}>
                                    {deletingId === banner._id ? '...' : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'white' }}>
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (<p style={styles.statusText}>No banners found.</p>)}
            </div>
        </div>
    );
};

export default BannerPage;