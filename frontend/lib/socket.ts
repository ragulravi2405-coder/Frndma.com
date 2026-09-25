import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = (token?: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
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
