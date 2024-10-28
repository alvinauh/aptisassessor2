import { createMiddleware } from 'hono/factory';
import { jwt } from 'hono/jwt';
import { cors } from 'hono/cors';

export const onRequest = createMiddleware()
  .use(cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  }))
  .use('/api/*', jwt({
    secret: process.env.JWT_SECRET as string,
    cookie: 'auth',
  }))
  .build();