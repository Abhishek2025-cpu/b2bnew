import React, { useState, useEffect } from 'react'; // 1. Import useState and useEffect

const Card = ({ label, value }) => {
  // Keeping the hover effect for a better user experience
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    background: '#ffc107',
    borderRadius: 16,
    padding: '25px 20px',
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Georgia, serif',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.25s ease-in-out',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>
        {value}
      </div>
      <div style={{ fontSize: 16 }}>
        {label}
      </div>
    </div>
  );
};


function DashboardPage() {
  // 2. Add state to hold the dynamic counts, with '...' as the initial loading text
  const [userCount, setUserCount] = useState('...');
  const [astrologerCount, setAstrologerCount] = useState('...');

  // 3. Add useEffect to fetch data on component load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userResponse, astrologerResponse] = await Promise.all([
          fetch('https://kalpyotish.onrender.com/api/auth/user-stats'),
          fetch('https://kalpyotish.onrender.com/api/astrologer/astrologer-stats')
        ]);

        if (!userResponse.ok || !astrologerResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const userData = await userResponse.json();
        const astrologerData = await astrologerResponse.json();

        // Update state with the total counts from the API
        setUserCount(userData.data.total);
        setAstrologerCount(astrologerData.data.total);

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setUserCount('Error');
        setAstrologerCount('Error');
      }
    };

    fetchStats();
  }, []); // The empty dependency array `[]` ensures this runs only once.

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      paddingTop: '40px'
    }}>
      <div style={{
        display: 'grid',
        gap: '40px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        width: '100%',
        maxWidth: '600px',
      }}>
        {/* 4. Use the state variables in the Card components */}
        <Card label="Total User" value={userCount} />
        <Card label="Total Astrologers" value={astrologerCount} />
        
        {/* These cards remain static for now */}
        <Card label="Puja Request" value="534" />
        <Card label="Products Sales" value="534" />
      </div>
    </div>
  );
}

export default DashboardPage;