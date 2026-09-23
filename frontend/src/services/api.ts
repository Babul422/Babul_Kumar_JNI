import type { BackendHealthResponse, ChatApiRequest, ChatApiResponse } from '../types';

// Determine backend base URL: allows VITE_BACKEND_URL override, default to http://127.0.0.1:8000
const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export class ApiError extends Error {
  statusCode?: number;
  isNetworkError: boolean;

  constructor(message: string, statusCode?: number, isNetworkError: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isNetworkError = isNetworkError;
  }
}

/**
 * Sends a chat message to the FastAPI /chat endpoint.
 */
export async function sendChatMessage(sessionId: string, message: string): Promise<ChatApiResponse> {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) {
    throw new ApiError('Message cannot be empty.');
  }

  const payload: ChatApiRequest = {
    session_id: sessionId,
    message: trimmedMessage,
  };

  const endpoint = `${API_BASE_URL}/chat`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = `Server responded with status ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData?.detail) {
          errorMessage = typeof errorData.detail === 'string'
            ? errorData.detail
            : JSON.stringify(errorData.detail);
        }
      } catch {
        // Response body was not JSON
        const text = await response.text().catch(() => '');
        if (text) errorMessage = text;
      }

      throw new ApiError(errorMessage, response.status, false);
    }

    const data = await response.json();

    if (!data || typeof data !== 'object') {
      throw new ApiError('Invalid response format received from backend API.');
    }

    if (typeof data.bot_reply !== 'string') {
      throw new ApiError("Backend response missing required 'bot_reply' string.");
    }

    const rawRisk = data.character_break_risk;
    const parsedRisk = typeof rawRisk === 'number' ? rawRisk : parseFloat(rawRisk) || 0.0;

    return {
      bot_reply: data.bot_reply,
      character_break_risk: Math.max(0.0, Math.min(1.0, parsedRisk)),
    };
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network level error (server down, CORS failure, connection refused)
    const isConnRefused = error?.message?.includes('Failed to fetch') || error?.name === 'TypeError';
    const friendlyMessage = isConnRefused
      ? `Cannot connect to backend at ${API_BASE_URL}. Ensure the FastAPI server is running with 'uvicorn bot_api:app --reload'.`
      : `Network error: ${error?.message || 'Unknown network error'}`;

    throw new ApiError(friendlyMessage, undefined, true);
  }
}

/**
 * Checks backend health and retrieves active model info.
 */
export async function checkBackendHealth(): Promise<BackendHealthResponse> {
  const endpoint = `${API_BASE_URL}/`;
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (response.ok) {
      return await response.json();
    }
    return { status: 'degraded' };
  } catch {
    return { status: 'offline' };
  }
}

export { API_BASE_URL };
