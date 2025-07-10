// src/pages/Profile.jsx
import { useAdmin } from '../context/AdminContext';

function Profile() {
  const { admin } = useAdmin();

  return (
    <div style={{ padding: 40 }}>
      <h2>👤 Admin Profile</h2>
      <img
        src={admin?.profile}
        alt="profile"
        style={{ width: 100, height: 100, borderRadius: '50%', margin: '20px 0' }}
      />
      <p><strong>Name:</strong> {admin?.name}</p>
      <p><strong>Email:</strong> {admin?.email}</p>
      <p><strong>Number:</strong> {admin?.number}</p>
    </div>
  );
}

export default Profile;
