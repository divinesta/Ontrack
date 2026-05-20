import type { Response } from 'express';

type SuccessResponseOptions<TData> = {
  res: Response;
  statusCode?: number;
  message: string;
  data?: TData;
  metadata?: Record<string, unknown>;
};

export const sendSuccess = <TData>({
  res,
  statusCode = 200,
  message,
  data,
  metadata,
}: SuccessResponseOptions<TData>) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data === undefined ? {} : { data }),
    ...(metadata === undefined ? {} : { metadata }),
  });
};
