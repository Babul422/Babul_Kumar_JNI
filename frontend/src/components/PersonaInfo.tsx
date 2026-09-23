import React from 'react';
import { Activity, Cpu, ShieldCheck, UserCheck } from 'lucide-react';
import type { Persona } from '../types';

interface PersonaInfoProps {
  persona: Persona;
  backendModel?: string;
  backendHealthy?: boolean;
}

export const PersonaInfo: React.FC<PersonaInfoProps> = ({
  persona,
  backendModel = 'gemini-2.5-flash',
  backendHealthy = true,
}) => {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 backdrop-blur-sm space-y-4">
      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400">
            Selected Persona
          </span>
          {persona.isLiveBackend ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
              UI Prototype
            </span>
          )}
        </div>
        <h2 className="text-base font-bold text-zinc-100">{persona.name}</h2>
        <p className="text-xs font-medium text-zinc-400 mt-0.5">{persona.tagline}</p>
      </div>

      {/* Inspired By Safety / UX Notice */}
      <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/70 text-xs text-zinc-400">
        <div className="flex items-start gap-1.5">
          <UserCheck className="w-3.5 h-3.5 shrink-0 text-zinc-400 mt-0.5" />
          <div>
            <span className="font-semibold text-zinc-300">Identity Notice: </span>
            {persona.inspiredBy || 'Persona inspired by principles and traits.'}
            <span className="block text-[11px] text-zinc-400 mt-1">
              Does not represent the actual real-world person speaking.
            </span>
          </div>
        </div>
      </div>

      {/* Core Personality Traits */}
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Core Traits & Mental Models
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {persona.traits.map((trait, index) => (
            <span
              key={index}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Multi-Persona Backend Notice if not Nikhil Kamath */}
      {!persona.isLiveBackend && (
        <div className="p-2.5 rounded-lg bg-zinc-900 border border-amber-900/40 text-[11px] text-amber-300/90 leading-relaxed">
          <span className="font-semibold text-amber-200">Note: </span>
          The active backend currently serves the{' '}
          <strong className="text-amber-100">Nikhil Kamath-inspired</strong> prompt pipeline. Chatting
          with this persona tests session handling and UI readiness while routing to the live Flash model.
        </div>
      )}

      {/* Backend Engine Details */}
      <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-xs">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-zinc-400" />
            Backend Engine
          </span>
          <span className="font-mono text-zinc-200 text-[11px] bg-zinc-800/60 px-1.5 py-0.5 rounded border border-zinc-700/50">
            {backendModel}
          </span>
        </div>

        <div className="flex items-center justify-between text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-zinc-400" />
            Server Health
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium ${
              backendHealthy ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendHealthy ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
            {backendHealthy ? 'Online (FastAPI)' : 'Offline / Unreachable'}
          </span>
        </div>

        <div className="flex items-center justify-between text-zinc-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            API Contract
          </span>
          <span className="font-mono text-zinc-200 text-[11px]">POST /chat</span>
        </div>
      </div>
    </div>
  );
};
