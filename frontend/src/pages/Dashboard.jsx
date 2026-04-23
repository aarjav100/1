import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  LogOut, 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Filter,
  X
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic'
  });

  const fetchGrievances = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/grievances');
      setGrievances(res.data);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to fetch grievances' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrievances();
  }, [fetchGrievances]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      fetchGrievances();
      return;
    }
    try {
      const res = await api.get(`/grievances/search?title=${query}`);
      setGrievances(res.data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/grievances/${editingId}`, formData);
        setMsg({ type: 'success', text: 'Grievance updated successfully!' });
      } else {
        await api.post('/grievances', formData);
        setMsg({ type: 'success', text: 'Grievance submitted successfully!' });
      }
      resetForm();
      fetchGrievances();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Action failed' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this grievance?')) return;
    try {
      await api.delete(`/grievances/${id}`);
      setMsg({ type: 'success', text: 'Grievance deleted' });
      fetchGrievances();
    } catch (err) {
      setMsg({ type: 'error', text: 'Delete failed' });
    }
  };

  const handleEdit = (grievance) => {
    setFormData({
      title: grievance.title,
      description: grievance.description,
      category: grievance.category
    });
    setEditingId(grievance._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', category: 'Academic' });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusIcon = (status) => {
    return status === 'Resolved' ? 
      <CheckCircle2 size={16} color="#4ade80" /> : 
      <Clock size={16} color="#fbbf24" />;
  };

  return (
    <div className="glass-card dashboard-card" style={{ maxWidth: '1000px', width: '95%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Grievance Portal</h1>
          <p style={{ margin: '0.25rem 0 0', opacity: 0.7 }}>Welcome back, {user?.name}</p>
        </div>
        <button onClick={logout} className="logout-btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      {msg.text && (
        <div style={{ 
          background: msg.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${msg.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          color: msg.type === 'success' ? '#86efac' : '#fca5a5',
          padding: '0.75rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
        }}>
          {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {msg.text}
          <X size={14} style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={() => setMsg({ type: '', text: '' })} />
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
          <input 
            type="text" 
            placeholder="Search grievances by title..." 
            value={searchQuery}
            onChange={handleSearch}
            style={{ paddingLeft: '40px', width: '100%' }}
          />
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="primary" 
          style={{ width: 'auto', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {showForm ? <X size={18} /> : <PlusCircle size={18} />}
          {showForm ? 'Cancel' : 'New Grievance'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem' }}>
            {editingId ? 'Update Grievance' : 'Submit New Grievance'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Title</label>
              <input 
                type="text" 
                required 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Brief summary of the issue"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label>Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Academic">Academic</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Transport">Transport</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label>Date</label>
                <input type="text" disabled value={new Date().toLocaleDateString()} />
              </div>
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea 
                required 
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Provide detailed information about your grievance..."
                style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '0.75rem', color: 'white' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="primary" style={{ flex: 1, margin: 0 }}>
                {editingId ? 'Update Grievance' : 'Submit Grievance'}
              </button>
              <button type="button" onClick={resetForm} style={{ flex: 1, margin: 0, background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grievance-list">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} /> Your Grievances
        </h2>
        
        {loading ? (
          <p style={{ textAlign: 'center', opacity: 0.5 }}>Loading...</p>
        ) : grievances.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
            <AlertCircle size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p style={{ opacity: 0.5, margin: 0 }}>No grievances found matching your criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {grievances.map((g) => (
              <div key={g._id} style={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                padding: '1.25rem', 
                borderRadius: '12px', 
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                transition: 'all 0.2s ease'
              }} className="grievance-item">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '20px', 
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}>{g.category}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{new Date(g.date).toLocaleDateString()}</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.3rem',
                      color: g.status === 'Resolved' ? '#4ade80' : '#fbbf24'
                    }}>
                      {getStatusIcon(g.status)} {g.status}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{g.title}</h3>
                  <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem', lineHeight: 1.5 }}>{g.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button 
                    onClick={() => handleEdit(g)}
                    style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: 'none', cursor: 'pointer', color: 'white' }}
                    title="Edit"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(g._id)}
                    style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer', color: '#f87171' }}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
