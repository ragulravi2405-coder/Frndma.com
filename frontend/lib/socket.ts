import { io, Socket } from 'socket.io-client';

const getSocketUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0';
    if (!isLocal) {
      // In production unified mode, Socket.IO runs on the public server at current origin
      return window.location.origin;
    }
  }
  return envUrl || 'http://localhost:5000';
};

let socket: Socket | null = null;

export const getSocket = (token?: string): Socket => {
  if (!socket) {
    const socketUrl = getSocketUrl();
    socket = io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
      auth: { token },
      query: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected to Frndma Realtime Gateway');
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected from Frndma Realtime Gateway');
    });
  }
  return socket;
};
