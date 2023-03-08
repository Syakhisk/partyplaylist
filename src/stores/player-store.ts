import { updatePlayingStatus } from "@/services/firestore/player";
import useSessionStore from "@/stores/session-store";
import { create } from "zustand";

export const enum YTPlaybackStatus {
  Unstarted = -1,
  Ended,
  Playing,
  Paused,
  Buffering,
  VideoCued = 5,
}
export const usePlayerStore = create<playerStore>((set, get) => ({
  player: null,
  currentTime: 0,
  duration: 0,
  progress: 0,
  playingStatus: YTPlaybackStatus.Unstarted,
  isMuted: true,
}));
export const setPlayingStatus = (status: YTPlaybackStatus) => {
  usePlayerStore.setState({ playingStatus: status });
};
export const setPlayer = (player: Player) => {
  usePlayerStore.setState({ player });
};
export const play = async () =>
  await _updatePLayingState(YTPlaybackStatus.Playing);

export const pause = async () =>
  await _updatePLayingState(YTPlaybackStatus.Paused);

export const stop = async () =>
  await _updatePLayingState(YTPlaybackStatus.Ended);

const _updatePLayingState = async (status: YTPlaybackStatus) => {
  const session = useSessionStore.getState().session;
  if (!session.id) return;
  await updatePlayingStatus(session.id, status);
};
export interface playerStore {
  player: Player | null;
  currentTime: number;
  duration: number;
  progress: number;
  playingStatus: YTPlaybackStatus;
  isMuted: true;
}
type Player = {
  playVideo: () => void;
  stopVideo: () => void;
  pauseVideo: () => void;
};
