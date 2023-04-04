import { httpResponse } from "./response";
import { createUserByFirebase, CreateUserByFirebase } from "./user/createUser";
import {
  CreatedUserByFirebase,
  createdUserByFirebase,
} from "./user/createdUser";
export const user = {
  createByFirebase: createUserByFirebase,
  createdByFirebase: createdUserByFirebase,
};
export { httpResponse };
export type { HttpResponse } from "./response";
export declare namespace User {
  export type CreateByFirebase = CreateUserByFirebase;
  export type CreatedByFirebase = CreatedUserByFirebase;
}
