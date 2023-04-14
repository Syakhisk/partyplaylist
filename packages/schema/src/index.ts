import { participants, Participants as TParticipants} from "./participant";
import { httpResponse } from "./response";
import {
  CreateSession,
  CreatedSession,
  joinSession,
  createSession,
  createdSession,
  JoinSession,
  getSessionDetail,
  GetSessionDetail,
  mySession,
  MySession,
} from "./session";
import { createUserByFirebase, CreateUserByFirebase } from "./user/createUser";
import {
  CreatedUserByFirebase,
  createdUserByFirebase,
} from "./user/createdUser";
export const user = {
  createByFirebase: createUserByFirebase,
  createdByFirebase: createdUserByFirebase,
};

export const session = {
  create: createSession,
  created: createdSession,
  join: joinSession,
  detail: getSessionDetail,
  my: mySession,
};

export const participant = {
  participants: participants,
};
export { httpResponse };
export type { HttpResponse } from "./response";
export declare namespace User {
  export type CreateByFirebase = CreateUserByFirebase;
  export type CreatedByFirebase = CreatedUserByFirebase;
}
export declare namespace Participant {
  export type Participants = TParticipants;
}
export declare namespace Session {
  export type Create = CreateSession;
  export type Created = CreatedSession;
  export type Join = JoinSession;
  export type Detail = GetSessionDetail;
  export type My = MySession;
}
