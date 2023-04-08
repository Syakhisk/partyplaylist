export enum WebsocketEvent {
  PlayerPlay = 'player.play',
  PlayerPause = 'player.pause',
  PlayerNext = 'player.next',
  PlayerPrevious = 'player.previous',
  PlayerJump = 'player.jump',
  ParticipantLeave = 'participant.leave',
  SessionHostChange = 'session.host.change',
}

export type WebSocketEventPayload = {
  [WebsocketEvent.PlayerJump]: {
    seconds: number;
  };
  [WebsocketEvent.ParticipantLeave]: {
    userId: string;
  };
  [WebsocketEvent.SessionHostChange]: {
    newHostId: string;
  };
};
