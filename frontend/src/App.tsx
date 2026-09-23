import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, BarChart3 } from 'lucide-react';
import type { ChatMessageItem, Persona } from './types';
import { PERSONAS } from './data/personas';
import { checkBackendHealth, sendChatMessage, ApiError } from './services/api';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { MessageInput } from './components/MessageInput';
import { RiskIndicator } from './components/RiskIndicator';
import { PersonaInfo } from './components/PersonaInfo';

function generateSessionId(personaId: string): string {
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${personaId}-${Date.now().toString(36)}-${randomStr}`;
}

export const App: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<Persona>(PERSONAS[0]);
  const [sessionId, setSessionId] = useState<string>(() => generateSessionId(PERSONAS[0].id));
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentRisk, setCurrentRisk] = useState<number | null>(null);
  const [riskHistory, setRiskHistory] = useState<number[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [backendHealthy, setBackendHealthy] = useState<boolean>(true);
  const [backendModel, setBackendModel] = useState<string>('gemini-2.5-flash');

  // Mobile drawer states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileInsightsOpen, setIsMobileInsightsOpen] = useState(false);

  // Initial backend health check
  useEffect(() => {
    let isMounted = true;
    async function checkHealth() {
      try {
        const health = await checkBackendHealth();
        if (isMounted) {
          setBackendHealthy(health.status === 'healthy');
          if (health.model) {
            setBackendModel(health.model);
          }
        }
      } catch {
        if (isMounted) setBackendHealthy(false);
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Handle New Session
  const handleNewSession = useCallback(() => {
    const newId = generateSessionId(selectedPersona.id);
    setSessionId(newId);
    setMessages([]);
    setCurrentRisk(null);
    setRiskHistory([]);
    setApiError(null);
  }, [selectedPersona.id]);

  // Handle Switching Persona
  const handleSelectPersona = useCallback((persona: Persona) => {
    setSelectedPersona(persona);
    // Optionally switch session prefix to keep logs clean
    const newId = generateSessionId(persona.id);
    setSessionId(newId);
    setMessages([]);
    setCurrentRisk(null);
    setRiskHistory([]);
    setApiError(null);
  }, []);

  // Send Message Flow
  const handleSendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setApiError(null);

      const userMessageId = `user-${Date.now()}`;
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newUserMsg: ChatMessageItem = {
        id: userMessageId,
        role: 'user',
        content: trimmed,
        timestamp: now,
        personaId: selectedPersona.id,
      };

      // 1. Add user message immediately
      setMessages((prev) => [...prev, newUserMsg]);
      setIsLoading(true);

      try {
        // 2. Call POST /chat
        const response = await sendChatMessage(sessionId, trimmed);

        const assistantMsgId = `ai-${Date.now()}`;
        const newAssistantMsg: ChatMessageItem = {
          id: assistantMsgId,
          role: 'assistant',
          content: response.bot_reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          characterBreakRisk: response.character_break_risk,
          personaId: selectedPersona.id,
        };

        // 3. Display response and update risk state
        setMessages((prev) => [...prev, newAssistantMsg]);
        setCurrentRisk(response.character_break_risk);
        setRiskHistory((prev) => [...prev, response.character_break_risk]);
        setBackendHealthy(true);
      } catch (err: any) {
        const errorMsg =
          err instanceof ApiError
            ? err.message
            : err?.message || 'Unexpected communication error occurred.';

        setApiError(errorMsg);

        // Append failed delivery indicator message
        const failedMsgId = `err-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          {
            id: failedMsgId,
            role: 'assistant',
            content: `Failed to deliver message: ${errorMsg}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            personaId: selectedPersona.id,
            error: true,
          },
        ]);

        if (err instanceof ApiError && err.isNetworkError) {
          setBackendHealthy(false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, selectedPersona.id, isLoading]
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-zinc-800">
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold text-zinc-200">
          AI Persona Lab · {selectedPersona.name}
        </span>

        <button
          type="button"
          onClick={() => setIsMobileInsightsOpen(true)}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
          title="Open insights"
        >
          <BarChart3 className="w-5 h-5" />
        </button>
      </div>

      {/* Left Sidebar (Desktop + Mobile Drawer) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:static lg:transform-none transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="relative h-full flex">
          <Sidebar
            selectedPersona={selectedPersona}
            onSelectPersona={(p) => {
              handleSelectPersona(p);
              setIsMobileSidebarOpen(false);
            }}
            sessionId={sessionId}
            onNewSession={() => {
              handleNewSession();
              setIsMobileSidebarOpen(false);
            }}
            turnCount={messages.filter((m) => m.role === 'user').length}
            isLoading={isLoading}
          />
          {isMobileSidebarOpen && (
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Backdrop for mobile drawer */}
      {(isMobileSidebarOpen || isMobileInsightsOpen) && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={() => {
            setIsMobileSidebarOpen(false);
            setIsMobileInsightsOpen(false);
          }}
        />
      )}

      {/* Main Center Chat Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 pt-14 lg:pt-0">
        <ChatWindow
          messages={messages}
          selectedPersona={selectedPersona}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onRetryMessage={handleSendMessage}
          apiError={apiError}
          onDismissError={() => setApiError(null)}
        />

        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          starterPrompts={messages.length === 0 ? selectedPersona.starterPrompts : []}
        />
      </main>

      {/* Right Insights Panel (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-80 lg:w-88 bg-zinc-950/90 border-l border-zinc-800/80 p-5 flex flex-col gap-4 overflow-y-auto transform lg:static lg:transform-none transition-transform duration-300 ease-in-out backdrop-blur-md shrink-0 ${
          isMobileInsightsOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between lg:hidden pb-2 border-b border-zinc-800">
          <span className="text-xs font-bold text-zinc-200">Insights & Controls</span>
          <button
            type="button"
            onClick={() => setIsMobileInsightsOpen(false)}
            className="p-1 rounded-md text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Character Break Risk Gauge */}
        <RiskIndicator riskScore={currentRisk} historyScores={riskHistory} />

        {/* Persona Details & Identity Info */}
        <PersonaInfo
          persona={selectedPersona}
          backendModel={backendModel}
          backendHealthy={backendHealthy}
        />
      </aside>
    </div>
  );
};

export default App;
