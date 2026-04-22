import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Book, Lock, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const [course, setCourse] = useState(user?.course || '');
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleCourseUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile('course', { course });
      setMsg({ type: 'success', text: 'Course updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile('password', passwords);
      setMsg({ type: 'success', text: 'Password updated successfully!' });
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  return (
    <div className="glass-card dashboard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, textAlign: 'left' }}>Student Dashboard</h1>
        <button onClick={logout} className="logout" style={{ width: 'auto', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      {msg.text && (
        <div className={msg.type === 'success' ? 'success-msg' : 'error-msg'} 
             style={msg.type === 'success' ? { background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#86efac', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem', textAlign: 'center' } : {}}>
          {msg.text}
        </div>
      )}

      <div className="grid-layout">
        <div>
          <div className="profile-info">
            <h2 style={{ fontSize: '1.25rem', textAlign: 'left', marginBottom: '1rem' }}>
              <User size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Profile Information
            </h2>
            <div className="profile-item">
              <span className="profile-label">Name:</span>
              <span className="profile-value">{user?.name}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Email:</span>
              <span className="profile-value">{user?.email}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Current Course:</span>
              <span className="profile-value">{user?.course}</span>
            </div>
          </div>

          <div className="profile-info">
            <h2 style={{ fontSize: '1.25rem', textAlign: 'left', marginBottom: '1rem' }}>
              <Book size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Change Course
            </h2>
            <form onSubmit={handleCourseUpdate}>
              <div className="input-group">
                <select value={course} onChange={(e) => setCourse(e.target.value)} required>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business Administration">Business Administration</option>
                  <option value="Design">Design</option>
                </select>
              </div>
              <button type="submit" className="primary" style={{ marginTop: '0' }}>Update Course</button>
            </form>
          </div>
        </div>

        <div>
          <div className="profile-info">
            <h2 style={{ fontSize: '1.25rem', textAlign: 'left', marginBottom: '1rem' }}>
              <Lock size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Update Password
            </h2>
            <form onSubmit={handlePasswordUpdate}>
              <div className="input-group">
                <label>Old Password</label>
                <input
                  type="password"
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="input-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <button type="submit" className="secondary" style={{ marginTop: '0' }}>Change Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
