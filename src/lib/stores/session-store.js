import { doc, updateDoc } from "firebase/firestore";
import { create } from "zustand";
import { COLLECTION_NAME, db } from "../firebase";
import { arrayMove } from "../helper";

const useSessionStore = create((set, get) => ({
  session: {},
  queue: [],
  currentSong: null,
  isHost: false,
  toggleHost: () => {
    const { isHost } = get();
    console.log({ isHost });
    set(() => ({ isHost: !isHost }));
  },
  setSession: (newSession) => {
    set(() => {
      const currentSong =
        newSession.queue.find((i) => i.id == newSession.current_song_id) ??
        newSession.queue[0];

      return {
        session: newSession ?? {},
        queue: newSession.queue ?? [],
        currentSong,
      };
    });
  },
  getCurrentSong: () => {
    const { session, queue } = get();
    const { current_song_id } = session;

    return queue?.find((item) => item.id == current_song_id);
  },
  getCurrentSongIndex: () => {
    const { session, queue } = get();
    const { current_song_id } = session;

    return queue?.findIndex((item) => item.id == current_song_id);
  },
  getSongById: (id) => {
    const { queue } = get();

    return queue.find((item) => item.id == id);
  },
  isFirstSong: () => {
    const { currentSong, queue } = get();
    return queue.findIndex((item) => item.id == currentSong?.id) == 0;
  },
  isLastSong: () => {
    const { currentSong, queue } = get();
    return (
      queue.findIndex((item) => item.id == currentSong?.id) == queue.length - 1
    );
  },
  queueUp: (id) => {
    return set(async (state) => {
      const curIdx = state.queue.findIndex((i) => i.id == id);
      const newQueue = arrayMove(state.queue, curIdx, curIdx - 1);

      await updateDoc(doc(db, COLLECTION_NAME, state.session.id), {
        queue: newQueue,
      });
    });
  },
  queueDown: (id) => {
    return set(async (state) => {
      const curIdx = state.queue.findIndex((i) => i.id == id);
      const newQueue = arrayMove(state.queue, curIdx, curIdx + 1);

      await updateDoc(doc(db, COLLECTION_NAME, state.session.id), {
        queue: newQueue,
      });
    });
  },
  queueRemove: (id) => {
    return set(async (state) => {
      const curIdx = state.queue.findIndex((i) => i.id == id);
      const newQueue = [...state.queue];

      newQueue.splice(curIdx, 1);

      await updateDoc(doc(db, COLLECTION_NAME, state.session.id), {
        queue: newQueue,
      });
    });
  },
  queuePlayNext: (id) => {
    return set(async (state) => {
      const curIdx = state.queue.findIndex((i) => i.id == id);
      const newQueue = [...state.queue];
      const [curItem] = newQueue.splice(curIdx, 1);
      console.log(curItem, newQueue);

      await updateDoc(doc(db, COLLECTION_NAME, state.session.id), {
        queue: [curItem, ...newQueue],
      });
    });
  },
}));

export default useSessionStore;
