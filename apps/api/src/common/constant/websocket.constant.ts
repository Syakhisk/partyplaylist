export enum WebsocketEvent {
  PlayerPlay = 'player.play',
  PlayerPause = 'player.pause',
  PlayerNext = 'player.next',
  PlayerPrevious = 'player.previous',
  PlayerJump = 'player.jump',
}

export type WebSocketEventPayload = {
  [WebsocketEvent.PlayerJump]: {
    seconds: number;
  };
};
