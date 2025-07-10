import React, { useState, useEffect, useMemo } from 'react';
import { FaTrash } from 'react-icons/fa';

// --- Reusable Components ---

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

const UserDetailsModal = ({ user, onClose }) => {
    // This is the fully functional, interactive modal
    if (!user) return null;
  
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1000,
        display: 'flex', justifyContent: 'center', alignItems: 'center'
      }}>
        <div style={{
          background: 'white', borderRadius: '8px', padding: '24px',
          width: '90%', maxWidth: '700px', maxHeight: '90vh',
          display: 'flex', flexDirection: 'column', fontFamily: 'Georgia, serif',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '12px', marginBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '24px' }}>{user.name}'s Details</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', lineHeight: 1 }}>×</button>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '10px' }}>
            {Object.entries(user).map(([key, value]) => (
              <div key={key} style={{
                display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px',
                borderBottom: '1px solid #f0f0f0', padding: '12px 0', alignItems: 'center'
              }}>
                <strong style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</strong>
                <div>{typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value || 'N/A')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};


// --- Main User Page Component ---

function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://kalpyotish.onrender.com/api/auth/users');
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        // Add a temporary 'isActive' property to each user for the toggle to work
        const usersWithStatus = result.data.map(user => ({ ...user, isActive: true }));
        setUsers(usersWithStatus || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  
  const handleDelete = (userId) => { /* ... unchanged ... */ };

  const handleToggleStatus = (userId, newStatus) => {
    // This function now makes the toggle workable in the UI
    setUsers(currentUsers =>
        currentUsers.map(user =>
            user._id === userId ? { ...user, isActive: newStatus } : user
        )
    );
    // Placeholder for a real API call
    console.log(`UI Updated: User ${userId} status changed to ${newStatus}. An API call would be made here.`);
  };

  const filteredUsers = useMemo(() =>
    users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [users, searchTerm]
  );

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>Loading Users...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: 'red' }}>Error: {error}</div>;

  return (
    <>
      <div style={{ padding: '20px' }}>
        {/* Top Controls - "Add User" button removed */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ccc', width: '300px', fontSize: '16px' }}
          />
        </div>

        <div style={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', overflow: 'hidden', fontFamily: 'Georgia, serif' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffda77' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffe499' }}>
                {['S.no', 'Profile', 'Name', 'Phone', 'Details', 'Action'].map(header => (
                  <th key={header} style={{ padding: '15px', textAlign: 'left', border: '1px solid #ffca59' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id} style={{ borderTop: '1px solid #ffca59' }}>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>{index + 1}.</td>
                  <td style={{ padding: '8px 15px', textAlign: 'center' }}>
                    <img
                      src={user.profile || 'https://via.placeholder.com/40'}
                      alt={user.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </td>
                  <td style={{ padding: '12px 15px' }}>{user.name}</td>
                  <td style={{ padding: '12px 15px' }}>{user.mobileNo || 'N/A'}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    {/* Correct "View" button */}
                    <button
                      onClick={() => handleViewDetails(user)}
                      style={{
                        backgroundColor: 'black', color: 'white', border: 'none',
                        borderRadius: '20px', padding: '8px 20px', cursor: 'pointer',
                        fontWeight: 'bold'
                      }}>
                      View
                    </button>
                  </td>
                  <td style={{ padding: '12px 15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      {/* Workable Toggle Switch */}
                      <StatusToggle 
                        initialStatus={user.isActive} 
                        onToggle={(newStatus) => handleToggleStatus(user._id, newStatus)} 
                      />
                      <FaTrash onClick={() => handleDelete(user._id)} style={{ color: 'black', cursor: 'pointer', fontSize: '18px' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <UserDetailsModal user={selectedUser} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

export default UserPage;