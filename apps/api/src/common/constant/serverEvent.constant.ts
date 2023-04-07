export enum ServerEvent {
  UserOffline = 'user.offline',
  PlayerPlaying = 'player.playing',
}
type UserPayload = {
  uid: string;
};
export type ServerEventPayload = {
  [ServerEvent.UserOffline]: UserPayload;
  [ServerEvent.PlayerPlaying]: UserPayload;
};
