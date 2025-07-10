import { useState } from 'react';
 import { useAdmin } from '../context/AdminContext'; // or your context path
 import { useNavigate } from 'react-router-dom';



function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 const { login } = useAdmin();
const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const res = await fetch('https://kalpyotish.onrender.com/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      login(data.admin);               // Store admin info in context + localStorage
      showToast('Login successful 🎉');
      navigate('/');                   // Immediately redirect to dashboard
    } else {
      setError(data.message || 'Invalid credentials!');
    }
  } catch (err) {
    setLoading(false);
    setError('Something went wrong!');
  }
};
 





  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.innerText = message;
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#28a745',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: 9999,
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      transition: 'opacity 0.3s ease'
    });
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  };

  return (
    <div style={{
      height: '100vh',
      background: ' #f5f5f5',
      backgroundSize: '400% 400%',
      animation: 'gradientMove 15s ease infinite',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '0 15px'
    }}>
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        background: '#D9D9D9',
        borderRadius: '12px',
        padding: '40px 30px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 12px 35px rgba(0,0,0,0.15)',
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: 30,
          color: '#222'
        }}>🔐 Admin Login</h2>

        <form onSubmit={handleLogin}>

          {/* Email Field */}
          <div style={{ marginBottom: 20, position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', fontSize: 18, color: '#777'
            }}>📧</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              style={{
                width: '100%',
                padding: '14px 14px 14px 40px',
                fontSize: '15px',
                border: '1px solid #ccc',
                boxSizing:'border-box',
                borderRadius: '8px',
                outline: 'none',
                backgroundColor: '#f9f9f9',
                transition: '0.3s',
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = 'inset 0 0 5px 1px #007bff';
                e.target.style.borderColor = '#007bff';
                e.target.style.backgroundColor = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'inset 0 0 0 0 #007bff';
                e.target.style.borderColor = '#ccc';
                e.target.style.backgroundColor = '#f9f9f9';
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: 25, position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', fontSize: 18, color: '#777'
            }}>🔒</span>
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              style={{
                width: '100%',
                padding: '14px 40px 14px 40px',
                fontSize: '15px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                outline: 'none',
                boxSizing:'border-box',
                backgroundColor: '#f9f9f9',
                transition: '0.3s'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = 'inset 0 0 5px 1px #007bff';
                e.target.style.borderColor = '#007bff';
                e.target.style.backgroundColor = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'inset 0 0 0 0 #007bff';
                e.target.style.borderColor = '#ccc';
                e.target.style.backgroundColor = '#f9f9f9';
              }}
            />
            <span
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 18,
                color: '#777',
                cursor: 'pointer'
              }}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? '🙈' : '👁️'}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: '0.3s ease',
              boxShadow: '0 5px 15px rgba(0, 123, 255, 0.3)'
            }}
          >
            {loading && <div className="spinner"></div>}
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {error && <p style={{ color: 'red', textAlign: 'center', marginTop: 15 }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
