import React, { useState } from 'react';
import { TripFormData, TravelStyle, TransportMode } from '../types';
import { MapPin, DollarSign, PlaneTakeoff, ArrowRight, Car, Bus, Train, Footprints, Plane } from 'lucide-react';

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState('Moderate');
  const [travelers, setTravelers] = useState('Couple');
  const [transportMode, setTransportMode] = useState<TransportMode>(TransportMode.FLIGHT);
  const [styles, setStyles] = useState<TravelStyle[]>([]);

  const toggleStyle = (style: TravelStyle) => {
    if (styles.includes(style)) {
      setStyles(styles.filter(s => s !== style));
    } else {
      setStyles([...styles, style]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      origin,
      destination,
      days,
      budget,
      travelers,
      transportMode,
      style: styles.length > 0 ? styles : [TravelStyle.RELAXED]
    });
  };

  const inputWrapperClass = "relative group";
  const inputClasses = "w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-neon-lime focus:border-transparent focus:outline-none transition-all font-bold font-grotesk text-lg";
  const labelClasses = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2 font-grotesk";
  const iconClasses = "absolute right-4 top-[3.2rem] text-gray-600 group-focus-within:text-neon-lime transition-colors";

  const transportOptions = [
    { mode: TransportMode.FLIGHT, icon: Plane },
    { mode: TransportMode.CAR, icon: Car },
    { mode: TransportMode.TRAIN, icon: Train },
    { mode: TransportMode.BUS, icon: Bus },
    { mode: TransportMode.WALK, icon: Footprints },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Locations */}
      <div className="grid grid-cols-1 gap-6">
        <div className={inputWrapperClass}>
          <label className={labelClasses}>
            Start Point
          </label>
          <input
            type="text"
            required
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Where you at? (e.g. NYC)"
            className={inputClasses}
          />
          <PlaneTakeoff className={iconClasses} size={20} />
        </div>

        <div className={inputWrapperClass}>
          <label className={labelClasses}>
             Dream Destination
          </label>
          <input
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where we going? (e.g. Tokyo)"
            className={inputClasses}
          />
          <MapPin className={iconClasses} size={20} />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <label className={labelClasses}>
            Duration
          </label>
          <div className="bg-black/20 border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:border-white/20 transition-all">
            <input
              type="range"
              min="1"
              max="14"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-purple"
            />
            <span className="text-neon-purple font-grotesk font-black text-xl ml-4 min-w-[3rem] text-right">{days}d</span>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className={labelClasses}>
            The Vibe (Budget)
          </label>
          <div className="relative">
             <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className={`${inputClasses} appearance-none cursor-pointer text-sm`}
            >
                <option value="Budget">💸 Broke (Budget)</option>
                <option value="Moderate">⚖️ Chill (Moderate)</option>
                <option value="High End">💅 Boujee (High End)</option>
                <option value="Luxury">👑 Royalty (Luxury)</option>
            </select>
            <div className="absolute right-4 top-4 pointer-events-none">
               <DollarSign className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Transport Mode */}
      <div>
          <label className={labelClasses}>
            How are we moving?
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
             {transportOptions.map(({ mode, icon: Icon }) => (
                <button
                   key={mode}
                   type="button"
                   onClick={() => setTransportMode(mode)}
                   className={`flex flex-col items-center justify-center min-w-[4.5rem] h-16 rounded-xl transition-all border ${
                      transportMode === mode
                      ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                      : 'bg-black/40 text-gray-400 border-white/10 hover:bg-white/10 hover:border-white/20'
                   }`}
                >
                   <Icon size={20} className="mb-1" />
                   <span className="text-[10px] font-bold font-grotesk uppercase">{mode}</span>
                </button>
             ))}
          </div>
      </div>

      {/* Travelers */}
      <div>
          <label className={labelClasses}>
            Who's Coming?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
             {['Solo', 'Couple', 'Family', 'Friends'].map((opt) => (
                <button
                   key={opt}
                   type="button"
                   onClick={() => setTravelers(opt)}
                   className={`py-3 rounded-xl text-xs font-bold font-grotesk border transition-all ${
                      travelers.includes(opt) 
                      ? 'bg-white text-black border-white' 
                      : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'
                   }`}
                >
                   {opt}
                </button>
             ))}
          </div>
      </div>

      {/* Styles */}
      <div>
        <label className={labelClasses}>
          Travel Aesthetics
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.values(TravelStyle).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => toggleStyle(style)}
              className={`px-4 py-2 rounded-full text-xs font-bold font-grotesk uppercase tracking-wide transition-all border ${
                styles.includes(style)
                  ? 'bg-neon-lime text-black border-neon-lime shadow-[0_0_15px_rgba(190,242,100,0.4)]'
                  : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-6 rounded-2xl font-grotesk font-black text-xl uppercase tracking-wider transition-all transform hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group ${
          isLoading
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-white text-black hover:bg-neon-cyan hover:text-black'
        }`}
      >
        {/* Hover effect gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
             <div className="w-5 h-5 border-4 border-gray-400 border-t-black rounded-full animate-spin"></div>
            Thinking...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2 relative z-10">
            Generate Plan <ArrowRight className="w-6 h-6" />
          </span>
        )}
      </button>
    </form>
  );
};

export default TripForm;