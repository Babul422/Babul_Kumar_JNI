import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, CornerDownLeft, Loader2, Sparkles } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  starterPrompts?: string[];
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
  starterPrompts = [],
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || isLoading) return;
    onSendMessage(text);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUsePrompt = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      {/* Quick Starter Prompts */}
      {starterPrompts.length > 0 && (
        <div className="mb-2 flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Sparkles className="w-3 h-3 text-zinc-400" />
            Ideas:
          </span>
          {starterPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              disabled={isLoading}
              onClick={() => handleUsePrompt(prompt)}
              className="text-xs px-2.5 py-1 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-700 transition-colors shrink-0 max-w-[280px] truncate disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Box Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-xl focus-within:border-zinc-700 focus-within:ring-1 focus-within:ring-zinc-700/60 transition-all p-2.5">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
          placeholder="Type a message or test instruction boundaries... (Shift+Enter for newline)"
          className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-400 resize-none px-2 py-1 focus:outline-none max-h-44 disabled:opacity-50"
        />

        <div className="flex items-center justify-between pt-2 px-1 border-t border-zinc-800/60 text-xs">
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3 text-zinc-400" />
              Enter to send
            </span>
            <span>·</span>
            <span>Shift + Enter for new line</span>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim() || isLoading}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed shadow-sm"
            title="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
