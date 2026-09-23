import React from 'react';
import {
  Bot,
  Copy,
  Check,
  PlusCircle,
  Terminal,
} from 'lucide-react';
import type { Persona } from '../types';
import { PersonaSelector } from './PersonaSelector';

interface SidebarProps {
  selectedPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  sessionId: string;
  onNewSession: () => void;
  turnCount: number;
  isLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedPersona,
  onSelectPersona,
  sessionId,
  onNewSession,
  turnCount,
  isLoading,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopySession = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <aside className="w-80 shrink-0 border-r border-zinc-800/80 bg-zinc-950/70 p-5 flex flex-col justify-between h-full backdrop-blur-md overflow-y-auto">
      {/* Top Branding & Main Controls */}
      <div className="space-y-6">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-100 shadow-sm">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-zinc-100 flex items-center gap-2">
                AI Persona Lab
                <span className="text-[10px] font-mono text-zinc-400 font-normal px-1.5 py-0.2 bg-zinc-900 border border-zinc-800 rounded">
                  v1.0
                </span>
              </h1>
            </div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Experiment with AI personality and consistency.
          </p>
        </div>

        {/* Persona Selector */}
        <div className="pt-1">
          <PersonaSelector
            selectedPersona={selectedPersona}
            onSelectPersona={onSelectPersona}
          />
        </div>

        {/* New Session Action */}
        <div>
          <button
            type="button"
            onClick={onNewSession}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-zinc-700/70 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white transition-all text-xs font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400 group-hover:rotate-90 transition-transform duration-300" />
            Start New Session
          </button>
        </div>

        {/* Session Indicator Card */}
        <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-zinc-400" />
              Current Session
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {turnCount} {turnCount === 1 ? 'turn' : 'turns'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
            <span className="font-mono text-xs text-zinc-300 truncate" title={sessionId}>
              {sessionId}
            </span>
            <button
              type="button"
              onClick={handleCopySession}
              className="text-zinc-400 hover:text-zinc-200 transition-colors p-1"
              title="Copy session ID"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <p className="text-[11px] text-zinc-400 leading-normal">
            Session history is completely isolated in-memory on the server.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-6 border-t border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
        <div className="flex items-center justify-between">
          <span>Backend</span>
          <span className="font-mono text-zinc-400">FastAPI + LangChain</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Model</span>
          <span className="font-mono text-zinc-400">Gemini 2.5 Flash</span>
        </div>
      </div>
    </aside>
  );
};
