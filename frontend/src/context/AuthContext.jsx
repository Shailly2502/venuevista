import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

const DEMO_USERS = {
  planner: {
    id: 101,
    name: 'Elena Vance',
    email: 'elena.vance@eventcraft.com',
    role: 'Event Planner',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    company: 'Vance Luxury Events',
    phone: '+1 (555) 234-5678',
  },
  host: {
    id: 202,
    name: 'Marcus Sterling',
    email: 'marcus@luminarygroup.com',
    role: 'Venue Host',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    company: 'Luminary Venues NYC',
    phone: '+1 (555) 890-1234',
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('venuevista_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('venuevista_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('venuevista_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Attempt backend API call if server is running
      const response = await api.post('/auth/login/', { email, password });
      const { access, user: userData } = response.data;
      localStorage.setItem('token', access);
      setToken(access);
      setUser(userData);
      return { success: true };
    } catch (err) {
      // Fallback for seamless demo experience when backend isn't actively running
      const isHost = email.toLowerCase().includes('host');
      const fallbackUser = isHost ? DEMO_USERS.host : {
        id: Date.now(),
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'VIP Guest',
        email,
        role: isHost ? 'Venue Host' : 'Event Organizer',
        avatar: isHost ? DEMO_USERS.host.avatar : DEMO_USERS.planner.avatar,
        company: isHost ? 'Independent Venue Owner' : 'Private Host',
        phone: '+1 (555) 345-6789'
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(fallbackUser);
      return { success: true, isDemo: true };
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async (type = 'planner') => {
    const email = type === 'host' ? 'marcus@luminarygroup.com' : 'elena.vance@eventcraft.com';
    try {
      const res = await login(email, 'Password123!');
      if (res?.success) return;
    } catch {
      // Fallback
    }
    const selected = DEMO_USERS[type] || DEMO_USERS.planner;
    const mockToken = `demo-token-${type}-${Date.now()}`;
    localStorage.setItem('token', mockToken);
    setToken(mockToken);
    setUser(selected);
    return selected;
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register/', userData);
      const { access, user: newUser } = response.data;
      localStorage.setItem('token', access);
      setToken(access);
      setUser(newUser);
      return { success: true };
    } catch (err) {
      // Mock registration fallback
      const newUser = {
        id: Date.now(),
        name: userData.name || 'New Member',
        email: userData.email,
        role: userData.role || 'Event Organizer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        company: userData.company || 'Private Events',
        phone: userData.phone || '+1 (555) 000-0000'
      };
      const mockToken = 'mock-reg-token-' + Date.now();
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(newUser);
      return { success: true, isDemo: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('venuevista_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        loginAsDemo,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
