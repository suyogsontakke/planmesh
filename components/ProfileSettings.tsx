import React, { useState, useRef } from 'react';
import { X, Save, Sparkles, User as UserIcon, Calendar, Type, Upload } from 'lucide-react';
import { User } from '../types';
import { generateProfileImage } from '../services/geminiService';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (user: User) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [dob, setDob] = useState(user.dob || '');
  const [bio, setBio] = useState(user.bio || '');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name,
      dob,
      bio,
      profilePic: tempImage || user.profilePic
    });
    onClose();
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) return;
    setIsGenerating(true);
    try {
      const base64Image = await generateProfileImage(imagePrompt);
      setTempImage(base64Image);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-dark-900 border border-white/10 w-full max-w-2xl rounded-[2rem] relative overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left: AI Avatar Generator */}
        <div className="w-full md:w-2/5 bg-black/40 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
           <div className="absolute inset-0 bg-neon-purple/5"></div>
           
           <div className="relative w-40 h-40 mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-lime to-neon-cyan rounded-full blur opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative w-full h-full rounded-full border-4 border-black overflow-hidden bg-dark-800 flex items-center justify-center">
                 {(tempImage || user.profilePic) ? (
                    <img src={tempImage || user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                    <UserIcon className="w-16 h-16 text-gray-600" />
                 )}
              </div>
              
              {/* Upload Button Overlay */}
              <button 
                onClick={triggerFileInput}
                className="absolute bottom-1 right-1 bg-white text-black p-2 rounded-full hover:bg-gray-200 hover:scale-105 transition-all shadow-lg z-10"
                title="Upload from Device"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
           </div>

           <h3 className="font-grotesk font-bold text-white mb-4 flex items-center gap-2">
             <Sparkles className="w-4 h-4 text-neon-lime" /> AI Avatar Studio
           </h3>

           <div className="w-full space-y-3">
              <input 
                type="text" 
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="e.g. Cyberpunk Astronaut..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-neon-purple focus:outline-none"
              />
              <button 
                onClick={handleGenerateImage}
                disabled={isGenerating || !imagePrompt}
                className="w-full bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple border border-neon-purple/50 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate with Nano'}
              </button>
           </div>
        </div>

        {/* Right: Details Form */}
        <div className="w-full md:w-3/5 p-8 relative overflow-y-auto scrollbar-hide">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-grotesk font-black text-white mb-1">Profile Settings</h2>
            <p className="text-gray-400 text-sm mb-8">Customize your PlanMesh identity.</p>

            <div className="space-y-5">
                <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Display Name</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:border-neon-lime focus:outline-none font-bold"
                        />
                        <UserIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-600" />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Date of Birth</label>
                    <div className="relative">
                        <input 
                            type="date" 
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:border-neon-lime focus:outline-none font-bold"
                        />
                        <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-600" />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Your Vibe (Bio)</label>
                    <div className="relative">
                        <textarea 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:border-neon-lime focus:outline-none font-bold resize-none"
                        />
                        <Type className="absolute left-3 top-3.5 w-4 h-4 text-gray-600" />
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button 
                    onClick={handleSave}
                    className="bg-white text-black px-6 py-3 rounded-full font-grotesk font-black uppercase hover:bg-neon-lime transition-colors flex items-center gap-2"
                >
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileSettings;