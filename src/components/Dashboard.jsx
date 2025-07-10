import { useState, useEffect } from 'react';

// The Card component remains the same. It's a presentational component.
function Card({ label, value }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    background: '#ffc107',
    borderRadius: 16,
    padding: '25px 20px',
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Georgia, serif',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
    cursor: 'pointer',
    transition: 'transform 0.25s ease-in-out',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8
      }}>
        {/* The value will be "..." during loading, then the number */}
        {value}
      </div>
      <div style={{
        fontSize: 16,
      }}>
        {label}
      </div>
    </div>
  );
}

// The Dashboard component now contains the logic to fetch data.
function Dashboard() {
  // State to hold the counts. Initialized to '...' for loading state.
  const [userCount, setUserCount] = useState('...');
  const [astrologerCount, setAstrologerCount] = useState('...');

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch both APIs concurrently for better performance
        const [userResponse, astrologerResponse] = await Promise.all([
          fetch('https://kalpyotish.onrender.com/api/auth/user-stats'),
          fetch('https://kalpyotish.onrender.com/api/astrologer/astrologer-stats')
        ]);

        if (!userResponse.ok || !astrologerResponse.ok) {
          throw new Error('Network response was not ok for one or more stats.');
        }

        const userData = await userResponse.json();
        const astrologerData = await astrologerResponse.json();

        // Update state with the total counts from the API data
        setUserCount(userData.data.total);
        setAstrologerCount(astrologerData.data.total);

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Update state to show an error message in the cards
        setUserCount('Error');
        setAstrologerCount('Error');
      }
    };

    fetchStats();
  }, []); // The empty array ensures this effect runs only once on mount

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    
      backgroundColor: '#ffffff',
      padding: '20px'
    }}>
      <div style={{
        display: 'grid',
        gap: '40px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        width: '100%',
        maxWidth: '600px',
      }}>
        {/* Cards now use the dynamic state values */}
        <Card label="Total User" value={userCount} />
        <Card label="Total Astrologers" value={astrologerCount} />
        
        {/* These cards remain static as no API was provided */}
        <Card label="Puja Request" value="534" />
        <Card label="Products Sales" value="534" />
      </div>
    </div>
  );
}

export default Dashboard;