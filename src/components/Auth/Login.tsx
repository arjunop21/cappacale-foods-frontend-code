import React, {useState} from 'react';
import {motion} from 'motion/react';
import {useAuth} from '../../hooks/useAuth';
import {authApi} from '../../services/auth';

export const Login: React.FC<{onClose: () => void}> = ({onClose}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {login} = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await authApi.login(email, password);
      login(data.token, data.user);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{opacity: 0, scale: 0.9}}
        animate={{opacity: 1, scale: 1}}
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900">Welcome Back</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary outline-none"
              required
            />
          </div>
          <button className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all">
            Login
          </button>
        </form>
        <button onClick={onClose} className="w-full mt-4 text-gray-500 text-sm hover:underline">
          Cancel
        </button>
      </motion.div>
    </div>
  );
};
