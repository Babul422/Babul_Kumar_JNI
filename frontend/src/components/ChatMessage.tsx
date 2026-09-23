import React, { useState } from 'react';
import { AlertCircle, Bot, Check, Copy, User } from 'lucide-react';
import type { ChatMessageItem, Persona } from '../types';
import { evaluateRisk } from './RiskIndicator';

interface ChatMessageProps {
  message: ChatMessageItem;
  persona: Persona;
  onRetry?: (text: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  persona,
  onRetry,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const riskEval =
    !isUser && message.characterBreakRisk !== undefined
      ? evaluateRisk(message.characterBreakRisk)
      : null;

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold border ${
            isUser
              ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
              : 'bg-zinc-900 border-zinc-750 text-emerald-400'
          }`}
        >
          {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
        </div>

        {/* Bubble & Metadata */}
        <div className="flex flex-col min-w-0">
          <div
            className={`flex items-center gap-2 mb-1 text-[11px] text-zinc-400 ${
              isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <span className="font-semibold text-zinc-300">
              {isUser ? 'You' : persona.name}
            </span>
            <span>·</span>
            <span>{message.timestamp}</span>

            {/* Turn Risk Badge for AI replies */}
            {riskEval && (
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.2 rounded border ${riskEval.bgClass} ${riskEval.borderClass} ${riskEval.colorClass}`}
              >
                Risk: {riskEval.percentage}% · {riskEval.label}
              </span>
            )}
          </div>

          {/* Message Content Body */}
          <div
            className={`relative group rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words border ${
              isUser
                ? 'bg-zinc-800/90 text-zinc-100 border-zinc-700/60 rounded-tr-sm'
                : message.error
                ? 'bg-rose-950/40 text-rose-200 border-rose-900/60 rounded-tl-sm'
                : 'bg-zinc-900/80 text-zinc-200 border-zinc-800/80 rounded-tl-sm'
            }`}
          >
            {message.error && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Delivery Failure</span>
              </div>
            )}

            <div>{message.content}</div>

            {/* Error retry option */}
            {message.error && onRetry && (
              <button
                type="button"
                onClick={() => onRetry(message.content)}
                className="mt-2 text-xs font-medium text-rose-400 hover:text-rose-300 underline"
              >
                Retry message
              </button>
            )}

            {/* Copy Button */}
            {!message.error && (
              <button
                type="button"
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 p-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40"
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
