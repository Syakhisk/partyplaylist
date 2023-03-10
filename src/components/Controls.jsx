import {
  BackwardIcon,
  FireIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import usePlayerStore from "../lib/stores/player-store";
import useSessionStore from "../lib/stores/session-store";

const Controls = () => {
  const currentSong = useSessionStore((s) => s.currentSong);

  const player = usePlayerStore((s) => s.player);
  const progress = usePlayerStore((s) => s.progress);

  if (!player) {
    return <Skeleton />;
  }

  return (
    <div>
      <div className="flex gap-8 border rounded p-4 px-8 items-center relative overflow-hidden">
        {currentSong?.title}

        <PrevButton />
        <PlayPauseButton />
        <NextButton />
        {/* <MuteButton /> */}
        <HostButton />

        <div
          className="w-full h-1 absolute bottom-0 left-0 bg-primary z-10"
          style={{
            transformOrigin: "center left",
            transform: `scaleX(${progress})`,
          }}
        />
        <div className="w-full h-1 absolute bottom-0 left-0 bg-dim" />
      </div>
    </div>
  );
};

const HostButton = () => {
  const toggleHost = useSessionStore((s) => s.toggleHost);
  const isHost = useSessionStore((s) => s.isHost);

  const cn = clsx(["h-8", !isHost && "opacity-50"]);
  return <FireIcon onClick={toggleHost} className={cn} />;
};

const PlayPauseButton = () => {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playerAction = usePlayerStore((s) => s.action);

  if (isPlaying) {
    return <PauseIcon onClick={playerAction.pause} className="h-8" />;
  }

  return <PlayIcon onClick={playerAction.play} className="h-8" />;
};

const PrevButton = () => {
  const isFirstSong = useSessionStore((s) => s.isFirstSong);
  const playerAction = usePlayerStore((s) => s.action);
  const cn = clsx(["h-6", isFirstSong() && "opacity-50"]);

  return <BackwardIcon className={cn} onClick={playerAction.prev} />;
};

const NextButton = () => {
  const isLastSong = useSessionStore((s) => s.isLastSong);
  const playerAction = usePlayerStore((s) => s.action);
  const cn = clsx(["h-6", isLastSong() && "opacity-50"]);

  return <ForwardIcon className={cn} onClick={playerAction.next} />;
};

const MuteButton = () => {
  const playerAction = usePlayerStore((s) => s.action);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const cn = clsx(["h-6"]);
  if (isMuted)
    return (
      <SpeakerXMarkIcon
        className={clsx(cn, "opacity-50")}
        onClick={playerAction.toggleMute}
      />
    );

  return <SpeakerWaveIcon className={cn} onClick={playerAction.toggleMute} />;
};

const Skeleton = () => (
  <div className="w-full max-w-lg">
    <div className="flex gap-8 border rounded p-4 px-8 items-center">
      <div className="h-3 w-full rounded bg-dim animate-pulse"></div>
      <BackwardIcon className="h-6" />
      <PlayIcon className="h-8" />
      <ForwardIcon className="h-6" />
    </div>
  </div>
);

export default Controls;
