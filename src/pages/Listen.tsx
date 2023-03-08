import Controls from "@/components/Controls";
import Info from "@/components/Info";
import Player from "@/components/Player";
import Queue from "@/components/Queue";
import UsernameModal from "@/components/UsernameModal";
import { getSnapshot } from "@/services/firestore";
import { updateSongId } from "@/services/firestore/player";
import { subscribeToSession } from "@/services/firestore/session";
import { getMetadataFromUrl, VideoMetadata } from "@/services/youtube";
import {
  setPlayingStatus,
  usePlayerStore,
  YTPlaybackStatus,
} from "@/stores/player-store";
import useQueueStore, { setQueue } from "@/stores/queue-store";
import useSessionStore, {
  setCurrentSong,
  setSession,
} from "@/stores/session-store";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Listen = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const isLogin = useSessionStore((s) => s.isLogin);
  const username = useSessionStore((s) => s.username);
  const [isOpen, setIsOpen] = useState(!isLogin);
  const [, setVideo] = useState<VideoMetadata>();
  const queue = useQueueStore((s) => s.queue);
  const video = queue[0] ?? {};
  const isHost =
    useSessionStore.getState().username ===
    useSessionStore.getState().session.host;
  const [loadingEnum, setLoadingEnum] = useState<
    "loading" | "ready" | "invalid"
  >();

  useEffect(() => {
    if (!isLogin) {
      setLoadingEnum("invalid");
    } else {
      setLoadingEnum("ready");
    }
    setIsOpen(!isLogin);
  }, [isLogin]);

  useEffect(() => {
    if (!sessionId) return;
    return subscribeToSession(sessionId, ({ data }) => {
      setCurrentSong(
        (data as { current_song: { id: string } }).current_song.id
      );
      if (sessionId && video.video_id) {
        updateSongId(sessionId, video.video_id);
      }
      setPlayingStatus(
        (data as { current_song: { status: number } }).current_song
          .status as YTPlaybackStatus
      );
    });
  }, [sessionId, video.video_id]);

  useEffect(() => {
    setLoadingEnum("loading");

    (async () => {
      if (!sessionId) {
        setLoadingEnum("invalid");
        setIsOpen(true);
        return;
      }

      const snapshot = await getSnapshot(sessionId);
      if (!snapshot) {
        navigate("/404");
        setLoadingEnum("invalid");
        return;
      }

      const data = await getMetadataFromUrl(
        "https://www.youtube.com/watch?v=KXw8CRapg7k"
      );

      setSession({
        host: snapshot.host,
        id: sessionId,
      });

      setQueue(snapshot.queue as VideoMetadata[]);

      setVideo(data);
      setLoadingEnum("ready");
    })();
  }, []);

  return (
    <div className="max-w-4xl border mx-auto h-screen overflow-hidden flex flex-col">
      {loadingEnum === "ready" && (
        <>
          <Info />
          { isHost && <Player />}
          <Controls />
          <Queue />
        </>
      )}

      <UsernameModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        sessionId={sessionId}
      />
    </div>
  );
};

export default Listen;
