export interface security {
  hashPassword(rawPassword: string): Promise<string>;
  comparePassword(hash: string, password: string): Promise<void>;
}
