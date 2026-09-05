import { useState } from 'react';
import { X, Eye, EyeOff, Coffee, AlertCircle } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Hardcoded Admin Bypass
    if (form.email.toLowerCase() === 'admin@aroma.com' && form.password === 'admin') {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onAuthSuccess({
          name: 'Admin',
          email: 'admin@aroma.com',
          uid: 'admin-bypass',
          role: 'admin'
        });
        handleClose();
      }, 1500);
      return;
    }

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(userCredential.user, { displayName: form.name });
        
        setSuccess(true);
        setTimeout(() => {
          onAuthSuccess({
            name: form.name,
            email: userCredential.user.email,
            uid: userCredential.user.uid,
            role: userCredential.user.email === 'admin@aroma.com' ? 'admin' : 'user'
          });
          handleClose();
        }, 1500);

      } else {
        const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
        
        setSuccess(true);
        setTimeout(() => {
          onAuthSuccess({
            name: userCredential.user.displayName || 'User',
            email: userCredential.user.email,
            uid: userCredential.user.uid,
            role: userCredential.user.email === 'admin@aroma.com' ? 'admin' : 'user'
          });
          handleClose();
        }, 1500);
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Incorrect email or password. Please try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ name: '', email: '', password: '' });
    setError('');
    setSuccess(false);
    setMode('signin');
    setIsLoading(false);
    onClose();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setForm({ name: '', email: '', password: '' });
    setError('');
  };

  return (
    <div className="auth-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={handleClose}>
          <X size={24} />
        </button>

        <div className="auth-split-layout">
          {/* Left Side: Image / Branding for Desktop */}
          <div className="auth-brand-side">
            <div className="auth-brand-overlay">
              <Coffee size={48} className="auth-brand-icon" />
              <h2>Aroma N Tea Cup</h2>
              <p>Experience the finest blends crafted just for you.</p>
            </div>
            <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600" alt="Coffee pouring" className="auth-brand-img" />
          </div>

          {/* Right Side: Form */}
          <div className="auth-form-side">
            <div className="auth-header-mobile">
              <div className="auth-logo">
                <Coffee size={24} />
              </div>
              <span className="auth-brand">Aroma N Tea Cup</span>
            </div>

            <h2 className="modal-title">
              {success
                ? 'Success!'
                : mode === 'signin' ? 'Sign in to your account' : 'Create an account'}
            </h2>
            <p className="modal-subtitle">
              {success
                ? 'Redirecting you...'
                : mode === 'signin'
                  ? 'Welcome back! Please enter your details.'
                  : 'Start your coffee journey with us.'}
            </p>

        {!success && (
          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name" type="text" name="name"
                  placeholder="Juan dela Cruz"
                  value={form.name} onChange={handleChange} required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email" type="email" name="email"
                placeholder="hello@aromantea.com"
                value={form.email} onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password" placeholder="••••••••"
                  value={form.password} onChange={handleChange}
                  required minLength={mode === 'signup' ? 6 : 5}
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'signin' && (
              <div className="forgot-row">
                <button type="button" className="forgot-btn">Forgot password?</button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="auth-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className={`auth-submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {isLoading ? <span className="spinner" /> : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>


          </form>
        )}

        {success && (
          <div className="success-anim">
            <div className="success-circle">✓</div>
          </div>
        )}

        {!success && (
          <div className="auth-switch">
            {mode === 'signin' ? (
              <p>Don't have an account? <button type="button" onClick={() => { setMode('signup'); setError(''); }}>Sign Up</button></p>
            ) : (
              <p>Already have an account? <button type="button" onClick={() => { setMode('signin'); setError(''); }}>Sign In</button></p>
            )}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
