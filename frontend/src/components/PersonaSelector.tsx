import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search, User } from 'lucide-react';
import type { Persona } from '../types';
import { PERSONAS } from '../data/personas';

interface PersonaSelectorProps {
  selectedPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersona,
  onSelectPersona,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPersonas = PERSONAS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
        Active Persona ({PERSONAS.length})
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/80 transition-colors text-left focus:outline-none focus:ring-1 focus:ring-zinc-600"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300 shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-zinc-100 truncate">
                {selectedPersona.name}
              </span>
              {selectedPersona.isLiveBackend && (
                <span className="text-[10px] text-emerald-400 font-medium px-1.5 py-0.2 bg-emerald-950/70 border border-emerald-800/60 rounded">
                  Live
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 truncate">{selectedPersona.tagline}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 max-h-96 rounded-xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden">
          {/* Search Header */}
          <div className="p-2 border-b border-zinc-800/80 bg-zinc-950/40">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
              <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <input
                type="text"
                placeholder="Search 20 personas or traits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-zinc-200 placeholder-zinc-400 focus:outline-none text-xs"
                autoFocus
              />
            </div>
          </div>

          {/* Personas List */}
          <div className="overflow-y-auto divide-y divide-zinc-800/40 p-1">
            {filteredPersonas.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-400">
                No persona matches "{searchQuery}"
              </div>
            ) : (
              filteredPersonas.map((persona) => {
                const isSelected = persona.id === selectedPersona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => {
                      onSelectPersona(persona);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center justify-between gap-3 p-2.5 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-zinc-800 text-white'
                        : 'hover:bg-zinc-800/60 text-zinc-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-100 truncate">
                          {persona.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700/40">
                          {persona.category}
                        </span>
                        {persona.isLiveBackend && (
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            ● Live
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {persona.tagline}
                      </p>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
