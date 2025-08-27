import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetMsg('');
    setError('');
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMsg('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-dark via-gray-900 to-accent-blue text-light">
      <form onSubmit={showSignup ? handleSignup : handleLogin} className="bg-dark-accent p-10 rounded-2xl shadow-2xl w-96 border border-gray-700">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-accent-blue drop-shadow">{showSignup ? 'Sign Up' : 'Login'}</h2>
        {!showReset ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mb-5 w-full p-3 rounded-lg border border-gray-600 bg-dark text-light focus:border-accent-blue focus:ring-2 focus:ring-accent-blue transition-all"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mb-5 w-full p-3 rounded-lg border border-gray-600 bg-dark text-light focus:border-accent-blue focus:ring-2 focus:ring-accent-blue transition-all"
              required
            />
            {error && <div className="mb-5 text-red-400 text-sm text-center font-semibold">{error}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-accent-blue to-accent-yellow text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
              {showSignup ? 'Sign Up' : 'Login'}
            </button>
            <p className="mt-6 text-sm text-center text-gray-300">
              {showSignup ? (
                <>Already have an account? <button type="button" className="text-accent-blue underline font-semibold" onClick={() => setShowSignup(false)}>Login</button></>
              ) : (
                <>
                  Don't have an account? <button type="button" className="text-accent-blue underline font-semibold" onClick={() => setShowSignup(true)}>Sign up</button><br />
                  <button type="button" className="text-accent-yellow underline font-semibold mt-2" onClick={() => setShowReset(true)}>Forgot Password?</button>
                </>
              )}
            </p>
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="mb-5 w-full p-3 rounded-lg border border-gray-600 bg-dark text-light focus:border-accent-blue focus:ring-2 focus:ring-accent-blue transition-all"
              required
            />
            {resetMsg && <div className="mb-5 text-green-400 text-sm text-center font-semibold">{resetMsg}</div>}
            {error && <div className="mb-5 text-red-400 text-sm text-center font-semibold">{error}</div>}
            <button type="button" className="w-full bg-gradient-to-r from-accent-blue to-accent-yellow text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform mb-2" onClick={handleReset}>
              Send Password Reset Email
            </button>
            <button type="button" className="w-full bg-gray-700 text-white font-bold py-2 rounded-lg shadow hover:scale-105 transition-transform" onClick={() => setShowReset(false)}>
              Back to Login
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default AuthPage;
