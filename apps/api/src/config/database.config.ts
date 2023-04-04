import { registerAs } from '@nestjs/config';
export type DatabaseConfig = {
  user: string;
  password: string;
  dbName: string;
  host: string;
  port: number;
};
export default registerAs<DatabaseConfig>('database', () => ({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  dbName: process.env.PG_DB,
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT, 10) || 5432,
}));
