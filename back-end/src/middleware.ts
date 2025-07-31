import type { MiddlewareHandler, Context } from 'hono';
import { verify } from "hono/jwt";

const JWT_SECRET = 'rishav';

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) return c.text('Unauthorized', 401);
    try {
        const token = authHeader.split(' ')[1];
        const payload = await verify(token, JWT_SECRET);
        c.set('user', payload);
        await next();
    } catch {
        return c.text('Invalid or expired token', 401);
    }
}