import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, Sparkles } from 'lucide-react';
import type { RiskEvaluation } from '../types';

interface RiskIndicatorProps {
  riskScore: number | null;
  historyScores?: number[];
}

export function evaluateRisk(score: number): RiskEvaluation {
  const percentage = Math.round(score * 100);

  if (percentage <= 20) {
    return {
      percentage,
      level: 'stable',
      label: 'Stable',
      description: 'Persona demeanor and guardrails remain consistent.',
      colorClass: 'text-emerald-400',
      bgClass: 'bg-emerald-950/60',
      borderClass: 'border-emerald-800/60',
    };
  }

  if (percentage <= 50) {
    return {
      percentage,
      level: 'moderate',
      label: 'Moderate',
      description: 'Mild boundary probing or conversational tension detected.',
      colorClass: 'text-amber-400',
      bgClass: 'bg-amber-950/60',
      borderClass: 'border-amber-800/60',
    };
  }

  if (percentage <= 75) {
    return {
      percentage,
      level: 'elevated',
      label: 'Elevated',
      description: 'Substantial instruction challenge or override attempt detected.',
      colorClass: 'text-orange-400',
      bgClass: 'bg-orange-950/60',
      borderClass: 'border-orange-800/60',
    };
  }

  return {
    percentage,
    level: 'high',
    label: 'High Risk',
    description: 'Direct adversarial jailbreak or explicit persona override attempt.',
    colorClass: 'text-rose-400',
    bgClass: 'bg-rose-950/60',
    borderClass: 'border-rose-800/60',
  };
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ riskScore, historyScores = [] }) => {
  const hasScore = riskScore !== null;
  const currentRisk = hasScore ? evaluateRisk(riskScore) : null;

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-zinc-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Character Break Risk
          </h3>
        </div>
        <span className="text-[10px] text-zinc-400 bg-zinc-800/70 px-2 py-0.5 rounded-full border border-zinc-700/50">
          Live Signal
        </span>
      </div>

      {hasScore && currentRisk ? (
        <div>
          {/* Main Metric Display */}
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold tracking-tight ${currentRisk.colorClass}`}>
                {currentRisk.percentage}%
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${currentRisk.bgClass} ${currentRisk.borderClass} ${currentRisk.colorClass}`}
              >
                {currentRisk.level === 'stable' && <CheckCircle2 className="w-3 h-3" />}
                {currentRisk.level === 'moderate' && <Info className="w-3 h-3" />}
                {currentRisk.level === 'elevated' && <AlertTriangle className="w-3 h-3" />}
                {currentRisk.level === 'high' && <ShieldAlert className="w-3 h-3" />}
                {currentRisk.label}
              </span>
            </div>
          </div>

          {/* Segmented Progress Meter */}
          <div className="w-full bg-zinc-950 rounded-full h-2 mb-3 overflow-hidden border border-zinc-800/90 flex">
            <div
              className={`h-full transition-all duration-500 ease-out ${
                currentRisk.level === 'stable'
                  ? 'bg-emerald-500'
                  : currentRisk.level === 'moderate'
                  ? 'bg-amber-500'
                  : currentRisk.level === 'elevated'
                  ? 'bg-orange-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.max(4, currentRisk.percentage)}%` }}
            />
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed mb-3">
            {currentRisk.description}
          </p>

          {/* Scale Reference Table */}
          <div className="grid grid-cols-4 gap-1 text-center py-2 border-t border-zinc-800/80 mb-3">
            <div className="p-1 rounded bg-zinc-950/40">
              <div className="text-[10px] text-zinc-400">0–20%</div>
              <div className="text-[11px] font-medium text-emerald-400">Stable</div>
            </div>
            <div className="p-1 rounded bg-zinc-950/40">
              <div className="text-[10px] text-zinc-400">20–50%</div>
              <div className="text-[11px] font-medium text-amber-400">Moderate</div>
            </div>
            <div className="p-1 rounded bg-zinc-950/40">
              <div className="text-[10px] text-zinc-400">50–75%</div>
              <div className="text-[11px] font-medium text-orange-400">Elevated</div>
            </div>
            <div className="p-1 rounded bg-zinc-950/40">
              <div className="text-[10px] text-zinc-400">75–100%</div>
              <div className="text-[11px] font-medium text-rose-400">High</div>
            </div>
          </div>

          {/* History Sparkline if multiple turns */}
          {historyScores.length > 1 && (
            <div className="pt-2 border-t border-zinc-800/60">
              <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-2">
                Session History ({historyScores.length} turns)
              </div>
              <div className="flex items-end gap-1.5 h-8">
                {historyScores.map((score, i) => {
                  const heightPercent = Math.max(15, Math.round(score * 100));
                  const evalItem = evaluateRisk(score);
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center group relative cursor-pointer"
                    >
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          evalItem.level === 'stable'
                            ? 'bg-emerald-500/70 group-hover:bg-emerald-400'
                            : evalItem.level === 'moderate'
                            ? 'bg-amber-500/70 group-hover:bg-amber-400'
                            : evalItem.level === 'elevated'
                            ? 'bg-orange-500/70 group-hover:bg-orange-400'
                            : 'bg-rose-500/70 group-hover:bg-rose-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-7 text-[10px] bg-zinc-900 border border-zinc-700 text-zinc-200 px-1 rounded pointer-events-none z-10 whitespace-nowrap">
                        Turn {i + 1}: {Math.round(score * 100)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-6 text-center text-zinc-400">
          <div className="w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-2 text-zinc-400">
            %
          </div>
          <p className="text-xs text-zinc-400">
            Awaiting first message to evaluate persona stability.
          </p>
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-start gap-1.5 text-[11px] text-zinc-400">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-zinc-400" />
        <span>
          Experimental persona-consistency signal, not a scientifically validated metric.
        </span>
      </div>
    </div>
  );
};
