import React, { useState, useEffect } from 'react';
import { TripFormData, Itinerary, User, SavedTrip } from './types';
import TripForm from './components/TripForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import GlobeView from './components/GlobeView';
import AuthModal from './components/AuthModal';
import ProfileSettings from './components/ProfileSettings';
import HistorySidebar from './components/HistorySidebar';
import { generateItinerary } from './services/geminiService';
import { userService } from './services/userService';
import { Map, Sparkles, Zap, Globe2, User as UserIcon, LogOut, Menu, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize User
  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadHistory(currentUser.email);
    }
  }, []);

  const loadHistory = (email: string) => {
    setSavedTrips(userService.getHistory(email));
  };

  const handleLogin = (email: string, password: string) => {
    try {
      const loggedInUser = userService.login(email, password);
      setUser(loggedInUser);
      loadHistory(loggedInUser.email);
      setIsAuthModalOpen(false);
      setAuthError(null);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleSignup = (email: string, password: string, name: string) => {
    try {
      const newUser = userService.signup(email, password, name);
      setUser(newUser);
      loadHistory(newUser.email);
      setIsAuthModalOpen(false);
      setAuthError(null);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    try {
      const savedUser = userService.updateProfile(updatedUser);
      setUser(savedUser);
    } catch (err: any) {
      console.error("Failed to update profile", err);
    }
  };

  const handleLogout = () => {
    userService.logout();
    setUser(null);
    setSavedTrips([]);
    setIsHistoryOpen(false);
    setIsProfileOpen(false);
  };

  const handleFormSubmit = async (data: TripFormData) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    setIsSaved(false);
    try {
      const result = await generateItinerary(data);
      setItinerary(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong while planning your trip.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTrip = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (itinerary) {
      userService.saveTrip(user.email, itinerary);
      loadHistory(user.email);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleSelectTrip = (trip: SavedTrip) => {
    setItinerary(trip.data);
    setIsSaved(true); // It's already saved
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white font-sans selection:bg-neon-lime selection:text-black relative overflow-x-hidden">
      
      {/* Noise Overlay */}
      <div className="bg-noise"></div>

      {/* Animated Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => { setIsAuthModalOpen(false); setAuthError(null); }}
        onLogin={handleLogin}
        onSignup={handleSignup}
        error={authError}
      />

      {user && (
        <ProfileSettings 
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
          onUpdateUser={handleUpdateUser}
        />
      )}
      
      {user && (
        <HistorySidebar
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          trips={savedTrips}
          onSelectTrip={handleSelectTrip}
          userEmail={user.email}
        />
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-dark-950/80 backdrop-blur-xl z-40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setItinerary(null)}>
            <div className="relative">
                <div className="absolute inset-0 bg-neon-lime blur-lg opacity-20 group-hover:opacity-50 transition-opacity"></div>
                <Globe2 className="w-8 h-8 text-white relative z-10 transform group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <span className="font-grotesk text-2xl font-black tracking-tighter text-white">
              Plan<span className="text-neon-lime">Mesh</span>.
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-sm font-bold font-grotesk text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Explore</a>
                <a href="#" className="hover:text-white transition-colors">Journal</a>
            </nav>
            
            {user ? (
               <div className="flex items-center gap-2 sm:gap-4">
                 {/* User Menu Button */}
                 <button 
                    onClick={() => setIsHistoryOpen(true)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 sm:px-4 py-2 rounded-full transition-colors"
                 >
                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-neon-lime border border-white/20">
                       {user.profilePic ? (
                         <img src={user.profilePic} alt="Avatar" className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-black font-bold text-xs">{user.name[0].toUpperCase()}</span>
                       )}
                    </div>
                    <span className="hidden sm:inline font-bold font-grotesk text-sm">{user.name}</span>
                    <Menu className="w-4 h-4 ml-1" />
                 </button>
                 
                 {/* Settings Button */}
                 <button 
                    onClick={() => setIsProfileOpen(true)}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title="Settings"
                 >
                    <Settings className="w-5 h-5" />
                 </button>

                 <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-white" title="Logout">
                    <LogOut className="w-5 h-5" />
                 </button>
               </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm font-grotesk hover:bg-neon-lime hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2"
              >
                  <UserIcon className="w-4 h-4" /> Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Content & Form */}
          <div className="lg:col-span-5 space-y-12">
             <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neon-cyan text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors cursor-default">
                   <Zap className="w-3 h-3" /> AI Powered V2.0
                </div>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-grotesk font-black text-white leading-[0.85] tracking-tighter">
                  NO MORE<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-lime via-white to-neon-cyan animate-pulse">BASIC</span><br/>
                  TRIPS.
                </h1>
                <p className="text-gray-400 text-lg font-medium font-sans max-w-md border-l-2 border-neon-purple pl-6 py-2">
                  Stop scrolling. Start living. Generate aesthetic, personalized itineraries tailored to your specific vibe in seconds.
                </p>
             </div>

             <div className="glass-panel rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] group-hover:bg-brand-500/20 transition-colors duration-700"></div>
                <TripForm onSubmit={handleFormSubmit} isLoading={isLoading} />
             </div>

             {error && (
               <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl font-grotesk font-bold flex items-center gap-3">
                 <Sparkles className="w-5 h-5 text-red-500" />
                 {error}
               </div>
             )}
          </div>

          {/* Right Column: 3D Visualization & Results */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Globe Visualization */}
            <div className="sticky top-28 z-30">
                <div className="relative group">
                    <GlobeView 
                      destinationCoords={itinerary?.coordinates} 
                      originCoords={itinerary?.originCoordinates}
                      destinationName={itinerary?.destinationName}
                      description={itinerary?.overview}
                      isLoading={isLoading}
                    />
                </div>
                
                {/* Itinerary Content */}
                {itinerary && (
                  <div className="mt-12 animate-fade-in-up">
                     <ItineraryDisplay 
                        data={itinerary} 
                        onSave={handleSaveTrip}
                        isSaved={isSaved}
                     />
                  </div>
                )}

                 {/* Empty State */}
                 {!itinerary && !isLoading && (
                    <div className="mt-12 border border-dashed border-white/10 rounded-3xl p-12 text-center space-y-4 opacity-40">
                       <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center">
                          <Map className="w-8 h-8 text-gray-400" />
                       </div>
                       <p className="text-sm font-grotesk font-bold text-gray-500 tracking-widest uppercase">
                         Map is waiting for your input
                       </p>
                    </div>
                 )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="font-grotesk text-2xl font-black tracking-tighter text-white">
              Plan<span className="text-neon-lime">Mesh</span>.
            </span>
            <p className="text-gray-600 font-grotesk text-sm">© 2025 PlanMesh. Built for the aesthetics.</p>
            <div className="flex gap-4">
                <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">
                    <span className="text-xs font-bold">IG</span>
                </div>
                <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">
                    <span className="text-xs font-bold">TT</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;