import React, { useState, useEffect, useMemo } from 'react';
import { FaTrash, FaTimes } from 'react-icons/fa';

// --- Reusable Components ---

// (StatusToggle and DetailsModal remain the same, but are included here for completeness)
const StatusToggle = ({ initialStatus, onToggle }) => {
    const [isActive, setIsActive] = useState(initialStatus);
    const handleToggle = () => {
      const newStatus = !isActive;
      setIsActive(newStatus);
      onToggle(newStatus);
    };
    return (
      <div onClick={handleToggle} style={{
        width: '44px', height: '24px', backgroundColor: 'black', borderRadius: '12px', padding: '2px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: isActive ? 'flex-end' : 'flex-start',
        transition: 'justify-content 0.2s ease-in-out'
      }}>
        <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
      </div>
    );
};
// --- THIS IS THE CORRECT, FULLY-FEATURED DetailsModal ---
const DetailsModal = ({ astrologer, onClose }) => {
    const [expandedKeys, setExpandedKeys] = useState({});
  
    if (!astrologer) return null;
  
    const toggleExpand = (key) => {
      setExpandedKeys(prev => ({ ...prev, [key]: !prev[key] }));
    };
  
    const renderValue = (key, value) => {
      const isExpanded = !!expandedKeys[key];
  
      // Handle nested objects (like availability, social_media_links)
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return (
          <div>
            <button onClick={() => toggleExpand(key)} style={{
              background: '#333', color: 'white', border: 'none',
              borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
            }}>
              {isExpanded ? 'Hide' : 'View'}
            </button>
            {isExpanded && (
              <div style={{ marginTop: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                {Object.entries(value).map(([subKey, subValue]) => (
                  <div key={subKey} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '4px 0', borderBottom: '1px solid #eee' }}>
                    <strong>{subKey}</strong>
                    <span>{String(subValue)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
      
      // Handle arrays (like skills, language)
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : 'N/A';
      }
  
      // Handle image URLs
      if (typeof value === 'string' && (value.endsWith('.jpg') || value.endsWith('.png') || value.endsWith('.jpeg'))) {
          return <a href={value} target="_blank" rel="noopener noreferrer"><img src={value} alt="preview" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: '4px' }}/></a>
      }
  
      // Handle null, undefined or empty strings
      if (value === null || value === undefined || value === '') {
        return <span style={{ color: '#888' }}>N/A</span>;
      }
  
      // Handle regular string/number values
      return String(value);
    };
  
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1000,
        display: 'flex', justifyContent: 'center', alignItems: 'center'
      }}>
        <div style={{
          background: 'white', borderRadius: '8px', padding: '24px',
          width: '90%', maxWidth: '700px', maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          fontFamily: 'Georgia, serif',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '12px', marginBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '24px' }}>
              {astrologer.name}'s Details
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', lineHeight: 1 }}>
              ×
            </button>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '10px' }}>
            {Object.entries(astrologer).map(([key, value]) => (
              <div key={key} style={{
                display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px',
                borderBottom: '1px solid #f0f0f0', padding: '12px 0', alignItems: 'center'
              }}>
                <strong style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</strong>
                <div>{renderValue(key, value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

// --- NEW Add Astrologer Modal Component ---
// --- NEW Add Astrologer Modal Component (with resilient API handling) ---
const AddAstrologerModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ name: '', number: '', email: '', experience: '' });
    const [skills, setSkills] = useState([]);
    const [currentSkill, setCurrentSkill] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(''); // State to hold form-specific errors

    const handleInputChange = (e) => { /* ... unchanged ... */
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => { /* ... unchanged ... */
        setProfilePhoto(e.target.files[0]);
    };

    const handleSkillKeyDown = (e) => { /* ... unchanged ... */
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
                setSkills([...skills, currentSkill.trim()]);
            }
            setCurrentSkill('');
        }
    };
    
    const removeSkill = (skillToRemove) => { /* ... unchanged ... */
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

   // Replace the existing handleSubmit function with this one.

// Inside your AddAstrologerModal component in AstrologerPage.jsx

    // THIS IS THE CORRECTED AND ROBUST SUBMIT FUNCTION WITH LOGGING
 // Inside your AddAstrologerModal component in AstrologerPage.jsx

    // THIS IS THE CORRECTED SUBMIT FUNCTION
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        console.log("1. handleSubmit triggered.");

        const apiFormData = new FormData();
        apiFormData.append('name', formData.name);
        apiFormData.append('number', formData.number);
        apiFormData.append('email', formData.email);
        apiFormData.append('experience', formData.experience);
        
        if (profilePhoto) {
            apiFormData.append('profilePhoto', profilePhoto);
        }

        // *** THE CRITICAL FIX IS HERE ***
        // Instead of looping, we convert the entire skills array into a single JSON string.
        // This sends '["marrige", "legal"]' which the server can parse correctly.
        apiFormData.append('skills', JSON.stringify(skills));
        
        console.log("2. FormData prepared. 'skills' is now a JSON string.");
        
        try {
            console.log("3. Sending FETCH request to the API...");
            const response = await fetch('https://kalpyotish.onrender.com/api/astrologer/register', {
                method: 'POST',
                body: apiFormData,
            });

            console.log("4. Received a response from the server.", "Status:", response.status, "OK:", response.ok);

            if (!response.ok) {
                let errorMessage = `Server Error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    console.error("! Parsed error JSON from server:", errorData);
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    console.error("! Could not parse error response as JSON.", jsonError);
                }
                throw new Error(errorMessage);
            }

            console.log("5. SUCCESS: Parsing success JSON...");
            const successData = await response.json();
            onSuccess(successData.data);

        } catch (err) {
            console.error("! CATCH: The entire try block failed.", err);
            if (err instanceof TypeError) {
                setError("Network Error: Could not connect to server.");
            } else {
                setError(err.message);
            }
        } finally {
            console.log("6. FINALLY: Setting isSubmitting back to false.");
            setIsSubmitting(false);
        }
    };

// The rest of your AddAstrologerModal component and AstrologerPage component remain the same.

    const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '15px', boxSizing: 'border-box' };
    
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: 'white', borderRadius: '8px', padding: '24px', width: '90%', maxWidth: '500px', position: 'relative' }}>
                <h2 style={{ marginTop: 0 }}>Add New Astrologer</h2>
                {error && <p style={{ color: 'red', background: '#ffebee', padding: '10px', borderRadius: '4px' }}>Error: {error}</p>}
                <form onSubmit={handleSubmit}>
                    {/* Form inputs are unchanged */}
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} style={inputStyle} required />
                    <input type="text" name="number" placeholder="Phone Number" value={formData.number} onChange={handleInputChange} style={inputStyle} required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} style={inputStyle} required />
                    <input type="text" name="experience" placeholder="Experience (e.g., 5 years)" value={formData.experience} onChange={handleInputChange} style={inputStyle} required />
                    
                    <div>
                        <label>Skills (press Enter after each)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', padding: '8px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '15px' }}>
                            {skills.map(skill => (
                                <span key={skill} style={{ background: '#e0e0e0', padding: '3px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
                                    {skill}
                                    <FaTimes onClick={() => removeSkill(skill)} style={{ marginLeft: '5px', cursor: 'pointer' }} />
                                </span>
                            ))}
                            <input type="text" value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)} onKeyDown={handleSkillKeyDown} style={{ border: 'none', outline: 'none', flex: 1, minWidth: '100px' }} />
                        </div>
                    </div>

                    <div>
                        <label>Profile Photo</label>
                        <input type="file" name="profilePhoto" onChange={handleFileChange} style={{ ...inputStyle, border: 'none', padding: '10px 0' }} />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: 'black', color: 'white', cursor: 'pointer' }}>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- NEW Toast Component ---
const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // Auto-close after 3 seconds
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


// --- Main Astrologer Page Component ---

function AstrologerPage() {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for the new modal
  const [selectedAstrologer, setSelectedAstrologer] = useState(null);
  
  const [toastMessage, setToastMessage] = useState(''); // State for toast

  useEffect(() => { /* ... fetchAstrologers logic is unchanged ... */
    const fetchAstrologers = async () => {
        try {
          const response = await fetch('https://kalpyotish.onrender.com/api/astrologer/all');
          if (!response.ok) throw new Error('Network response was not ok');
          const result = await response.json();
          setAstrologers(result.data || []);
        } catch (err) { setError(err.message); } 
        finally { setLoading(false); }
      };
      fetchAstrologers();
  }, []);

  const handleToggleStatus = async (astroId, newStatus) => { /* ... unchanged ... */ };
  const handleViewDetails = (astrologer) => { setSelectedAstrologer(astrologer); setIsDetailsModalOpen(true); };

  const handleAddSuccess = (newAstrologer) => {
    setAstrologers(prev => [newAstrologer, ...prev]); // Add new astrologer to the top of the list
    setIsAddModalOpen(false);
    setToastMessage('Astrologer added successfully!');
  };
  
  const filteredAstrologers = useMemo(() => astrologers.filter(astro => astro.name.toLowerCase().includes(searchTerm.toLowerCase())), [astrologers, searchTerm]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>Loading Astrologers...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: 'red' }}>Error: {error}</div>;

  return (
    <>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ccc', width: '300px', fontSize: '16px' }}/>
          <button onClick={() => setIsAddModalOpen(true)} style={{ backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
            + Add Astrologer
          </button>
        </div>

        <div style={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', overflow: 'hidden', fontFamily: 'Georgia, serif' }}>
          {/* ... Table JSX is unchanged ... */}
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffda77' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffe499' }}>
                {['S.no', 'Profile', 'Name', 'Phone', 'Details', 'Action'].map(header => (
                  <th key={header} style={{ padding: '15px', textAlign: 'left', border: '1px solid #ffca59' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAstrologers.map((astro, index) => (
                <tr key={astro._id} style={{ borderTop: '1px solid #ffca59' }}>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>{index + 1}.</td>
                  <td style={{ padding: '8px 15px', textAlign: 'center' }}>
                    <img src={astro.user_profile || astro.profilePhoto || 'https://via.placeholder.com/40'} alt={astro.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}/>
                  </td>
                  <td style={{ padding: '12px 15px' }}>{astro.name}</td>
                  <td style={{ padding: '12px 15px' }}>{astro.mobileNo || astro.number || 'N/A'}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <button onClick={() => handleViewDetails(astro)} style={{ backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 20px', cursor: 'pointer', fontWeight: 'bold' }}>View</button>
                  </td>
                  <td style={{ padding: '12px 15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <StatusToggle initialStatus={astro.isApproved} onToggle={(newStatus) => handleToggleStatus(astro._id, newStatus)} />
                      <FaTrash style={{ color: 'black', cursor: 'pointer', fontSize: '18px' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isDetailsModalOpen && <DetailsModal astrologer={selectedAstrologer} onClose={() => setIsDetailsModalOpen(false)} />}
      {isAddModalOpen && <AddAstrologerModal onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddSuccess} />}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </>
  );
}

export default AstrologerPage;