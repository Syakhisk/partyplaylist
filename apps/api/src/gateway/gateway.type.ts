import { Socket } from 'socket.io';

export type UserPayload = {
  userId: string;
};

export type AuthenticatedSocket = UserPayload & Socket;
