import { httpResponse } from "./response";
import { CreateSession, CreatedSession, createSession, createdSession } from "./session";
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
  created: createdSession
}
export { httpResponse };
export type { HttpResponse } from "./response";
export declare namespace User {
  export type CreateByFirebase = CreateUserByFirebase;
  export type CreatedByFirebase = CreatedUserByFirebase;
}
export declare namespace Session {
  export type Create = CreateSession
  export type Created = CreatedSession
}