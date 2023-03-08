import { Unsubscribe, arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { COLLECTION_NAME, db } from ".";

// export const getSessionById = async (id: string): any => {
// };

export const getSessionById = async (id: string): Promise<any> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
};
export const createSession = async (id: string, name: string): Promise<void> => {
  await setDoc(doc(db, COLLECTION_NAME, id), {
    current_song: {
      id: null,
      status:null,
    },
    host: name,
    name : name,
    participants: [
      {
        name: name,
      }
    ],
    queue: [],
  })
}
export const addParticipant = async(id: string, name:string): Promise<void> => {
  await updateDoc(doc(db, COLLECTION_NAME, id), {
    participants: arrayUnion({name}) 
  })
}

export const subscribeToSession = (id: string, callback: (data : {[key:string]:unknown}) => void): Unsubscribe=> {
  const docRef = doc(db, COLLECTION_NAME, id);
  return onSnapshot(docRef, (doc) => {
    callback({
      data: {
        id: doc.id,
        ...doc.data(),
      },
    });
  });
};
