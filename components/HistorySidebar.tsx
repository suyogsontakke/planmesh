import React from 'react';
import { X, Map, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { SavedTrip } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  trips: SavedTrip[];
  onSelectTrip: (trip: SavedTrip) => void;
  userEmail: string;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, trips, onSelectTrip, userEmail }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]" 
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-dark-950 border-l border-white/10 z-[90] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
             <div>
               <h2 className="font-grotesk font-black text-2xl text-white">Your Trips</h2>
               <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{userEmail}</p>
             </div>
             <button 
               onClick={onClose}
               className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
             >
               <X className="w-6 h-6" />
             </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {trips.length === 0 ? (
               <div className="text-center py-20 opacity-40">
                  <Map className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <p className="font-grotesk font-bold text-gray-500">No trips saved yet.</p>
               </div>
            ) : (
              trips.map((trip) => (
                <div 
                  key={trip.id}
                  onClick={() => {
                    onSelectTrip(trip);
                    onClose();
                  }}
                  className="group bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-grotesk font-bold text-lg text-white group-hover:text-neon-cyan transition-colors">
                      {trip.destination}
                    </h3>
                    <div className="bg-black/30 px-2 py-1 rounded text-[10px] font-mono text-gray-400 border border-white/5">
                       {trip.data.durationDays} Days
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {trip.date}
                    </span>
                    <span className="flex items-center gap-1">
                       {trip.data.totalEstimatedCost}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-neon-lime text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                     View Plan <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;