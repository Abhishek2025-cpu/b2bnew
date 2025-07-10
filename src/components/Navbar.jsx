import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext'; // Make sure this path is correct
import { FaUser, FaSignOutAlt } from 'react-icons/fa'; // Icons for the dropdown

// Custom hook to detect clicks outside of a component
function useOutsideClick(ref, callback) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);
}

// --- NEW Profile Modal Component ---
const ProfileModal = ({ admin, onClose }) => {
    if (!admin) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{
                background: 'white', borderRadius: '12px', padding: '30px',
                width: '90%', maxWidth: '450px', position: 'relative',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)', textAlign: 'center'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '10px', right: '15px', background: 'none',
                    border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888'
                }}>
                    ×
                </button>
                <img
                    src={admin.profile || 'https://via.placeholder.com/100'}
                    alt={admin.name}
                    style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '4px solid #ffca00', marginBottom: '20px' }}
                />
                <h2 style={{ margin: '0 0 10px 0' }}>{admin.name}</h2>
                <p style={{ margin: 0, color: '#555' }}><strong>Email:</strong> {admin.email}</p>
                <p style={{ margin: '8px 0 0', color: '#555' }}><strong>Phone:</strong> {admin.number || 'N/A'}</p>
            </div>
        </div>
    );
};


function Navbar() {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // State for the new modal
  const dropdownRef = useRef(null);
  
  useOutsideClick(dropdownRef, () => setDropdownOpen(false));

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };
  
  const handleViewProfile = () => {
    setIsProfileModalOpen(true);
    setDropdownOpen(false); // Close dropdown when modal opens
  };

  return (
    <>
      <header style={{
        padding: '12px 24px',
        backgroundColor: '#ffca00',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: 16, color: '#868e96', zIndex: 1 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input type="text" placeholder="Search" style={{
            width: 350, height: 44, borderRadius: 22, border: 'none',
            padding: '0 20px 0 50px', fontSize: 14, backgroundColor: '#f1f3f5',
            outline: 'none',
          }}/>
        </div>

        {/* Profile Section with Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <img
            src={admin?.profile || 'https://via.placeholder.com/44'}
            alt={admin?.name || 'Admin'}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer',
              border: '2px solid white'
            }}
          />

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div style={{
              position: 'absolute', top: '55px', right: 0, backgroundColor: 'white',
              borderRadius: '8px', boxShadow: '0 5px 25px rgba(0,0,0,0.15)',
              width: '200px', zIndex: 100, overflow: 'hidden', border: '1px solid #eee'
            }}>
              <div style={{ padding: '15px', borderBottom: '1px solid #f0f0f0' }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{admin?.name}</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>{admin?.email}</p>
              </div>
              <div style={{ padding: '5px' }}>
                {/* "View Profile" now opens the modal */}
                <div onClick={handleViewProfile} style={{
                  display: 'flex', alignItems: 'center', padding: '10px 15px',
                  textDecoration: 'none', color: '#333', borderRadius: '6px',
                  cursor: 'pointer', transition: 'background-color 0.2s'
                }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f5f5f5'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <FaUser style={{ marginRight: '12px' }} /> View Profile
                </div>
                
                <div onClick={handleLogout} style={{
                  display: 'flex', alignItems: 'center', padding: '10px 15px',
                  color: '#e74c3c', cursor: 'pointer', borderRadius: '6px',
                  transition: 'background-color 0.2s'
                }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f5f5f5'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <FaSignOutAlt style={{ marginRight: '12px' }} /> Logout
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Render the modal conditionally */}
      {isProfileModalOpen && <ProfileModal admin={admin} onClose={() => setIsProfileModalOpen(false)} />}
    </>
  );
}

export default Navbar;