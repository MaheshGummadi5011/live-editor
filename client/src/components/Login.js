import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (onLogin) onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark text-light">
      <form onSubmit={handleSubmit} className="bg-dark-accent p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-4 w-full p-2 rounded border border-gray-600 bg-dark text-light"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-4 w-full p-2 rounded border border-gray-600 bg-dark text-light"
          required
        />
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-accent-blue text-white font-bold py-2 rounded hover:bg-blue-700">Login</button>
      </form>
      <p className="mt-4 text-sm text-center">
        Don't have an account? <a href="/register" className="text-accent-blue underline">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
