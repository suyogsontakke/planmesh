import React, { useState } from 'react';
import { X, Mail, ArrowRight, Fingerprint, Lock, User, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, name: string) => void;
  error?: string | null;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onSignup, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      onSignup(email, password, name);
    } else {
      onLogin(email, password);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-dark-900 border border-white/10 w-full max-w-md rounded-3xl p-8 relative overflow-hidden shadow-2xl animate-blob">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-lime via-white to-neon-cyan"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-neon-lime/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="mb-8">
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 border border-white/10 text-neon-lime">
             <Fingerprint className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-grotesk font-black text-white mb-2">
            {isSignUp ? 'Join the Club.' : 'Welcome Back.'}
          </h2>
          <p className="text-gray-400 text-sm font-medium">
            {isSignUp 
              ? 'Save your trips and get exclusive access to secret tips.' 
              : 'Access your saved itineraries and history.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {isSignUp && (
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block font-grotesk">Full Name</label>
              <div className="relative">
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white focus:border-neon-lime focus:ring-1 focus:ring-neon-lime focus:outline-none transition-all font-grotesk font-bold"
                  />
                  <User className="absolute left-4 top-4 w-5 h-5 text-gray-600" />
              </div>
            </div>
          )}

          <div>
             <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block font-grotesk">Email Address</label>
             <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white focus:border-neon-lime focus:ring-1 focus:ring-neon-lime focus:outline-none transition-all font-grotesk font-bold"
                />
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-600" />
             </div>
          </div>

          <div>
             <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block font-grotesk">Password</label>
             <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 pl-12 pr-12 text-white focus:border-neon-lime focus:ring-1 focus:ring-neon-lime focus:outline-none transition-all font-grotesk font-bold"
                />
                <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-600" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-white focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
             </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black py-4 rounded-xl font-grotesk font-black uppercase tracking-wider hover:bg-neon-lime transition-colors flex items-center justify-center gap-2 group"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setShowPassword(false); }}
            className="text-xs text-gray-500 hover:text-white transition-colors font-bold font-grotesk uppercase tracking-wide"
          >
            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;