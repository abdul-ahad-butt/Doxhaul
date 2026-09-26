import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

export const errorHandler = async (err: Error, c: Context) => {
  if (err instanceof HTTPException) {
    return c.json({
      success: false,
      error: {
        code: 'HTTP_ERROR',
        message: err.message,
      },
    }, err.status);
  }

  if (err instanceof z.ZodError) {
    return c.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.errors,
      },
    }, 400);
  }

  console.error('Unhandled error:', err);

  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  }, 500);
};
