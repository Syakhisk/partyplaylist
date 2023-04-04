import { registerAs } from '@nestjs/config';

export type AppConfig = {
  host: string;
  port: number;
  env: string;
  cookieSecret: string;
};

export default registerAs<AppConfig>('app', () => ({
  cookieSecret: process.env.COOKIE_SECRET,
  host: process.env.HOST ?? '0.0.0.0',
  port: +process.env.port,
  env: process.env.ENV ?? 'production',
}));
