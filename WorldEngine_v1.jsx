import React, { useState } from 'react';
import { Clock, BookOpen, Map, Users, Activity } from 'lucide-react';

// Sample Lore Schema representing "Story States"
const loreData = {
  years: [1024, 1050, 1085],
  states: {
    1024: {
      era: "The Neon Awakening",
      status: "Peaceful",
      activeCharacters: ["Elias Thorne", "Serafina"],
      description: "The city thrives under the first glow of the bioluminescent grid.",
      corruption: 0
    },
    1050: {
      era: "The Brass Collapse",
      status: "Warfare",
      activeCharacters: ["Elias Thorne (Exiled)", "Kaelen"],
      description: "Industrial fallout has turned the sky a permanent bruised purple.",
      corruption: 45
    },
    1085: {
      era: "The Silent Grid",
      status: "Post-Apocalyptic",
      activeCharacters: ["Serafina (The Oracle)"],
      description: "Only ghosts and machine-echoes remain in the steel husks of the city.",
      corruption: 90
    }
  }
};

const WorldEngine = () => {
  const [currentYear, setCurrentYear] = useState(1024);
  const worldState = loreData.states[currentYear];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-200 p-8 font-serif selection:bg-cyan-500/30`}>
      {/* CRT Scanline Overlay Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />

      <header className="max-w-6xl mx-auto border-b border-cyan-900/50 pb-6 mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase font-mono">
            World_Engine_v1.0
          </h1>
          <p className="text-slate-500 mt-2 italic">Chronicle of the Shattered Isles</p>
        </div>
        <div className="text-right font-mono text-sm text-cyan-500">
          STATUS: {worldState.status.toUpperCase()}
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Temporal Control Sidebar */}
        <section className="space-y-6 border border-slate-800 bg-slate-900/50 p-6 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 text-cyan-400 font-mono mb-4">
            <Clock size={18} />
            <span className="uppercase tracking-widest text-xs">Temporal Anchor</span>
          </div>
          
          <input 
            type="range" 
            min="0" 
            max={loreData.years.length - 1} 
            step="1"
            value={loreData.years.indexOf(currentYear)}
            onChange={(e) => setCurrentYear(loreData.years[e.target.value])}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          
          <div className="flex justify-between font-mono text-xs text-slate-500">
            {loreData.years.map(year => (
              <span key={year} className={currentYear === year ? "text-cyan-400" : ""}>
                {year}
              </span>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800">
            <h3 className="text-xl mb-4 font-semibold text-purple-400">{worldState.era}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              {worldState.description}
            </p>
          </div>
        </section>

        {/* Dynamic Wiki / Metadata View */}
        <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Character Tracker */}
          <div className="border border-slate-800 bg-slate-900/30 p-6 rounded-lg hover:border-cyan-500/50 transition-colors">
            <div className="flex items-center gap-2 text-purple-400 font-mono mb-4">
              <Users size={18} />
              <span className="uppercase tracking-widest text-xs">Active Dramatis Personae</span>
            </div>
            <ul className="space-y-3">
              {worldState.activeCharacters.map(char => (
                <li key={char} className="flex items-center gap-3 text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
                  {char}
                </li>
              ))}
            </ul>
          </div>

          {/* Corruption Monitor */}
          <div className="border border-slate-800 bg-slate-900/30 p-6 rounded-lg">
            <div className="flex items-center gap-2 text-orange-400 font-mono mb-4">
              <Activity size={18} />
              <span className="uppercase tracking-widest text-xs">World Corruption Index</span>
            </div>
            <div className="text-5xl font-mono text-slate-200 mb-2">
              {worldState.corruption}%
            </div>
            <div className="w-full bg-slate-800 h-1 mt-4">
              <div 
                className="bg-orange-500 h-full transition-all duration-500 ease-in-out shadow-[0_0_12px_rgba(249,115,22,0.5)]" 
                style={{ width: `${worldState.corruption}%` }} 
              />
            </div>
          </div>

          {/* Lore Log Output */}
          <div className="md:col-span-2 border border-slate-800 bg-black/40 p-6 rounded-lg font-mono text-xs overflow-hidden">
            <div className="flex justify-between items-center mb-4 opacity-50">
              <span>SYSTEM_LOG_OUTPUT</span>
              <span>UTC_{new Date().getFullYear()}</span>
            </div>
            <div className="space-y-2 text-cyan-500/80">
              <p>{`> Initializing temporal shift to year ${currentYear}...`}</p>
              <p>{`> Loading narrative state: ${worldState.era.replace(/\s/g, '_')}`}</p>
              <p className="animate-pulse">{`> Character statuses updated based on ${worldState.status} protocols.`}</p>
              <p>{`> Ready for manuscript input.`}</p>
            </div>
          </div>
        </section>
      </main>

      {/* Thematic Footer */}
      <footer className="max-w-6xl mx-auto mt-12 text-center text-slate-600 font-mono text-[10px] uppercase tracking-[0.2em]">
        Logic & Prose // Built for the Void
      </footer>
    </div>
  );
};

export default WorldEngine;

