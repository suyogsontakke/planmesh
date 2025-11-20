import React, { useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { Coordinates } from '../types';
import { Maximize2, X, Loader2, Layers, Building2 } from 'lucide-react';

interface GlobeViewProps {
  destinationCoords?: Coordinates;
  originCoords?: Coordinates;
  destinationName?: string;
  description?: string;
  isLoading?: boolean;
}

const GlobeView: React.FC<GlobeViewProps> = ({ 
  destinationCoords, 
  originCoords, 
  destinationName, 
  description,
  isLoading = false 
}) => {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(600);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [arcsData, setArcsData] = useState<any[]>([]);
  const [labelsData, setLabelsData] = useState<any[]>([]);
  const [ringsData, setRingsData] = useState<any[]>([]);
  const [htmlElementsData, setHtmlElementsData] = useState<any[]>([]);
  
  // 3D Buildings (Simulated with Points/Cylinders)
  const [buildingsData, setBuildingsData] = useState<any[]>([]);
  
  // Country Polygon Data
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState<object | null>(null);
  const [infoBoxVisible, setInfoBoxVisible] = useState(true);
  
  // Map Style State
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite'>('dark');

  useEffect(() => {
    // Fetch world countries GeoJSON for the polygon layer
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  // Handle Resize logic for both modes
  useEffect(() => {
    const updateDimensions = () => {
      if (isExpanded) {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      } else if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
        setHeight(600); // Default height in sidebar
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions(); // Initial sizing

    return () => window.removeEventListener('resize', updateDimensions);
  }, [isExpanded]);

  // Reset Info Box when destination changes
  useEffect(() => {
    if (destinationName) {
      setInfoBoxVisible(true);
    }
  }, [destinationName]);

  // Generate 3D Buildings
  const generateCity = (center: Coordinates) => {
    const buildings = [];
    const count = 60; // Number of buildings
    const radius = 0.04; // Spread in degrees (~4km)

    // Colors for the neon city (Dark Mode)
    const neonColors = ['#bef264', '#a855f7', '#22d3ee', '#f472b6', '#ffffff'];

    for (let i = 0; i < count; i++) {
        // Random offset
        const latOffset = (Math.random() - 0.5) * radius;
        const lngOffset = (Math.random() - 0.5) * radius;
        
        // Random height (altitude)
        // Taller buildings near center
        const dist = Math.sqrt(latOffset*latOffset + lngOffset*lngOffset);
        const heightFactor = Math.max(0, 1 - (dist / (radius * 0.7)));
        const altitude = (Math.random() * 0.08 + 0.02) * heightFactor + 0.01;

        buildings.push({
            lat: center.lat + latOffset,
            lng: center.lng + lngOffset,
            altitude: altitude,
            radius: Math.random() * 0.1 + 0.02, // Radius of the cylinder
            color: neonColors[Math.floor(Math.random() * neonColors.length)], // Neon color stored here
            structureColor: `rgba(220, 220, 220, ${0.7 + Math.random() * 0.3})` // White/Concrete color for satellite
        });
    }
    return buildings;
  };

  // Handle Data Updates & Flight Path Animation
  useEffect(() => {
    if (globeEl.current) {
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 0.6;
        globeEl.current.controls().enableZoom = true;
    }

    if (destinationCoords && globeEl.current && !isLoading) {
      const arcs = [];
      const labels = [];
      const rings = [];
      const htmlElements = [];

      // Destination Marker
      labels.push({
        lat: destinationCoords.lat,
        lng: destinationCoords.lng,
        text: destinationName,
        color: '#bef264', // Neon Lime
        size: 1.5,
        resolution: 2
      });

      rings.push({
        lat: destinationCoords.lat,
        lng: destinationCoords.lng,
        maxR: 8,
        propagationSpeed: 4,
        repeatPeriod: 800,
        color: '#d946ef' // Neon Pink
      });

      // Info Box HTML Element
      if (infoBoxVisible) {
        htmlElements.push({
          lat: destinationCoords.lat,
          lng: destinationCoords.lng,
          title: destinationName,
          desc: description ? description.slice(0, 80) + (description.length > 80 ? '...' : '') : 'Explore this destination.',
        });
      }

      // Flight Path
      if (originCoords) {
        arcs.push({
          startLat: originCoords.lat,
          startLng: originCoords.lng,
          endLat: destinationCoords.lat,
          endLng: destinationCoords.lng,
          color: ['rgba(244, 114, 182, 0.8)', 'rgba(34, 211, 238, 1)'], 
          dashLength: 0.4,
          dashGap: 0.2,
          dashAnimateTime: 1500,
        });

        labels.push({
            lat: originCoords.lat,
            lng: originCoords.lng,
            text: "ORIGIN",
            color: '#a855f7',
            size: 1.0,
        });
      }

      setArcsData(arcs);
      setLabelsData(labels);
      setRingsData(rings);
      setHtmlElementsData(htmlElements);
      
      // Generate Buildings
      setBuildingsData(generateCity(destinationCoords));

      // Cinematic Fly-to Animation
      globeEl.current.pointOfView({
        lat: destinationCoords.lat,
        lng: destinationCoords.lng,
        altitude: isExpanded ? 1.5 : 2.0
      }, 2000);
    }
  }, [destinationCoords, originCoords, destinationName, description, isLoading, infoBoxVisible]);

  // Separate Effect for View Expansion (Zoom Transition)
  useEffect(() => {
    if (globeEl.current && destinationCoords) {
       globeEl.current.pointOfView({
          lat: destinationCoords.lat,
          lng: destinationCoords.lng,
          altitude: isExpanded ? 1.5 : 2.0
       }, 1000);
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMapStyle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMapStyle(prev => prev === 'dark' ? 'satellite' : 'dark');
  };

  // Style classes based on state
  const containerClasses = isExpanded 
    ? "fixed inset-0 z-[60] bg-black flex items-center justify-center"
    : "w-full relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 bg-dark-950";

  return (
    <>
      {/* Backdrop for modal */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 transition-opacity" onClick={toggleExpand}></div>
      )}

      <div ref={containerRef} className={`${containerClasses} transition-all duration-500 ease-in-out`}>
        
        {/* Loading Overlay */}
        {isLoading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-neon-lime/20 blur-xl rounded-full"></div>
                        <Loader2 className="w-12 h-12 text-neon-lime animate-spin relative z-10" />
                    </div>
                    <span className="font-grotesk font-bold text-neon-lime tracking-[0.3em] animate-pulse text-sm">
                        SCALING SATELLITE...
                    </span>
                </div>
            </div>
        )}

        {/* Decorative Overlays (Only in widget mode and dark mode) */}
        {!isExpanded && mapStyle === 'dark' && (
          <>
            <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-60"></div>
            <div className="absolute top-0 right-0 p-10 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20 z-0 pointer-events-none"></div>
          </>
        )}

        {/* Controls */}
        <div className="absolute top-6 right-6 z-20 flex gap-2 pointer-events-auto">
          {/* Map Style Toggle */}
          <button
             onClick={toggleMapStyle}
             className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 hover:border-neon-lime/50 text-white hover:text-neon-lime transition-all group relative overflow-hidden"
             title={mapStyle === 'dark' ? "Switch to Satellite" : "Switch to Dark Mode"}
          >
             {mapStyle === 'dark' ? <Layers className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
          </button>

          {isExpanded && (
             <button 
                onClick={toggleExpand}
                className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 hover:bg-white/20 text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
          )}
          {!isExpanded && (
            <button 
              onClick={toggleExpand}
              className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 hover:border-neon-cyan/50 text-white hover:text-neon-cyan transition-all group"
              title="Maximize Map"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Globe */}
        <div className={`${isExpanded ? 'cursor-move' : 'cursor-grab'}`}>
           {width > 0 && (
              <Globe
                ref={globeEl}
                width={width} 
                height={height} 
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl={mapStyle === 'dark' 
                    ? "//unpkg.com/three-globe/example/img/earth-dark.jpg" 
                    : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                }
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                
                atmosphereColor={mapStyle === 'dark' ? "#a855f7" : "#3b82f6"}
                atmosphereAltitude={0.15}
                
                // Country Polygons
                polygonsData={countries.features}
                polygonAltitude={d => d === hoverD ? 0.06 : 0.01}
                polygonCapColor={d => d === hoverD ? 'rgba(190, 242, 100, 0.1)' : 'rgba(0, 0, 0, 0)'}
                polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
                polygonStrokeColor={d => d === hoverD ? '#bef264' : (mapStyle === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)')}
                polygonLabel={({ properties: d }: any) => `
                  <div class="bg-black/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 font-grotesk shadow-xl tracking-wider">
                    ${d.ADMIN}
                  </div>
                `}
                onPolygonHover={setHoverD}
                polygonsTransitionDuration={300}

                // Points (3D Buildings)
                pointsData={buildingsData}
                pointLat="lat"
                pointLng="lng"
                pointColor={(d: any) => mapStyle === 'dark' ? d.color : d.structureColor} // Neon in Dark, White/Concrete in Satellite
                pointAltitude="altitude"
                pointRadius="radius" // Dynamic radius from data
                pointsMerge={false} // Disable merge to allow individual color updates if needed, or keep true for perfs
                pointsTransitionDuration={1000}

                // HTML Elements
                htmlElementsData={htmlElementsData}
                htmlElement={(d: any) => {
                  const el = document.createElement('div');
                  el.className = 'pointer-events-auto transform -translate-x-1/2 -translate-y-full mt-[-30px] transition-all duration-500 ease-out opacity-0 translate-y-4';
                  requestAnimationFrame(() => {
                    el.classList.remove('opacity-0', 'translate-y-4');
                  });

                  const container = document.createElement('div');
                  container.className = 'bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-xl w-64 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative group';
                  container.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="font-grotesk font-bold text-neon-lime text-lg leading-none mr-2">${d.title}</h3>
                    </div>
                    <p class="text-xs text-gray-300 font-medium leading-relaxed">${d.desc}</p>
                    <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-white/20 border-r-[8px] border-r-transparent"></div>
                  `;

                  const closeBtn = document.createElement('button');
                  closeBtn.className = "absolute top-2 right-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-full p-1";
                  closeBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
                  closeBtn.onclick = (e) => {
                    e.stopPropagation();
                    setInfoBoxVisible(false);
                  };
                  container.appendChild(closeBtn);
                  el.appendChild(container);
                  return el;
                }}

                // Standard Layers
                arcsData={arcsData}
                arcColor="color"
                arcDashLength={0.5}
                arcDashGap={0.2}
                arcDashAnimateTime={1500}
                arcStroke={2}
                arcsTransitionDuration={1000}
                
                labelsData={labelsData}
                labelLat={d => (d as any).lat}
                labelLng={d => (d as any).lng}
                labelText={d => (d as any).text}
                labelSize={d => (d as any).size}
                labelDotRadius={0.5}
                labelColor={d => (d as any).color}
                labelResolution={2}
                labelTypeFace="Space Grotesk"
                labelAltitude={0.01}
                labelsTransitionDuration={1000}

                ringsData={ringsData}
                ringColor={d => (d as any).color}
                ringMaxRadius="maxR"
                ringPropagationSpeed="propagationSpeed"
                ringRepeatPeriod="repeatPeriod"
              />
           )}
        </div>
        
        {/* Live Indicator */}
        <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
           <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="relative flex h-3 w-3">
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isLoading ? 'bg-yellow-400 hidden' : 'bg-green-400 animate-ping'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                </span>
                <span className="text-xs font-grotesk font-bold text-white tracking-widest">
                   {isExpanded ? 'IMMERSIVE MODE' : (isLoading ? 'ESTABLISHING LINK...' : (mapStyle === 'satellite' ? 'SATELLITE FEED' : 'LIVE SATELLITE'))}
                </span>
             </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default GlobeView;