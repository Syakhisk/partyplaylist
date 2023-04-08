export enum ServerEvent {
  UserOffline = 'user.offline',
  PlayerPlaying = 'player.playing',
  PlayerPausing = 'player.pausing',
  PlayerNext = 'player.next',
  PlayerPrevious = 'player.previous',
  PlayerJumping = 'player.jumping',
}
type UserPayload = {
  uid: string;
};
export type ServerEventPayload = {
  [ServerEvent.UserOffline]: UserPayload;
  [ServerEvent.PlayerPlaying]: UserPayload;
};
