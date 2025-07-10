import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'; // Make sure this path is correct

// Importing icons from the react-icons library
import { 
  FaTachometerAlt, FaUserTie, FaUsers, FaShoppingBag, FaPrayingHands, 
  FaChartPie, FaMoon, FaQuestionCircle, FaShieldAlt, FaCogs 
} from 'react-icons/fa';

const menuItems = [
  { name: "Dashboard", icon: <FaTachometerAlt />, path: "/" },
  { name: "Astrologer", icon: <FaUserTie />, path: "/astrologer" },
  { name: "User", icon: <FaUsers />, path: "/user" },
  { name: "Products", icon: <FaShoppingBag />, path: "/products" },
  { name: "Online Puja", icon: <FaPrayingHands />, path: "/online-puja" },
  { name: "Kundli", icon: <FaChartPie />, path: "/kundli" },
  { name: "Horoscope", icon: <FaMoon />, path: "/horoscope" },
  { name: "FAQ", icon: <FaQuestionCircle />, path: "/faq" },
  { name: "Privacy Policy", icon: <FaShieldAlt />, path: "/privacy-policy" },
  { name: "Settings", icon: <FaCogs />, path: "/settings" },
];

// A reusable NavLink component for cleaner code
const NavLink = ({ item, isOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <Link
      to={item.path}
      title={!isOpen ? item.name : undefined} // Tooltip only when collapsed
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isOpen ? 'flex-start' : 'center', // Center icon when collapsed
        backgroundColor: isActive ? '#000' : 'transparent',
        color: isActive ? '#fff' : '#000',
        padding: '12px 16px',
        borderRadius: 24,
        textDecoration: 'none',
        fontFamily: 'serif',
        fontSize: 16,
        whiteSpace: 'nowrap',
        transition: 'all 0.2s',
        marginBottom: 10,
      }}
    >
      <span style={{ fontSize: '20px', minWidth: isOpen ? '30px' : 'auto' }}>{item.icon}</span>
      {isOpen && <span style={{ marginLeft: '12px' }}>{item.name}</span>}
    </Link>
  );
};


function Sidebar({ isOpen, setIsOpen }) {
  const scrollbarStyles = `
    .sidebar-scroll-container::-webkit-scrollbar { width: 8px; }
    .sidebar-scroll-container::-webkit-scrollbar-track { background: #e0af00; }
    .sidebar-scroll-container::-webkit-scrollbar-thumb { background-color: #333; border-radius: 4px; }
  `;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div style={{
        position: 'relative',
        width: isOpen ? '240px' : '80px', // Correct collapsed width
        backgroundColor: '#ffca00',
        transition: 'width 0.3s ease-in-out',
        flexShrink: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
        // 'overflow: hidden' is removed to prevent clipping the button
      }}>
        {/* Toggle Button - Correctly positioned to be visible */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'absolute', top: 25, right: -15, // Sticks out by half its width
            width: 30, height: 30, backgroundColor: '#fff', border: '1px solid #ddd', 
            borderRadius: '50%', display: 'flex', justifyContent: 'center', 
            alignItems: 'center', cursor: 'pointer', zIndex: 100, 
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)', fontSize: '20px', color: '#333'
          }}
        >
          {isOpen ? '‹' : '›'}
        </div>

        {/* Header */}
        <div style={{ padding: '20px 0 10px 0' }}>
          <Link to="/" title={!isOpen ? "Astrologer App partner" : undefined} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'black' }}>
            <img src={logo} alt="logo" style={{ width: 50, height: 50, flexShrink: 0 }} />
            {isOpen && (
              <span style={{ fontFamily: 'serif', fontSize: 18, marginLeft: 12, whiteSpace: 'nowrap' }}>
                KalpJyotish Admin
              </span>
            )}
          </Link>
        </div>

        {/* Scrollable Area for ALL menu items */}
        <div
          className="sidebar-scroll-container"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px', // Uniform padding
          }}
        >
          {menuItems.map((item) => (
            <NavLink key={item.name} item={item} isOpen={isOpen} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Sidebar;