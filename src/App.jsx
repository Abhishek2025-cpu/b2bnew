import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardPage from './Pages/DashboardPage';
import Dashboard from './components/Dashboard';
import AstrologerPage from './Pages/AstrologerPage';
import UserPage from './Pages/UserPage';
import ProductPage from './Pages/ProductPage';
import PoojaPage from './Pages/PoojaPage';
// Add imports for other pages as you create them
// import Profile from './Pages/Profile';

// A placeholder for other pages
const Placeholder = ({ title }) => <h1 style={{ fontFamily: 'serif' }}>{title} Page</h1>;

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // Mocking admin login for demonstration. Replace with your actual context/logic.
  const admin = { name: 'Admin User' };

  if (!admin) {
    return (
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F8F9FA' }}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar />
        
        {/* Scrollable Page Content */}
        <main style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#fff' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
           <Route path="/astrologer" element={<AstrologerPage />} /> 
            <Route path="/user" element={<UserPage />} /> 
            <Route path="/products" element={<ProductPage />} /> 
             <Route path="/online-puja" element={<PoojaPage />} /> 
            <Route path="/kundli" element={<Placeholder title="Kundli" />} />
            <Route path="/horoscope" element={<Placeholder title="Horoscope" />} />
            <Route path="/faq" element={<Placeholder title="FAQ" />} />
            <Route path="/privacy-policy" element={<Placeholder title="Privacy Policy" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;